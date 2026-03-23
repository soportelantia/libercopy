import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

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

    const orderData: Record<string, unknown> = {
      status: "pending",
      customer_email: customerEmail.trim().toLowerCase(),
      subtotal: subtotal ?? total,
      total,
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

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error("Unexpected error in /api/orders/abandoned POST:", err)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/abandoned — update subtotal/total of an existing pending order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, subtotal, total } = body

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId es requerido" }, { status: 400 })
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
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
