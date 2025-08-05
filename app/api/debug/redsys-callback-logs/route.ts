import { type NextRequest, NextResponse } from "next/server"

// Almacenar logs en memoria (en producción usarías una base de datos)
let callbackLogs: Array<{
  id: string
  timestamp: string
  level: "info" | "error" | "warn"
  message: string
  data?: any
}> = []

export async function GET() {
  try {
    // Devolver los últimos 100 logs
    const recentLogs = callbackLogs.slice(-100).reverse()

    return NextResponse.json({
      success: true,
      logs: recentLogs,
      total: callbackLogs.length,
    })
  } catch (error) {
    console.error("Error getting callback logs:", error)
    return NextResponse.json({ success: false, error: "Error al obtener logs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { level, message, data } = await request.json()

    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: level || "info",
      message,
      data,
    }

    callbackLogs.push(logEntry)

    // Mantener solo los últimos 1000 logs
    if (callbackLogs.length > 1000) {
      callbackLogs = callbackLogs.slice(-1000)
    }

    console.log(`[REDSYS LOG] ${level.toUpperCase()}: ${message}`, data || "")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving callback log:", error)
    return NextResponse.json({ success: false, error: "Error al guardar log" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    callbackLogs = []
    return NextResponse.json({ success: true, message: "Logs cleared" })
  } catch (error) {
    console.error("Error clearing logs:", error)
    return NextResponse.json({ success: false, error: "Error al limpiar logs" }, { status: 500 })
  }
}
