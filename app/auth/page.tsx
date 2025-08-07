"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, CheckCircle, X, ArrowLeft, User } from 'lucide-react'
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register form
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerFirstName, setRegisterFirstName] = useState("")
  const [registerLastName, setRegisterLastName] = useState("")
  const [hasVerified, setHasVerified] = useState(false)

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/auth"
  
  
  useEffect(() => {
    const verified = searchParams.get("verified") === "1"
    
    if (user && !verified) {
      router.push(redirectTo)
    }

    if (verified) {
      setActiveTab("login")
      //setSuccess("Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.")
      setHasVerified(true) // ← guardar en estado
    }
  }, [user, router, redirectTo, searchParams])

  useEffect(() => {
    setPasswordValidation({
      length: registerPassword.length >= 8,
      uppercase: /[A-Z]/.test(registerPassword),
      lowercase: /[a-z]/.test(registerPassword),
      number: /\d/.test(registerPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(registerPassword),
    })
  }, [registerPassword])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn(loginEmail, loginPassword)
      if (result && !result.success) {
        setError(result.error || "Credenciales incorrectas")
        return
      }
      router.push(redirectTo)
    } catch (error: any) {
      console.error("Error en login:", error)
      let errorMessage = "Error al iniciar sesión"
      
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Debes confirmar tu email antes de iniciar sesión."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Espera unos minutos antes de intentar de nuevo."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfEmailExists = async (email: string): Promise<boolean> => {
    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("❌ Error al consultar API:", text)
      return false
    }

    const result = await res.json()
    return result.exists
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (registerPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    const isPasswordValid = Object.values(passwordValidation).every(Boolean)
    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos")
      setIsLoading(false)
      return
    }

    try {
      const alreadyExists = await checkIfEmailExists(registerEmail)
      if (alreadyExists) {
        setError("Ya existe una cuenta con ese email. Inicia sesión o recupera tu contraseña.")
        setIsLoading(false)
        return
      }
      
      const result = await signUp(registerEmail, registerPassword, registerFirstName, registerLastName)
      console.log("Resultado del registro:", result)

      if (!result || !result.success) {
        setError(result?.error || "Error al crear la cuenta")
        setIsLoading(false)
        return
      }

      setSuccess("Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.")
      setActiveTab("login")
    } catch (error: any) {
      console.error("Error en registro:", error)
      let errorMessage = "Error inesperado al crear la cuenta"
      
      if (error.message) {
        if (error.message.includes("User already registered")) {
          errorMessage = "Ya existe una cuenta con ese email."
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres."
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "El formato del email no es válido."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      sessionStorage.setItem("redirectAfterLogin", redirectTo)
      const result = await signInWithGoogle()
      
      if (result && !result.success) {
        setError(result.error || "Error al iniciar sesión con Google")
        return
      }
      
      router.push(redirectTo)
    } catch (error: any) {
      console.error("Error en Google Sign In:", error)
      let errorMessage = "Error al iniciar sesión con Google"
      
      if (error.message) {
        if (error.message.includes("popup_closed_by_user")) {
          errorMessage = "Inicio de sesión cancelado por el usuario."
        } else if (error.message.includes("access_denied")) {
          errorMessage = "Acceso denegado. Verifica los permisos de tu cuenta de Google."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isPasswordMatch = registerPassword === confirmPassword && confirmPassword !== ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>

      <div className="w-full max-w-md relative">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center space-x-3 mb-4">
              
              <div>
                <div className="relative flex items-center space-x-2">
                <img
                  src="/libercopy-favicon.svg"
                  alt="LiberCopy Icon"
                  className="h-20 transform group-hover:scale-110 transition-all duration-300"
                />
                <img
                  src="/libercopy-logo.svg"
                  alt="LiberCopy - grupo lantia"
                  className="h-20 w-auto transform group-hover:scale-105 transition-all duration-300"
                />
              </div>
              </div>
            </div>
            
          </CardHeader>

          <CardContent className="p-6">
            {hasVerified  && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <X className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-xl p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Iniciar sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                >
                  Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                 

                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-medium transform hover:scale-105 transition-all duration-200"
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">o continúa con</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full border-gray-200 hover:bg-gray-50 rounded-xl py-3 font-medium transition-all duration-200 bg-transparent"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.5599 12.2492C22.5599 11.4692 22.4899 10.7192 22.3599 10.0292H11.9999V14.2892H17.9199C17.6599 15.6592 16.8799 16.8192 15.6999 17.6092V20.3892H19.2699C21.3499 18.4692 22.5599 15.6492 22.5599 12.2492Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M11.9999 22.9992C14.9199 22.9992 17.4099 22.0192 19.2299 20.3392L15.6999 17.6092C14.7199 18.2692 13.4699 18.6692 11.9999 18.6692C9.1399 18.6692 6.6499 16.7092 5.7799 13.9092H2.1799V16.7692C3.9799 20.2992 7.6999 22.9992 11.9999 22.9992Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.7799 13.9092C5.5599 13.2192 5.4299 12.4992 5.4299 11.7492C5.4299 10.9992 5.5599 10.2792 5.7799 9.5892V6.7292H2.1799C1.4299 8.2092 0.9999 9.8792 0.9999 11.7492C0.9999 13.6192 1.4299 15.2892 2.1799 16.7692L5.7799 13.9092Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M11.9999 5.3292C13.8299 5.3292 15.4399 5.9492 16.6399 7.1092L19.3199 4.4292C17.4099 2.6092 14.9199 1.6192 11.9999 1.6192C7.7099 1.6192 3.9799 4.3192 2.1799 7.8492L5.7799 10.7092C6.6499 7.9092 9.1399 5.3292 11.9999 5.3292Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar con Google
                </Button>

                <div className="text-center">
                  <Link
                    href="/reset-password"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                   <div className="space-y-2">
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Nombre"
                      value={registerFirstName}
                      onChange={(e) => setRegisterFirstName(e.target.value)}
                      required
                      className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Apellidos"
                      value={registerLastName}
                      onChange={(e) => setRegisterLastName(e.target.value)}
                      required
                      className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        className="pl-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {registerPassword && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-medium text-gray-700">Requisitos de contraseña:</p>
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div
                            className={`flex items-center ${passwordValidation.length ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.length ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Mínimo 8 caracteres
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.uppercase ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Una mayúscula
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.lowercase ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.lowercase ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Una minúscula
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.number ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.number ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Un número
                          </div>
                          <div
                            className={`flex items-center ${passwordValidation.special ? "text-green-600" : "text-gray-500"}`}
                          >
                            {passwordValidation.special ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Un carácter especial
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirmar contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={`pl-10 pr-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                          confirmPassword && !isPasswordMatch ? "border-red-300" : ""
                        } ${confirmPassword && isPasswordMatch ? "border-green-300" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword && !isPasswordMatch && (
                      <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                    )}
                    {confirmPassword && isPasswordMatch && (
                      <p className="text-xs text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Las contraseñas coinciden
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !Object.values(passwordValidation).every(Boolean) || !isPasswordMatch}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-medium transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">o continúa con</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full border-gray-200 hover:bg-gray-50 rounded-xl py-3 font-medium transition-all duration-200 bg-transparent"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.5599 12.2492C22.5599 11.4692 22.4899 10.7192 22.3599 10.0292H11.9999V14.2892H17.9199C17.6599 15.6592 16.8799 16.8192 15.6999 17.6092V20.3892H19.2699C21.3499 18.4692 22.5599 15.6492 22.5599 12.2492Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M11.9999 22.9992C14.9199 22.9992 17.4099 22.0192 19.2299 20.3392L15.6999 17.6092C14.7199 18.2692 13.4699 18.6692 11.9999 18.6692C9.1399 18.6692 6.6499 16.7092 5.7799 13.9092H2.1799V16.7692C3.9799 20.2992 7.6999 22.9992 11.9999 22.9992Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.7799 13.9092C5.5599 13.2192 5.4299 12.4992 5.4299 11.7492C5.4299 10.9992 5.5599 10.2792 5.7799 9.5892V6.7292H2.1799C1.4299 8.2092 0.9999 9.8792 0.9999 11.7492C0.9999 13.6192 1.4299 15.2892 2.1799 16.7692L5.7799 13.9092Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M11.9999 5.3292C13.8299 5.3292 15.4399 5.9492 16.6399 7.1092L19.3199 4.4292C17.4099 2.6092 14.9199 1.6192 11.9999 1.6192C7.7099 1.6192 3.9799 4.3192 2.1799 7.8492L5.7799 10.7092C6.6499 7.9092 9.1399 5.3292 11.9999 5.3292Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar con Google
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
