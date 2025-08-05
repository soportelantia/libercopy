import { NextResponse } from "next/server"

export async function GET() {
  // Solo mostrar información de configuración sin exponer las claves completas
  const config = {
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY ? `${process.env.MAILGUN_API_KEY.substring(0, 8)}...` : "NOT SET",
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || "NOT SET",
    MAILGUN_FROM_EMAIL: process.env.MAILGUN_FROM_EMAIL || "NOT SET",
    isConfigured: Boolean(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN),
    timestamp: new Date().toISOString(),
  }

  console.log("Mailgun configuration check:", config)

  return NextResponse.json({
    message: "Mailgun configuration status",
    config,
    environment: process.env.NODE_ENV,
  })
}
