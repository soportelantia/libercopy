import { type NextRequest, NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || "{}"),
})

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "")

// Store chunks in memory temporarily
const chunkStore = new Map<string, { chunks: Buffer[]; totalChunks: number; fileName: string }>()

export async function POST(request: NextRequest) {
  try {
    console.log("=== UPLOAD-CHUNK API: Procesando chunk ===")

    const formData = await request.formData()
    const chunk = formData.get("chunk") as File
    const chunkIndex = Number.parseInt(formData.get("chunkIndex") as string)
    const totalChunks = Number.parseInt(formData.get("totalChunks") as string)
    const fileName = formData.get("fileName") as string
    const uploadId = formData.get("uploadId") as string

    if (!chunk || isNaN(chunkIndex) || isNaN(totalChunks) || !fileName || !uploadId) {
      return NextResponse.json({ error: "Datos del chunk incompletos" }, { status: 400 })
    }

    // Verificar que el chunk no sea demasiado grande (2MB máximo por chunk)
    if (chunk.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Chunk demasiado grande" }, { status: 413 })
    }

    console.log(`Procesando chunk ${chunkIndex + 1}/${totalChunks} para ${fileName}`)

    // Initialize chunk storage for this upload if not exists
    if (!chunkStore.has(uploadId)) {
      chunkStore.set(uploadId, {
        chunks: new Array(totalChunks),
        totalChunks,
        fileName,
      })
    }

    const uploadData = chunkStore.get(uploadId)!

    // Store this chunk
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer())
    uploadData.chunks[chunkIndex] = chunkBuffer

    console.log(`Chunk ${chunkIndex + 1} almacenado en memoria`)

    // Check if all chunks are received
    const receivedChunks = uploadData.chunks.filter((c) => c !== undefined).length

    if (receivedChunks === totalChunks) {
      console.log("Todos los chunks recibidos, ensamblando archivo completo...")

      // Combine all chunks
      const completeFile = Buffer.concat(uploadData.chunks)
      console.log(`Archivo completo ensamblado: ${completeFile.length} bytes`)

      // Generate file info
      const timestamp = Date.now()
      const dateObj = new Date(timestamp)
      const year = dateObj.getFullYear()
      const month = String(dateObj.getMonth() + 1).padStart(2, "0")
      const day = String(dateObj.getDate()).padStart(2, "0")
      const formattedDate = `${year}-${month}-${day}`
      const finalFileName = `${timestamp}_${fileName}`
      const filePath = `liberCopy/${formattedDate}/${finalFileName}`

      // Upload to Google Cloud Storage
      const cloudFile = bucket.file(filePath)
      await cloudFile.save(completeFile, {
        metadata: {
          contentType: "application/pdf",
        },
      })

      console.log("Archivo subido exitosamente a Google Cloud Storage")

      // Generate URL
      const baseFileUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${filePath}`
      const tempUserId = `temp_${timestamp}_${Math.random().toString(36).substring(2, 15)}`

      // Clean up memory
      chunkStore.delete(uploadId)

      const response = {
        success: true,
        isComplete: true,
        fileName: finalFileName,
        fileUrl: baseFileUrl,
        tempPath: filePath,
        tempUserId: tempUserId,
        message: "Archivo subido exitosamente por chunks",
      }

      console.log("Respuesta del API (chunk final):", response)
      return NextResponse.json(response)
    } else {
      // Not all chunks received yet
      return NextResponse.json({
        success: true,
        isComplete: false,
        chunkIndex,
        message: `Chunk ${chunkIndex + 1}/${totalChunks} recibido (${receivedChunks}/${totalChunks})`,
      })
    }
  } catch (error) {
    console.error("Error en upload-chunk API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
