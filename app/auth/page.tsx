'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/hooks/use-cart'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signIn, signUp, user } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (user) {
      if (items.length > 0) {
        router.push('/cart')
      } else {
        router.push(redirect)
      }
    }
  }, [user, router, redirect, items])

  const translateError = (error: string): string => {
    const errorMessages: { [key: string]: string } = {
      'Invalid login credentials': 'Credenciales de acceso inválidas',
      'Email not confirmed': 'Email no confirmado. Revisa tu bandeja de entrada',
      'User already registered': 'El usuario ya está registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Signup requires a valid password': 'El registro requiere una contraseña válida',
      'User not found': 'Usuario no encontrado',
      'Invalid password': 'Contraseña incorrecta',
      'Email already registered': 'Este email ya está registrado',
      'Weak password': 'La contraseña es muy débil',
      'Invalid credentials': 'Credenciales inválidas',
      'Too many requests': 'Demasiados intentos. Inténtalo más tarde'
    }

    // Buscar coincidencias parciales
    for (const [key, value] of Object.entries(errorMessages)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }

    return error || 'Ha ocurrido un error inesperado'
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    console.log('Intentando login con:', { email })

    try {
      const result = await signIn(email, password)
      console.log('Resultado del login:', result)

      if (result?.error) {
        console.error('Error en login:', result.error)
        setError(translateError(result.error.message || result.error))
        return
      }

      if (result?.user) {
        console.log('Login exitoso, redirigiendo...')
        // Redirigir según si hay items en el carrito
        if (items.length > 0) {
          router.push('/cart')
        } else {
          router.push(redirect)
        }
      } else {
        setError('Error de autenticación. Inténtalo de nuevo.')
      }
    } catch (err: any) {
      console.error('Error capturado en handleSignIn:', err)
      setError(translateError(err.message || 'Error de conexión'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    console.log('Intentando registro con:', { email })

    // Validaciones
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(email, password)
      console.log('Resultado del registro:', result)

      if (result?.error) {
        console.error('Error en registro:', result.error)
        setError(translateError(result.error.message || result.error))
        return
      }

      if (result?.user) {
        console.log('Registro exitoso')
        // Mostrar mensaje de confirmación
        setError('')
        alert('Registro exitoso. Revisa tu email para confirmar tu cuenta.')
      } else {
        setError('Error en el registro. Inténtalo de nuevo.')
      }
    } catch (err: any) {
      console.error('Error capturado en handleSignUp:', err)
      setError(translateError(err.message || 'Error de conexión'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accede a tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O crea una nueva cuenta
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para acceder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Tu contraseña"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar Sesión
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>
                  Crea una nueva cuenta para empezar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Mínimo 6 caracteres"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm-password">Confirmar Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Repite tu contraseña"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear Cuenta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
