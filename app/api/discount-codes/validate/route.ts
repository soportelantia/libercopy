import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Código de descuento requerido" }, { status: 400 })
    }

    console.log("Validando código:", code)

    // Buscar el código de descuento
    const { data: discountCode, error: fetchError } = await supabaseAdmin
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (fetchError) {
      console.error("Error al buscar código:", fetchError)
      return NextResponse.json({ error: "Código de descuento no válido" }, { status: 404 })
    }

    if (!discountCode) {
      console.log("Código no encontrado:", code)
      return NextResponse.json({ error: "Código de descuento no válido" }, { status: 404 })
    }

    console.log("Código encontrado:", discountCode)

    // Verificar fechas
    const now = new Date()
    const startDate = new Date(discountCode.start_date)
    const endDate = new Date(discountCode.end_date)

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

    console.log("Código válido, devolviendo:", {
      id: discountCode.id,
      code: discountCode.code,
      percentage: discountCode.percentage,
    })

    return NextResponse.json({
      valid: true,
      discount: {
        id: discountCode.id,
        code: discountCode.code,
        percentage: discountCode.percentage,
      },
    })
  } catch (error) {
    console.error("Error en validación de código de descuento:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
