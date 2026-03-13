import { getSupabaseClient } from "@/lib/supabase/client"

export type Province = {
  id: string
  name: string
}

export type Municipality = {
  id: string
  province_id: string
  name: string
}

// Obtener todas las provincias
export async function getProvinces(): Promise<Province[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("provinces").select("*").order("name")

  if (error) {
    console.error("Error al obtener provincias:", error)
    return []
  }

  return data || []
}

// Obtener municipios por provincia
export async function getMunicipalitiesByProvince(provinceId: string): Promise<Municipality[]> {
  if (!provinceId) return []

  const supabase = getSupabaseClient()

  console.log(`Obteniendo municipios para la provincia: ${provinceId}`)

  const { data, error } = await supabase.from("municipalities").select("*").eq("province_id", provinceId).order("name")

  if (error) {
    console.error(`Error al obtener municipios para la provincia ${provinceId}:`, error)
    return []
  }

  console.log(`Municipios obtenidos para la provincia ${provinceId}:`, data?.length || 0)
  return data || []
}

// Provincias con tarifas de envío especiales (Canarias, Ceuta y Melilla)
const PROVINCIAS_TARIFA_ESPECIAL = ["35", "38", "51", "52"] // Las Palmas, Santa Cruz de Tenerife, Ceuta, Melilla

export const SHIPPING_FREE_THRESHOLD = 25 // €
export const SHIPPING_PENINSULA_COST = 3.99 // €
export const SHIPPING_ESPECIAL_COST = 19.99 // €

// Función para calcular los gastos de envío según la provincia y el subtotal del pedido (IVA incluido)
export const calcularGastosEnvioPorProvincia = (provinciaId: string, subtotal: number = 0): number => {
  // Canarias, Ceuta y Melilla: tarifa fija sin envío gratis
  if (PROVINCIAS_TARIFA_ESPECIAL.includes(provinciaId)) {
    return SHIPPING_ESPECIAL_COST
  }
  // Península y Baleares: gratis a partir de 25 €
  return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_PENINSULA_COST
}

// Función para calcular los gastos de envío (versión antigua - mantener por compatibilidad)
export const calcularGastosEnvio = (subtotal: number, provinciaId?: string): number => {
  if (provinciaId) {
    return calcularGastosEnvioPorProvincia(provinciaId, subtotal)
  }
  return subtotal < SHIPPING_FREE_THRESHOLD ? SHIPPING_PENINSULA_COST : 0
}
