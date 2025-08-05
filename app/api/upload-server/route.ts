import { type NextRequest, NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || "{}"),
})

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "")

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD-SERVER API: Iniciando upload ===")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se encontró archivo" }, { status: 400 })
    }

    console.log("Archivo recibido:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // Verificar límite estricto de 3MB para este endpoint
    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Archivo demasiado grande para este método. Máximo 3MB.",
        },
        { status: 413 },
      )
    }

    // Generar timestamp actual
    const timestamp = Date.now()

    // Obtener la fecha en formato YYYY-MM-DD
    const dateObj = new Date(timestamp)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, "0")
    const day = String(dateObj.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`

    // Generar nombre final del archivo
    const finalFileName = `${timestamp}_${file.name}`

    // Crear la ruta del archivo en Google Storage
    const filePath = `liberCopy/${formattedDate}/${finalFileName}`

    console.log("Ruta del archivo:", filePath)

    // Subir archivo a Google Cloud Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const cloudFile = bucket.file(filePath)

    await cloudFile.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    })

    console.log("Archivo subido exitosamente a Google Cloud Storage")

    // ✅ IMPORTANTE: Crear la URL base sin parámetros de autenticación
    const baseFileUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${filePath}`

    console.log("=== UPLOAD-SERVER API: URLs generadas ===")
    console.log("Base URL (para guardar):", baseFileUrl)

    // Generar tempUserId para compatibilidad
    const tempUserId = `temp_${timestamp}_${Math.random().toString(36).substring(2, 15)}`

    const response = {
      success: true,
      fileName: finalFileName,
      fileUrl: baseFileUrl, // ✅ URL limpia sin parámetros
      tempPath: filePath,
      tempUserId: tempUserId,
      message: "Archivo subido exitosamente",
    }

    console.log("Respuesta del API:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error en upload-server API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
