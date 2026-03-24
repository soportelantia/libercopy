import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { sendEmail, getAbandonedCartEmail } from "@/lib/mail-service"

// Tiempo mínimo desde la creación del pedido para considerarlo "abandonado" (en minutos)
const ABANDONED_AFTER_MINUTES = 60

export async function GET(request: NextRequest) {
  // Protección por secret — acepta tanto header Authorization como query param ?secret=
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error("[cron/abandoned-carts] CRON_SECRET no está configurado")
    return NextResponse.json({ error: "Configuración incorrecta del servidor" }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  const querySecret = request.nextUrl.searchParams.get("secret")

  const isAuthorized =
    authHeader === `Bearer ${cronSecret}` ||
    querySecret === cronSecret

  if (!isAuthorized) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  // Calcular el corte de tiempo
  const cutoff = new Date(Date.now() - ABANDONED_AFTER_MINUTES * 60 * 1000).toISOString()

  // Buscar pedidos pendientes con email, sin email de recuperación enviado, creados hace más de X minutos
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id, customer_email, subtotal, total, access_token, created_at,
      order_items (
        file_name, page_count, copies, print_type, paper_type, finishing, price
      )
    `)
    .eq("status", "pending")
    .not("customer_email", "is", null)
    .not("access_token", "is", null)
    .is("sent_abandoned_at", null)
    .lt("created_at", cutoff)
    .limit(50) // Procesar como mucho 50 por ejecución para no superar timeouts

  if (error) {
    console.error("[cron/abandoned-carts] Error consultando pedidos:", error)
    return NextResponse.json({ error: "Error consultando pedidos", details: error.message }, { status: 500 })
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ success: true, processed: 0, message: "No hay pedidos abandonados pendientes" })
  }

  console.log(`[cron/abandoned-carts] Procesando ${orders.length} pedido(s) abandonado(s)`)

  const results: { orderId: string; email: string; success: boolean; error?: string }[] = []

  for (const order of orders) {
    try {
      const { subject, html } = getAbandonedCartEmail({
        id: order.id,
        customer_email: order.customer_email,
        subtotal: order.subtotal,
        total: order.total,
        access_token: order.access_token,
        items: order.order_items ?? [],
      })

      const sendResult = await sendEmail({ to: order.customer_email, subject, html })

      if (sendResult.success) {
        // Marcar como enviado para no volver a procesar
        await supabaseAdmin
          .from("orders")
          .update({ sent_abandoned_at: new Date().toISOString() })
          .eq("id", order.id)

        results.push({ orderId: order.id, email: order.customer_email, success: true })
      } else {
        results.push({
          orderId: order.id,
          email: order.customer_email,
          success: false,
          error: String(sendResult.error ?? "Email no enviado"),
        })
      }
    } catch (err) {
      console.error(`[cron/abandoned-carts] Error procesando pedido ${order.id}:`, err)
      results.push({
        orderId: order.id,
        email: order.customer_email,
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido",
      })
    }
  }

  const sent = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  console.log(`[cron/abandoned-carts] Completado: ${sent} enviados, ${failed} fallidos`)

  return NextResponse.json({ success: true, processed: orders.length, sent, failed, results })
}
