import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      items,
      shipping_address,
      payment_method,
      subtotal,
      shipping_cost,
      total,
      discount_code,
      discount_percentage,
      discount_amount,
    } = body

    if (!user_id || !items || items.length === 0) {
      return NextResponse.json({ error: "Datos de pedido incompletos" }, { status: 400 })
    }

    // Usar el service role para operaciones de base de datos
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Crear el pedido principal
    const orderData = {
      user_id,
      status: "pending",
      subtotal: subtotal || 0,
      shipping_cost: shipping_cost || 0,
      discount_code: discount_code || null,
      discount_percentage: discount_percentage || 0,
      discount_amount: discount_amount || 0,
      total: total || 0,
      payment_method: payment_method || "paypal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 })
    }

    // Si se aplicó un descuento, actualizar el contador de usos
    if (discount_code) {
      const { error: updateError } = await supabaseAdmin
        .from("discount_codes")
        .update({
          current_uses: supabaseAdmin.raw("current_uses + 1"),
          updated_at: new Date().toISOString(),
        })
        .eq("code", discount_code)

      if (updateError) {
        console.warn("Warning: Could not update discount code usage:", updateError)
      }
    }

    // Crear los items del pedido
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        file_name: item.fileName || item.name || "archivo",
        page_count: item.pageCount || 0,
        copies: item.copies || item.quantity || 1,
        paper_size: item.paperSize || "a4",
        print_type: item.printType || "bw",
        paper_type: item.paperType || "standard",
        finishing: item.finishing || "none",
        price: item.price || 0,
        comments: item.comments || null,
        file_url: item.fileUrl || null,
        file_size: item.fileSize || 0,
        print_form: item.printForm || "single_sided",
        orientation: item.orientation || "portrait",
        pages_per_side: item.pagesPerSide || 1,
        created_at: new Date().toISOString(),
      }))

      const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("Order items creation error:", itemsError)
        // Eliminar el pedido si falla la creación de items
        await supabaseAdmin.from("orders").delete().eq("id", order.id)
        return NextResponse.json({ error: "Error al crear los items del pedido" }, { status: 500 })
      }
    }

    // Crear la dirección de envío si se proporciona
    if (shipping_address) {
      const shippingData = {
        order_id: order.id,
        recipient_name: shipping_address.recipient_name || "Cliente",
        address_line_1: shipping_address.address_line_1 || shipping_address.address_line || "",
        address_line: shipping_address.address_line || shipping_address.address_line_1 || "",
        postal_code: shipping_address.postal_code || "",
        city: shipping_address.city || shipping_address.municipality || "Sevilla",
        municipality: shipping_address.municipality || shipping_address.city || "Sevilla",
        state: shipping_address.state || shipping_address.province || "Sevilla",
        province: shipping_address.province || shipping_address.state || "Sevilla",
        country: shipping_address.country || "España",
        phone: shipping_address.phone || null,
        email: shipping_address.email || null,
        shipping_type: shipping_address.shipping_type || "delivery",
        created_at: new Date().toISOString(),
      }

      const { error: shippingError } = await supabaseAdmin.from("order_shipping_addresses").insert(shippingData)

      if (shippingError) {
        console.warn("Warning: Could not save shipping address:", shippingError)
      }
    }

    // Crear historial de estado
    const historyData = {
      order_id: order.id,
      status: "pending",
      created_at: new Date().toISOString(),
    }

    const { error: historyError } = await supabaseAdmin.from("order_status_history").insert(historyData)

    if (historyError) {
      console.warn("Warning: Could not create order history:", historyError)
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        discount_applied: !!discount_code,
        discount_amount: discount_amount || 0,
      },
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID requerido" }, { status: 400 })
    }

    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items(*),
        order_shipping_addresses(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error in GET orders:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
