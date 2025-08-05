import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendEmail, getPasswordResetEmail } from "@/lib/mail-service"

// Crear cliente admin de Supabase
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    console.log("🔐 Password reset requested for:", email)

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Generar enlace de recuperación usando Supabase Admin
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
      },
    })

    if (error) {
      console.error("❌ Error generando enlace de recuperación:", error)

      // No revelar si el usuario existe o no por seguridad
      return NextResponse.json(
        {
          success: true,
          message: "Si el email existe en nuestro sistema, recibirás un enlace de recuperación.",
        },
        { status: 200 },
      )
    }

    console.log("✅ Enlace de recuperación generado:", {
      email,
      hasActionLink: !!data.properties?.action_link,
    })

    // Usar el enlace generado por Supabase que incluye el token correcto
    const resetUrl = data.properties?.action_link

    if (!resetUrl) {
      console.error("❌ No se pudo generar el enlace de recuperación")
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }

    // Enviar email personalizado con el enlace correcto
    const emailTemplate = getPasswordResetEmail(resetUrl, email)
    const emailResult = await sendEmail({
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    if (!emailResult.success) {
      console.error("❌ Error enviando email:", emailResult.error)
      // Aún así devolvemos éxito para no revelar información
    } else {
      console.log("✅ Email de recuperación enviado correctamente")
    }

    return NextResponse.json({
      success: true,
      message: "Si el email existe en nuestro sistema, recibirás un enlace de recuperación.",
    })
  } catch (error) {
    console.error("❌ Error en reset-password API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
