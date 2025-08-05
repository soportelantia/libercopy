"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { AlertCircle, User, Package, LogOut, MapPin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { LocationSelector } from "@/components/location-selector"
import Footer from "@/components/footer"
type Profile = {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone: string
  address: string
  province: string
  municipality: string
  postal_code: string
}

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) throw error
        setProfile(data)
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, router, supabase])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)

    try {
      // Actualizar el perfil en la base de datos
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          phone: profile?.phone,
          address: profile?.address,
          province: profile?.province,
          municipality: profile?.municipality,
          postal_code: profile?.postal_code,
        })
        .eq("id", user?.id)

      if (profileError) throw profileError

      // Actualizar el email si ha cambiado
      if (profile?.email && profile.email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profile.email,
        })

        if (emailError) throw emailError
      }

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente.",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center" style={{ marginTop: "80px" }}>
          <div className="animate-pulse text-gray-600">Cargando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mi cuenta
            </h1>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/account"
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mi perfil</h3>
                <p className="text-sm text-gray-600">Gestiona tus datos personales</p>
              </div>
            </Link>

            <Link
              href="/account/addresses"
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mis direcciones</h3>
                <p className="text-sm text-gray-600">Gestiona tus direcciones de envío</p>
              </div>
            </Link>

            <Link
              href="/account/orders"
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Mis pedidos</h3>
                <p className="text-sm text-gray-600">Consulta el historial de tus pedidos</p>
              </div>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Datos personales
            </h2>

            {error && (
              <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-gray-700 font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={profile?.first_name || ""}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-gray-700 font-medium">
                    Apellidos
                  </Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={profile?.last_name || ""}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email || ""}
                  onChange={(e) => setProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">Al cambiar el email, se actualizará tu cuenta de acceso</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profile?.phone || ""}
                  onChange={handleInputChange}
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">
                  Dirección
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={profile?.address || ""}
                  onChange={handleInputChange}
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700 font-medium">
                    País
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value="España"
                    disabled
                    className="rounded-xl bg-gray-50 border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code" className="text-gray-700 font-medium">
                    Código postal
                  </Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={profile?.postal_code || ""}
                    onChange={handleInputChange}
                    className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <LocationSelector
                selectedProvince={profile?.province || ""}
                selectedMunicipality={profile?.municipality || ""}
                onProvinceChange={(province) =>
                  setProfile((prev) => (prev ? { ...prev, province, municipality: "" } : null))
                }
                onMunicipalityChange={(municipality) => setProfile((prev) => (prev ? { ...prev, municipality } : null))}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <Toaster />
    </main>
  )
}
