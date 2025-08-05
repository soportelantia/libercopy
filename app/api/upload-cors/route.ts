import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("=== INICIO UPLOAD CORS API ===")

  try {
    // Configurar CORS para Google Cloud Storage
    const { Storage } = await import("@google-cloud/storage")

    // Verificar configuración
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

    const storage = new Storage({
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    })

    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET)

    // Configurar CORS para el bucket
    const corsConfiguration = [
      {
        origin: ["https://v0-libery-copy.vercel.app", "http://localhost:3000"],
        method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        responseHeader: ["Content-Type", "x-goog-resumable"],
        maxAgeSeconds: 3600,
      },
    ]

    try {
      await bucket.setCorsConfiguration(corsConfiguration)
      console.log("CORS configurado exitosamente")

      return NextResponse.json({
        success: true,
        message: "CORS configurado correctamente",
        corsConfig: corsConfiguration,
      })
    } catch (corsError) {
      console.error("Error configurando CORS:", corsError)
      return NextResponse.json(
        {
          error: "Error configurando CORS",
          details: corsError instanceof Error ? corsError.message : "Error desconocido",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("=== ERROR EN UPLOAD CORS API ===")
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
