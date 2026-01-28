import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { supabaseAdmin } from "@/lib/supabase/admin"

// Configuración de Redsys
const REDSYS_CONFIG = {
  MERCHANT_CODE: process.env.NEXT_PUBLIC_REDSYS_MERCHANT_CODE!,
  SHA256_KEY: process.env.REDSYS_SHA256_KEY!,
  TERMINAL: process.env.NEXT_PUBLIC_REDSYS_TERMINAL || "1",
  CURRENCY: "978", // EUR
  TRANSACTION_TYPE: "0", // Autorización
  SIGNATURE_VERSION: "HMAC_SHA256_V1",
  TEST_MODE: process.env.REDSYS_TEST_MODE === "true",
}

// URLs de Redsys
const REDSYS_URLS = {
  TEST: "https://sis-t.redsys.es:25443/sis/realizarPago",
  PRODUCTION: "https://sis.redsys.es/sis/realizarPago",
}

// Funciones de utilidad basadas en el código PHP que funciona
function decodeBase64(data: string): Buffer {
  return Buffer.from(data, "base64")
}

function encodeBase64(data: Buffer): string {
  return data.toString("base64")
}

function encrypt3DES(message: string, key: Buffer): Buffer {
  console.log("=== ENCRYPT 3DES ===")
  console.log("Message:", message)
  console.log("Key length:", key.length)
  console.log("Key hex:", key.toString("hex"))

  // Padding manual a múltiplos de 8 bytes como en PHP
  const blockSize = 8
  const messageBuffer = Buffer.from(message, "utf8")
  const paddingLength = blockSize - (messageBuffer.length % blockSize)
  const paddedMessage = Buffer.concat([messageBuffer, Buffer.alloc(paddingLength, 0)])

  console.log("Original message length:", messageBuffer.length)
  console.log("Padded message length:", paddedMessage.length)
  console.log("Padded message hex:", paddedMessage.toString("hex"))

  // Crear cipher con IV de ceros como en PHP
  const iv = Buffer.alloc(8, 0) // IV de 8 bytes con ceros
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv)
  cipher.setAutoPadding(false) // Desactivar padding automático

  let encrypted = cipher.update(paddedMessage)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  console.log("Encrypted length:", encrypted.length)
  console.log("Encrypted hex:", encrypted.toString("hex"))

  return encrypted
}

function mac256(data: string, key: Buffer): Buffer {
  console.log("=== MAC256 ===")
  console.log("Data:", data)
  console.log("Key length:", key.length)
  console.log("Key hex:", key.toString("hex"))

  const hmac = crypto.createHmac("sha256", key)
  hmac.update(data, "utf8")
  const result = hmac.digest()

  console.log("HMAC result length:", result.length)
  console.log("HMAC result hex:", result.toString("hex"))

  return result
}

