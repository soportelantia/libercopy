import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  console.log("=== DEBUG TEST UPLOAD ===")

  try {
    // 1. Verificar variables de entorno
    console.log("1. Verificando variables de entorno...")
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      GOOGLE_CLOUD_PROJECT_ID: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_STORAGE_BUCKET: !!process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      GOOGLE_CLOUD_CREDENTIALS_JSON: !!process.env.GOOGLE_CLOUD_CREDENTIALS_JSON,
    }
    console.log("Variables de entorno:", envCheck)

    // 2. Verificar autenticación
    console.log("2. Verificando autenticación...")
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("Usuario:", user?.id, "Error auth:", authError)

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        step: "authentication",
        error: authError?.message || "No user found",
        envCheck,
      })
    }

    // 3. Verificar FormData
    console.log("3. Verificando FormData...")
    const formData = await request.formData()
    const file = formData.get("file") as File

    console.log("Archivo recibido:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      hasFile: !!file,
    })

    if (!file) {
      return NextResponse.json({
        success: false,
        step: "file_validation",
        error: "No file provided",
        envCheck,
        user: user.id,
      })
    }

    // 4. Verificar Google Cloud (sin subir archivo aún)
    console.log("4. Verificando configuración de Google Cloud...")

    // Verificar que las variables existen
    if (
      !process.env.GOOGLE_CLOUD_PROJECT_ID ||
      !process.env.GOOGLE_CLOUD_STORAGE_BUCKET ||
      !process.env.GOOGLE_CLOUD_CREDENTIALS_JSON
    ) {
      return NextResponse.json({
        success: false,
        step: "google_cloud_config",
        error: "Missing Google Cloud environment variables",
        envCheck,
        user: user.id,
        file: { name: file.name, size: file.size },
      })
    }

    // Verificar que las credenciales son JSON válido
    let credentials
    try {
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON)
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        step: "google_cloud_credentials",
        error: "Invalid JSON in GOOGLE_CLOUD_CREDENTIALS_JSON",
        envCheck,
        user: user.id,
        file: { name: file.name, size: file.size },
      })
    }

    return NextResponse.json({
      success: true,
      message: "All checks passed - ready for upload",
      envCheck,
      user: user.id,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      googleCloud: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
        serviceAccount: credentials.client_email,
      },
    })
  } catch (error) {
    console.error("Error en test upload:", error)
    return NextResponse.json({
      success: false,
      step: "general_error",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
