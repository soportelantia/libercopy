import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

// GET /api/orders/abandoned?order_id=XXX&token=YYY — recover a pending order securely
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")
    const token = searchParams.get("token")

    if (!orderId || !token) {
      return NextResponse.json({ error: "order_id y token son requeridos" }, { status: 400 })
    }

    // Fetch the order first (no join — avoids PostgREST relation errors)
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, subtotal, total, customer_email, user_id, access_token, created_at")
      .eq("id", orderId)
      .eq("access_token", token)
      .not("status", "in", '("paid","completed","processing")')
      .maybeSingle()

    if (error) {
      console.error("[/api/orders/abandoned GET] Query error:", error)
      return NextResponse.json({ order: null }, { status: 404 })
    }

    if (!order) {
      console.log(`[/api/orders/abandoned GET] Order not found or already paid — id=${orderId}`)
      return NextResponse.json({ order: null }, { status: 404 })
    }

    // Fetch order_items separately to avoid relying on PostgREST foreign-key relations
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("id, file_name, file_url, page_count, copies, print_type, paper_type, finishing, comments, price")
      .eq("order_id", orderId)

    if (itemsError) {
      console.warn("[/api/orders/abandoned GET] Could not fetch order_items:", itemsError)
    }

    return NextResponse.json({ order: { ...order, order_items: orderItems ?? [] } })
  } catch (err) {
    console.error("Unexpected error in /api/orders/abandoned GET:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST /api/orders/abandoned — create a pending order for abandoned cart recovery
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail, userId, subtotal, total } = body

    if (!customerEmail || typeof customerEmail !== "string") {
      return NextResponse.json({ error: "customer_email es requerido" }, { status: 400 })
    }

    if (typeof total !== "number" || total < 0) {
      return NextResponse.json({ error: "total es requerido y debe ser un número" }, { status: 400 })
    }

    // Generate a secure access token for recovery links
    const accessToken = crypto.randomUUID()

    const orderData: Record<string, unknown> = {
      status: "pending",
      customer_email: customerEmail.trim().toLowerCase(),
      subtotal: subtotal ?? total,
      total,
      access_token: accessToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (userId) {
      orderData.user_id = userId
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select("id")
      .single()

    if (error) {
      console.error("Error creating abandoned order:", error)
      return NextResponse.json(
        { error: "Error al crear el pedido", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, orderId: order.id, accessToken })
  } catch (err) {
    console.error("Unexpected error in /api/orders/abandoned POST:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PATCH /api/orders/abandoned — update subtotal/total of an existing pending order (requires token)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, accessToken, subtotal, total } = body

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 })
    }

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json({ error: "accessToken es requerido" }, { status: 400 })
    }

    if (typeof total !== "number" || total < 0) {
      return NextResponse.json({ error: "total es requerido y debe ser un número" }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        subtotal: subtotal ?? total,
        total,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("access_token", accessToken)
      .eq("status", "pending")

    if (error) {
      console.error("Error updating abandoned order:", error)
      return NextResponse.json(
        { error: "Error al actualizar el pedido", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Unexpected error in /api/orders/abandoned PATCH:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
