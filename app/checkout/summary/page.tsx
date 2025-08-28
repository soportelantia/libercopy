"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CreditCard, MapPin, Home, Phone, Tag, X, Check } from "lucide-react"
import { CheckoutSteps } from "@/components/checkout-steps"
import { calcularGastosEnvio } from "@/lib/location-service"
import { PayPalPayment } from "@/components/paypal-payment"
import { RedsysPayment } from "@/components/redsys-payment"
import { BizumPayment } from "@/components/bizum-payment"
import Footer from "@/components/footer"

interface DiscountCode {
  code: string
  percentage: number
  id: string
}

export default function CheckoutSummaryPage() {
  const router = useRouter()
  const { cart, getTotalPrice } = useCart()
  const { user, session } = useAuth()
  const [shippingData, setShippingData] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("paypal")
  const [loading, setLoading] = useState(true)
  const [showPayPal, setShowPayPal] = useState(false)
  const [showRedsys, setShowRedsys] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [redsysLoading, setRedsysLoading] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const orderCreationRef = useRef(false)
  const paymentComponentKey = useRef(0)
  const [showBizum, setShowBizum] = useState(false)

  // Estados para códigos de descuento
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState("")

  useEffect(() => {
    console.log("=== CHECKOUT SUMMARY PAGE INIT ===")
    console.log("User:", !!user)
    console.log("Session:", !!session)
    console.log("Cart items:", cart?.length || 0)

    if (!user) {
      sessionStorage.setItem("redirectUrl", "/checkout/summary")
      router.push("/auth")
      return
    }

    // Cargar método de pago seleccionado - priorizar sessionStorage
    const savedPayment = sessionStorage.getItem("selectedPaymentMethod")
    if (savedPayment) {
      setPaymentMethod(savedPayment)
      console.log("Payment method from sessionStorage:", savedPayment)
    }

    // Verificar que tenemos datos de envío
    const checkoutData = sessionStorage.getItem("checkoutData")
    if (checkoutData) {
      try {
        const data = JSON.parse(checkoutData)
        if (data.shipping) {
          setShippingData(data.shipping)
          console.log("Shipping data from checkoutData:", data.shipping.type)
        }
        if (data.payment?.method && !savedPayment) {
          setPaymentMethod(data.payment.method)
          console.log("Payment method from checkoutData:", data.payment.method)
        }
        // Cargar código de descuento aplicado si existe
        if (data.discount) {
          setAppliedDiscount(data.discount)
        }
      } catch (e) {
        console.error("Error parsing checkoutData:", e)
      }
    }

    // Si no hay datos en checkoutData, intentar con shippingSelection
    if (!shippingData) {
      const savedShipping = sessionStorage.getItem("shippingSelection")
      if (savedShipping) {
        try {
          const shipping = JSON.parse(savedShipping)
          setShippingData(shipping)
          console.log("Shipping data from shippingSelection:", shipping.type)
        } catch (e) {
          console.error("Error parsing shippingSelection:", e)
        }
      }
    }

    setLoading(false)
  }, [user, session, router])

  // Solo redirigir si no hay datos de envío después de cargar Y hay items en el carrito
  useEffect(() => {
    if (!loading && cart && cart.length > 0) {
      if (!shippingData) {
        console.log("No shipping data found, redirecting to shipping")
        router.push("/checkout/shipping")
      }
    } else if (!loading && (!cart || cart.length === 0)) {
      console.log("No cart items, redirecting to home")
      router.push("/")
    }
  }, [loading, shippingData, cart, router])

  // Función para validar código de descuento
  const validateDiscountCode = useCallback(async () => {
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
  }, [discountCode])

  // Función para remover código de descuento
  const removeDiscountCode = useCallback(() => {
    setAppliedDiscount(null)
    setDiscountCode("")
    setDiscountError("")

    // Remover de sessionStorage
    const checkoutData = JSON.parse(sessionStorage.getItem("checkoutData") || "{}")
    delete checkoutData.discount
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
  }, [])

  const createOrderDirectly = useCallback(async () => {
    // Evitar múltiples creaciones de pedido
    if (orderCreationRef.current || isCreatingOrder) {
      console.log("Order creation already in progress")
      return null
    }

    if (!user || !shippingData || !cart || cart.length === 0) {
      console.error("Missing user, shipping data, or cart items")
      return null
    }

    orderCreationRef.current = true
    setIsCreatingOrder(true)

    const subtotal = getTotalPrice() || 0
    const shippingCost = shippingData.type === "pickup" ? 0 : calcularGastosEnvio(subtotal)

    // Calcular descuento
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
    const total = subtotal + shippingCost - discountAmount

    try {
      console.log("=== CREATING ORDER ===")
      console.log("User ID:", user.id)
      console.log("Cart items:", cart?.length || 0)
      console.log("Shipping type:", shippingData.type)
      console.log("Subtotal:", subtotal)
      console.log("Discount amount:", discountAmount)
      console.log("Total amount:", total)

      // Crear el pedido principal
      const orderData = {
        user_id: user.id,
        status: "pending",
        subtotal: subtotal,
        shipping_cost: shippingCost,
        discount_code: appliedDiscount?.code || null,
        discount_percentage: appliedDiscount?.percentage || 0,
        discount_amount: discountAmount,
        total: total,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      console.log("Creating order with data:", orderData)

      const { data: order, error: orderError } = await supabase.from("orders").insert(orderData).select().single()

      if (orderError) {
        console.error("Order creation error:", orderError)
        throw new Error(`Error al crear el pedido: ${orderError.message}`)
      }

      console.log("Order created successfully:", order.id)

      // Si se aplicó un descuento, actualizar el contador de usos
      if (appliedDiscount) {
        const { error: updateError } = await supabase
          .from("discount_codes")
          .update({
            current_uses: supabase.raw("current_uses + 1"),
            updated_at: new Date().toISOString(),
          })
          .eq("id", appliedDiscount.id)

        if (updateError) {
          console.warn("Warning: Could not update discount code usage:", updateError.message)
        }
      }

      // Crear los items del pedido
      const orderItems = (cart || []).map((item, index) => {
        const itemData = {
          order_id: order.id,
          file_name: item.fileName || item.name || `archivo_${index}`,
          page_count: item.pageCount || 0,
          copies: item.options?.copies || item.quantity || 1,
          paper_size: item.options?.paperSize || "a4",
          print_type: item.options?.printType || "bw",
          paper_type: item.options?.paperType || "standard",
          finishing: item.options?.finishing || "none",
          price: item.price || 0,
          comments: item.comments || null,
          file_url: item.fileUrl || null,
          file_size: item.fileSize || 0,
          print_form: item.options?.printForm || "single_sided",
          orientation: item.options?.orientation || "portrait",
          pages_per_side: item.options?.pagesPerSide || 1,
          created_at: new Date().toISOString(),
        }
        return itemData
      })

      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

        if (itemsError) {
          console.error("Order items creation error:", itemsError)
          // Si falla la creación de items, eliminar el pedido
          await supabase.from("orders").delete().eq("id", order.id)
          throw new Error(`Error al crear los items del pedido: ${itemsError.message}`)
        }

        console.log("Order items created successfully")
      }

      // Crear la dirección de envío
      if (shippingData && (shippingData.address || shippingData.pickupPoint)) {
        let shippingAddress

        if (shippingData.type === "home" && shippingData.address) {
          shippingAddress = {
            order_id: order.id,
            recipient_name: shippingData.address.recipient_name || shippingData.address.name || "Cliente",
            address_line_1: shippingData.address.address_line || shippingData.address.address_line_1 || "",
            address_line: shippingData.address.address_line || shippingData.address.address_line_1 || "",
            postal_code: shippingData.address.postal_code || "",
            city:
              shippingData.address.municipality_name ||
              shippingData.address.municipality ||
              shippingData.address.city ||
              "Sevilla",
            municipality: shippingData.address.municipality_name || shippingData.address.municipality || "Sevilla",
            state: shippingData.address.province_name || shippingData.address.province || "Sevilla",
            province: shippingData.address.province_name || shippingData.address.province || "Sevilla",
            country: "España",
            phone: shippingData.address.phone || null,
            email: user.email || null,
            shipping_type: "delivery",
            created_at: new Date().toISOString(),
          }
        } else if (shippingData.type === "pickup" && shippingData.pickupPoint) {
          shippingAddress = {
            order_id: order.id,
            recipient_name: user.email || "Cliente",
            address_line_1: shippingData.pickupPoint.address || shippingData.pickupPoint.name || "Punto de recogida",
            address_line: shippingData.pickupPoint.address || shippingData.pickupPoint.name || "Punto de recogida",
            postal_code: "41001",
            city: "Sevilla",
            municipality: "Sevilla",
            state: "Sevilla",
            province: "Sevilla",
            country: "España",
            phone: shippingData.pickupPoint.phone || null,
            email: user.email || null,
            shipping_type: "pickup",
            created_at: new Date().toISOString(),
          }
        }

        if (shippingAddress) {
          const { error: shippingError } = await supabase.from("order_shipping_addresses").insert(shippingAddress)

          if (shippingError) {
            console.warn("Warning: Could not save shipping address:", shippingError.message)
          } else {
            console.log("Shipping address created successfully")
          }
        }
      }

      // Crear historial de estado
      const historyData = {
        order_id: order.id,
        status: "pending",
        created_at: new Date().toISOString(),
      }

      const { error: historyError } = await supabase.from("order_status_history").insert(historyData)

      if (historyError) {
        console.warn("Warning: Could not create order history:", historyError.message)
      } else {
        console.log("Order history created successfully")
      }

      console.log("=== ORDER CREATION COMPLETED ===")
      console.log("Order ID:", order.id)
      return order.id
    } catch (error) {
      console.error("=== ERROR IN ORDER CREATION ===")
      console.error("Error:", error)
      throw error
    } finally {
      setIsCreatingOrder(false)
      orderCreationRef.current = false
    }
  }, [user, shippingData, getTotalPrice, cart, paymentMethod, appliedDiscount])

  const handleContinue = useCallback(async () => {
    if (!shippingData) {
      alert("Por favor selecciona una dirección de envío")
      return
    }

    if (isCreatingOrder || orderCreationRef.current) {
      console.log("Order creation already in progress")
      return
    }

    const subtotal = getTotalPrice() || 0
    const shippingCost = shippingData.type === "pickup" ? 0 : calcularGastosEnvio(subtotal)
    const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
    const total = subtotal + shippingCost - discountAmount

    // Guardar datos completos para el checkout
    const checkoutData = {
      items: cart || [],
      subtotal,
      shippingCost,
      discountAmount,
      total,
      shipping: {
        ...shippingData,
        cost: shippingCost,
      },
      payment: {
        method: paymentMethod,
      },
      discount: appliedDiscount,
    }

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    sessionStorage.setItem("shippingSelection", JSON.stringify({ ...shippingData, cost: shippingCost }))
    sessionStorage.setItem("selectedPaymentMethod", paymentMethod)

    console.log("=== PROCESSING PAYMENT ===")
    console.log("Payment method:", paymentMethod)
    console.log("Total amount:", total)

    try {
      // Crear el pedido primero
      const newOrderId = await createOrderDirectly()
      if (!newOrderId) {
        throw new Error("No se pudo crear el pedido")
      }

      console.log("Order created with ID:", newOrderId)
      setOrderId(newOrderId)

      // Incrementar la key para forzar re-render del componente de pago
      paymentComponentKey.current += 1

      // Mostrar el componente de pago correspondiente
      if (paymentMethod === "paypal") {
        setShowPayPal(true)
        setShowRedsys(false)
        setShowBizum(false)
      } else if (paymentMethod === "bizum") {
        setShowBizum(true)
        setShowPayPal(false)
        setShowRedsys(false)
      } else if (paymentMethod === "redsys" || paymentMethod === "tarjeta" || paymentMethod === "card") {
        setShowRedsys(true)
        setShowPayPal(false)
        setShowBizum(false)
      }
    } catch (error) {
      console.error("=== ERROR PROCESSING PAYMENT ===")
      console.error("Error:", error)
      alert("Error al crear el pedido. Por favor, inténtalo de nuevo.")
    }
  }, [shippingData, getTotalPrice, cart, paymentMethod, createOrderDirectly, isCreatingOrder, appliedDiscount])

  const handleBack = useCallback(() => {
    router.push("/checkout/payment")
  }, [router])

  const handleRedsysError = useCallback((error: string) => {
    console.error("=== REDSYS ERROR ===")
    console.error("Error:", error)
    alert(`Error al preparar el pago: ${error}`)
    setShowRedsys(false)
    setShowBizum(false)
    setOrderId(null)
    orderCreationRef.current = false
  }, [])

  // Función para obtener el nombre del papel
  const getPaperTypeName = (paperType: string) => {
    switch (paperType) {
      case "standard":
      case "normal":
        return "Papel estándar (80g)"
      case "premium":
        return "Papel premium (120g)"
      case "recycled":
        return "Papel reciclado (80g)"
      default:
        return paperType || "Papel estándar (80g)"
    }
  }

  const getFinishingName = (finishing: string) => {
    switch (finishing) {
      case "none":
      case "sin_acabado":
        return "Sin acabado"
      case "stapled":
      case "grapado":
        return "Grapado"
      case "twoHoles":
        return "Dos taladros"
      case "fourHoles":
        return "Cuatro taladros"
      case "laminated":
        return "Plastificado"
      case "bound":
        return "Encuadernado"
      case "spiral":
      case "espiral":
        return "Espiral"
      case "thermal":
      case "termica":
        return "Encuadernación térmica"
      case "wire":
      case "wire-o":
        return "Wire-O"
      default:
        return finishing || "Sin acabado"
    }
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

  if (!shippingData && cart && cart.length > 0) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Redirigiendo a selección de envío...</p>
          </div>
        </div>
      </main>
    )
  }

  // Verificar que el carrito no esté vacío
  if (!cart || cart.length === 0) {
    return (
      <main className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p>Tu carrito está vacío. Redirigiendo...</p>
            <script>{typeof window !== "undefined" && setTimeout(() => router.push("/"), 2000)}</script>
          </div>
        </div>
      </main>
    )
  }

  const subtotal = getTotalPrice() || 0
  const shippingCost = shippingData.type === "pickup" ? 0 : calcularGastosEnvio(subtotal)
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
  const subtotalWithoutIVA = subtotal / 1.21
  const iva = subtotal - subtotalWithoutIVA
  const total = subtotal + shippingCost - discountAmount

  return (
    <div className="flex min-h-screen flex-col bg-white w-full overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="w-full">
          <CheckoutSteps currentStep={3} />
        </div>

        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="text-[#2E5FEB] hover:text-[#2E5FEB]/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al paso anterior
          </Button>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#2E5FEB] mb-8 text-center">Paso 3: Confirma tu pedido</h1>

        <div className="w-full space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Artículos del pedido */}
          <div className="w-full lg:col-span-2 space-y-6 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-3 lg:scrollbar-thin lg:scrollbar-thumb-gray-400 lg:scrollbar-track-gray-100 lg:hover:scrollbar-thumb-gray-500">
            <Card className="w-full">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Artículos en tu pedido</h3>

                <div className="space-y-6 ">
                  {(cart || []).map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                            {item.fileName || item.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.pageCount || 0} páginas • {item.options?.copies || item.quantity || 1}{" "}
                            {(item.options?.copies || item.quantity || 1) === 1 ? "copia" : "copias"}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-lg font-bold text-[#f47d30]">{(item.price || 0).toFixed(2)}€</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Tamaño: </span>
                            <span className="text-gray-600">{item.options?.paperSize?.toUpperCase() || "A4"}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Tipo: </span>
                            <span className="text-gray-600">
                              {item.options?.printType === "bw" ? "Blanco y Negro" : "Color"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Papel: </span>
                            <span className="text-gray-600">{getPaperTypeName(item.options?.paperType)}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-gray-700">Acabado: </span>
                            <span className="text-gray-600">{getFinishingName(item.options?.finishing)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Impresión: </span>
                            <span className="text-gray-600">
                              {item.options?.printForm === "oneSided" || item.options?.printForm === "single_sided"
                                ? "Una cara"
                                : "Doble cara"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Orientación: </span>
                            <span className="text-gray-600">
                              {item.options?.orientation === "landscape" ? "Horizontal" : "Vertical"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.comments && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-700">Comentarios: </span>
                          <p className="text-gray-600 mt-1 break-words">{item.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Código de descuento */}
            <Card className="w-full">
              <CardContent className="p-4 sm:p-6">
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
                      disabled={isCreatingOrder}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="text"
                        placeholder="Introduce tu código de descuento"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={discountLoading || isCreatingOrder}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            validateDiscountCode()
                          }
                        }}
                      />
                      <Button
                        onClick={validateDiscountCode}
                        disabled={discountLoading || !discountCode.trim() || isCreatingOrder}
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

            {/* Método de pago seleccionado */}
            <Card className="w-full">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Método de pago seleccionado
                </h3>

                <div className="flex flex-col space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    {paymentMethod === "paypal" ? (
                      <>
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white text-xs font-bold">PP</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-600">Pago seguro con tu cuenta PayPal</p>
                        </div>
                      </>
                    ) : paymentMethod === "bizum" ? (
                      <>
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white text-xs font-bold">BZ</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Bizum</p>
                          <p className="text-sm text-gray-600">Pago instantáneo con tu móvil</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-3 h-6 w-6 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">Tarjeta de crédito/débito</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/checkout/payment")}
                    className="text-[#2E5FEB] border-[#2E5FEB] hover:bg-[#2E5FEB] hover:text-white w-full sm:w-auto sm:self-end"
                    disabled={isCreatingOrder}
                  >
                    Cambiar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Información de envío */}
            <Card className="w-full">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4 flex items-center">
                  {shippingData.type === "pickup" ? (
                    <MapPin className="mr-2 h-5 w-5" />
                  ) : (
                    <Home className="mr-2 h-5 w-5" />
                  )}
                  Envío seleccionado
                </h3>

                <div className="flex flex-col space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div className="min-w-0 flex-1">
                    {shippingData.type === "pickup" ? (
                      <div className="text-sm space-y-2">
                        <div className="font-medium text-gray-900">
                          {shippingData.pickupPoint?.name || "Punto de recogida"}
                        </div>
                        <div className="text-gray-600">Recogida en tienda - Gratis</div>
                        {shippingData.pickupPoint?.address && (
                          <div className="flex items-start">
                            <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-600 break-words">{shippingData.pickupPoint.address}</span>
                          </div>
                        )}
                        {shippingData.pickupPoint?.phone && (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-600">{shippingData.pickupPoint.phone}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm space-y-2">
                        <div className="font-medium text-gray-900">
                          {shippingData.address?.name ||
                            shippingData.address?.recipient_name ||
                            "Dirección seleccionada"}
                        </div>
                        <div className="text-gray-600">
                          Envío a domicilio - {shippingCost === 0 ? "Gratis" : `${shippingCost.toFixed(2)}€`}
                        </div>
                        <div className="flex items-start">
                          <Home className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500" />
                          <div className="text-gray-600 min-w-0 flex-1">
                            <div className="break-words">{shippingData.address?.address_line}</div>
                            <div>
                              {shippingData.address?.postal_code}{" "}
                              {shippingData.address?.municipality_name || shippingData.address?.municipality}
                            </div>
                          </div>
                        </div>
                        {shippingData.address?.phone && (
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-gray-600">{shippingData.address.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/checkout/shipping")}
                    className="text-[#2E5FEB] border-[#2E5FEB] hover:bg-[#2E5FEB] hover:text-white w-full sm:w-auto sm:self-end"
                    disabled={isCreatingOrder}
                  >
                    Cambiar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="w-full lg:col-span-1">
            <Card className="w-full lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-hidden">
              <CardContent className="p-4 sm:p-6 lg:overflow-y-auto lg:max-h-full">
                <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Resumen del pedido</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal (sin IVA):</span>
                    <span>{subtotalWithoutIVA.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (21%):</span>
                    <span>{iva.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gastos de envío (IVA incl.):</span>
                    <span>{shippingCost === 0 ? "Gratis" : `${shippingCost.toFixed(2)}€`}</span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento ({appliedDiscount.percentage}%):</span>
                      <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-[#f47d30]">{total.toFixed(2)}€</span>
                    </div>
                    {appliedDiscount && (
                      <p className="text-sm text-green-600 mt-1">¡Has ahorrado {discountAmount.toFixed(2)}€!</p>
                    )}
                  </div>
                </div>

                {!showPayPal && !showRedsys && !showBizum && (
                  <Button
                    className="w-full mt-6 bg-[#2E5FEB] hover:bg-[#6d1a26]"
                    onClick={handleContinue}
                    disabled={redsysLoading || isCreatingOrder}
                  >
                    {isCreatingOrder
                      ? "Creando pedido..."
                      : redsysLoading
                        ? "Preparando..."
                        : paymentMethod === "paypal"
                          ? "Pagar con PayPal"
                          : paymentMethod === "bizum"
                            ? "Pagar con Bizum"
                            : "Pagar con tarjeta"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Componente PayPal */}
            {showPayPal && paymentMethod === "paypal" && orderId && (
              <Card key={`paypal-${paymentComponentKey.current}`} className="w-full mt-6">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Procesar pago con PayPal</h3>
                  <PayPalPayment
                    orderId={orderId}
                    amount={total}
                    onSuccess={() => {
                      console.log("PayPal payment successful")
                      router.push("/payment/success")
                    }}
                    onError={(error) => {
                      console.error("PayPal payment error:", error)
                      alert("Error al procesar el pago con PayPal")
                      setShowPayPal(false)
                      setOrderId(null)
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPayPal(false)
                      setOrderId(null)
                    }}
                    className="mt-4 w-full"
                  >
                    Cancelar pago
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Componente Redsys */}
            {showRedsys &&
              (paymentMethod === "redsys" || paymentMethod === "tarjeta" || paymentMethod === "card") &&
              orderId && (
                <Card key={`redsys-${paymentComponentKey.current}`} className="w-full mt-6">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Procesar pago con tarjeta</h3>
                    <RedsysPayment
                      orderId={orderId}
                      amount={total}
                      onError={handleRedsysError}
                      onLoading={setRedsysLoading}
                    />
                  </CardContent>
                </Card>
              )}

            {/* Componente Bizum */}
            {showBizum && paymentMethod === "bizum" && orderId && (
              <Card key={`bizum-${paymentComponentKey.current}`} className="w-full mt-6">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-[#2E5FEB] mb-4">Procesar pago con Bizum</h3>
                  <BizumPayment
                    orderId={orderId}
                    amount={total}
                    onError={(error) => {
                      console.error("Bizum payment error:", error)
                      alert("Error al procesar el pago con Bizum")
                      setShowBizum(false)
                      setOrderId(null)
                    }}
                    onLoading={setRedsysLoading}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  )
}
