import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    // Obtener el token de autorización del header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    // Crear cliente de Supabase con el token del usuario
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })

    // Verificar el usuario
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Usuario no autorizado" }, { status: 401 })
    }

    // Obtener datos del request
    const body = await request.json()
    const { items, subtotal, shippingCost, total, shipping, payment } = body

    console.log("Creating order for user:", user.id)

    // Validar datos requeridos
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items requeridos" }, { status: 400 })
    }

    if (!total || typeof total !== "number") {
      return NextResponse.json({ error: "Total requerido" }, { status: 400 })
    }

    // Usar el service role key para operaciones de base de datos
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Crear el pedido principal
    const orderData = {
      user_id: user.id,
      status: "pending",
      subtotal: subtotal || 0,
      shipping_cost: shippingCost || 0,
      total: total,
      payment_method: payment?.method || "paypal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: order, error: orderError } = await adminSupabase.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return NextResponse.json(
        {
          error: "Error al crear el pedido",
          details: orderError.message,
        },
        { status: 500 },
      )
    }

    // Crear los items del pedido
    const orderItems = items.map((item) => ({
      order_id: order.id,
      file_name: item.fileName || item.name || "archivo",
      page_count: item.pageCount || 0,
      copies: item.options?.copies || item.quantity || 1,
      paper_size: item.options?.paperSize || "a4",
      print_type: item.options?.printType || "bw",
      paper_type: item.options?.paperType || "standard",
      finishing: item.options?.finishing || "none",
      price: item.price || 0,
      comments: item.comments || null,
      file_url: item.fileUrl || null,
      created_at: new Date().toISOString(),
    }))

    const { error: itemsError } = await adminSupabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      await adminSupabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json(
        {
          error: "Error al crear los items del pedido",
          details: itemsError.message,
        },
        { status: 500 },
      )
    }

    // Crear la dirección de envío si existe - MEJORADO CON DEBUG
    if (shipping && (shipping.address || shipping.pickupPoint)) {
      let shippingAddress

      console.log("🚚 Processing shipping data:", {
        shippingType: shipping.type,
        hasAddress: !!shipping.address,
        hasPickupPoint: !!shipping.pickupPoint,
        shippingData: shipping,
      })

      if (shipping.type === "home" && shipping.address) {
        // Envío a domicilio
        shippingAddress = {
          order_id: order.id,
          recipient_name: shipping.address.recipient_name || shipping.address.name || "Cliente",
          company: shipping.address.company || null,
          address_line_1: shipping.address.address_line_1 || shipping.address.address_line || "",
          address_line_2: shipping.address.address_line_2 || null,
          city: shipping.address.city || shipping.address.municipality_name || shipping.address.municipality || "",
          postal_code: shipping.address.postal_code || "",
          province: shipping.address.province_name || shipping.address.province || "",
          country: shipping.address.country || "España",
          phone: shipping.address.phone || null,
          email: shipping.address.email || null,
          delivery_notes: shipping.address.delivery_notes || null,
          shipping_type: "delivery",
          created_at: new Date().toISOString(),
        }
      } else if (shipping.type === "pickup" && shipping.pickupPoint) {
        // Punto de recogida
        shippingAddress = {
          order_id: order.id,
          recipient_name: "Cliente",
          company: null,
          address_line_1: shipping.pickupPoint.address || shipping.pickupPoint.name || "Punto de recogida",
          address_line_2: null,
          city: "Sevilla",
          postal_code: "41001",
          province: "Sevilla",
          country: "España",
          phone: shipping.pickupPoint.phone || null,
          email: null,
          delivery_notes: null,
          shipping_type: "pickup",
          created_at: new Date().toISOString(),
        }
      }

      if (shippingAddress) {
        console.log("💾 Inserting shipping address:", shippingAddress)

        const { data: insertedAddress, error: shippingError } = await adminSupabase
          .from("order_shipping_addresses")
          .insert(shippingAddress)
          .select()
          .single()

        if (shippingError) {
          console.error("❌ Shipping address error:", shippingError)
          // No fallar el pedido por esto
        } else {
          console.log("✅ Shipping address created successfully:", insertedAddress)
        }
      } else {
        console.log("⚠️ No shipping address data to insert")
      }
    } else {
      console.log("⚠️ No shipping data provided")
    }

    // Crear historial de estado
    await adminSupabase.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      notes: "Pedido creado",
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order: order,
    })
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
