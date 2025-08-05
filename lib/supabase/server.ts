import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export const getSupabaseServer = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Faltan las variables de entorno de Supabase")
  }

  const cookieStore = cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Agregar este export adicional para compatibilidad
export const getSupabaseClient = getSupabaseServer

// Exportar createClient para compatibilidad
export { createClient } from "@supabase/supabase-js"
