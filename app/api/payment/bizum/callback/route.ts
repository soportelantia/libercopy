import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"
import { sendEmail, getOrderConfirmationEmail } from "@/lib/mail-service"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Sistema de logging en memoria
let callbackLogs: Array<{
  id: string
  timestamp: string
  level: "info" | "error" | "warning"
  message: string
  data?: any
}> = []

function addLog(level: "info" | "error" | "warning", message: string, data?: any) {
  const log = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  }
  callbackLogs.push(log)
  console.log(`[${level.toUpperCase()}] ${message}`, data || "")

  // Mantener solo los últimos 100 logs
  if (callbackLogs.length > 100) {
    callbackLogs = callbackLogs.slice(-100)
  }
}

// Configuración de Redsys (misma que en prepare)
const REDSYS_CONFIG = {
  SHA256_KEY: process.env.REDSYS_SHA256_KEY!,
}

// Funciones de utilidad (mismas que en prepare)
function decodeBase64(data: string): Buffer {
  return Buffer.from(data, "base64")
}

function encodeBase64(data: Buffer): string {
  return data.toString("base64")
}

function encrypt3DES(key: Buffer, message: string): Buffer {
  addLog("info", "Encrypting with 3DES", { messageLength: message.length, keyLength: key.length })

  const blockSize = 8
  const messageBuffer = Buffer.from(message, "utf8")
  const paddingLength = blockSize - (messageBuffer.length % blockSize)
  const paddedMessage = Buffer.concat([messageBuffer, Buffer.alloc(paddingLength, 0)])

  const iv = Buffer.alloc(8, 0)
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv)
  cipher.setAutoPadding(false)

  let encrypted = cipher.update(paddedMessage)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  addLog("info", "3DES encryption completed", {
    originalLength: messageBuffer.length,
    paddedLength: paddedMessage.length,
    encryptedLength: encrypted.length,
  })

  return encrypted
}

function mac256(data: string, key: Buffer): Buffer {
  addLog("info", "Generating HMAC-SHA256", { dataLength: data.length, keyLength: key.length })

  const hmac = crypto.createHmac("sha256", key)
  hmac.update(data, "utf8")
  const result = hmac.digest()

  addLog("info", "HMAC-SHA256 generated", { resultLength: result.length })
  return result
}

