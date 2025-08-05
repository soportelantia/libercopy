import { NextResponse } from "next/server"
import { GoogleStorageService } from "@/lib/google-storage"

// Esta API route se puede llamar periódicamente para limpiar archivos temporales
export async function POST() {
  try {
    await GoogleStorageService.cleanupTempFiles()
    return NextResponse.json({ success: true, message: "Archivos temporales limpiados" })
  } catch (error) {
    console.error("Error limpiando archivos temporales:", error)
    return NextResponse.json({ error: "Error al limpiar archivos temporales" }, { status: 500 })
  }
}
