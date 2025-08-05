import { NextResponse } from "next/server"
import { GoogleStorageService } from "@/lib/google-storage"

export async function GET() {
  console.log("=== INICIO DEBUG GOOGLE STORAGE ===")

  try {
    // Verificar solo las variables de entorno que necesitamos
    const envCheck = {
      GOOGLE_CLOUD_PROJECT_ID: {
        exists: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
        value: process.env.GOOGLE_CLOUD_PROJECT_ID || "NO_CONFIGURADO",
        length: process.env.GOOGLE_CLOUD_PROJECT_ID?.length || 0,
      },
      GOOGLE_CLOUD_STORAGE_BUCKET: {
        exists: !!process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
        value: process.env.GOOGLE_CLOUD_STORAGE_BUCKET || "NO_CONFIGURADO",
        length: process.env.GOOGLE_CLOUD_STORAGE_BUCKET?.length || 0,
      },
      GOOGLE_CLOUD_CREDENTIALS_JSON: {
        exists: !!process.env.GOOGLE_CLOUD_CREDENTIALS_JSON,
        value: process.env.GOOGLE_CLOUD_CREDENTIALS_JSON ? "JSON_CONFIGURADO" : "NO_CONFIGURADO",
        length: process.env.GOOGLE_CLOUD_CREDENTIALS_JSON?.length || 0,
        isValidJson: false,
        serviceAccountEmail: "NO_DISPONIBLE",
        projectId: "NO_DISPONIBLE",
      },
    }

    console.log("Variables de entorno verificadas:", envCheck)

    // Verificar variables obligatorias
    if (!envCheck.GOOGLE_CLOUD_PROJECT_ID.exists) {
      return NextResponse.json({
        success: false,
        error: "MISSING_PROJECT_ID",
        message: "GOOGLE_CLOUD_PROJECT_ID no está configurado",
        envCheck,
      })
    }

    if (!envCheck.GOOGLE_CLOUD_STORAGE_BUCKET.exists) {
      return NextResponse.json({
        success: false,
        error: "MISSING_BUCKET",
        message: "GOOGLE_CLOUD_STORAGE_BUCKET no está configurado",
        envCheck,
      })
    }

    if (!envCheck.GOOGLE_CLOUD_CREDENTIALS_JSON.exists) {
      return NextResponse.json({
        success: false,
        error: "MISSING_CREDENTIALS",
        message: "GOOGLE_CLOUD_CREDENTIALS_JSON no está configurado",
        envCheck,
        instructions: [
          "1. Ve a Google Cloud Console",
          "2. Crea un Service Account",
          "3. Descarga el archivo JSON de credenciales",
          "4. Copia todo el contenido del archivo JSON",
          "5. Configura GOOGLE_CLOUD_CREDENTIALS_JSON con ese contenido",
        ],
      })
    }

    // Verificar que el JSON es válido
    let credentials: any
    try {
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON!)
      envCheck.GOOGLE_CLOUD_CREDENTIALS_JSON.isValidJson = true
      envCheck.GOOGLE_CLOUD_CREDENTIALS_JSON.serviceAccountEmail = credentials.client_email || "NO_DISPONIBLE"
      envCheck.GOOGLE_CLOUD_CREDENTIALS_JSON.projectId = credentials.project_id || "NO_DISPONIBLE"
      console.log("Credenciales JSON válidas, Service Account:", credentials.client_email)
      console.log("Project ID en credenciales:", credentials.project_id)
    } catch (parseError) {
      console.error("Error parseando JSON:", parseError)
      return NextResponse.json({
        success: false,
        error: "INVALID_JSON_CREDENTIALS",
        message: "GOOGLE_CLOUD_CREDENTIALS_JSON no es un JSON válido",
        parseError: parseError instanceof Error ? parseError.message : String(parseError),
        envCheck,
      })
    }

    // Verificar campos requeridos en las credenciales
    if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
      return NextResponse.json({
        success: false,
        error: "INCOMPLETE_CREDENTIALS",
        message: "Las credenciales JSON no contienen todos los campos requeridos",
        missing: {
          client_email: !credentials.client_email,
          private_key: !credentials.private_key,
          project_id: !credentials.project_id,
        },
        envCheck,
      })
    }

    // Probar la conexión usando el servicio
    console.log("Probando conexión con GoogleStorageService...")
    const connectionTest = await GoogleStorageService.testConnection()

    // Resultado exitoso
    return NextResponse.json({
      success: connectionTest.success,
      message: connectionTest.message,
      envCheck,
      connectionTest,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("=== ERROR GENERAL EN DEBUG ===")
    console.error("Error:", error)
    console.error("Stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        success: false,
        error: "GENERAL_ERROR",
        message: "Error general en debug",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
