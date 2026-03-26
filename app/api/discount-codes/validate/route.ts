import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Código no válido" }, { status: 400 })
    }

    const normalizedCode = code.trim().toUpperCase()

    const { data: discount, error } = await supabaseAdmin
      .from("discount_codes")
      .select("id, code, percentage, start_date, end_date, max_uses, current_uses, is_active")
      .eq("code", normalizedCode)
      .single()

    if (error || !discount) {
      return NextResponse.json({ error: "Código no encontrado" }, { status: 404 })
    }

    if (!discount.is_active) {
      return NextResponse.json({ error: "Este código no está activo" }, { status: 400 })
    }

    const now = new Date()
    if (discount.start_date && new Date(discount.start_date) > now) {
      return NextResponse.json({ error: "Este código aún no está disponible" }, { status: 400 })
    }
    if (discount.end_date && new Date(discount.end_date) < now) {
      return NextResponse.json({ error: "Este código ha expirado" }, { status: 400 })
    }

    if (discount.max_uses !== null && discount.current_uses >= discount.max_uses) {
      return NextResponse.json({ error: "Este código ha alcanzado el límite de usos" }, { status: 400 })
    }

    const percentage = Number(discount.percentage)
    const discountAmount = subtotal ? (subtotal * percentage) / 100 : 0

    return NextResponse.json({
      valid: true,
      code: discount.code,
      percentage,
      discountAmount: Math.round(discountAmount * 100) / 100,
    })
  } catch (err) {
    console.error("[discount-codes/validate] Error:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
