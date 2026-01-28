import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Falta el email" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("❌ Error en consulta de perfiles:", error)
      console.error("Key: ",process.env.SUPABASE_SERVICE_ROLE_KEY!)
      return NextResponse.json({ error: "Error al consultar email" }, { status: 500 })
    }

    return NextResponse.json({ exists: !!data })
  } catch (err) {
    console.error("❌ Error interno en /check-email:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
