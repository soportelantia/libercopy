"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Home, MapPin, Clock, Phone } from "lucide-react"
import { CheckoutSteps } from "@/components/checkout-steps"
import Footer from "@/components/footer"
type Address = {
  id: string
  name: string
  recipient_name: string
  address_line: string
  postal_code: string
  municipality: string
  province: string
  phone: string
  is_default: boolean
  province_name?: string
  municipality_name?: string
}

type PickupPoint = {
  id: string
  name: string
  address: string
  hours: string
  phone: string
}

const pickupPoints: PickupPoint[] = [
  {
    id: "liberis",
    name: "Imprenta Liberis",
    address: "Calle Camino Empedrado 33 Parque Empresarial Parque Plata, 41900 Camas (Sevilla)",
    hours: "L-V: 9:00-18:00",
    phone: "955 28 61 25",
  },
]

export default function ShippingPage() {
  const router = useRouter()
  const { cart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [shippingType, setShippingType] = useState<"home" | "pickup">("home")
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>("")

  const shippingCost = shippingType === "home" ? 3.99 : 0
  const totalPrice = getTotalPrice() || 0
  const subtotal = totalPrice / 1.21
  const iva = totalPrice - subtotal
  const total = totalPrice + shippingCost

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem("redirectUrl", "/shipping")
      router.push("/auth")
      return
    }
    loadAddresses()
  }, [user, router])

  const loadAddresses = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("is_default", { ascending: false })

      if (error) throw error

      // Procesar cada dirección para obtener los nombres de provincia y municipio
      const processedAddresses = await Promise.all(
        (data || []).map(async (address) => {
          // Obtener nombre de la provincia
          const { data: provinceData } = await supabase
            .from("provinces")
            .select("name")
            .eq("id", address.province)
            .single()

          // Obtener nombre del municipio
          const { data: municipalityData } = await supabase
            .from("municipalities")
            .select("name")
            .eq("id", address.municipality)
            .single()

          return {
            ...address,
            province_name: provinceData?.name || address.province,
            municipality_name: municipalityData?.name || address.municipality,
          }
        }),
      )

      setAddresses(processedAddresses || [])

      // Seleccionar la dirección por defecto automáticamente
      const defaultAddress = processedAddresses?.find((addr) => addr.is_default)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id)
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    if (shippingType === "home" && !selectedAddress) {
      alert("Por favor selecciona una dirección de envío")
      return
    }

    if (shippingType === "pickup" && !selectedPickupPoint) {
      alert("Por favor selecciona un punto de recogida")
      return
    }

    // Preparar datos de envío
    const shippingData: any = {
      type: shippingType,
      cost: shippingCost,
    }

    if (shippingType === "home") {
      const address = addresses.find((addr) => addr.id === selectedAddress)
      shippingData.address = address
    } else {
      const pickupPoint = pickupPoints.find((point) => point.id === selectedPickupPoint)
      shippingData.pickupPoint = pickupPoint
    }

    // Guardar selección en sessionStorage
    sessionStorage.setItem("checkoutData", JSON.stringify({ shipping: shippingData }))
    router.push("/checkout/payment")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Cargando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <CheckoutSteps currentStep={1} />

        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/cart")}
            className="text-[#2E5FEB] hover:text-[#2E5FEB]/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al carrito
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-[#2E5FEB] mb-8 text-center">Paso 1: Selecciona método de envío</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RadioGroup
              value={shippingType}
              onValueChange={(value: "home" | "pickup") => setShippingType(value)}
              className="space-y-4"
            >
              {/* Envío a domicilio */}
              <Card
                className={`cursor-pointer transition-all ${
                  shippingType === "home" ? "border-[#2E5FEB] ring-2 ring-[#2E5FEB]/20" : "border-gray-200"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="text-lg font-medium cursor-pointer">
                      <Home className="inline mr-2 h-5 w-5" />
                      Envío a domicilio (+2.99€)
                    </Label>
                  </div>

                  {shippingType === "home" && (
                    <div className="ml-6">
                      {addresses.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500 mb-4">No tienes direcciones guardadas</p>
                          <Button variant="outline" onClick={() => router.push("/account?tab=addresses")}>
                            Añadir dirección
                          </Button>
                        </div>
                      ) : (
                        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {addresses.map((address) => (
                              <Card
                                key={address.id}
                                className={`cursor-pointer transition-all border ${
                                  selectedAddress === address.id
                                    ? "border-[#2E5FEB] ring-2 ring-[#2E5FEB]/20 bg-[#2E5FEB]/5"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => setSelectedAddress(address.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                                    <Label htmlFor={address.id} className="cursor-pointer flex-1">
                                      <div className="text-sm">
                                        <div className="font-medium text-gray-900">{address.name}</div>
                                        <div className="text-gray-700 mt-1">{address.recipient_name}</div>
                                        <div className="text-gray-600 mt-1">{address.address_line}</div>
                                        <div className="text-gray-600">
                                          {address.postal_code} {address.municipality_name || address.municipality},{" "}
                                          {address.province_name || address.province}
                                        </div>
                                        <div className="text-gray-600">Tel: {address.phone}</div>
                                        {address.is_default && (
                                          <span className="text-xs bg-[#2E5FEB] text-white px-2 py-1 rounded mt-2 inline-block">
                                            Predeterminada
                                          </span>
                                        )}
                                      </div>
                                    </Label>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Punto de recogida */}
              <Card
                className={`cursor-pointer transition-all ${
                  shippingType === "pickup" ? "border-[#2E5FEB] ring-2 ring-[#2E5FEB]/20" : "border-gray-200"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="text-lg font-medium cursor-pointer">
                      <MapPin className="inline mr-2 h-5 w-5" />
                      Punto de recogida (Gratis)
                    </Label>
                  </div>

                  {shippingType === "pickup" && (
                    <div className="ml-6">
                      <Select value={selectedPickupPoint} onValueChange={setSelectedPickupPoint}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un punto de recogida" />
                        </SelectTrigger>
                        <SelectContent>
                          {pickupPoints.map((point) => (
                            <SelectItem key={point.id} value={point.id}>
                              {point.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedPickupPoint && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          {(() => {
                            const point = pickupPoints.find((p) => p.id === selectedPickupPoint)
                            return point ? (
                              <div className="space-y-2 text-sm">
                                <div className="font-medium">{point.name}</div>
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="mr-2 h-4 w-4" />
                                  {point.address}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {point.hours}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Phone className="mr-2 h-4 w-4" />
                                  {point.phone}
                                </div>
                              </div>
                            ) : null
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </RadioGroup>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Resumen del pedido</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (sin IVA):</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (21%):</span>
                    <span>{iva.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gastos de envío:</span>
                    <span>{shippingCost === 0 ? "Gratis" : `${shippingCost.toFixed(2)}€`}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-[#f47d30]">{total.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={handleContinue}
                  disabled={
                    (shippingType === "home" && !selectedAddress) || (shippingType === "pickup" && !selectedPickupPoint)
                  }
                >
                  Continuar al paso 2
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
