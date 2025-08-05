import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, getWelcomeEmail, getPasswordResetEmail, getOrderConfirmationEmail } from "@/lib/mail-service"

export async function POST(request: NextRequest) {
  try {
    const { type, to, data } = await request.json()

    if (!type || !to) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let emailData
    switch (type) {
      case "welcome":
        emailData = getWelcomeEmail(data.firstName || "Usuario")
        break
      case "password-reset":
        emailData = getPasswordResetEmail(data.resetUrl)
        break
      case "order-confirmation":
        emailData = getOrderConfirmationEmail(data)
        break
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    const result = await sendEmail({
      to,
      subject: emailData.subject,
      html: emailData.html,
    })

    return NextResponse.json({
      success: result.success,
      result: result.success ? result.result : result.error,
    })
  } catch (error) {
    console.error("Error in send-email API:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
