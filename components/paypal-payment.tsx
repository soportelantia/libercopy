"use client"

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface PayPalPaymentProps {
  orderId: string
  amount: number
  onSuccess?: (details: any) => void
  onError?: (error: any) => void
}

function PayPalPayment({ orderId, amount, onSuccess, onError }: PayPalPaymentProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Configuración para producción
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const environment = process.env.NEXT_PUBLIC_PAYPAL_ENVIRONMENT || "production"

  console.log("PayPal Configuration:", {
    clientId: clientId ? `${clientId.substring(0, 10)}...` : "NOT SET",
    environment: environment,
    orderId,
    amount,
  })

  if (!clientId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error de configuración: PayPal Client ID no encontrado</AlertDescription>
      </Alert>
    )
  }

  const initialOptions = {
    clientId: clientId,
    currency: "EUR",
    intent: "capture",
    environment: environment, // "production" para producción
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pagar con PayPal</CardTitle>
        <CardDescription>
          Total a pagar: €{amount.toFixed(2)}
          <br />
          <small className="text-muted-foreground">
            Entorno: {environment} {environment === "production" ? "(Producción)" : "(Sandbox)"}
          </small>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            disabled={loading}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "paypal",
            }}
            createOrder={(data, actions) => {
              console.log("Creating PayPal order...")
              setLoading(true)
              setError(null)

              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "EUR",
                      value: amount.toFixed(2),
                    },
                    description: `Pedido #${orderId}`,
                    custom_id: orderId,
                  },
                ],
                application_context: {
                  brand_name: "LiberCopy",
                  landing_page: "NO_PREFERENCE",
                  user_action: "PAY_NOW",
                  return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/success?orderId=${orderId}`,
                  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/error?orderId=${orderId}`,
                },
              })
            }}
            onApprove={async (data, actions) => {
              console.log("PayPal payment approved:", data)
              setLoading(true)

              try {
                if (!actions.order) {
                  throw new Error("No order actions available")
                }

                const details = await actions.order.capture()
                console.log("Payment captured:", details)

                // Notificar a nuestro backend
                const response = await fetch("/api/payment/paypal/callback-simple", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderId: orderId,
                    status: details.status,
                    transactionId: details.id,
                    paypalOrderId: data.orderID,
                    details: details,
                  }),
                })

                const result = await response.json()
                console.log("Backend callback result:", result)

                if (result.success) {
                  onSuccess?.(details)
                  // Redirigir a página de éxito
                  window.location.href = `/payment/success?orderId=${orderId}&transactionId=${details.id}`
                } else {
                  throw new Error(result.error || "Error procesando el pago")
                }
              } catch (error) {
                console.error("Error processing payment:", error)
                const errorMessage = error instanceof Error ? error.message : "Error desconocido"
                setError(`Error procesando el pago: ${errorMessage}`)
                onError?.(error)
              } finally {
                setLoading(false)
              }
            }}
            onError={(err) => {
              console.error("PayPal error:", err)
              setError("Error en el procesamiento del pago con PayPal")
              setLoading(false)
              onError?.(err)
            }}
            onCancel={(data) => {
              console.log("PayPal payment cancelled:", data)
              setError("Pago cancelado por el usuario")
              setLoading(false)
            }}
          />
        </PayPalScriptProvider>

        {loading && (
          <div className="flex items-center justify-center mt-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-muted-foreground">Procesando pago...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Export both named and default exports to ensure compatibility
export { PayPalPayment }
export default PayPalPayment
