/**
 * lib/discount-codes.ts
 *
 * Helpers para generar y gestionar códigos de descuento únicos
 * en la tabla `discount_codes` de Supabase.
 */

import { supabaseAdmin } from "@/lib/supabase/admin"

export interface DiscountCodeOptions {
  percentage: number
  /** Días de validez desde ahora */
  validDays: number
  maxUses?: number
  prefix?: string
}

export interface CreatedDiscountCode {
  code: string
  percentage: number
  start_date: string
  end_date: string
}

/**
 * Genera un código legible con el prefijo indicado.
 * Ejemplo: "LIBER-A3F7K2"
 */
function generateCode(prefix = "LIBER"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let suffix = ""
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}-${suffix}`
}

/**
 * Crea un código de descuento único en la tabla `discount_codes` e
 * inmediatamente guarda el código en `orders.abandoned_discount_code`.
 *
 * Si el pedido ya tiene un código de recuperación válido para el paso
 * actual se devuelve sin crear uno nuevo (reutilización segura).
 *
 * @param orderId   UUID del pedido
 * @param step      Paso del flujo (2 o 3) — solo informativo para el log
 * @param options   Configuración del código (porcentaje, validez…)
 * @param maxRetries Intentos máximos si el código ya existe (colisión)
 */
export async function createAbandonedCartDiscountCode(
  orderId: string,
  step: 2 | 3,
  options: DiscountCodeOptions,
  maxRetries = 5
): Promise<CreatedDiscountCode | null> {
  const { percentage, validDays, maxUses = 1, prefix = "LIBER" } = options
  const now = new Date()
  const endDate = new Date(now.getTime() + validDays * 24 * 60 * 60 * 1000)

  // Comprobar si el pedido ya tiene un código de recuperación vigente
  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from("orders")
    .select("abandoned_discount_code, abandoned_email_step")
    .eq("id", orderId)
    .single()

  if (orderFetchError) {
    console.error(`[discount-codes] Error leyendo pedido ${orderId}:`, orderFetchError.message)
    return null
  }

  if (order?.abandoned_discount_code) {
    // Verificar si ese código sigue activo
    const { data: existingCode } = await supabaseAdmin
      .from("discount_codes")
      .select("code, percentage, start_date, end_date, is_active")
      .eq("code", order.abandoned_discount_code)
      .single()

    if (
      existingCode &&
      existingCode.is_active &&
      new Date(existingCode.end_date) > now
    ) {
      console.log(
        `[discount-codes] Reutilizando código existente "${existingCode.code}" para pedido ${orderId} (paso ${step})`
      )
      return {
        code: existingCode.code,
        percentage: Number(existingCode.percentage),
        start_date: existingCode.start_date,
        end_date: existingCode.end_date,
      }
    }
    // El código expiró o está inactivo — crear uno nuevo
    console.log(
      `[discount-codes] Código anterior expirado o inactivo para pedido ${orderId}, generando nuevo`
    )
  }

  // Intentar insertar un código único
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const code = generateCode(prefix)
    const start_date = now.toISOString()
    const end_date = endDate.toISOString()

    const { error: insertError } = await supabaseAdmin
      .from("discount_codes")
      .insert({
        code,
        percentage,
        start_date,
        end_date,
        max_uses: maxUses,
        current_uses: 0,
        is_active: true,
      })

    if (insertError) {
      // Código duplicado → reintentar
      if (insertError.code === "23505") {
        console.warn(
          `[discount-codes] Colisión en intento ${attempt} para código "${code}", reintentando…`
        )
        continue
      }
      console.error(`[discount-codes] Error insertando código "${code}":`, insertError.message)
      return null
    }

    // Guardar el código en el pedido
    const { error: orderUpdateError } = await supabaseAdmin
      .from("orders")
      .update({ abandoned_discount_code: code })
      .eq("id", orderId)

    if (orderUpdateError) {
      console.error(
        `[discount-codes] Error guardando código en pedido ${orderId}:`,
        orderUpdateError.message
      )
      // El código se creó en discount_codes; lo devolvemos igualmente
    } else {
      console.log(
        `[discount-codes] Código "${code}" (${percentage}%) creado y guardado en pedido ${orderId} (paso ${step})`
      )
    }

    return { code, percentage, start_date, end_date }
  }

  console.error(
    `[discount-codes] No se pudo generar un código único tras ${maxRetries} intentos para pedido ${orderId}`
  )
  return null
}

/**
 * Opciones predeterminadas por paso del flujo de abandono.
 *
 * Paso 2 → 5 % de descuento, válido 3 días
 * Paso 3 → 7 % de descuento, válido 2 días
 */
export const ABANDONED_DISCOUNT_OPTIONS: Record<2 | 3, DiscountCodeOptions> = {
  2: { percentage: 5, validDays: 3, prefix: "LIBER" },
  3: { percentage: 7, validDays: 2, prefix: "LIBER" },
}
