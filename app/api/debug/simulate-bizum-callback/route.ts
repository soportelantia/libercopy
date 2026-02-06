import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  console.log("[v0] === SIMULATING BIZUM CALLBACK ===")

  // Datos reales del callback que recibiste
  const redsysOrderNumber = "364131370956"
  const responseCode = "0000"
  const authCode = "424750"

  try {
    // 1. Buscar el mapeo
    console.log("[v0] Step 1: Looking up order mapping...")
    const { data: mappingData, error: mappingError } = await supabase
      .from("redsys_order_mapping")
      .select("order_id")
      .eq("redsys_order_number", redsysOrderNumber)
      .single()

    console.log("[v0] Mapping result:", { mappingData, error: mappingError?.message })

    if (mappingError || !mappingData) {
      return NextResponse.json({
        success: false,
        step: "mapping_lookup",
        redsysOrderNumber,
        error: mappingError?.message || "Mapping not found",
        errorCode: mappingError?.code,
        errorDetails: mappingError,
      })
    }

    const realOrderId = mappingData.order_id
    console.log("[v0] Found order ID:", realOrderId)

    // 2. Determinar el estado del pago
    const isSuccessful = responseCode && Number.parseInt(responseCode) >= 0 && Number.parseInt(responseCode) <= 99
    const newStatus = isSuccessful ? "completed" : "payment_failed"

    console.log("[v0] Step 2: Payment status determined:", {
      responseCode,
      isSuccessful,
      newStatus,
    })

    // 3. Verificar el pedido antes de actualizar
    console.log("[v0] Step 3: Checking order before update...")
    const { data: orderBefore, error: orderBeforeError } = await supabase
      .from("orders")
      .select("id, status, total_amount, user_id, payment_method")
      .eq("id", realOrderId)
      .single()

    console.log("[v0] Order before update:", { orderBefore, error: orderBeforeError?.message })

    if (orderBeforeError) {
      return NextResponse.json({
        success: false,
        step: "order_check",
        orderId: realOrderId,
        error: orderBeforeError.message,
        errorCode: orderBeforeError.code,
        errorDetails: orderBeforeError,
      })
    }

    // 4. Actualizar el pedido
    console.log("[v0] Step 4: Updating order...")
    const { data: updateData, error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        payment_reference: authCode || redsysOrderNumber,
        updated_at: new Date().toISOString(),
      })
      .eq("id", realOrderId)
      .select()

    console.log("[v0] Update result:", { updateData, error: updateError?.message })

    if (updateError) {
      return NextResponse.json({
        success: false,
        step: "order_update",
        orderId: realOrderId,
        error: updateError.message,
        errorCode: updateError.code,
        errorDetails: updateError,
      })
    }

    // 5. Verificar el pedido después de actualizar
    console.log("[v0] Step 5: Verifying order after update...")
    const { data: orderAfter, error: orderAfterError } = await supabase
      .from("orders")
      .select("id, status, payment_reference, updated_at")
      .eq("id", realOrderId)
      .single()

    console.log("[v0] Order after update:", { orderAfter, error: orderAfterError?.message })

    return NextResponse.json({
      success: true,
      message: "Simulation completed successfully",
      redsysOrderNumber,
      orderId: realOrderId,
      newStatus,
      paymentReference: authCode || redsysOrderNumber,
      orderBefore,
      orderAfter,
      updateResult: updateData,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        step: "unexpected_error",
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorStack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