function createMerchantSignature(merchantParameters: string, orderNumber: string, key: string): string {
  addLog("info", "Creating merchant signature", {
    orderNumber,
    parametersLength: merchantParameters.length,
  })

  try {
    const decodedKey = decodeBase64(key)
    const diversifiedKey = encrypt3DES(decodedKey, orderNumber)
    const macResult = mac256(merchantParameters, diversifiedKey)
    const signature = encodeBase64(macResult)

    addLog("info", "Signature created successfully", { signatureLength: signature.length })
    return signature
  } catch (error) {
    addLog("error", "Error creating signature", { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] === REDSYS BIZUM CALLBACK RECEIVED ===")
  addLog("info", "=== REDSYS CALLBACK RECEIVED ===")

  try {
    // Obtener datos del formulario
    const formData = await request.formData()
    const signatureVersion = formData.get("Ds_SignatureVersion") as string
    const merchantParameters = formData.get("Ds_MerchantParameters") as string
    const signature = formData.get("Ds_Signature") as string

    console.log("[v0] Form data received:", {
      signatureVersion,
      merchantParameters: merchantParameters?.substring(0, 50) + "...",
      signature: signature?.substring(0, 20) + "...",
    })

    addLog("info", "Form data received", {
      signatureVersion,
      merchantParametersLength: merchantParameters?.length,
      signatureLength: signature?.length,
    })

    if (!merchantParameters || !signature) {
      console.error("[v0] ERROR: Missing required parameters")
      addLog("error", "Missing required parameters")
      return new Response("OK", { status: 200 })
    }

    // Decodificar parámetros
    let decodedParameters
    try {
      const decodedJson = Buffer.from(merchantParameters, "base64").toString("utf8")
      decodedParameters = JSON.parse(decodedJson)
      console.log("[v0] Parameters decoded successfully:", decodedParameters)
      addLog("info", "Parameters decoded successfully", decodedParameters)
    } catch (error) {
      console.error("[v0] ERROR: Error decoding parameters:", error)
      addLog("error", "Error decoding parameters", { error: error instanceof Error ? error.message : String(error) })
      return new Response("OK", { status: 200 })
    }

    const {
      Ds_Order: redsysOrderNumber,
      Ds_Amount: amount,
      Ds_Response: responseCode,
      Ds_AuthorisationCode: authCode,
      Ds_TransactionType: transactionType,
      Ds_MerchantCode: merchantCode,
    } = decodedParameters

    addLog("info", "Transaction details", {
      redsysOrderNumber,
      amount,
      responseCode,
      authCode,
      transactionType,
      merchantCode,
    })

    // Verificar firma
    try {
      const expectedSignature = createMerchantSignature(merchantParameters, redsysOrderNumber, REDSYS_CONFIG.SHA256_KEY)

      // Normalizar firma recibida: Base64 URL-safe → Base64 estándar
        let normalizedSignature = signature.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")
        while (normalizedSignature.length % 4 !== 0) {
        normalizedSignature += "="
        }

        // Comparar firma esperada con firma normalizada
        if (expectedSignature !== normalizedSignature) {
        addLog("error", "Signature verification failed", {
            received: normalizedSignature,
            expected: expectedSignature,
        })
        return new Response("OK", { status: 200 })
        }

      addLog("info", "Signature verified successfully")
    } catch (error) {
      addLog("error", "Error verifying signature", { error: error instanceof Error ? error.message : String(error) })
      return new Response("OK", { status: 200 })
    }

    // Buscar el pedido real usando el mapeo
    console.log("[v0] Looking up order mapping for Redsys order:", redsysOrderNumber)
    addLog("info", "Looking up order mapping", { redsysOrderNumber })

    const { data: mappingData, error: mappingError } = await supabase
      .from("redsys_order_mapping")
      .select("order_id")
      .eq("redsys_order_number", redsysOrderNumber)
      .single()

    console.log("[v0] Mapping query result:", { mappingData, mappingError: mappingError?.message })

    if (mappingError || !mappingData) {
      console.error("[v0] ERROR: Order mapping not found!", {
        redsysOrderNumber,
        error: mappingError?.message,
        errorDetails: mappingError,
      })
      addLog("error", "Order mapping not found", {
        redsysOrderNumber,
        error: mappingError?.message,
      })
      return new Response("OK", { status: 200 })
    }

    const realOrderId = mappingData.order_id
    console.log("[v0] Order mapping found successfully:", {
      redsysOrderNumber,
      realOrderId,
    })
    addLog("info", "Order mapping found", {
      redsysOrderNumber,
      realOrderId,
    })

    let userEmail: string | null = null
    let orderData: any = null

    // Obtener información completa del pedido y el usuario
    try {
    const { data: orderDetails, error: orderError } = await supabase
        .from("orders")
        .select("*, order_items (*), order_shipping_addresses (*)")
        .eq("id", realOrderId)
        .single()

    if (orderError || !orderDetails) {
        addLog("error", "Failed to fetch order details for email", {
        error: orderError?.message,
        orderId: realOrderId,
        })
    } else {
        orderData = orderDetails

        // Buscar email del usuario
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(orderDetails.user_id)
        if (userError || !userData?.user?.email) {
        addLog("warning", "User email not found", {
            userId: orderDetails.user_id,
            error: userError?.message,
        })
        } else {
        userEmail = userData.user.email
        addLog("info", "User email retrieved", { userEmail })
        }
    }
    } catch (fetchError) {
    addLog("error", "Error retrieving order and user", {
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
    })
    }

    // Determinar el estado del pago
    const isSuccessful = responseCode && Number.parseInt(responseCode) >= 0 && Number.parseInt(responseCode) <= 99
    const newStatus = isSuccessful ? "completed" : "payment_failed"

    console.log("[v0] Payment status determined:", {
      responseCode,
      isSuccessful,
      newStatus,
    })

    addLog("info", "Payment status determined", {
      responseCode,
      isSuccessful,
      newStatus,
    })

    // Actualizar el pedido
    try {
      console.log("[v0] Updating order in database:", {
        orderId: realOrderId,
        newStatus,
        paymentReference: authCode || redsysOrderNumber,
      })

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: newStatus,
          payment_reference: authCode || redsysOrderNumber,
          updated_at: new Date().toISOString(),
        })
        .eq("id", realOrderId)

      if (updateError) {
        console.error("[v0] ERROR: Error updating order:", updateError)
        addLog("error", "Error updating order", {
          orderId: realOrderId,
          error: updateError.message,
        })
      } else {
        console.log("[v0] SUCCESS: Order updated successfully!")
        addLog("info", "Order updated successfully", {
          orderId: realOrderId,
          newStatus,
          paymentReference: authCode || redsysOrderNumber,
        })
      }
    } catch (dbError) {
      console.error("[v0] ERROR: Database error updating order:", dbError)
      addLog("error", "Database error updating order", {
        orderId: realOrderId,
        error: dbError instanceof Error ? dbError.message : String(dbError),
      })
    }

    // Crear historial de estado
    try {
      const { error: historyError } = await supabase.from("order_status_history").insert({
        order_id: realOrderId,
        status: newStatus,
        notes: `Bizum callback - Response: ${responseCode}, Auth: ${authCode || "N/A"}`,
        created_at: new Date().toISOString(),
      })

      if (historyError) {
        addLog("warning", "Error creating status history", {
          orderId: realOrderId,
          error: historyError.message,
        })
      } else {
        addLog("info", "Status history created", { orderId: realOrderId })
      }
    } catch (historyDbError) {
      addLog("warning", "Database error creating history", {
        orderId: realOrderId,
        error: historyDbError instanceof Error ? historyDbError.message : String(historyDbError),
      })
    }

    addLog("info", "=== CALLBACK PROCESSING COMPLETED ===", {
      orderId: realOrderId,
      finalStatus: newStatus,
      success: isSuccessful,
    })

    // Enviar email de confirmación si fue exitoso
    if (isSuccessful && userEmail && orderData) {
    try {
        addLog("info", "Preparing confirmation email", { to: userEmail })

        const emailContent = getOrderConfirmationEmail({
        ...orderData,
        status: "completed",
        order_items: orderData.order_items || [],
        order_shipping_addresses: orderData.order_shipping_addresses || [],
        })

        await sendEmail({
        to: userEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        })

        addLog("info", "Confirmation email sent", { to: userEmail })
    } catch (emailError) {
        addLog("warning", "Error sending confirmation email", {
        error: emailError instanceof Error ? emailError.message : String(emailError),
        })
    }
    }


    // Siempre responder OK para evitar reintentos de Redsys
    return new Response("OK", { status: 200 })
  } catch (error) {
    addLog("error", "Unexpected error in callback", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Incluso en caso de error, responder OK para evitar reintentos
    return new Response("OK", { status: 200 })
  }
}
