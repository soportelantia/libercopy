import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const redsysOrderNumber = searchParams.get("redsysOrderNumber")

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
    // Buscar el mapeo
    const { data: mappingData, error: mappingError } = await supabase
      .from("redsys_order_mapping")
      .select("*")
      .eq("redsys_order_number", redsysOrderNumber)
      .single()

    if (mappingError) {
      return NextResponse.json({
        success: false,
        redsysOrderNumber,
        found: false,
        error: mappingError.message,
        errorCode: mappingError.code,
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
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
