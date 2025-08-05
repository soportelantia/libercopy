import { type NextRequest, NextResponse } from "next/server"
import { sendEmail, getMailgunStatus } from "@/lib/mail-service"

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json()

    if (!to) {
      return NextResponse.json({ error: "Email address required" }, { status: 400 })
    }

    console.log("🧪 Testing email send to:", to)

    const status = getMailgunStatus()
    console.log("📊 Mailgun status:", status)

    const result = await sendEmail({
      to,
      subject: "Test Email - Liberiscopy",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🧪 Test Email</h2>
          <p>Este es un email de prueba desde Liberiscopy.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Mailgun Status:</strong></p>
          <pre>${JSON.stringify(status, null, 2)}</pre>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      result,
      mailgunStatus: status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error in test email:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
        mailgunStatus: getMailgunStatus(),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  const status = getMailgunStatus()
  return NextResponse.json({
    message: "Email test endpoint",
    mailgunStatus: status,
    timestamp: new Date().toISOString(),
  })
}
