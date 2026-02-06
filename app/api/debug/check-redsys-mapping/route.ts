import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redsysOrderNumber = searchParams.get("redsysOrderNumber")

  console.log("[v0] Check Redsys Mapping - Start")
  console.log("[v0] Redsys Order Number:", redsysOrderNumber)
  console.log("[v0] Supabase URL configured:", !!process.env.SUPABASE_URL)
  console.log("[v0] Service Role Key configured:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (!redsysOrderNumber) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing redsysOrderNumber parameter",
        usage: "?redsysOrderNumber=364131370956",
      },
      { status: 400 }
    )
  }

  try {
    console.log("[v0] Querying redsys_order_mapping table...")
    
    // Buscar el mapeo
    const { data: mappingData, error: mappingError } = await supabase
      .from("redsys_order_mapping")
      .select("*")
      .eq("redsys_order_number", redsysOrderNumber)
      .single()

    console.log("[v0] Query result:", { mappingData, mappingError: mappingError?.message })

    if (mappingError) {
      return NextResponse.json({
        success: false,
        redsysOrderNumber,
        found: false,
        error: mappingError.message,
        errorCode: mappingError.code,
        errorDetails: mappingError,
      })
    }

    // Si encontró el mapeo, también buscar el pedido
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, status, total_amount, payment_method, payment_reference, created_at, updated_at")
      .eq("id", mappingData.order_id)
      .single()

    return NextResponse.json({
      success: true,
      redsysOrderNumber,
      found: true,
      mapping: mappingData,
      order: orderData || null,
      orderError: orderError?.message || null,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        redsysOrderNumber,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorStack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
