"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, ArrowLeft, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Footer from "@/components/footer"
export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)

  // Cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [cooldownTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cooldownTime > 0) {
      return
    }

    setError(null)
    setIsLoading(true)

    const { error } = await resetPassword(email)

    if (error) {
      if (error.type === "rate_limit") {
        setError(error.message)
        setCooldownTime(60) // 60 segundos de cooldown
      } else {
        setError(error.message || "Error al enviar el correo de recuperación")
      }
      setIsLoading(false)
    } else {
      setIsSubmitted(true)
      setCooldownTime(60) // Prevenir múltiples envíos
      toast({
        title: "Correo enviado",
        description: "Hemos enviado un correo con instrucciones para restablecer tu contraseña.",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12" style={{marginTop: '50px'}}>
        <div className="max-w-md mx-auto">
          <Link href="/auth" className="flex items-center text-[#2563eb] hover:text-[#f47d30] mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a inicio de sesión
          </Link>

          <h1 className="text-2xl font-bold text-[#2563eb] mb-8 text-center">Recuperar contraseña</h1>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {cooldownTime > 0 && (
              <Alert className="mb-4 border-orange-200 bg-orange-50">
                <Clock className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800">Espera un momento</AlertTitle>
                <AlertDescription className="text-orange-700">
                  Puedes solicitar otro correo en {formatTime(cooldownTime)}
                </AlertDescription>
              </Alert>
            )}

            {isSubmitted ? (
              <div className="text-center py-4">
                <h2 className="text-xl font-semibold text-[#2563eb] mb-2">Correo enviado</h2>
                <p className="text-gray-600 mb-4">
                  Hemos enviado un correo electrónico a <span className="font-medium">{email}</span> con instrucciones
                  para restablecer tu contraseña.
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                </p>
                {cooldownTime === 0 && (
                  <Button
                    onClick={() => {
                      setIsSubmitted(false)
                      setError(null)
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Enviar otro correo
                  </Button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <Button type="submit" className="w-full" disabled={isLoading || cooldownTime > 0}>
                  {isLoading
                    ? "Enviando..."
                    : cooldownTime > 0
                      ? `Espera ${formatTime(cooldownTime)}`
                      : "Enviar correo de recuperación"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <Toaster />
    </main>
  )
}
