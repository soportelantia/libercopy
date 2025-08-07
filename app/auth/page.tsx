"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/hooks/use-cart"
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AuthPage() {
  const { signIn, signUp, user, isLoading: authLoading } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Estados para registro
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      // Verificar si items existe y tiene length antes de acceder
      const hasCartItems = items && Array.isArray(items) && items.length > 0
      
      if (hasCartItems) {
        router.push("/cart")
      } else {
        router.push(redirect || "/")
      }
    }
  }, [user, authLoading, router, redirect, items])

  const translateError = (error: string): string => {
    const errorTranslations: Record<string, string> = {
      "Invalid login credentials": "Credenciales de acceso incorrectas",
      "Email not confirmed": "Email no confirmado. Revisa tu bandeja de entrada",
      "User already registered": "El usuario ya está registrado",
      "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
      "Invalid email": "Email inválido",
      "Email already registered": "Este email ya está registrado",
      "Passwords do not match": "Las contraseñas no coinciden",
      "All fields are required": "Todos los campos son obligatorios",
      "Network error": "Error de conexión. Inténtalo de nuevo",
      "Server error": "Error del servidor. Inténtalo más tarde"
    }

    return errorTranslations[error] || error
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Intentando login con:", loginEmail)

      if (!loginEmail || !loginPassword) {
        throw new Error("Todos los campos son obligatorios")
      }

      const result = await signIn(loginEmail, loginPassword)
      console.log("Resultado del login:", result)

      if (result?.error) {
        console.error("Error en login:", result.error)
        throw new Error(result.error.message || "Error en el login")
      }

      if (result?.user) {
        console.log("Login exitoso, redirigiendo...")
        // La redirección se maneja en el useEffect
      } else {
        throw new Error("No se pudo completar el login")
      }
    } catch (error: any) {
      console.error("Error capturado en handleLogin:", error)
      const errorMessage = error?.message || "Error desconocido en el login"
      setError(translateError(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Intentando registro con:", registerEmail)

      if (!registerEmail || !registerPassword || !confirmPassword || !firstName || !lastName) {
        throw new Error("Todos los campos son obligatorios")
      }

      if (registerPassword !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (registerPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      const result = await signUp(registerEmail, registerPassword, firstName, lastName)
      console.log("Resultado del registro:", result)

      if (result?.error) {
        console.error("Error en registro:", result.error)
        throw new Error(result.error.message || "Error en el registro")
      }

      if (result?.user) {
        console.log("Registro exitoso, redirigiendo...")
        // La redirección se maneja en el useEffect
      } else {
        throw new Error("No se pudo completar el registro")
      }
    } catch (error: any) {
      console.error("Error capturado en handleRegister:", error)
      const errorMessage = error?.message || "Error desconocido en el registro"
      setError(translateError(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center" style={{ marginTop: "80px" }}>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Cargando...</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12" style={{ marginTop: "80px" }}>
        <div className="w-full max-w-md">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bienvenido
              </CardTitle>
              <CardDescription>Inicia sesión o crea una cuenta nueva</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="register">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        href="/reset-password"
                        className="text-sm text-blue-600 hover:text-purple-600 underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Nombre</Label>
                        <Input
                          id="first-name"
                          type="text"
                          placeholder="Tu nombre"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Apellidos</Label>
                        <Input
                          id="last-name"
                          type="text"
                          placeholder="Tus apellidos"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Repite tu contraseña"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        "Crear Cuenta"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Al registrarte, aceptas nuestros{" "}
                      <Link href="/condiciones-compra" className="text-blue-600 hover:text-purple-600 underline">
                        términos y condiciones
                      </Link>{" "}
                      y{" "}
                      <Link href="/politica-privacidad" className="text-blue-600 hover:text-purple-600 underline">
                        política de privacidad
                      </Link>
                      .
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
