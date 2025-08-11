import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código de descuento requerido" }, { status: 400 })
    }

    // Buscar el código de descuento
    const { data: discountCode, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (error || !discountCode) {
      return NextResponse.json({ error: "Código de descuento no válido" }, { status: 404 })
    }

    // Verificar fechas de validez
    const now = new Date()
    const startDate = new Date(discountCode.start_date)
    const endDate = new Date(discountCode.end_date)

    if (now < startDate || now > endDate) {
      return NextResponse.json({ error: "Código de descuento expirado" }, { status: 400 })
    }

    // Verificar límite de usos
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      return NextResponse.json({ error: "Código de descuento agotado" }, { status: 400 })
    }

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
