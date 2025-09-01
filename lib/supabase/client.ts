import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  },
})

// Mantener compatibilidad con el código existente
export const getSupabaseClient = () => supabase
