"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { PayPalPayment } from "@/components/paypal-payment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Package } from "lucide-react"

// Funciones auxiliares para mostrar los detalles
const getSizeName = (size: string) => {
  const sizeMap: { [key: string]: string } = {
    a4: "A4 (21x29.7 cm)",
    a3: "A3 (29.7x42 cm)",
    a5: "A5 (14.8x21 cm)",
    letter: "Carta (21.6x27.9 cm)",
    legal: "Legal (21.6x35.6 cm)",
  }
  return sizeMap[size] || size || "A4"
}

const getPrintTypeName = (type: string) => {
  const typeMap: { [key: string]: string } = {
    single: "Una cara",
    double: "Doble cara",
    color: "Color",
    bw: "Blanco y negro",
    grayscale: "Escala de grises",
  }
  return typeMap[type] || type || "Blanco y negro"
}

const getPaperTypeName = (paper: string) => {
  const paperMap: { [key: string]: string } = {
    standard: "Estándar (80g)",
    normal: "Estándar (80g)",
    premium: "Premium (120g)",
    photo: "Fotográfico",
    recycled: "Reciclado",
  }
  return paperMap[paper] || paper || "Estándar (80g)"
}

const getFinishingName = (finishing: string) => {
  const finishingMap: { [key: string]: string } = {
    none: "Sin acabado",
    stapled: "Grapado",
    spiral: "Espiral",
    thermal: "Encuadernación térmica",
    wire: "Wire-O",
    perfect: "Encuadernación perfecta",
  }
  return finishingMap[finishing] || finishing || "Sin acabado"
}

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calcular el total de forma segura
  const cartTotal = getTotalPrice() || 0
  const totalWithIVA = cartTotal * 1.21

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/")
    }
  }, [cart, router])

  const createOrder = async () => {
    setIsCreatingOrder(true)
    setError(null)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          total: cartTotal,
          paymentMethod: "paypal",
        }),
      })

      if (!response.ok) {
        throw new Error("Error al crear el pedido")
      }

      const data = await response.json()
      setOrderId(data.orderId)
      return data.orderId
    } catch (error) {
      console.error("Error creating order:", error)
      setError("Error al crear el pedido. Por favor, inténtalo de nuevo.")
      return null
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    router.push("/payment/success")
  }

  const handlePaymentError = (error: string) => {
    setError(error)
  }

  const handleBackToSummary = () => {
    router.push("/checkout/summary")
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <Button onClick={() => router.push("/")} className="bg-[#8B4513] hover:bg-[#A0522D] text-white">
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={handleBackToSummary} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al resumen
          </Button>
          <h1 className="text-2xl font-bold">Finalizar compra con PayPal</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detalles del pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Detalles del pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, index) => {
                  const itemPrice = item.price || 0
                  const itemQuantity = item.quantity || 1
                  const itemSubtotal = itemPrice * itemQuantity

                  return (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{item.fileName || `Documento ${index + 1}`}</span>
                        </div>
                        <span className="text-sm text-gray-500">Cantidad: {itemQuantity}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Tamaño:</span>
                          <span className="ml-2 font-medium">{getSizeName(item.options?.paperSize)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tipo:</span>
                          <span className="ml-2 font-medium">{getPrintTypeName(item.options?.printType)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Papel:</span>
                          <span className="ml-2 font-medium">{getPaperTypeName(item.options?.paperType)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Acabado:</span>
                          <span className="ml-2 font-medium">{getFinishingName(item.options?.finishing)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t">
                        <span className="text-sm text-gray-600">Precio unitario:</span>
                        <span className="font-medium">{itemPrice.toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="font-medium">{itemSubtotal.toFixed(2)}€</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Resumen de precios */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{cartTotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (21%):</span>
                  <span className="font-medium">{(cartTotal * 0.21).toFixed(2)}€</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{totalWithIVA.toFixed(2)}€</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de pago PayPal */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pago con PayPal</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {!orderId ? (
                  <div className="text-center py-8">
                    <Button
                      onClick={createOrder}
                      disabled={isCreatingOrder}
                      className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
                    >
                      {isCreatingOrder ? "Creando pedido..." : "Crear pedido y continuar"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">Se creará tu pedido antes de proceder al pago</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Pedido creado:</strong> #{orderId.substring(0, 8)}
                      </p>
                      <p className="text-blue-600 text-sm mt-1">Procede con el pago usando PayPal</p>
                    </div>

                    <PayPalPayment
                      orderId={orderId}
                      amount={totalWithIVA}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Información del pago</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>• Pago seguro procesado por PayPal</p>
                <p>• Recibirás un email de confirmación</p>
                <p>• El pedido se procesará una vez confirmado el pago</p>
                <p>• Tiempo estimado de entrega: 2-3 días laborables</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
