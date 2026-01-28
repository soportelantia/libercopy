"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import Footer from "@/components/footer"

function PaymentSuccessPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const { clearCart } = useCart()
  const orderId = searchParams.get("orderId")
  const transactionId = searchParams.get("transactionId")

  useEffect(() => {
    // Si tenemos un orderId, podríamos cargar los detalles del pedido
    if (orderId) {
      // Aquí podrías cargar los detalles del pedido si es necesario
      setOrderDetails({
        id: orderId,
        transactionId: transactionId,
      })
      clearCart() // Aquí vacías el carrito
    }
  }, [orderId, transactionId])

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 mb-2">¡Pago completado con éxito!</CardTitle>
              <p className="text-gray-600">Tu pedido ha sido procesado correctamente</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {orderDetails && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Detalles del pedido</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Número de pedido:</span> #{orderDetails.id?.substring(0, 8)}
                    </p>
                    {orderDetails.transactionId && (
                      <p>
                        <span className="font-medium">ID de transacción:</span> {orderDetails.transactionId}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Estado:</span>{" "}
                      <span className="text-green-600 font-medium">Pagado</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <Package className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800">¿Qué sigue?</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Procesaremos tu pedido y te enviaremos un email con los detalles de envío una vez que esté listo.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/account/orders" className="block">
                  <Button className="w-full" size="lg">
                    Ver mis pedidos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/" className="block">
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    Volver al inicio
                  </Button>
                </Link>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t">
                <p>
                  Si tienes alguna pregunta sobre tu pedido, puedes contactarnos o revisar el estado en tu área de
                  cliente.
                </p>
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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PaymentSuccessPageInner />
    </Suspense>
  )
}
