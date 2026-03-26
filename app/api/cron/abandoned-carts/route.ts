import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mail-service"
import {
  getAbandonedCartEmailStep1,
  getAbandonedCartEmailStep2,
  getAbandonedCartEmailStep3,
} from "@/lib/abandoned-cart"
import {
  createAbandonedCartDiscountCode,
  ABANDONED_DISCOUNT_OPTIONS,
} from "@/lib/discount-codes"

// ---------------------------------------------------------------------------
// Umbrales de tiempo (en milisegundos)
// ---------------------------------------------------------------------------
const STEP1_AFTER_MS  =  1 * 60 * 60 * 1000   // 1 hora
const STEP2_AFTER_MS  = 12 * 60 * 60 * 1000   // 12 horas
const STEP3_AFTER_MS  = 48 * 60 * 60 * 1000   // 48 horas

/** Máximo de pedidos procesados por ejecución (evita timeouts de Vercel) */
const BATCH_SIZE = 50

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
type ResultEntry = {
  orderId: string
  email: string
  step: number
  success: boolean
  error?: string
}

// ---------------------------------------------------------------------------
// GET handler
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  // -- Protección por secret --------------------------------------------------
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    console.error("[cron/abandoned-carts] CRON_SECRET no está configurado")
    return NextResponse.json({ error: "Configuración incorrecta del servidor" }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  const querySecret = request.nextUrl.searchParams.get("secret")
  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret

  if (!isAuthorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  // -- Calcular el corte de tiempo más antiguo que nos interesa ---------------
  // Solo consultamos pedidos creados hace como mínimo 60 min para no
  // arrastrar pedidos completamente nuevos.
  const oldestCutoff = new Date(Date.now() - STEP1_AFTER_MS).toISOString()

  // -- Consulta de pedidos candidatos ----------------------------------------
  // Pedidos pending con email y access_token, creados hace más de 1 h,
  // y cuyo flujo de abandono no ha terminado.
  const { data: orders, error: queryError } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      customer_email,
      subtotal,
      total,
      access_token,
      created_at,
      abandoned_email_step,
      abandoned_last_email_at,
      abandoned_discount_code,
      abandoned_flow_finished_at,
      order_items (
        file_name, page_count, copies, print_type, paper_type, finishing, price
      )
    `)
    .eq("status", "pending")
    .not("customer_email", "is", null)
    .not("access_token", "is", null)
    .is("abandoned_flow_finished_at", null)
    .lt("created_at", oldestCutoff)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE)

  if (queryError) {
    console.error("[cron/abandoned-carts] Error consultando pedidos:", queryError)
    return NextResponse.json(
      { error: "Error consultando pedidos", details: queryError.message },
      { status: 500 }
    )
  }

  if (!orders || orders.length === 0) {
    console.log("[cron/abandoned-carts] No hay pedidos abandonados pendientes")
    return NextResponse.json({
      success: true,
      processed: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      results: [],
    })
  }

  console.log(`[cron/abandoned-carts] Evaluando ${orders.length} pedido(s) candidato(s)`)

  const results: ResultEntry[] = []
  const now = Date.now()

  for (const order of orders) {
    const createdAt  = new Date(order.created_at).getTime()
    const ageMs      = now - createdAt
    const step       = (order.abandoned_email_step ?? 0) as number

    // Determinar qué paso corresponde ahora
    let targetStep: 1 | 2 | 3 | null = null

    if (step === 0 && ageMs >= STEP1_AFTER_MS) {
      targetStep = 1
    } else if (step === 1 && ageMs >= STEP2_AFTER_MS) {
      targetStep = 2
    } else if (step === 2 && ageMs >= STEP3_AFTER_MS) {
      targetStep = 3
    }

    if (!targetStep) {
      // No corresponde aún ningún paso — ignorar sin contar como fallo
      continue
    }

    console.log(
      `[cron/abandoned-carts] Pedido ${order.id} — paso ${targetStep} (edad: ${Math.round(ageMs / 3600000)}h)`
    )

    try {
      let subject = ""
      let html    = ""

      const commonData = {
        id:             order.id,
        customer_email: order.customer_email,
        subtotal:       order.subtotal,
        total:          order.total,
        access_token:   order.access_token,
        items:          order.order_items ?? [],
      }

      if (targetStep === 1) {
        // -- Paso 1: recordatorio simple, sin descuento ----------------------
        ;({ subject, html } = getAbandonedCartEmailStep1(commonData))

      } else if (targetStep === 2) {
        // -- Paso 2: descuento 5 % ------------------------------------------
        const codeData = await createAbandonedCartDiscountCode(
          order.id,
          2,
          ABANDONED_DISCOUNT_OPTIONS[2]
        )
        if (!codeData) {
          results.push({
            orderId: order.id,
            email:   order.customer_email,
            step:    targetStep,
            success: false,
            error:   "No se pudo generar el código de descuento",
          })
          continue
        }
        ;({ subject, html } = getAbandonedCartEmailStep2(
          commonData,
          codeData.code,
          codeData.percentage
        ))

      } else {
        // -- Paso 3: descuento 7 % ------------------------------------------
        const codeData = await createAbandonedCartDiscountCode(
          order.id,
          3,
          ABANDONED_DISCOUNT_OPTIONS[3]
        )
        if (!codeData) {
          results.push({
            orderId: order.id,
            email:   order.customer_email,
            step:    targetStep,
            success: false,
            error:   "No se pudo generar el código de descuento",
          })
          continue
        }
        ;({ subject, html } = getAbandonedCartEmailStep3(
          commonData,
          codeData.code,
          codeData.percentage
        ))
      }

      // -- Enviar email -------------------------------------------------------
      const sendResult = await sendEmail({
        to:      order.customer_email,
        subject,
        html,
      })

      if (!sendResult.success) {
        results.push({
          orderId: order.id,
          email:   order.customer_email,
          step:    targetStep,
          success: false,
          error:   String(sendResult.error ?? "Email no enviado"),
        })
        continue
      }

      // -- Actualizar estado en BD (solo si el envío fue exitoso) ------------
      const isLastStep = targetStep === 3
      const updatePayload: Record<string, unknown> = {
        abandoned_email_step:    targetStep,
        abandoned_last_email_at: new Date().toISOString(),
        updated_at:              new Date().toISOString(),
      }
      if (isLastStep) {
        updatePayload.abandoned_flow_finished_at = new Date().toISOString()
      }
      // Retrocompatibilidad: también rellenar sent_abandoned_at en el primer envío
      if (targetStep === 1) {
        updatePayload.sent_abandoned_at = new Date().toISOString()
      }

      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update(updatePayload)
        .eq("id", order.id)
        // Guard adicional: solo actualizar si el step no ha avanzado ya
        // (protección ante ejecuciones paralelas)
        .eq("abandoned_email_step", step)

      if (updateError) {
        console.error(
          `[cron/abandoned-carts] Error actualizando pedido ${order.id} tras paso ${targetStep}:`,
          updateError.message
        )
        // El email ya se envió — registramos éxito parcial
        results.push({
          orderId: order.id,
          email:   order.customer_email,
          step:    targetStep,
          success: true,
          error:   `Email enviado pero DB no actualizada: ${updateError.message}`,
        })
      } else {
        console.log(
          `[cron/abandoned-carts] Paso ${targetStep} enviado y registrado para pedido ${order.id}`
        )
        results.push({
          orderId: order.id,
          email:   order.customer_email,
          step:    targetStep,
          success: true,
        })
      }
    } catch (err) {
      console.error(`[cron/abandoned-carts] Error procesando pedido ${order.id}:`, err)
      results.push({
        orderId: order.id,
        email:   order.customer_email,
        step:    targetStep,
        success: false,
        error:   err instanceof Error ? err.message : "Error desconocido",
      })
    }
  }

  const sent    = results.filter((r) => r.success).length
  const failed  = results.filter((r) => !r.success).length
  // "skipped" = pedidos evaluados que no tenían ningún paso pendiente aún
  const skipped = orders.length - results.length

  console.log(
    `[cron/abandoned-carts] Completado — enviados: ${sent}, fallidos: ${failed}, sin paso pendiente: ${skipped}`
  )

  return NextResponse.json({
    success:   true,
    processed: orders.length,
    sent,
    failed,
    skipped,
    results,
  })
}
