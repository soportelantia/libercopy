"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { CheckoutSteps } from "@/components/checkout-steps"
import { Tag, X, Check, CreditCard, Smartphone } from "lucide-react"
import { PayPalPayment } from "@/components/paypal-payment"
import { RedsysPayment } from "@/components/redsys-payment"
import { BizumPayment } from "@/components/bizum-payment"

interface DiscountCode {
  code: string
  percentage: number
  message: string
}

interface ShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  province: string
  phone: string
}

export default function CheckoutSummaryPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()

  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | "bizum">("card")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null)
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const [discountError, setDiscountError] = useState("")
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Cargar dirección de envío
    const savedAddress = sessionStorage.getItem("shippingAddress")
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress))
    }

    // Cargar descuento aplicado
    const savedDiscount = sessionStorage.getItem("appliedDiscount")
    if (savedDiscount) {
      try {
        setAppliedDiscount(JSON.parse(savedDiscount))
      } catch (error) {
        console.error("Error loading saved discount:", error)
        sessionStorage.removeItem("appliedDiscount")
      }
    }
  }, [])

  // Guardar descuento aplicado en sessionStorage
  useEffect(() => {
    if (appliedDiscount) {
      sessionStorage.setItem("appliedDiscount", JSON.stringify(appliedDiscount))
    } else {
      sessionStorage.removeItem("appliedDiscount")
    }
  }, [appliedDiscount])

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      setDiscountError("Por favor, introduce un código de descuento")
      return
    }

    setIsValidatingDiscount(true)
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

      if (response.ok && data.valid) {
        setAppliedDiscount({
          code: data.code,
          percentage: data.percentage,
          message: data.message,
        })
        setDiscountCode("")
        setDiscountError("")
      } else {
        setDiscountError(data.error || "Código de descuento no válido")
      }
    } catch (error) {
      console.error("Error validating discount code:", error)
      setDiscountError("Error al validar el código de descuento")
    } finally {
      setIsValidatingDiscount(false)
    }
  }

  const removeDiscount = () => {
    setAppliedDiscount(null)
    setDiscountError("")
  }

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0
    return (total * appliedDiscount.percentage) / 100
  }

  const calculateFinalTotal = () => {
    return total - calculateDiscountAmount()
  }

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessing(true)

    try {
      const orderData = {
        items,
        total: calculateFinalTotal(),
        shippingAddress,
        paymentMethod,
        paymentData,
        discountCode: appliedDiscount?.code || null,
        discountPercentage: appliedDiscount?.percentage || null,
        discountAmount: calculateDiscountAmount(),
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        sessionStorage.removeItem("shippingAddress")
        sessionStorage.removeItem("appliedDiscount")
        router.push(`/payment/success?orderId=${order.id}`)
      } else {
        throw new Error("Error creating order")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      router.push("/payment/error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
          <Button onClick={() => router.push("/imprimir")}>Comenzar a imprimir</Button>
        </div>
      </div>
    )
  }

  if (!shippingAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Información de envío requerida</h1>
          <Button onClick={() => router.push("/checkout/shipping")}>Configurar envío</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Resumen del pedido */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.fileName}</p>
                    <p className="text-sm text-gray-600">
                      {item.pages} páginas • {item.paperType} • {item.binding}
                      {item.copies > 1 && ` • ${item.copies} copias`}
                    </p>
                  </div>
                  <p className="font-medium">{item.price.toFixed(2)} €</p>
                </div>
              ))}

              <Separator />

              {/* Código de descuento */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Código de descuento
                </Label>

                {appliedDiscount ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {appliedDiscount.code} ({appliedDiscount.percentage}% descuento)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeDiscount}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Introduce tu código"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === "Enter" && validateDiscountCode()}
                    />
                    <Button
                      onClick={validateDiscountCode}
                      disabled={isValidatingDiscount || !discountCode.trim()}
                      variant="outline"
                    >
                      {isValidatingDiscount ? "Validando..." : "Aplicar"}
                    </Button>
                  </div>
                )}

                {discountError && (
                  <Alert variant="destructive">
                    <AlertDescription>{discountError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{total.toFixed(2)} €</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({appliedDiscount.percentage}%):</span>
                    <span>-{calculateDiscountAmount().toFixed(2)} €</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{calculateFinalTotal().toFixed(2)} €</span>
                </div>

                {appliedDiscount && (
                  <p className="text-sm text-green-600 text-center">
                    ¡Ahorras {calculateDiscountAmount().toFixed(2)} € con el código {appliedDiscount.code}!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dirección de envío */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección de envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{shippingAddress.name}</p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.postalCode} {shippingAddress.city}
                </p>
                <p>{shippingAddress.province}</p>
                <p>Tel: {shippingAddress.phone}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/checkout/shipping")} className="mt-4">
                Cambiar dirección
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Método de pago */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Método de pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selector de método de pago */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-xs">Tarjeta</span>
                </Button>
                <Button
                  variant={paymentMethod === "paypal" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("paypal")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">PP</span>
                  </div>
                  <span className="text-xs">PayPal</span>
                </Button>
                <Button
                  variant={paymentMethod === "bizum" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("bizum")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xs">Bizum</span>
                </Button>
              </div>

              <Separator />

              {/* Componente de pago según el método seleccionado */}
              {paymentMethod === "paypal" && (
                <PayPalPayment
                  amount={calculateFinalTotal()}
                  onSuccess={handlePaymentSuccess}
                  onError={() => router.push("/payment/error")}
                />
              )}

              {paymentMethod === "card" && (
                <RedsysPayment
                  amount={calculateFinalTotal()}
                  onSuccess={handlePaymentSuccess}
                  onError={() => router.push("/payment/error")}
                />
              )}

              {paymentMethod === "bizum" && (
                <BizumPayment
                  amount={calculateFinalTotal()}
                  onSuccess={handlePaymentSuccess}
                  onError={() => router.push("/payment/error")}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
