"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { AlertCircle, ArrowLeft, FileText, Truck, MapPin, Phone, User, Download, Clock, Mail, Building } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Footer from "@/components/footer"
type OrderItem = {
  id: string
  file_name: string
  file_size: number
  file_url: string | null
  page_count: number
  paper_size: string
  paper_type: string
  print_type: string
  print_form: string
  orientation: string
  pages_per_side: string
  finishing: string
  copies: number
  comments: string
  price: number
  created_at: string
}

type OrderStatusHistory = {
  id: string
  order_id: string
  status: string
  comment: string | null
  created_at: string
  created_by: string | null
}

type OrderShippingAddress = {
  id: string
  order_id: string
  recipient_name: string
  company: string | null
  address_line_1: string
  address_line_2: string | null
  city: string
  province: string
  postal_code: string
  country: string
  phone: string | null
  email: string | null
  delivery_notes: string | null
  created_at: string
}

type Order = {
  id: string
  user_id: string
  total_amount: number | null
  status: string
  created_at: string
  updated_at: string
  shipping_cost: number | null
  shipping_company: string | null
  tracking_number: string | null
  shipping_notes: string | null
  estimated_delivery_date: string | null
  tracking_url: string | null
  payment_method?: string | null
  items: OrderItem[]
  status_history: OrderStatusHistory[]
  shipping_address: OrderShippingAddress | null
}

