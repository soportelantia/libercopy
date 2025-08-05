"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import { CheckoutSteps } from "@/components/checkout-steps"
import Footer from "@/components/footer"
export default function CheckoutPaymentPage() {
  const router = useRouter()
  const { cart } = useCart()
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<string>("paypal")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      sessionStorage.setItem("redirectUrl", "/checkout/payment")
      router.push("/auth")
      return
    }

    // Cargar método de pago previamente seleccionado
    const savedPayment = sessionStorage.getItem("selectedPaymentMethod")
    if (savedPayment) {
      setSelectedMethod(savedPayment)
      console.log("Loaded payment method:", savedPayment)
    }

    setLoading(false)
  }, [user, router])

  useEffect(() => {
    if (!loading && cart.length === 0) {
      router.push("/")
    }
  }, [loading, cart, router])

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method)
    console.log("Selected payment method:", method)
  }

  const handleContinue = () => {
    // Guardar el método de pago seleccionado
    sessionStorage.setItem("selectedPaymentMethod", selectedMethod)

    // Actualizar checkoutData si existe
    const checkoutData = sessionStorage.getItem("checkoutData")
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData)
        data.payment = { method: selectedMethod }
        sessionStorage.setItem("checkoutData", JSON.stringify(data))
      } catch (e) {
        console.error("Error updating checkoutData:", e)
      }
    }

    console.log("Continuing with payment method:", selectedMethod)
    router.push("/checkout/summary")
  }

  const handleBack = () => {
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

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <CheckoutSteps currentStep={2} />

        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="text-[#2E5FEB] hover:text-[#2E5FEB]/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al paso anterior
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-[#2E5FEB] mb-8 text-center">Paso 2: Selecciona tu método de pago</h1>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#2E5FEB] mb-6">Métodos de pago disponibles</h3>

              <div className="space-y-4">
                {/* PayPal */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === "paypal"
                      ? "border-[#2E5FEB] bg-[#2E5FEB]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleMethodSelect("paypal")}
                >
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-bold">PP</span>
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-gray-600">Pago seguro con tu cuenta PayPal</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedMethod === "paypal" ? "border-[#2E5FEB] bg-[#2E5FEB]" : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "paypal" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tarjeta de crédito/débito */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === "tarjeta"
                      ? "border-[#2E5FEB] bg-[#2E5FEB]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleMethodSelect("tarjeta")}
                >
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <CreditCard className="mr-3 h-6 w-6 text-gray-600" />
                      <div>
                        <p className="font-medium">Tarjeta de crédito/débito</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedMethod === "tarjeta" ? "border-[#2E5FEB] bg-[#2E5FEB]" : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "tarjeta" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bizum */}
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedMethod === "bizum"
                      ? "border-[#2E5FEB] bg-[#2E5FEB]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleMethodSelect("bizum")}
                >
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center mr-3">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Bizum</p>
                        <p className="text-sm text-gray-600">Pago instantáneo desde tu móvil</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedMethod === "bizum" ? "border-[#2E5FEB] bg-[#2E5FEB]" : "border-gray-300"
                      }`}
                    >
                      {selectedMethod === "bizum" && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Todos los pagos son procesados de forma segura
                </div>

                <Button className="w-full bg-[#2E5FEB] hover:bg-[#6d1a26]" onClick={handleContinue}>
                  Continuar al resumen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  )
}
