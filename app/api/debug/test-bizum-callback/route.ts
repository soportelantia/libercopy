import { NextResponse } from "next/server"
import crypto from "crypto"

// Configuración de Redsys
const REDSYS_CONFIG = {
  MERCHANT_CODE: process.env.REDSYS_MERCHANT_CODE || "",
  TERMINAL: process.env.REDSYS_TERMINAL || "001",
  SHA256_KEY: process.env.REDSYS_SHA256_KEY || "",
  ENVIRONMENT: process.env.REDSYS_ENVIRONMENT || "test",
}

function createMerchantSignature(merchantParameters: string, orderNumber: string, secretKey: string): string {
  try {
    // 1. Decodificar la clave secreta de Base64
    const key = Buffer.from(secretKey, "base64")

    // 2. Crear 3DES key usando el número de orden
    const iv = Buffer.alloc(8, 0) // IV de ceros
    const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv)
    cipher.setAutoPadding(false)

    // Preparar el número de orden (debe ser de longitud múltiplo de 8)
    let orderBytes = Buffer.from(orderNumber, "utf8")
    const paddingLength = 8 - (orderBytes.length % 8)
    if (paddingLength < 8) {
      orderBytes = Buffer.concat([orderBytes, Buffer.alloc(paddingLength, 0)])
    }

    // Cifrar el número de orden para obtener la clave derivada
    const derivedKey = Buffer.concat([cipher.update(orderBytes), cipher.final()])

    // 3. Calcular HMAC-SHA256 de los parámetros del comerciante con la clave derivada
    const hmac = crypto.createHmac("sha256", derivedKey)
    hmac.update(merchantParameters)
    const signature = hmac.digest("base64")

    return signature
  } catch (error) {
    console.error("Error creating merchant signature:", error)
    throw error
  }
}

export async function GET() {
  try {
    // Datos exactos del callback que fallaron
    const merchantParameters = "eyJEc19NZXJjaGFudENvZGUiOiIzMjI1MTM1OTkiLCJEc19UZXJtaW5hbCI6IjAwMSIsIkRzX09yZGVyIjoiMzY0MTMxMzcwOTU2IiwiRHNfQW1vdW50IjoiMjU3NiIsIkRzX0N1cnJlbmN5IjoiOTc4IiwiRHNfRGF0ZSI6IjA1XC8wMlwvMjAyNiIsIkRzX0hvdXIiOiIxNDowNCIsIkRzX1NlY3VyZVBheW1lbnQiOiIxIiwiRHNfUmVzcG9uc2UiOiIwMDAwIiwiRHNfTWVyY2hhbnREYXRhIjoiIiwiRHNfVHJhbnNhY3Rpb25UeXBlIjoiMCIsIkRzX0NvbnN1bWVyTGFuZ3VhZ2UiOiIxIiwiRHNfQXV0aG9yaXNhdGlvbkNvZGUiOiI0MjQ3NTAiLCJEc19CaXp1bV9DdWVudGFUcnVuY2FkYSI6IkVTNzZYWFhYWFhYWFhYWFhYWFhYMDUyNiIsIkRzX0JpenVtX01vYmlsZU51bWJlciI6IjYwMDdYWFhYWDMwMyIsIkRzX0JpenVtX0lkT3BlciI6IjE1MzgwOTA3MTQxMzc0ODQ5ODQ0MzIyNTA0ODQ3ODMxMzU5IiwiRHNfUHJvY2Vzc2VkUGF5TWV0aG9kIjoiNjgifQ=="
    const receivedSignature = "FMXoSbscST_I8n9FL9rt5qNctmxdEn8E-yT43Nowm2I="

    // Decodificar parámetros
    const decodedJson = Buffer.from(merchantParameters, "base64").toString("utf8")
    const decodedParameters = JSON.parse(decodedJson)

    console.log("Decoded parameters:", decodedParameters)

    const redsysOrderNumber = decodedParameters.Ds_Order

    // Calcular firma esperada
    const expectedSignature = createMerchantSignature(merchantParameters, redsysOrderNumber, REDSYS_CONFIG.SHA256_KEY)

    // Normalizar firma recibida
    let normalizedSignature = receivedSignature.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")
    while (normalizedSignature.length % 4 !== 0) {
      normalizedSignature += "="
    }

    const signatureMatches = expectedSignature === normalizedSignature

    return NextResponse.json({
      success: true,
      test: "Bizum Callback Signature Test",
      config: {
        merchantCode: REDSYS_CONFIG.MERCHANT_CODE,
        terminal: REDSYS_CONFIG.TERMINAL,
        environment: REDSYS_CONFIG.ENVIRONMENT,
        sha256KeyConfigured: !!REDSYS_CONFIG.SHA256_KEY,
        sha256KeyLength: REDSYS_CONFIG.SHA256_KEY?.length,
      },
      decodedParameters,
      signatures: {
        received: receivedSignature,
        normalized: normalizedSignature,
        expected: expectedSignature,
        matches: signatureMatches,
      },
      orderNumber: redsysOrderNumber,
      responseCode: decodedParameters.Ds_Response,
      authCode: decodedParameters.Ds_AuthorisationCode,
    })
  } catch (error) {
    console.error("Test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
