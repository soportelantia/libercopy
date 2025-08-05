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

// Función para calcular los gastos de envío (mantenemos esta función del archivo original)
export const calcularGastosEnvio = (subtotal: number): number => {
  return subtotal < 25 ? 2.99 : 0
}
