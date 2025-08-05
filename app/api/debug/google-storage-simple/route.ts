import { NextResponse } from "next/server"

export async function GET() {
  console.log("=== DEBUG GOOGLE STORAGE SIMPLE ===")

  try {
    // Check environment variables
    const envVars = {
      GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_STORAGE_BUCKET: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      GOOGLE_CLOUD_CREDENTIALS_JSON: process.env.GOOGLE_CLOUD_CREDENTIALS_JSON ? "SET" : "NOT SET",
    }

    console.log("Environment variables:", envVars)

    // Check if all required variables are set
    const missing = []
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID) missing.push("GOOGLE_CLOUD_PROJECT_ID")
    if (!process.env.GOOGLE_CLOUD_STORAGE_BUCKET) missing.push("GOOGLE_CLOUD_STORAGE_BUCKET")
    if (!process.env.GOOGLE_CLOUD_CREDENTIALS_JSON) missing.push("GOOGLE_CLOUD_CREDENTIALS_JSON")

    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        missing: missing,
        help: "You need to configure these Google Cloud variables in your .env.local file",
      })
    }

    // Try to parse credentials JSON
    let credentials
    try {
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON!)
      console.log("Credentials parsed successfully")
      console.log("Service account email:", credentials.client_email)
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: "Invalid GOOGLE_CLOUD_CREDENTIALS_JSON",
        details: parseError instanceof Error ? parseError.message : String(parseError),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Google Cloud Storage configuration looks good",
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      serviceAccount: credentials.client_email,
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
