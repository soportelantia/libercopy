"use client"

import Navbar from "@/components/navbar"
import AuthDebugger from "@/components/auth-debugger"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function AuthDebugPage() {
  const { signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
    setIsSigningOut(false)
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-[#8b2131] mb-8 text-center">Depuración de Autenticación</h1>

        <AuthDebugger />

        <div className="flex justify-center mt-8">
          <Button variant="destructive" onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </div>
      </div>
    </main>
  )
}
