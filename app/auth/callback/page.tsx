"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { session, isLoading } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
    if (!isLoading && session) {
      // Si hay elementos en el carrito, redirigir al carrito
      if (cart && cart.length > 0) {
        router.push("/cart")
        return
      }

      // Verificar si hay una URL de redirección guardada
      if (typeof window !== "undefined") {
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin")
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin")
          router.push(redirectUrl)
          return
        }
      }

      // Si no hay URL de redirección, usar la lógica predeterminada
      router.push("/")
    }
  }, [isLoading, session, router, cart])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Procesando autenticación...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b2131] mx-auto"></div>
      </div>
    </div>
  )
}
