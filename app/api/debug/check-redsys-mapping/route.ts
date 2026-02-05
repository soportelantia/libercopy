import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const redsysOrderNumber = searchParams.get("redsysOrderNumber")

    if (!redsysOrderNumber) {
      return NextResponse.json(
        {
          error: "Missing redsysOrderNumber parameter",
          usage: "/api/debug/check-redsys-mapping?redsysOrderNumber=364131370956",
        },
        { status: 400 }
      )
    }

    // Buscar el mapeo
    const { data: mapping, error: mappingError } = await supabase
      .from("redsys_order_mapping")
      .select("*")
      .eq("redsys_order_number", redsysOrderNumber)
      .single()

    // Buscar todos los mapeos similares (por si hay un problema de formato)
    const { data: allMappings, error: allMappingsError } = await supabase
      .from("redsys_order_mapping")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    // Si encontramos el mapeo, buscar el pedido asociado
    let orderData = null
    if (mapping?.order_id) {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, status, payment_reference, total, created_at")
        .eq("id", mapping.order_id)
        .single()

      orderData = order || { error: orderError?.message }
    }

    return NextResponse.json({
      searchedRedsysOrderNumber: redsysOrderNumber,
      mappingFound: !!mapping,
      mapping: mapping || null,
      mappingError: mappingError?.message || null,
      associatedOrder: orderData,
      recentMappings: allMappings || [],
      allMappingsError: allMappingsError?.message || null,
    })
  } catch (error) {
    console.error("[v0] Error in check-redsys-mapping:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
