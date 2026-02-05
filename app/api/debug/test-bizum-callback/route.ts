import { NextResponse } from "next/server"
import crypto from "crypto"

// Configuración de Redsys
const REDSYS_CONFIG = {
  MERCHANT_CODE: process.env.NEXT_PUBLIC_REDSYS_MERCHANT_CODE || "",
  TERMINAL: "001",
  SHA256_KEY: process.env.REDSYS_SHA256_KEY!,
  TEST_MODE: process.env.NEXT_PUBLIC_REDSYS_TEST_MODE === "true",
}

// Datos exactos del callback que falló
const TEST_DATA = {
  Ds_SignatureVersion: "HMAC_SHA256_V1",
  Ds_MerchantParameters:
    "eyJEc19NZXJjaGFudENvZGUiOiIzMjI1MTM1OTkiLCJEc19UZXJtaW5hbCI6IjAwMSIsIkRzX09yZGVyIjoiMzY0MTMxMzcwOTU2IiwiRHNfQW1vdW50IjoiMjU3NiIsIkRzX0N1cnJlbmN5IjoiOTc4IiwiRHNfRGF0ZSI6IjA1XC8wMlwvMjAyNiIsIkRzX0hvdXIiOiIxNDowNCIsIkRzX1NlY3VyZVBheW1lbnQiOiIxIiwiRHNfUmVzcG9uc2UiOiIwMDAwIiwiRHNfTWVyY2hhbnREYXRhIjoiIiwiRHNfVHJhbnNhY3Rpb25UeXBlIjoiMCIsIkRzX0NvbnN1bWVyTGFuZ3VhZ2UiOiIxIiwiRHNfQXV0aG9yaXNhdGlvbkNvZGUiOiI0MjQ3NTAiLCJEc19CaXp1bV9DdWVudGFUcnVuY2FkYSI6IkVTNzZYWFhYWFhYWFhYWFhYWFhYMDUyNiIsIkRzX0JpenVtX01vYmlsZU51bWJlciI6IjYwMDdYWFhYWDMwMyIsIkRzX0JpenVtX0lkT3BlciI6IjE1MzgwOTA3MTQxMzc0ODQ5ODQ0MzIyNTA0ODQ3ODMxMzU5IiwiRHNfUHJvY2Vzc2VkUGF5TWV0aG9kIjoiNjgifQ==",
  Ds_Signature: "FMXoSbscST_I8n9FL9rt5qNctmxdEn8E-yT43Nowm2I=",
}

function decodeBase64(data: string): Buffer {
  return Buffer.from(data, "base64")
}

function encodeBase64(data: Buffer): string {
  return data.toString("base64")
}

function encrypt3DES(key: Buffer, message: string): Buffer {
  const blockSize = 8
  const messageBuffer = Buffer.from(message, "utf8")
  const paddingLength = blockSize - (messageBuffer.length % blockSize)
  const paddedMessage = Buffer.concat([messageBuffer, Buffer.alloc(paddingLength, 0)])

  const iv = Buffer.alloc(8, 0)
  const cipher = crypto.createCipheriv("des-ede3-cbc", key, iv)
  cipher.setAutoPadding(false)

  let encrypted = cipher.update(paddedMessage)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return encrypted
}

function mac256(data: string, key: Buffer): Buffer {
  const hmac = crypto.createHmac("sha256", key)
  hmac.update(data, "utf8")
  return hmac.digest()
}

function createMerchantSignature(merchantParameters: string, orderNumber: string, key: string): string {
  const decodedKey = decodeBase64(key)
  const diversifiedKey = encrypt3DES(decodedKey, orderNumber)
  const macResult = mac256(merchantParameters, diversifiedKey)
  return encodeBase64(macResult)
}

export async function GET() {
  try {
    // Decodificar los parámetros
    const decodedJson = Buffer.from(TEST_DATA.Ds_MerchantParameters, "base64").toString("utf8")
    const decodedParameters = JSON.parse(decodedJson)

    const orderNumber = decodedParameters.Ds_Order
    const responseCode = decodedParameters.Ds_Response
    const authCode = decodedParameters.Ds_AuthorisationCode

    // Calcular la firma esperada
    const expectedSignature = createMerchantSignature(TEST_DATA.Ds_MerchantParameters, orderNumber, REDSYS_CONFIG.SHA256_KEY)

    // Normalizar la firma recibida
    let normalizedSignature = TEST_DATA.Ds_Signature.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")
    while (normalizedSignature.length % 4 !== 0) {
      normalizedSignature += "="
    }

    // Verificar si las firmas coinciden
    const signaturesMatch = expectedSignature === normalizedSignature

    return NextResponse.json({
      success: true,
      test: "Bizum Callback Signature Test",
      config: {
        merchantCode: REDSYS_CONFIG.MERCHANT_CODE,
        terminal: REDSYS_CONFIG.TERMINAL,
        environment: REDSYS_CONFIG.TEST_MODE ? "test" : "production",
        sha256KeyConfigured: !!REDSYS_CONFIG.SHA256_KEY,
        sha256KeyLength: REDSYS_CONFIG.SHA256_KEY?.length || 0,
      },
      decodedParameters,
      signatures: {
        received: TEST_DATA.Ds_Signature,
        normalized: normalizedSignature,
        expected: expectedSignature,
        matches: signaturesMatch,
      },
      orderNumber,
      responseCode,
      authCode,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
