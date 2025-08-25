"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { CheckoutSteps } from "@/components/checkout-steps"
import { Tag, X, Check, AlertCircle } from "lucide-react"

interface DiscountCode {
  id: string
  code: string
  percentage: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()

  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const [discountError, setDiscountError] = useState("")
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false)

  const subtotal = total
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
  const finalTotal = subtotal - discountAmount

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
      return
    }

    // Cargar descuento guardado
    const savedDiscount = sessionStorage.getItem("appliedDiscount")
    if (savedDiscount) {
      try {
        setAppliedDiscount(JSON.parse(savedDiscount))
      } catch (error) {
        console.error("Error loading saved discount:", error)
        sessionStorage.removeItem("appliedDiscount")
      }
    }
  }, [items.length, router])

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
        setAppliedDiscount(data.discount)
        setDiscountCode("")
        setDiscountError("")

        // Guardar en sessionStorage
        sessionStorage.setItem("appliedDiscount", JSON.stringify(data.discount))
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
    sessionStorage.removeItem("appliedDiscount")
  }

  const handleContinue = () => {
    // Guardar información del descuento para el siguiente paso
    if (appliedDiscount) {
      sessionStorage.setItem(
        "checkoutDiscount",
        JSON.stringify({
          code: appliedDiscount.code,
          percentage: appliedDiscount.percentage,
          amount: discountAmount,
        }),
      )
    }

    router.push("/checkout/shipping")
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={1} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Resumen del pedido */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.fileName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.copies} {item.copies === 1 ? "copia" : "copias"} • {item.pages} páginas
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.colorMode === "color" ? "Color" : "Blanco y negro"} • {item.paperSize}
                    </p>
                    {item.binding && <p className="text-sm text-muted-foreground">Encuadernación: {item.binding}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.price.toFixed(2)}€</p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento ({appliedDiscount.percentage}%)</span>
                    <span>-{discountAmount.toFixed(2)}€</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)}€</span>
                </div>

                {appliedDiscount && (
                  <p className="text-sm text-green-600">¡Has ahorrado {discountAmount.toFixed(2)}€!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Código de descuento y continuar */}
        <div className="space-y-6">
          {/* Código de descuento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Código de descuento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appliedDiscount ? (
                <div className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <strong>Código aplicado: {appliedDiscount.code}</strong>
                          <p className="text-sm">Descuento del {appliedDiscount.percentage}%</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeDiscount}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Introduce tu código de descuento"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === "Enter" && validateDiscountCode()}
                    />
                    <Button onClick={validateDiscountCode} disabled={isValidatingDiscount || !discountCode.trim()}>
                      {isValidatingDiscount ? "Validando..." : "Aplicar"}
                    </Button>
                  </div>

                  {discountError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{discountError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continuar */}
          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleContinue} className="w-full" size="lg">
                Continuar con el envío
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
