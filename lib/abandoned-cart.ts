/**
 * lib/abandoned-cart.ts
 *
 * Plantillas de email para la secuencia de recuperación de carrito abandonado.
 * Reutiliza la función getEmailTemplate de mail-service para mantener
 * coherencia visual con el resto de emails del proyecto.
 *
 * Paso 1 — recordatorio amable (sin descuento)   — 1 h desde created_at
 * Paso 2 — objeciones + descuento 5 %            — 12 h desde created_at
 * Paso 3 — último aviso + descuento 7 %           — 48 h desde created_at
 */

/** Datos mínimos del pedido necesarios para construir los emails */
export interface AbandonedCartOrderData {
  id: string
  customer_email: string
  subtotal?: number | null
  total?: number | null
  access_token: string
  items?: Array<{
    file_name?: string
    page_count?: number
    copies?: number
    print_type?: string
    paper_type?: string
    finishing?: string
    price?: number
  }>
}

// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------

function getEmailTemplate(title: string, content: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">LiberCopy</h1>
      </div>

      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2>${title}</h2>
        ${content}
      </div>

      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} LiberCopy. Todos los derechos reservados.</p>
        <p>Si tienes alguna pregunta, contáctanos respondiendo a este email.</p>
      </div>
    </div>
  `
}

function printTypeLabel(v?: string): string {
  return v === "color" ? "Color" : v === "bw" ? "Blanco y negro" : (v ?? "-")
}

function paperTypeLabel(v?: string): string {
  return v === "doubleSided" ? "Doble cara" : v === "singleSided" ? "Una cara" : (v ?? "-")
}

function finishingLabel(v?: string): string {
  return v === "stapled" ? "Grapado" : v === "bound" ? "Encuadernado" : v === "none" ? "Sin acabado" : (v ?? "-")
}

function buildItemsTable(
  items: AbandonedCartOrderData["items"]
): string {
  if (!items || items.length === 0) return ""

  const rows = items
    .map(
      (item, i) => `
      <tr style="background-color: ${i % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; max-width: 180px; word-break: break-word;">
          ${item.file_name ?? "archivo.pdf"}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align:center;">
          ${item.page_count ?? "-"}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align:center;">
          ${item.copies ?? 1}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #555;">
          ${printTypeLabel(item.print_type)} · ${paperTypeLabel(item.paper_type)} · ${finishingLabel(item.finishing)}
        </td>
      </tr>`
    )
    .join("")

  return `
    <table style="width:100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="text-align:left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Archivo</th>
          <th style="text-align:center; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Pag.</th>
          <th style="text-align:center; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Copias</th>
          <th style="text-align:left; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">Opciones</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`
}

function buildOrderSummary(orderData: AbandonedCartOrderData): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.es"
  const amount = (orderData.total ?? orderData.subtotal ?? 0).toFixed(2)
  const orderRef = orderData.id.substring(0, 8).toUpperCase()

  return `
    <div style="background-color: #f0f7ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;">
        <strong>Referencia:</strong>
        <span style="font-family: monospace; background-color: #e9ecef; padding: 2px 6px; border-radius: 4px;">#${orderRef}</span>
      </p>
      <p style="margin: 0 0 4px 0;">
        <strong>Importe total:</strong>
        <span style="font-size: 20px; font-weight: bold; color: #2563eb;">${amount} €</span>
      </p>
    </div>`
}

function buildCtaButton(recoveryUrl: string, label = "Retomar mi pedido"): string {
  return `
    <div style="text-align: center; margin: 35px 0;">
      <a href="${recoveryUrl}"
         style="background-color: #2563eb; color: white; padding: 16px 36px; text-decoration: none;
                border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
        ${label}
      </a>
    </div>`
}

function buildDiscountBanner(code: string, percentage: number, validDays: number): string {
  return `
    <div style="background-color: #f0fdf4; border: 2px dashed #16a34a; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 6px 0; font-size: 14px; color: #166534;">Descuento especial para ti</p>
      <p style="margin: 0 0 8px 0; font-size: 28px; font-weight: bold; color: #15803d; letter-spacing: 2px;">${code}</p>
      <p style="margin: 0; font-size: 14px; color: #166534;">
        <strong>${percentage} % de descuento</strong> — válido durante ${validDays} ${validDays === 1 ? "día" : "días"}
      </p>
    </div>`
}

// ---------------------------------------------------------------------------
// Plantilla — Paso 1
// ---------------------------------------------------------------------------

/**
 * Email 1: recordatorio amable, resumen del pedido y CTA.
 * Se envía 1 hora después de created_at si el pedido sigue pendiente.
 */
export function getAbandonedCartEmailStep1(orderData: AbandonedCartOrderData): {
  subject: string
  html: string
} {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.es"
  const recoveryUrl = `${siteUrl}/imprimir?order_id=${orderData.id}&token=${orderData.access_token}`
  const items = orderData.items ?? []

  const content = `
    <p>Hola,</p>

    <p>Vimos que dejaste un pedido de impresión pendiente en LiberCopy y no llegaste a completar el pago.</p>

    ${buildOrderSummary(orderData)}

    ${items.length > 0 ? `<p><strong>Detalle de tu pedido:</strong></p>${buildItemsTable(items)}` : ""}

    <p>Tu pedido sigue guardado. Puedes retomarlo exactamente donde lo dejaste:</p>

    ${buildCtaButton(recoveryUrl)}

    <p style="color: #666; font-size: 13px;">Si ya completaste tu pedido o no reconoces este mensaje, puedes ignorarlo.</p>

    <p>Saludos,<br>El equipo de LiberCopy</p>
  `

  return {
    subject: "¿Olvidaste algo? Tu pedido de impresión te espera",
    html: getEmailTemplate("Tu pedido sigue guardado", content),
  }
}

// ---------------------------------------------------------------------------
// Plantilla — Paso 2
// ---------------------------------------------------------------------------

/**
 * Email 2: recuerda el pedido, responde objeciones habituales e incluye
 * un código de descuento del 5 %. Se envía 12 horas después de created_at.
 */
export function getAbandonedCartEmailStep2(
  orderData: AbandonedCartOrderData,
  discountCode: string,
  discountPercentage = 5
): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.es"
  const recoveryUrl = `${siteUrl}/imprimir?order_id=${orderData.id}&token=${orderData.access_token}&codigo=${discountCode}`
  const items = orderData.items ?? []

  const content = `
    <p>Hola,</p>

    <p>Vemos que todavía no has terminado tu pedido de impresión. Queremos ayudarte a resolverlo.</p>

    ${buildOrderSummary(orderData)}

    ${items.length > 0 ? `<p><strong>Detalle de tu pedido:</strong></p>${buildItemsTable(items)}` : ""}

    <div style="background-color: #f8f9fa; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #1e40af;">¿Tienes dudas? Aquí van las respuestas más habituales:</p>
      <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 1.7;">
        <li><strong>¿Es seguro pagar?</strong> Sí, usamos pasarelas certificadas (Redsys, PayPal y Bizum).</li>
        <li><strong>¿Cuándo recibiré mi pedido?</strong> Los envíos salen el mismo día hábil si el pedido se confirma antes de las 14:00 h.</li>
        <li><strong>¿Y si hay algún problema con la impresión?</strong> Nos hacemos cargo — contáctanos y lo solucionamos sin coste.</li>
      </ul>
    </div>

    <p>Para animarte a terminar, te ofrecemos un <strong>${discountPercentage} % de descuento</strong> exclusivo:</p>

    ${buildDiscountBanner(discountCode, discountPercentage, 3)}

    <p>Aplica el código al finalizar el pedido. Solo es válido para este pedido y durante los próximos 3 días.</p>

    ${buildCtaButton(recoveryUrl, "Terminar mi pedido con descuento")}

    <p style="color: #666; font-size: 13px;">Si ya completaste tu pedido o no reconoces este mensaje, puedes ignorarlo.</p>

    <p>Saludos,<br>El equipo de LiberCopy</p>
  `

  return {
    subject: `${discountPercentage} % de descuento para terminar tu pedido de impresión`,
    html: getEmailTemplate("Un descuento especial para ti", content),
  }
}

// ---------------------------------------------------------------------------
// Plantilla — Paso 3
// ---------------------------------------------------------------------------

/**
 * Email 3: último aviso con urgencia suave e incluye un código de descuento
 * del 7 %. Se envía 48 horas después de created_at.
 */
export function getAbandonedCartEmailStep3(
  orderData: AbandonedCartOrderData,
  discountCode: string,
  discountPercentage = 7
): { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.es"
  const recoveryUrl = `${siteUrl}/imprimir?order_id=${orderData.id}&token=${orderData.access_token}&codigo=${discountCode}`
  const items = orderData.items ?? []

  const content = `
    <p>Hola,</p>

    <p>Este es nuestro último recordatorio sobre tu pedido pendiente en LiberCopy. Queremos darte una última oportunidad antes de que se libere tu carrito.</p>

    ${buildOrderSummary(orderData)}

    ${items.length > 0 ? `<p><strong>Detalle de tu pedido:</strong></p>${buildItemsTable(items)}` : ""}

    <p>
      Como último gesto, te ofrecemos el descuento más alto que podemos darte:
      <strong>${discountPercentage} % de descuento</strong>, válido solo durante 48 horas.
    </p>

    ${buildDiscountBanner(discountCode, discountPercentage, 2)}

    <p>Aplica el código al finalizar el pago. Después de este periodo, el código expirará y tu carrito se liberará.</p>

    ${buildCtaButton(recoveryUrl, "Aprovechar mi descuento antes de que expire")}

    <p style="color: #666; font-size: 13px;">Si has decidido no continuar o ya completaste el pedido, no tienes que hacer nada. Gracias por considerar LiberCopy.</p>

    <p>Saludos,<br>El equipo de LiberCopy</p>
  `

  return {
    subject: "Ultimo aviso: tu pedido de impresión expira pronto",
    html: getEmailTemplate("Ultima oportunidad para tu pedido", content),
  }
}

/**
 * Helper de recuperación: marca un pedido como recuperado si ya había
 * iniciado la secuencia de abandono.
 *
 * Llama a esta función en cualquier punto del backend donde un pedido
 * pase a status = 'completed'.
 *
 * @example
 *   import { markOrderAsRecovered } from "@/lib/abandoned-cart"
 *   await markOrderAsRecovered(supabase, orderId)
 */
export async function markOrderAsRecovered(
  // Aceptamos cualquier cliente de Supabase (admin o anon)
  // para que sea fácil de usar desde los callbacks de pago.
  supabaseClient: { from: (table: string) => any },
  orderId: string
): Promise<void> {
  // Solo rellenar si el pedido había iniciado la secuencia (paso >= 1)
  const { data: order, error: fetchError } = await supabaseClient
    .from("orders")
    .select("abandoned_email_step, recovered_at")
    .eq("id", orderId)
    .single()

  if (fetchError) {
    console.error(`[abandoned-cart] Error leyendo pedido ${orderId} para markOrderAsRecovered:`, fetchError.message)
    return
  }

  // Si ya tiene recovered_at o nunca empezó la secuencia, no hacemos nada
  if (!order || order.recovered_at || !order.abandoned_email_step || order.abandoned_email_step < 1) {
    return
  }

  const { error: updateError } = await supabaseClient
    .from("orders")
    .update({ recovered_at: new Date().toISOString() })
    .eq("id", orderId)

  if (updateError) {
    console.error(`[abandoned-cart] Error marcando pedido ${orderId} como recuperado:`, updateError.message)
  } else {
    console.log(`[abandoned-cart] Pedido ${orderId} marcado como recuperado (abandoned_email_step=${order.abandoned_email_step})`)
  }
}
