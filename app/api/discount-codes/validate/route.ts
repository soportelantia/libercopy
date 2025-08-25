import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código de descuento requerido" }, { status: 400 })
    }

    // Usar el service role para evitar problemas de RLS
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    console.log("Validating discount code:", code.toUpperCase())

    // Buscar el código de descuento
    const { data: discountCode, error } = await supabaseAdmin
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    console.log("Database query result:", { discountCode, error })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Código de descuento no válido" }, { status: 404 })
    }

    if (!discountCode) {
      console.log("No discount code found")
      return NextResponse.json({ error: "Código de descuento no válido" }, { status: 404 })
    }

    // Verificar fechas de validez
    const now = new Date()
    const startDate = new Date(discountCode.start_date)
    const endDate = new Date(discountCode.end_date)

    console.log("Date validation:", { now, startDate, endDate })

    if (now < startDate) {
      return NextResponse.json({ error: "Código de descuento aún no válido" }, { status: 400 })
    }

    if (now > endDate) {
      return NextResponse.json({ error: "Código de descuento expirado" }, { status: 400 })
    }

    // Verificar límite de usos
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      return NextResponse.json({ error: "Código de descuento agotado" }, { status: 400 })
    }

    console.log("Discount code validated successfully:", discountCode)

    return NextResponse.json({
      success: true,
      discount: {
        code: discountCode.code,
        percentage: discountCode.percentage,
        id: discountCode.id,
      },
    })
  } catch (error) {
    console.error("Error validating discount code:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
