import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")
  const PayerID = searchParams.get("PayerID")
  const orderId = searchParams.get("orderId")

  if (!token || !PayerID || !orderId) {
    return NextResponse.json({ message: "Missing parameters" }, { status: 400 })
  }

  try {
    // Verify payment with PayPal (replace with your actual PayPal API call)
    // This is a placeholder, you'll need to integrate with the PayPal API
    const verificationResponse = await verifyPayPalPayment(token, PayerID)

    if (verificationResponse.status !== "COMPLETED") {
      console.error("PayPal payment verification failed:", verificationResponse)
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 })
    }

    // Update order status in Supabase
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "paid", paypal_token: token, paypal_payer_id: PayerID })
      .eq("id", orderId)

    if (error) {
      console.error("Supabase update error:", error)
      return NextResponse.json({ message: "Failed to update order status" }, { status: 500 })
    }

    // Buscar el pedido con sus items y dirección de envío
    console.log("🔍 Fetching order data for:", orderId)

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
    *,
    order_items (
      id,
      file_url,
      file_name,
      temp_path,
      page_count,
      copies,
      paper_size,
      print_type,
      paper_type,
      paper_weight,
      print_form,
      orientation,
      pages_per_side,
      finishing,
      price,
      comments,
      file_size
    ),
    order_shipping_addresses (
      id,
      recipient_name,
      company,
      address_line_1,
      address_line_2,
      city,
      postal_code,
      province,
      country,
      phone,
      email,
      delivery_notes,
      shipping_type
    )
  `)
      .eq("id", orderId)
      .single()

    console.log("📦 Order data fetched:", {
      orderId: order?.id,
      hasOrderItems: !!order?.order_items?.length,
      orderItemsCount: order?.order_items?.length || 0,
      hasShippingAddresses: !!order?.order_shipping_addresses?.length,
      shippingAddressesCount: order?.order_shipping_addresses?.length || 0,
      shippingAddressesData: order?.order_shipping_addresses,
      rawOrderData: JSON.stringify(order, null, 2),
    })

    if (orderError) {
      console.error("❌ Supabase order fetch error:", orderError)
      return NextResponse.json({ message: "Failed to fetch order data" }, { status: 500 })
    }

    if (!order) {
      console.error("❌ Order not found:", orderId)
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Send confirmation email
    // await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     type: 'order-confirmation',
    //     to: orderData.customer_email,
    //     data: orderData // Esto debe incluir order_shipping_addresses
    //   })
    // })

    // Enviar correo de confirmación solo si el pago fue exitoso y tenemos email
    const isSuccessful = verificationResponse.status === "COMPLETED"
    const userEmail = order?.customer_email
    const newStatus = "completed" // Cambiar a completed en lugar de paid

    if (isSuccessful && userEmail) {
      try {
        console.log("📧 Preparing to send confirmation email to:", userEmail)
        console.log("📧 Order data for email:", {
          orderId: order.id,
          status: newStatus,
          hasShippingAddresses: !!order.order_shipping_addresses?.length,
          shippingAddresses: order.order_shipping_addresses,
        })

        const emailData = {
          ...order,
          status: newStatus,
          user: { email: userEmail },
          // Asegurar que order_shipping_addresses esté incluido correctamente
          order_shipping_addresses: order.order_shipping_addresses || [],
        }

        console.log("📧 Email data prepared with shipping addresses:", emailData.order_shipping_addresses)

        const { subject, html } = getOrderConfirmationEmail(emailData)

        await sendEmail({
          to: userEmail,
          subject,
          html,
        })
        console.log("✅ Confirmation email sent successfully")
      } catch (emailError) {
        console.error("❌ Error sending confirmation email:", emailError)
        // No fallamos la respuesta si el correo falla
      }
    } else if (isSuccessful && !userEmail) {
      console.log("⚠️ Payment successful but no user email found, skipping email notification")
    }

    return NextResponse.redirect(new URL(`/order-confirmation?orderId=${orderId}`, request.url))
  } catch (error: any) {
    console.error("Error processing PayPal callback:", error)
    return NextResponse.json({ message: "Error processing callback", error: error.message }, { status: 500 })
  }
}

async function verifyPayPalPayment(token: string, PayerID: string): Promise<any> {
  // Implement your PayPal payment verification logic here
  // This is a placeholder and needs to be replaced with actual API calls to PayPal
  // to verify the payment using the token and PayerID.

  // Example response (replace with actual PayPal API response parsing)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: "COMPLETED" }) // Simulate a successful payment
    }, 500)
  })
}

async function sendEmail(params: { to: string; subject: string; html: any }) {
  console.log("sendEmail function called", params)
}

async function getOrderConfirmationEmail(params: any) {
  console.log("getOrderConfirmationEmail function called", params)
  return { subject: "subject", html: "html" }
}
