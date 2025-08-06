"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<any>
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth state changed:", event, session?.user?.email)

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Manejar eventos específicos
      if (event === "SIGNED_IN") {
        console.log("✅ Usuario autenticado:", session?.user?.email)
      } else if (event === "SIGNED_OUT") {
        console.log("👋 Usuario desconectado")
        router.push("/")
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("🔐 Recuperación de contraseña iniciada")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

 

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setLoading(true)

      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        return {
          success: false,
          error: result.error || "Error al crear la cuenta",
        }
      }

      return { success: true }
    } catch (err) {
      console.error("❌ Error inesperado en signUp:", err)
      return { success: false, error: "Error inesperado" }
    } finally {
      setLoading(false)
    }
  }


  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("❌ Error en login:", error)
        return { success: false, error: error.message }
      }

      console.log("✅ Usuario autenticado:", data.user?.email)
      return { success: true }
    } catch (error) {
      console.error("❌ Error inesperado en login:", error)
      return { success: false, error: "Error inesperado" }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        }
      })

      if (error) {
        console.error("❌ Error al iniciar sesión con Google:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("❌ Error inesperado con Google Sign-In:", error)
      throw error
    }
  }


  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("❌ Error en logout:", error)
      } else {
        console.log("✅ Logout exitoso")
      }
    } catch (error) {
      console.error("❌ Error inesperado en logout:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)

      // Usar nuestro endpoint personalizado
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("❌ Error en reset password:", result.error)
        return { success: false, error: result.error }
      }

      console.log("✅ Reset password enviado:", result.message)
      return { success: true }
    } catch (error) {
      console.error("❌ Error inesperado en reset password:", error)
      return { success: false, error: "Error inesperado" }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (password: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        console.error("❌ Error actualizando contraseña:", error)
        return { success: false, error: error.message }
      }

      console.log("✅ Contraseña actualizada correctamente")
      return { success: true }
    } catch (error) {
      console.error("❌ Error inesperado actualizando contraseña:", error)
      return { success: false, error: "Error inesperado" }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    signInWithGoogle
    
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
