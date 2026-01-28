"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Tag, X, Check } from "lucide-react"
import { CheckoutSteps } from "@/components/checkout-steps"
import Footer from "@/components/footer"

interface DiscountCode {
  code: string
  percentage: number
  id: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getTotalPrice } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  // Estados para códigos de descuento
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState("")

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem("redirectUrl", "/checkout")
      router.push("/auth")
      return
    }

    if (!cart || cart.length === 0) {
      router.push("/")
      return
    }

    // Cargar código de descuento aplicado si existe
    const checkoutData = sessionStorage.getItem("checkoutData")
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData)
        if (data.discount) {
          setAppliedDiscount(data.discount)
        }
      } catch (e) {
        console.error("Error parsing checkoutData:", e)
      }
    }

    setLoading(false)
  }, [user, cart, router])

  // Función para validar código de descuento
  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Por favor, introduce un código de descuento")
      return
    }

    setDiscountLoading(true)
    setDiscountError("")

    try {
      const response = await fetch("/api/discount-codes/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: discountCode.trim() }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setAppliedDiscount(data.discount)
        setDiscountCode("")
        setDiscountError("")

        // Guardar en sessionStorage
        const checkoutData = JSON.parse(sessionStorage.getItem("checkoutData") || "{}")
        checkoutData.discount = data.discount
        sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
      } else {
        setDiscountError(data.error || "Código de descuento no válido")
      }
    } catch (error) {
      console.error("Error validating discount code:", error)
      setDiscountError("Error al validar el código de descuento")
    } finally {
      setDiscountLoading(false)
    }
  }

  // Función para remover código de descuento
  const removeDiscountCode = () => {
    setAppliedDiscount(null)
    setDiscountCode("")
    setDiscountError("")

    // Remover de sessionStorage
    const checkoutData = JSON.parse(sessionStorage.getItem("checkoutData") || "{}")
    delete checkoutData.discount
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
  }

  const handleContinue = () => {
    // Guardar datos del checkout incluyendo el descuento
    const subtotal = getTotalPrice() || 0
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0

    const checkoutData = {
      items: cart || [],
      subtotal,
      discountAmount,
      discount: appliedDiscount,
      timestamp: new Date().toISOString(),
    }

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    router.push("/checkout/shipping")
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

  if (!cart || cart.length === 0) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Tu carrito está vacío. Redirigiendo...</p>
          </div>
        </div>
      </main>
    )
  }

  const subtotal = getTotalPrice() || 0
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
  const finalSubtotal = subtotal - discountAmount

  return (
    <div className="flex min-h-screen flex-col bg-white">
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

        <h1 className="text-2xl font-bold text-[#2E5FEB] mb-8 text-center">Paso 1: Revisa tu pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Artículos del pedido */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Artículos en tu pedido</h3>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.fileName || item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.pageCount || 0} páginas • {item.options?.copies || item.quantity || 1} copias
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.options?.printType === "bw" ? "Blanco y Negro" : "Color"} •{" "}
                          {item.options?.paperSize?.toUpperCase() || "A4"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#f47d30]">{(item.price || 0).toFixed(2)}€</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Código de descuento */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4 flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  Código de descuento
                </h3>

                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Código aplicado: {appliedDiscount.code}</p>
                        <p className="text-sm text-green-600">Descuento del {appliedDiscount.percentage}%</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeDiscountCode}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Introduce tu código de descuento"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={discountLoading}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            validateDiscountCode()
                          }
                        }}
                      />
                      <Button
                        onClick={validateDiscountCode}
                        disabled={discountLoading || !discountCode.trim()}
                        className="bg-[#2E5FEB] hover:bg-[#2E5FEB]/80"
                      >
                        {discountLoading ? "Validando..." : "Aplicar"}
                      </Button>
                    </div>
                    {discountError && <p className="text-sm text-red-600">{discountError}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Resumen del pedido</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({appliedDiscount.percentage}%):</span>
                      <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Subtotal con descuento:</span>
                      <span className="text-[#f47d30]">{finalSubtotal.toFixed(2)}€</span>
                    </div>
                    {appliedDiscount && (
                      <p className="text-sm text-green-600 mt-1">¡Has ahorrado {discountAmount.toFixed(2)}€!</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Los gastos de envío se calcularán en el siguiente paso</p>
                </div>

                <Button className="w-full mt-6 bg-[#2E5FEB] hover:bg-[#2E5FEB]/80" onClick={handleContinue}>
                  Continuar al envío
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
