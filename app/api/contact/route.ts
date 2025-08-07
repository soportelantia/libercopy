import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/mail-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message } = body

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos obligatorios deben estar completos' },
        { status: 400 }
      )
    }

    // Crear el contenido del email
    const emailContent = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `

    // Enviar email
    const emailResult = await sendEmail({
      to: 'info@libercopy.es',
      subject: `Contacto: ${subject}`,
      html: emailContent,
      replyTo: email
    })

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Mensaje enviado correctamente. Te responderemos pronto.'
      })
    } else {
      console.error('Error sending email:', emailResult.error)
      return NextResponse.json(
        { success: false, message: 'Error al enviar el mensaje. Inténtalo de nuevo.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