export default function OrderDetailsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([])
  const [isCancelling, setIsCancelling] = useState(false)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
      return
    }

    if (user && orderId) {
      fetchOrderDetails()
    }
  }, [user, authLoading, orderId])

  const fetchOrderDetails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Obtener los detalles del pedido
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("user_id", user?.id)
        .single()

      if (orderError) throw orderError

      console.log("Order data:", orderData)

      // Obtener la dirección de envío estática del pedido
      const { data: shippingAddressData, error: shippingError } = await supabase
        .from("order_shipping_addresses")
        .select("*")
        .eq("order_id", orderId)
        .single()

      if (shippingError && shippingError.code !== "PGRST116") {
        // PGRST116 es "no rows returned", que es aceptable
        console.warn("Error loading shipping address:", shippingError)
      }

      console.log("Shipping address data:", shippingAddressData)

      // Obtener los elementos del pedido
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true })

      if (itemsError) throw itemsError

      console.log("Items data:", itemsData)

      // Obtener el historial de estados con mejor manejo de errores
      try {
        const { data: historyData, error: historyError } = await supabase
          .from("order_status_history")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false })

        if (historyError) {
          console.warn("Error loading order status history:", historyError)
          // Si hay error, crear un historial básico con el estado actual del pedido
          setStatusHistory([
            {
              id: `default-${orderId}`,
              order_id: orderId,
              status: orderData.status,
              comment: "Estado actual del pedido",
              created_at: orderData.created_at,
              created_by: orderData.user_id
            }
          ])
        } else {
          console.log("Status history data:", historyData)
          setStatusHistory(historyData || [])
        }
      } catch (historyError) {
        console.error("Error fetching status history:", historyError)
        // Crear historial básico en caso de error
        setStatusHistory([
          {
            id: `default-${orderId}`,
            order_id: orderId,
            status: orderData.status,
            comment: "Estado actual del pedido",
            created_at: orderData.created_at,
            created_by: orderData.user_id
          }
        ])
      }

      setOrder({
        ...orderData,
        items: itemsData || [],
        shipping_address: shippingAddressData || null,
      })
    } catch (error: any) {
      console.error("Error fetching order details:", error)
      setError(error.message || "Error al cargar los detalles del pedido")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para calcular el total del pedido
  const calculateOrderTotal = (order: Order) => {
    if (order.total_amount && order.total_amount > 0) {
      return order.total_amount
    }

    // Calcular desde los items si no hay total_amount
    const itemsTotal = order.items.reduce((sum, item) => {
      const price = item.price || 0
      const copies = item.copies || 1
      return sum + price * copies
    }, 0)

    // Incluir gastos de envío en el cálculo
    const shippingCost = order.shipping_cost || 0
    return itemsTotal + shippingCost
  }

  const handleCancelOrder = async () => {
    if (!order) return

    setIsCancelling(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", order.id)
        .eq("user_id", user?.id)

      if (error) throw error

      // Registrar el cambio de estado en el historial
      await supabase.from("order_status_history").insert({
        order_id: order.id,
        status: "cancelled",
        comment: "Pedido cancelado por el usuario",
        created_by: user?.id,
      })

      toast({
        title: "Pedido cancelado",
        description: "Tu pedido ha sido cancelado correctamente.",
      })

      // Actualizar el estado local
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null))

      // Recargar el historial
      fetchOrderDetails()
    } catch (error: any) {
      console.error("Error cancelling order:", error)
      setError(error.message || "Error al cancelar el pedido")
    } finally {
      setIsCancelling(false)
    }
  }

  const handlePayOrder = () => {
    router.push(`/checkout/payment/${orderId}`)
  }

  const handleDownloadFile = async (itemId: string, fileName: string) => {
    // Evitar descargas múltiples del mismo archivo
    if (downloadingFiles.has(itemId)) {
      return
    }

    setDownloadingFiles((prev) => new Set(prev).add(itemId))

    try {
      console.log("Iniciando descarga para:", { orderId, itemId, fileName })

      const res = await fetch("/api/admin/download-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, itemId }),
      })

      console.log("Respuesta del servidor:", res.status, res.statusText)

      if (!res.ok) {
        const errorData = await res.json()
        console.error("Error del servidor:", errorData)
        throw new Error(errorData.error || `Error del servidor: ${res.status}`)
      }

      const data = await res.json()
      console.log("Datos recibidos:", data)

      if (!data.url) {
        console.error("Respuesta sin URL:", data)
        throw new Error("URL de descarga no recibida del servidor")
      }

      // Crear enlace de descarga
      const a = document.createElement("a")
      a.href = data.url
      a.download = fileName
      a.target = "_blank"
      a.rel = "noopener noreferrer"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast({
        title: "Descarga iniciada",
        description: `Descargando ${fileName}...`,
      })
    } catch (error) {
      console.error("Error al descargar:", error)
      toast({
        title: "Error en la descarga",
        description: error instanceof Error ? error.message : "No se pudo iniciar la descarga",
        variant: "destructive",
      })
    } finally {
      setDownloadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  // Función para obtener el nombre legible de las opciones
  const getReadableOption = (key: string, value: string) => {
    const options: Record<string, Record<string, string>> = {
      paper_size: { a4: "A4", a3: "A3" },
      paper_type: { normal: "Normal", cardstock: "Cartulina", photo: "Fotográfico" },
      print_type: { bw: "Blanco y negro", color: "Color", colorPro: "Color PRO" },
      print_form: { oneSided: "Una cara", doubleSided: "Doble cara" },
      pages_per_side: { one: "Una página por cara", multiple: "Múltiples páginas por cara" },
      finishing: {
        none: "Sin acabado",
        stapled: "Grapado",
        twoHoles: "Dos taladros",
        laminated: "Plastificado",
        bound: "Encuadernado",
        fourHoles: "Cuatro taladros",
      },
    }

    return options[key]?.[value] || value
  }

  // Función para obtener el texto y color del estado
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "Pendiente de pago", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      case "processing":
        return { text: "En procesamiento", color: "bg-blue-100 text-blue-800 border-blue-200" }
      case "completed":
        return { text: "Pagado", color: "bg-green-100 text-green-800 border-green-200" }
      case "shipped":
        return { text: "Enviado", color: "bg-purple-100 text-purple-800 border-purple-200" }
      case "cancelled":
        return { text: "Cancelado", color: "bg-red-100 text-red-800 border-red-200" }
      case "payment_failed":
        return { text: "Pago fallido", color: "bg-red-100 text-red-800 border-red-200" }
      default:
        return { text: status, color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  // Función para obtener el nombre del método de pago
  const getPaymentMethodName = (method: string | null | undefined) => {
    if (!method) return "No especificado"

    switch (method.toLowerCase()) {
      case "paypal":
        return "PayPal"
      case "tarjeta":
      case "card":
        return "Tarjeta de crédito"
      case "bizum":
        return "Bizum"
      default:
        return method
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Función para renderizar la dirección de envío estática
  const renderShippingAddress = (address: OrderShippingAddress) => {
    if (!address) return null

    return (
      <div className="space-y-3">
        {/* Nombre del destinatario */}
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
          <span className="font-medium text-gray-800">{address.recipient_name}</span>
        </div>

        {/* Empresa (si existe) */}
        {address.company && (
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{address.company}</span>
          </div>
        )}

        {/* Dirección completa */}
        <div className="flex items-start">
          <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="text-gray-700">{address.address_line_1}</div>
            {address.address_line_2 && <div className="text-gray-600 text-sm">{address.address_line_2}</div>}
            <div className="text-gray-700">
              <span className="font-mono font-medium">{address.postal_code}</span> {address.city}
            </div>
            <div className="text-gray-600">{address.province}</div>
            <div className="text-gray-600">{address.country}</div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 pt-2 border-t border-gray-100">
          {address.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700">{address.phone}</span>
            </div>
          )}
          {address.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 break-all">{address.email}</span>
            </div>
          )}
        </div>

        {/* Notas de entrega */}
        {address.delivery_notes && (
          <div className="pt-3 border-t border-gray-100">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Notas de entrega:</span>
              </p>
              <p className="text-sm text-gray-700 mt-1">{address.delivery_notes}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading || authLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center" style={{ marginTop: "80px" }}>
          <div className="animate-pulse text-gray-600">Cargando...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
          <Link href="/account/orders" className="flex items-center text-blue-600 hover:text-purple-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis pedidos
          </Link>

          <Alert variant="destructive" className="max-w-4xl mx-auto border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
          <Link href="/account/orders" className="flex items-center text-blue-600 hover:text-purple-600 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a mis pedidos
          </Link>

          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Pedido no encontrado</h2>
            <p className="text-gray-500">No se encontró el pedido solicitado.</p>
          </div>
        </div>
      </main>
    )
  }

  const statusInfo = getStatusInfo(order.status)
  const orderTotal = calculateOrderTotal(order)
  const shippingCost = order.shipping_cost || 0
  const subtotal = orderTotal - shippingCost
  const taxAmount = subtotal * 0.21

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
        <Link href="/account/orders" className="flex items-center text-blue-600 hover:text-purple-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a mis pedidos
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Detalles del pedido
              </h1>
              <p className="text-gray-600">
                Pedido #{order.id.substring(0, 8)} • {new Date(order.created_at).toLocaleDateString("es-ES")}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                {statusInfo.text}
              </span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {/* Primera fila: Estado del pedido y Resumen del pago */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
                <div className="flex items-center mb-4">
                  <Truck className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">Estado del pedido</h2>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Estado actual:</span> {statusInfo.text}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Fecha del pedido:</span>{" "}
                  {new Date(order.created_at).toLocaleDateString("es-ES")}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Método de pago:</span> {getPaymentMethodName(order.payment_method)}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="font-semibold text-gray-800">Resumen del pago</h2>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Subtotal:</span> {subtotal.toFixed(2)}€
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Gastos de envío:</span>{" "}
                  {shippingCost > 0 ? `${shippingCost.toFixed(2)}€` : "Gratis"}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">IVA (21%):</span> {taxAmount.toFixed(2)}€
                </p>
                <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <span className="font-medium">Total:</span> {orderTotal.toFixed(2)}€
                </p>
              </div>
            </div>

            {/* Segunda fila: Dirección de envío (ancho completo) */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="font-semibold text-lg text-gray-800">Dirección de envío</h2>
              </div>
              <div className="max-w-none">
                {order.shipping_address ? (
                  renderShippingAddress(order.shipping_address)
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-2">No hay información de envío disponible</p>
                    <p className="text-xs text-gray-400">
                      La dirección de envío se guardará cuando se complete el pedido
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(order.tracking_number || order.shipping_company || order.shipping_notes || order.tracking_url) && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 mb-6">
              <div className="flex items-center mb-4">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="font-semibold text-gray-800">Detalles del envío</h2>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                {order.shipping_company && (
                  <p>
                    <span className="font-medium">Empresa de mensajería:</span> {order.shipping_company}
                  </p>
                )}
                {order.tracking_number && (
                  <p>
                    <span className="font-medium">Número de seguimiento:</span>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded ml-2">{order.tracking_number}</span>
                  </p>
                )}
                {order.tracking_url && (
                  <p>
                    <span className="font-medium">Seguimiento:</span>
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-purple-600 underline ml-2"
                    >
                      Rastrear envío
                    </a>
                  </p>
                )}
                {order.estimated_delivery_date && (
                  <p>
                    <span className="font-medium">Fecha estimada de entrega:</span>{" "}
                    {new Date(order.estimated_delivery_date).toLocaleDateString("es-ES")}
                  </p>
                )}
                {order.shipping_notes && (
                  <p>
                    <span className="font-medium">Notas del envío:</span> {order.shipping_notes}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Elementos del pedido
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-xl mr-3">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-800">{item.file_name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{formatFileSize(item.file_size || 0)}</span>
                          {item.file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadFile(item.id, item.file_name)}
                              disabled={downloadingFiles.has(item.id)}
                              className="text-xs rounded-xl hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              {downloadingFiles.has(item.id) ? "Descargando..." : "Descargar"}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-600 mt-1">
                        <p>
                          <span className="font-medium">Páginas:</span> {item.page_count || 0}
                        </p>
                        <p>
                          <span className="font-medium">Copias:</span> {item.copies || 1}
                        </p>
                        <p>
                          <span className="font-medium">Tamaño:</span>{" "}
                          {getReadableOption("paper_size", item.paper_size)}
                        </p>
                        <p>
                          <span className="font-medium">Papel:</span> {getReadableOption("paper_type", item.paper_type)}
                        </p>
                        <p>
                          <span className="font-medium">Impresión:</span>{" "}
                          {getReadableOption("print_type", item.print_type)}
                        </p>
                        <p>
                          <span className="font-medium">Caras:</span> {getReadableOption("print_form", item.print_form)}
                        </p>
                        <p>
                          <span className="font-medium">Orientación:</span> {item.orientation}
                        </p>
                        <p>
                          <span className="font-medium">Páginas por cara:</span>{" "}
                          {getReadableOption("pages_per_side", item.pages_per_side)}
                        </p>
                        <p>
                          <span className="font-medium">Acabado:</span> {getReadableOption("finishing", item.finishing)}
                        </p>
                      </div>
                      {item.comments && (
                        <p className="text-xs text-gray-600 mt-2">
                          <span className="font-medium">Comentarios:</span> {item.comments}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {((item.price || 0) * (item.copies || 1)).toFixed(2)}€
                      </p>
                      <p className="text-xs text-gray-500">
                        {(item.price || 0).toFixed(2)}€ x {item.copies || 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg text-gray-800">Total</span>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {orderTotal.toFixed(2)}€
                </span>
              </div>
            </div>
          </div>

          {/* Historial de estados */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200/50 mb-6">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Historial del pedido
              </h2>
            </div>

            {statusHistory.length > 0 ? (
              <div className="space-y-4">
                {statusHistory.map((history, index) => {
                  const statusInfo = getStatusInfo(history.status)
                  return (
                    <div key={history.id} className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0 ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-300"
                          }`}
                        />
                        {index < statusHistory.length - 1 && <div className="w-px h-8 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(history.created_at).toLocaleString("es-ES")}
                          </span>
                        </div>
                        {history.comment && <p className="text-sm text-gray-600">{history.comment}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No hay historial de estados disponible</p>
              </div>
            )}
          </div>

          {order.status === "pending" && (
            <div className="flex flex-col md:flex-row gap-4 justify-end">
              <Button
                variant="outline"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="rounded-xl hover:bg-red-50 hover:border-red-300 hover:text-red-600 bg-transparent"
              >
                {isCancelling ? "Cancelando..." : "Cancelar pedido"}
              </Button>
              <Button
                onClick={handlePayOrder}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Pagar ahora
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <Toaster />
    </main>
  )
}
