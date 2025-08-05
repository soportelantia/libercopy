import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { sendEmail, getOrderConfirmationEmail } from "@/lib/mail-service"
import crypto from "crypto"

// Función para verificar la firma del webhook de PayPal
function verifyPayPalWebhook(payload: string, headers: any): boolean {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!webhookId || !clientSecret) {
    console.error("PayPal webhook verification failed: Missing webhook ID or client secret")
    return false
  }

  try {
    const authAlgo = headers["paypal-auth-algo"]
    const transmission_id = headers["paypal-transmission-id"]
    const cert_id = headers["paypal-cert-id"]
    const transmission_time = headers["paypal-transmission-time"]
    const webhook_signature = headers["paypal-transmission-sig"]

    const expected_sig = crypto
      .createHmac("sha256", clientSecret)
      .update(`${authAlgo}|${cert_id}|${transmission_id}|${transmission_time}|${webhookId}|${payload}`)
      .digest("base64")

    return expected_sig === webhook_signature
  } catch (error) {
    console.error("Error verifying PayPal webhook:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    // Verificar la firma del webhook (siempre en producción)
    // Eliminamos la condición para que siempre verifique la firma
    if (!verifyPayPalWebhook(payload, headers)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const body = JSON.parse(payload)
    console.log("PayPal webhook received:", body.event_type)

    // Procesar diferentes tipos de eventos
    switch (body.event_type) {
      case "CHECKOUT.ORDER.APPROVED":
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentSuccess(body)
        break
      case "PAYMENT.CAPTURE.DENIED":
        await handlePaymentFailure(body)
        break
      default:
        console.log(`Unhandled PayPal event: ${body.event_type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing PayPal webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handlePaymentSuccess(webhookData: any) {
  try {
    const resource = webhookData.resource
    const orderId = resource.custom_id || resource.invoice_id
    const transactionId = resource.id

    if (!orderId) {
      console.error("No order ID found in PayPal webhook")
      return
    }

    const supabase = getSupabaseServer()

    // Buscar el pedido en la base de datos
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, user:user_id(email)")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      console.error("Error fetching order:", orderError)
      return
    }

    // Actualizar el estado del pedido
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "processing",
        paid_at: new Date().toISOString(),
        payment_reference: transactionId,
      })
      .eq("id", orderId)

    if (updateError) {
      console.error("Error updating order:", updateError)
      return
    }

    // Enviar correo de confirmación
    if (order.user && order.user.email) {
      try {
        const { subject, html } = getOrderConfirmationEmail(order)
        await sendEmail({
          to: order.user.email,
          subject,
          html,
        })
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError)
      }
    }

    console.log(`Order ${orderId} marked as paid successfully`)
  } catch (error) {
    console.error("Error handling PayPal payment success:", error)
  }
}

async function handlePaymentFailure(webhookData: any) {
  try {
    const resource = webhookData.resource
    const orderId = resource.custom_id || resource.invoice_id

    if (!orderId) {
      console.error("No order ID found in PayPal webhook")
      return
    }

    const supabase = getSupabaseServer()

    // Actualizar el estado del pedido como fallido
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "payment_failed",
      })
      .eq("id", orderId)

    if (updateError) {
      console.error("Error updating failed order:", updateError)
      return
    }

    console.log(`Order ${orderId} marked as payment failed`)
  } catch (error) {
    console.error("Error handling PayPal payment failure:", error)
  }
}
