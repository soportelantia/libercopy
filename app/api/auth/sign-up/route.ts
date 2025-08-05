import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getWelcomeEmail, sendEmail } from "@/lib/mail-service"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // 1. Crear el usuario sin enviar el email por defecto
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
      email_confirm: false, // 🔒 No enviar email por defecto
    })

    if (createError) {
      console.error("❌ Error creando usuario:", createError)
      return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
    }

    // 2. Generar enlace de confirmación personalizado
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth?verified=1`, // o a donde quieras que confirme
      },
    })

    if (linkError || !linkData?.properties?.action_link) {
      console.error("❌ Error generando enlace de confirmación:", linkError)
      return NextResponse.json({ success: false, error: "No se pudo generar el enlace de confirmación" }, { status: 500 })
    }

    const confirmUrl = linkData.properties.action_link

    // 3. Preparar plantilla personalizada
    const template = getWelcomeEmail(firstName,confirmUrl)

    // 4. Enviar email
    const emailResult = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })

    if (!emailResult.success) {
      console.error("❌ Error enviando email:", emailResult.error)
      return NextResponse.json({ success: false, error: "Error enviando el email de bienvenida" }, { status: 500 })
    }

    console.log("✅ Usuario registrado y email enviado")
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ Error en /api/auth/sign-up:", err)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
