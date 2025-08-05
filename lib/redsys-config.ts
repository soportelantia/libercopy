// Este archivo ya no es necesario, la configuración se ha movido al endpoint del servidor
// Mantenemos solo las constantes públicas que pueden ser útiles

export const REDSYS_PUBLIC_CONFIG = {
  CURRENCY_EUR: "978",
  TRANSACTION_TYPE_AUTHORIZATION: "0",
  SIGNATURE_VERSION: "HMAC_SHA256_V1",
}

// Función para generar el número de pedido en formato requerido por Redsys
export function generateRedsysOrderNumber(orderId: string): string {
  const timestamp = Date.now().toString().slice(-4)
  const orderSuffix = orderId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)
  return `${timestamp}${orderSuffix}`.padEnd(12, "0").slice(0, 12)
}
