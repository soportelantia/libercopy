import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Very basic check first
    const result = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      hasGoogleProjectId: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      hasGoogleBucket: !!process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      hasGoogleCredentials: !!process.env.GOOGLE_CLOUD_CREDENTIALS_JSON,
    }

    return NextResponse.json({
      success: true,
      message: "Configuration check successful",
      data: result,
    })
  } catch (error) {
    // More detailed error logging
    console.error("Error in simple-config:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Configuration check failed",
        details:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      },
      { status: 500 },
    )
  }
}
