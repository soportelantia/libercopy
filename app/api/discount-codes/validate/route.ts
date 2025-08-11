import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código de descuento requerido" }, { status: 400 })
    }

    // Use service role key for database operations
    const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Validate discount code
    const { data: discountCode, error } = await adminSupabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single()

    if (error || !discountCode) {
      return NextResponse.json(
        {
          valid: false,
          error: "Código de descuento no válido",
        },
        { status: 404 },
      )
    }

    // Check if code is within valid date range
    const now = new Date()
    const startDate = new Date(discountCode.start_date)
    const endDate = new Date(discountCode.end_date)

    if (now < startDate || now > endDate) {
      return NextResponse.json(
        {
          valid: false,
          error: "Código de descuento expirado",
        },
        { status: 400 },
      )
    }

    // Check usage limits
    if (discountCode.max_uses && discountCode.current_uses >= discountCode.max_uses) {
      return NextResponse.json(
        {
          valid: false,
          error: "Código de descuento agotado",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      valid: true,
      code: discountCode.code,
      percentage: discountCode.percentage,
      message: `Descuento del ${discountCode.percentage}% aplicado`,
    })
  } catch (error) {
    console.error("Error validating discount code:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
