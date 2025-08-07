'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/hooks/use-cart'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signIn, signUp, user } = useAuth()
  const { items } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      if (items.length > 0) {
        router.push('/cart')
      } else {
        router.push(redirect || '/')
      }
    }
  }, [user, items, router, redirect])

  const translateError = (error: string): string => {
    const errorMessages: { [key: string]: string } = {
      'Invalid login credentials': 'Credenciales de acceso inválidas',
      'Email not confirmed': 'Email no confirmado',
      'User already registered': 'El usuario ya está registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
      'Invalid email': 'Email inválido',
      'Signup requires a valid password': 'El registro requiere una contraseña válida',
      'User not found': 'Usuario no encontrado',
      'Invalid password': 'Contraseña inválida',
      'Email already registered': 'El email ya está registrado',
      'Weak password': 'Contraseña débil',
      'Network error': 'Error de conexión',
      'Server error': 'Error del servidor'
    }
    
    return errorMessages[error] || error || 'Ha ocurrido un error inesperado'
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Intentando iniciar sesión con:', email)
      
      if (!email || !password) {
        setError('Por favor, completa todos los campos')
        return
      }

      const result = await signIn(email, password)
      console.log('Resultado del login:', result)

      if (result?.error) {
        console.error('Error en login:', result.error)
        setError(translateError(result.error.message))
        return
      }

      if (result?.user) {
        console.log('Login exitoso, redirigiendo...')
        setSuccess('Inicio de sesión exitoso')
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          if (items.length > 0) {
            router.push('/cart')
          } else {
            router.push(redirect || '/')
          }
        }, 1000)
      }
    } catch (err: any) {
      console.error('Error capturado en handleSignIn:', err)
      setError(translateError(err.message || 'Error al iniciar sesión'))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Intentando registrar usuario:', email)

      if (!email || !password || !confirmPassword) {
        setError('Por favor, completa todos los campos')
        return
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }

      const result = await signUp(email, password)
      console.log('Resultado del registro:', result)

      if (result?.error) {
        console.error('Error en registro:', result.error)
        setError(translateError(result.error.message))
        return
      }

      if (result?.user) {
        console.log('Registro exitoso')
        setSuccess('Registro exitoso. Por favor, verifica tu email para activar tu cuenta.')
        
        // Limpiar formulario
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      console.error('Error capturado en handleSignUp:', err)
      setError(translateError(err.message || 'Error al registrarse'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accede a tu cuenta
          </h2>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Autenticación</CardTitle>
            <CardDescription>
              Inicia sesión o crea una nueva cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Contraseña</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
