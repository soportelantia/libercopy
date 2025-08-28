import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
  throw new Error("Supabase URL is required. Please check your environment variables.")
}

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
  throw new Error("Supabase anonymous key is required. Please check your environment variables.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    redirectTo: siteUrl
      ? `${siteUrl}/auth/callback`
      : `${window?.location?.origin || "http://localhost:3000"}/auth/callback`,
  },
})

// Mantener compatibilidad con el código existente
export const getSupabaseClient = () => supabase
