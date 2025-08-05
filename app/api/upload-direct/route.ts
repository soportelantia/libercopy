import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("=== INICIO UPLOAD DIRECT API ===")

  try {
    // Obtener solo los metadatos del archivo (no el archivo completo)
    const body = await request.json()
    const { fileName, fileSize, fileType } = body

    console.log("Metadatos recibidos:", { fileName, fileSize, fileType })

    if (!fileName || !fileSize || !fileType) {
      return NextResponse.json({ error: "Faltan metadatos del archivo" }, { status: 400 })
    }

    // Validar tipo de archivo (solo PDF)
    if (fileType !== "application/pdf") {
      return NextResponse.json({ error: "Solo se permiten archivos PDF" }, { status: 400 })
    }

    // Límite de 50MB
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (fileSize > maxSize) {
      return NextResponse.json(
        {
          error: `El archivo excede el tamaño máximo de 50MB. Tu archivo tiene ${(fileSize / (1024 * 1024)).toFixed(2)}MB.`,
          code: "FILE_TOO_LARGE",
        },
        { status: 400 },
      )
    }

    // Generar datos para upload directo
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const uniqueFileName = `${timestamp}_${sanitizedFileName}`
    const tempUserId = `temp_${timestamp}_${Math.random().toString(36).substring(2, 15)}`
    const tempPath = `liberCopy/temp/${tempUserId}/${uniqueFileName}`

    // Verificar configuración de Google Cloud
    if (!process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || !process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
      return NextResponse.json(
        {
          error: "Configuración de almacenamiento no disponible",
          code: "STORAGE_CONFIG_ERROR",
        },
        { status: 503 },
      )
    }

    let credentials
    try {
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON)
    } catch {
      return NextResponse.json(
        {
          error: "Error de configuración del almacenamiento",
          code: "STORAGE_CONFIG_ERROR",
        },
        { status: 503 },
      )
    }

    // Configurar Google Cloud Storage
    const { Storage } = await import("@google-cloud/storage")
    const storage = new Storage({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    })

    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)

    // Configurar CORS automáticamente si no está configurado
    try {
      console.log("Configurando CORS para el bucket...")
      const corsConfiguration = [
        {
          origin: ["https://v0-libery-copy.vercel.app", "http://localhost:3000", "*"],
          method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          responseHeader: ["Content-Type", "x-goog-resumable", "x-goog-content-length-range"],
          maxAgeSeconds: 3600,
        },
      ]

      await bucket.setCorsConfiguration(corsConfiguration)
      console.log("CORS configurado exitosamente")
    } catch (corsError) {
      console.warn("No se pudo configurar CORS automáticamente:", corsError)
      // Continuar sin CORS, intentaremos de todas formas
    }

    // Generar URL firmada para upload resumible
    const fileRef = bucket.file(tempPath)

    try {
      // Intentar generar URL firmada para upload resumible
      const [signedUrl] = await fileRef.getSignedUrl({
        version: "v4",
        action: "resumable",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutos
        contentType: "application/pdf",
        extensionHeaders: {
          "x-goog-content-length-range": `0,${maxSize}`,
        },
      })

      console.log("URL firmada resumible generada")

      return NextResponse.json({
        success: true,
        uploadUrl: signedUrl,
        fileName: uniqueFileName,
        tempPath: tempPath,
        tempUserId: tempUserId,
        originalName: fileName,
        size: fileSize,
        uploadType: "resumable",
      })
    } catch (signedUrlError) {
      console.error("Error generando URL firmada resumible:", signedUrlError)

      // Fallback: intentar URL firmada simple
      try {
        const [signedUrl] = await fileRef.getSignedUrl({
          version: "v4",
          action: "write",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutos
          contentType: "application/pdf",
        })

        console.log("URL firmada simple generada como fallback")

        return NextResponse.json({
          success: true,
          uploadUrl: signedUrl,
          fileName: uniqueFileName,
          tempPath: tempPath,
          tempUserId: tempUserId,
          originalName: fileName,
          size: fileSize,
          uploadType: "simple",
        })
      } catch (fallbackError) {
        console.error("Error generando URL firmada simple:", fallbackError)
        throw fallbackError
      }
    }
  } catch (error) {
    console.error("=== ERROR EN UPLOAD DIRECT API ===")
    console.error("Error completo:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 },
    )
  }
}
