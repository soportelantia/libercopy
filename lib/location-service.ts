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

// Función para calcular los gastos de envío según la provincia
export const calcularGastosEnvioPorProvincia = (provinciaId: string): number => {
  // Si es una provincia con tarifa especial (Canarias, Ceuta, Melilla)
  if (PROVINCIAS_TARIFA_ESPECIAL.includes(provinciaId)) {
    return 19.99
  }
  // Resto de provincias
  return 3.99
}

// Función para calcular los gastos de envío (versión antigua - mantener por compatibilidad)
export const calcularGastosEnvio = (subtotal: number, provinciaId?: string): number => {
  // Si se proporciona la provincia, usar el cálculo por provincia
  if (provinciaId) {
    return calcularGastosEnvioPorProvincia(provinciaId)
  }
  // Fallback: usar el cálculo antiguo
  return subtotal < 25 ? 2.99 : 0
}
