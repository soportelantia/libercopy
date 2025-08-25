import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    console.log("Validating discount code:", code)

    if (!code) {
      return NextResponse.json({ error: "Código de descuento requerido" }, { status: 400 })
    }

    const supabase = createClient()

    // Buscar el código de descuento
    const { data: discountCode, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    console.log("Database query result:", { discountCode, error })

    if (error || !discountCode) {
      console.log("Discount code not found or error:", error)
      return NextResponse.json({ error: "Código de descuento no válido" }, { status: 404 })
    }

    // Verificar fechas de validez
    const now = new Date()
    const startDate = new Date(discountCode.start_date)
    const endDate = new Date(discountCode.end_date)

    console.log("Date validation:", { now, startDate, endDate })

    if (now < startDate) {
      return NextResponse.json({ error: "Este código de descuento aún no está activo" }, { status: 400 })
    }

    if (now > endDate) {
      return NextResponse.json({ error: "Este código de descuento ha expirado" }, { status: 400 })
    }

    // Verificar límite de usos
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      return NextResponse.json({ error: "Este código de descuento ha alcanzado su límite de usos" }, { status: 400 })
    }

    console.log("Discount code validated successfully:", discountCode)

    return NextResponse.json({
      valid: true,
      code: discountCode.code,
      percentage: discountCode.percentage,
      message: `¡Código aplicado! ${discountCode.percentage}% de descuento`,
    })
  } catch (error) {
    console.error("Error validating discount code:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