function createMerchantSignature(merchantParameters: string, orderNumber: string, key: string): string {
  console.log("=== CREATE MERCHANT SIGNATURE ===")
  console.log("Merchant Parameters:", merchantParameters)
  console.log("Order Number:", orderNumber)
  console.log("Key (first 20 chars):", key.substring(0, 20) + "...")

  try {
    // 1. Decodificar la clave Base64
    const decodedKey = decodeBase64(key)
    console.log("Decoded key length:", decodedKey.length)
    console.log("Decoded key hex:", decodedKey.toString("hex"))

    // 2. Diversificar la clave con el número de pedido usando 3DES
    const diversifiedKey = encrypt3DES(orderNumber, decodedKey)
    console.log("Diversified key length:", diversifiedKey.length)
    console.log("Diversified key hex:", diversifiedKey.toString("hex"))

    // 3. Generar MAC256 de los parámetros con la clave diversificada
    const macResult = mac256(merchantParameters, diversifiedKey)
    console.log("MAC result length:", macResult.length)
    console.log("MAC result hex:", macResult.toString("hex"))

    // 4. Codificar el resultado en Base64
    const signature = encodeBase64(macResult)
    console.log("Final signature:", signature)

    return signature
  } catch (error) {
    console.error("Error in createMerchantSignature:", error)
    throw new Error(`Failed to generate signature: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function generateRedsysOrderNumber(orderId: string): string {
  // 1. Últimos 6 dígitos del timestamp (solo números)
  const timestampPart = Date.now().toString().slice(-6)

  // 2. Limpiar orderId: solo dígitos numéricos
  const orderIdNumbers = orderId.replace(/[^0-9]/g, "")

  // 3. Concatenar partes
  let rawNumber = timestampPart + orderIdNumbers

  // 4. Asegurar que comience con '3'
  if (!rawNumber.startsWith("3")) {
    rawNumber = "3" + rawNumber
  }

  // 5. Ajustar a longitud exacta de 12 dígitos
  if (rawNumber.length < 12) {
    rawNumber = rawNumber.padEnd(12, "0") // Rellenar con ceros a la derecha
  } else {
    rawNumber = rawNumber.slice(0, 12) // Recortar a 12 dígitos
  }

  console.log("Generated order number:", rawNumber)
  return rawNumber
}

export async function POST(request: NextRequest) {
  console.log("=== REDSYS PREPARE PAYMENT ENDPOINT ===")

  try {
    // Validar variables de entorno
    const missingEnvVars = []
    if (!REDSYS_CONFIG.MERCHANT_CODE) missingEnvVars.push("NEXT_PUBLIC_REDSYS_MERCHANT_CODE")
    if (!REDSYS_CONFIG.SHA256_KEY) missingEnvVars.push("REDSYS_SHA256_KEY")

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars)
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error",
          details: `Missing environment variables: ${missingEnvVars.join(", ")}`,
        },
        { status: 500 },
      )
    }

    console.log("Environment variables validated:")
    console.log("- MERCHANT_CODE:", REDSYS_CONFIG.MERCHANT_CODE)
    console.log("- TERMINAL:", REDSYS_CONFIG.TERMINAL)
    console.log("- TEST_MODE:", REDSYS_CONFIG.TEST_MODE)
    console.log("- SHA256_KEY length:", REDSYS_CONFIG.SHA256_KEY.length)

    // Parsear el cuerpo de la petición
    const body = await request.json()
    const { orderId, amount } = body

    console.log("Request body:", { orderId, amount })

    // Validar parámetros
    if (!orderId || !amount) {
      console.error("Missing required parameters:", { orderId: !!orderId, amount: !!amount })
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
          details: "orderId and amount are required",
        },
        { status: 400 },
      )
    }

    if (typeof amount !== "number" || amount <= 0) {
      console.error("Invalid amount:", amount)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
          details: "Amount must be a positive number",
        },
        { status: 400 },
      )
    }

    // Generar número de pedido para Redsys
    const redsysOrderNumber = generateRedsysOrderNumber(orderId)
    const amountInCents = Math.round(amount * 100)

    console.log("=== PAYMENT DETAILS ===")
    console.log("Original Order ID:", orderId)
    console.log("Redsys Order Number:", redsysOrderNumber)
    console.log("Amount in euros:", amount)
    console.log("Amount in cents:", amountInCents)

    // Guardar el mapeo en la base de datos
    try {
      const { error: mappingError } = await supabaseAdmin.from("redsys_order_mapping").insert({
        redsys_order_number: redsysOrderNumber,
        order_id: orderId,
      })

      if (mappingError) {
        console.error("Error saving order mapping:", mappingError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create order mapping",
            details: mappingError.message,
          },
          { status: 500 },
        )
      }

      console.log("Order mapping saved successfully")
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          details: "Failed to save order mapping",
        },
        { status: 500 },
      )
    }

    // URLs de callback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://v0-libery-copy.vercel.app"
    const merchantURL = `${baseUrl}/api/payment/bizum/callback`
    const urlOK = `${baseUrl}/payment/success`
    const urlKO = `${baseUrl}/payment/error`

    console.log("=== CALLBACK URLS ===")
    console.log("Merchant URL (callback):", merchantURL)
    console.log("URL OK:", urlOK)
    console.log("URL KO:", urlKO)

    // Crear parámetros del comercio
    const merchantParameters = {
      DS_MERCHANT_AMOUNT: amountInCents.toString(),
      DS_MERCHANT_ORDER: redsysOrderNumber,
      DS_MERCHANT_MERCHANTCODE: REDSYS_CONFIG.MERCHANT_CODE,
      DS_MERCHANT_CURRENCY: REDSYS_CONFIG.CURRENCY,
      DS_MERCHANT_TRANSACTIONTYPE: REDSYS_CONFIG.TRANSACTION_TYPE,
      DS_MERCHANT_TERMINAL: REDSYS_CONFIG.TERMINAL,
      DS_MERCHANT_MERCHANTURL: merchantURL,
      DS_MERCHANT_URLOK: urlOK,
      DS_MERCHANT_URLKO: urlKO,
      DS_MERCHANT_PRODUCTDESCRIPTION: "Pedido LiberCopy #" + orderId.substring(0, 8),
      DS_MERCHANT_PAYMETHODS: "z"
    }

    console.log("=== MERCHANT PARAMETERS ===")
    console.log("Parameters object:", merchantParameters)

    // Codificar parámetros en Base64
    const merchantParametersJson = JSON.stringify(merchantParameters)
    const merchantParametersBase64 = Buffer.from(merchantParametersJson, "utf8").toString("base64")

    console.log("=== ENCODED PARAMETERS ===")
    console.log("JSON length:", merchantParametersJson.length)
    console.log("JSON:", merchantParametersJson)
    console.log("Base64 length:", merchantParametersBase64.length)
    console.log("Base64 (first 100 chars):", merchantParametersBase64.substring(0, 100) + "...")

    // Generar firma
    console.log("=== GENERATING SIGNATURE ===")
    const signature = createMerchantSignature(merchantParametersBase64, redsysOrderNumber, REDSYS_CONFIG.SHA256_KEY)

    // URL del gateway
    const gatewayURL = REDSYS_CONFIG.TEST_MODE ? REDSYS_URLS.TEST : REDSYS_URLS.PRODUCTION

    console.log("=== FINAL FORM DATA ===")
    console.log("Gateway URL:", gatewayURL)
    console.log("Signature Version:", REDSYS_CONFIG.SIGNATURE_VERSION)
    console.log("Signature:", signature)

    // Preparar respuesta
    const response = {
      success: true,
      formData: {
        Ds_SignatureVersion: REDSYS_CONFIG.SIGNATURE_VERSION,
        Ds_MerchantParameters: merchantParametersBase64,
        Ds_Signature: signature,
      },
      formUrl: gatewayURL,
      debug: {
        orderId,
        redsysOrderNumber,
        amount,
        amountInCents,
        merchantCode: REDSYS_CONFIG.MERCHANT_CODE,
        terminal: REDSYS_CONFIG.TERMINAL,
        isTestMode: REDSYS_CONFIG.TEST_MODE,
        gatewayURL,
        merchantURL,
        urlOK,
        urlKO,
        parametersJson: merchantParametersJson,
        parametersBase64Length: merchantParametersBase64.length,
        signatureLength: signature.length,
      },
    }

    console.log("=== RESPONSE PREPARED ===")
    console.log("Success:", response.success)
    console.log("Form URL:", response.formUrl)
    console.log("Debug info available:", !!response.debug)

    return NextResponse.json(response)
  } catch (error) {
    console.error("=== ERROR IN REDSYS PREPARE ===")
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
