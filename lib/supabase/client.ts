import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Función para obtener la URL base correcta
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    redirectTo: `${getBaseUrl()}/auth/callback`
  },
})

// Mantener compatibilidad con el código existente
export const getSupabaseClient = () => supabase
