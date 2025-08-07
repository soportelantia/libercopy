import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validar campos requeridos
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos obligatorios deben ser completados' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      )
    }

    // Preparar el contenido del email
    const emailContent = `
      <h2>Nuevo mensaje de contacto desde LiberCopy</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Este mensaje fue enviado desde el formulario de contacto de libercopy.es
      </p>
    `

    // Enviar el email
    const result = await sendEmail({
      to: 'info@libercopy.es',
      subject: `[Contacto Web] ${subject}`,
      html: emailContent,
      replyTo: email
    })

    if (!result.success) {
      console.error('Error enviando email:', result.error)
      return NextResponse.json(
        { error: 'Error interno del servidor al enviar el email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente'
    })

  } catch (error) {
    console.error('Error en API de contacto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
