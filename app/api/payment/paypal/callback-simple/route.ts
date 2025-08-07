import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendEmail, getOrderConfirmationEmail } from "@/lib/mail-service"

// Usar el cliente de Supabase con service role para acceso completo
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  console.log("PayPal simple callback endpoint called")

  try {
    const body = await request.json()
    console.log("PayPal callback received data:", body)

    if (!body.orderId || !body.status) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const { orderId, status, transactionId } = body
    const isSuccessful = status === "COMPLETED"

    console.log("Processing payment:", { orderId, status, transactionId, isSuccessful })

    // Buscar SOLO el pedido, sin hacer joins problemáticos
    console.log("Fetching order:", orderId)
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      console.error("Error fetching order:", orderError)
      return NextResponse.json({ error: "Order not found", details: orderError.message }, { status: 404 })
    }

    if (!order) {
      console.error("Order not found:", orderId)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log("Order found:", { id: order.id, currentStatus: order.status, userId: order.user_id })

    // Obtener items del pedido por separado
    let orderItems = []
    try {
      const { data: items, error: itemsError } = await supabaseAdmin
        .from("order_items")
        .select("*")
        .eq("order_id", orderId)

      if (!itemsError && items) {
        orderItems = items
        console.log("Order items found:", items.length)
      }
    } catch (error) {
      console.error("Error fetching order items:", error)
    }

    // Obtener dirección de envío por separado
    let shippingAddresses = []
    try {
      const { data: addresses, error: addressError } = await supabaseAdmin
        .from("order_shipping_addresses")
        .select("*")
        .eq("order_id", orderId)

      if (!addressError && addresses) {
        shippingAddresses = addresses
        console.log("Shipping addresses found:", addresses.length)
      }
    } catch (error) {
      console.error("Error fetching shipping addresses:", error)
    }

    // Obtener información del usuario por separado usando el admin client
    let userEmail = null
    if (order.user_id) {
      try {
        console.log("Fetching user data for user_id:", order.user_id)
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(order.user_id)
        if (!userError && userData.user) {
          userEmail = userData.user.email
          console.log("User email found:", userEmail)
        } else {
          console.error("Error fetching user or user not found:", userError)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    // Preparar datos de actualización
    const updateData: any = {
      status: isSuccessful ? "processing" : "payment_failed",
      updated_at: new Date().toISOString(),
    }

    if (isSuccessful) {
      updateData.paid_at = new Date().toISOString()
      updateData.payment_method = "paypal"

      if (transactionId) {
        updateData.payment_reference = transactionId
      }
    }

    console.log("Updating order with data:", updateData)

    // Actualizar el pedido
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select()

    if (updateError) {
      console.error("Error updating order:", updateError)

      // Intentar actualización simple solo con el estado
      console.log("Attempting simple status update...")
      const { error: simpleUpdateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: isSuccessful ? "processing" : "payment_failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (simpleUpdateError) {
        console.error("Simple update also failed:", simpleUpdateError)
        return NextResponse.json(
          {
            error: "Failed to update order",
            details: updateError.message,
            simpleUpdateError: simpleUpdateError.message,
          },
          { status: 500 },
        )
      } else {
        console.log("Simple update succeeded")
      }
    } else {
      console.log("Order updated successfully")
    }

    // Registrar en el historial de estados si el pago fue exitoso
    if (isSuccessful) {
      try {
        console.log("Recording status history...")
        const { error: historyError } = await supabaseAdmin.from("order_status_history").insert({
          order_id: orderId,
          status: "completed",
          comment: `Pago completado con PayPal${transactionId ? ` (ID: ${transactionId})` : ""}`,
          created_at: new Date().toISOString(),
        })

        if (historyError) {
          console.error("Error recording status history:", historyError)
        } else {
          console.log("Status history recorded successfully")
        }
      } catch (historyError) {
        console.error("Exception recording status history:", historyError)
      }
    }

    // Enviar email de confirmación si el pago fue exitoso y tenemos el email
    if (isSuccessful && userEmail) {
      try {
        console.log("Sending order confirmation email to:", userEmail)

        // Construir el objeto del pedido con todos los datos
        const orderData = {
          ...order,
          status: "completed",
          order_items: orderItems,
          order_shipping_addresses: shippingAddresses,
        }

        const confirmationEmail = getOrderConfirmationEmail(orderData)

        await sendEmail({
          to: userEmail,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
        })

        console.log("Order confirmation email sent successfully")
      } catch (emailError) {
        console.error("Error sending order confirmation email:", emailError)
        // No fallar la respuesta por un error de email
      }
    } else if (isSuccessful && !userEmail) {
      console.warn("Payment successful but no user email found for order:", orderId)
    }

    const responseMessage = isSuccessful ? "Pago procesado exitosamente - Pedido en proceso" : "Pago fallido"

    console.log(`Callback processing completed for order ${orderId}: ${responseMessage}`)

    return NextResponse.json({
      success: true,
      status: isSuccessful ? "completed" : "payment_failed",
      message: responseMessage,
      orderId,
      transactionId,
      emailSent: isSuccessful && userEmail ? true : false,
    })
  } catch (error) {
    console.error("Error in simple callback:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PayPal simple callback endpoint is working",
    timestamp: new Date().toISOString(),
  })
}
