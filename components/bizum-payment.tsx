"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Smartphone, AlertCircle } from "lucide-react"

interface BizumPaymentProps {
  orderId: string
  amount: number
  onError: (error: string) => void
  onLoading: (loading: boolean) => void
}

interface BizumFormData {
  Ds_SignatureVersion: string
  Ds_MerchantParameters: string
  Ds_Signature: string
}

export function BizumPayment({ orderId, amount, onError, onLoading }: BizumPaymentProps) {
  const [formData, setFormData] = useState<BizumFormData | null>(null)
  const [formUrl, setFormUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  console.log("=== BIZUM PAYMENT COMPONENT ===")
  console.log("Order ID:", orderId)
  console.log("Amount:", amount)

  useEffect(() => {
    if (!orderId || !amount) {
      console.error("Missing required props:", { orderId: !!orderId, amount: !!amount })
      onError("Faltan datos requeridos para el pago")
      return
    }

    preparePayment()

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [orderId, amount])

  const preparePayment = async () => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)
    onLoading(true)

    console.log("=== PREPARING BIZUM PAYMENT ===")
    console.log("Order ID:", orderId)
    console.log("Amount:", amount)

    try {
      const response = await fetch("/api/payment/bizum/prepare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          amount,
        }),
        signal: abortControllerRef.current.signal,
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Error en la respuesta`)
      }

      if (!data.success) {
        throw new Error(data.error || "Error al preparar el pago")
      }

      if (!data.formData || !data.formUrl) {
        throw new Error("Respuesta incompleta del servidor")
      }

      // Validar datos del formulario
      const { Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature } = data.formData

      if (!Ds_SignatureVersion || !Ds_MerchantParameters || !Ds_Signature) {
        console.error("Missing form data:", {
          Ds_SignatureVersion: !!Ds_SignatureVersion,
          Ds_MerchantParameters: !!Ds_MerchantParameters,
          Ds_Signature: !!Ds_Signature,
        })
        throw new Error("Datos del formulario incompletos")
      }

      console.log("=== FORM DATA RECEIVED ===")
      console.log("Signature Version:", Ds_SignatureVersion)
      console.log("Parameters length:", Ds_MerchantParameters.length)
      console.log("Signature length:", Ds_Signature.length)
      console.log("Form URL:", data.formUrl)

      setFormData(data.formData)
      setFormUrl(data.formUrl)
      setDebug(data.debug)

      console.log("=== BIZUM PAYMENT PREPARED SUCCESSFULLY ===")
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request was aborted")
        return
      }

      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      console.error("=== ERROR PREPARING BIZUM PAYMENT ===")
      console.error("Error:", errorMessage)
      console.error("Full error:", err)

      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
      onLoading(false)
    }
  }

  const submitForm = () => {
    console.log("=== SUBMITTING BIZUM FORM ===")

    if (!formRef.current) {
      console.error("Form reference not found")
      onError("Error: Formulario no encontrado")
      return
    }

    if (!formData || !formUrl) {
      console.error("Form data or URL missing:", {
        hasFormData: !!formData,
        hasFormUrl: !!formUrl,
      })
      onError("Error: Datos del formulario no disponibles")
      return
    }

    console.log("Submitting form to:", formUrl)
    console.log("Form data:", formData)

    try {
      formRef.current.submit()
      console.log("Form submitted successfully")
    } catch (err) {
      console.error("Error submitting form:", err)
      onError("Error al enviar el formulario")
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="text-center py-4">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">Preparando pago con Bizum...</p>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="text-center py-4">
        <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <Button onClick={preparePayment} variant="outline" size="sm">
          Reintentar
        </Button>
      </div>
    )
  }

  // Mostrar formulario listo
  if (formData && formUrl) {
    return (
      <div className="space-y-4">
        {/* Formulario oculto para Redsys */}
        <form ref={formRef} action={formUrl} method="POST" style={{ display: "none" }}>
          <input type="hidden" name="Ds_SignatureVersion" value={formData.Ds_SignatureVersion} />
          <input type="hidden" name="Ds_MerchantParameters" value={formData.Ds_MerchantParameters} />
          <input type="hidden" name="Ds_Signature" value={formData.Ds_Signature} />
          <button type="submit" id="bizum-submit-button" style={{ display: "none" }}>
            Submit
          </button>
        </form>

        {/* Información para el usuario */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center mr-3 flex-shrink-0">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Pago con Bizum preparado</h4>
              <p className="text-sm text-blue-700 mb-3">
                Haz clic en "Pagar con Bizum" para ser redirigido a la pasarela segura donde podrás completar tu pago
                desde tu móvil.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <div>• Importe: {amount.toFixed(2)}€</div>
                <div>• Pedido: {orderId}</div>
                <div>• Método: Bizum</div>
                <div>• Pago instantáneo desde tu móvil</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de debug (solo en desarrollo) */}
        {debug && process.env.NODE_ENV === "development" && (
          <details className="text-xs text-gray-500 border rounded p-2">
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(debug, null, 2)}</pre>
          </details>
        )}

        {/* Botón manual para enviar */}
        <Button
          onClick={submitForm}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          size="lg"
        >
          <Smartphone className="w-4 h-4 mr-2" />
          Pagar con Bizum
        </Button>
      </div>
    )
  }

  // Estado inicial
  return (
    <div className="text-center py-4">
      <p className="text-sm text-gray-600">Inicializando pago...</p>
    </div>
  )
}
