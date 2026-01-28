"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import Navbar from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard } from "lucide-react"
import PayPalPayment from "@/components/paypal-payment"
import Footer from "@/components/footer"

function PaymentProcessPageInner() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const supabase = getSupabaseClient()

  const orderId = params.id as string
  const paymentMethod = searchParams.get("method")
  const amount = Number.parseFloat(searchParams.get("amount") || "0")

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (!orderId) {
      setError("ID de pedido no válido")
      setLoading(false)
      return
    }

    fetchOrder()
  }, [user, orderId])

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("user_id", user?.id)
        .single()

      if (orderError || !orderData) {
        setError("Pedido no encontrado")
        return
      }

      setOrder(orderData)
    } catch (error) {
      console.error("Error fetching order:", error)
      setError("Error al cargar el pedido")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      // El webhook de PayPal ya actualizará el estado del pedido
      // Simplemente redirigimos a la página de éxito
      router.push("/payment/success")
    } catch (error) {
      console.error("Error handling payment success:", error)
      setError("Error al procesar el pago exitoso")
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    console.error("Payment error:", errorMessage)
    setError(errorMessage)
  }

  const handleBack = () => {
    router.push("/checkout/summary")
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E5FEB] mx-auto mb-4"></div>
            <p>Cargando información del pedido...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-6">
                <div className="text-red-500 mb-4">
                  <CreditCard className="h-12 w-12 mx-auto mb-2" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Error en el pago</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button onClick={handleBack} variant="outline" className="w-full bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al resumen
                  </Button>
                  <Button onClick={() => router.push("/cart")} className="w-full">
                    Ir al carrito
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Pedido no encontrado</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Volver al inicio
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="text-[#2E5FEB] hover:text-[#2E5FEB]/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al resumen
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {paymentMethod === "paypal" ? "Pago con PayPal" : "Procesar Pago"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Resumen del pedido</h3>
                  <div className="flex justify-between items-center">
                    <span>Pedido #{orderId.substring(0, 8)}</span>
                    <span className="font-bold text-[#f47d30]">{amount.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {paymentMethod === "paypal" ? (
                <div>
                  <div className="mb-4 text-center">
                    <p className="text-gray-600">Serás redirigido a PayPal para completar tu pago de forma segura.</p>
                  </div>
                  <PayPalPayment
                    orderId={orderId}
                    amount={amount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p>Método de pago no soportado</p>
                  <Button onClick={handleBack} className="mt-4">
                    Volver
                  </Button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </main>
  )
}

export default function PaymentProcessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PaymentProcessPageInner />
    </Suspense>
  )
}
