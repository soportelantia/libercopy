"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import { AlertCircle, ArrowLeft, Package, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Footer from "@/components/footer"

type Order = {
  id: string
  created_at: string
  total_amount: number | null
  status: string
  items: {
    id: string
    file_name: string
    copies: number | null
    price: number | null
  }[]
  shipping_cost: number | null
  discount_code: string | null
  discount_percentage: number | null
  discount_amount: number | null
}

const ORDERS_PER_PAGE = 10

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true)

        // Primero obtenemos el total de pedidos para la paginación
        const { count, error: countError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if (countError) throw countError

        setTotalOrders(count || 0)
        setTotalPages(Math.ceil((count || 0) / ORDERS_PER_PAGE))

        // Luego obtenemos los pedidos de la página actual
        const from = (currentPage - 1) * ORDERS_PER_PAGE
        const to = from + ORDERS_PER_PAGE - 1

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .range(from, to)

        if (ordersError) throw ordersError

        // Para cada pedido, obtenemos sus elementos
        const ordersWithItems = await Promise.all(
          (ordersData || []).map(async (order) => {
            const { data: itemsData, error: itemsError } = await supabase
              .from("order_items")
              .select("*")
              .eq("order_id", order.id)

            if (itemsError) throw itemsError

            return {
              ...order,
              items: itemsData || [],
            }
          }),
        )

        setOrders(ordersWithItems)
      } catch (error: any) {
        console.error("Error fetching orders:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, router, currentPage, supabase])

  // Función para calcular el total de un pedido si no está disponible
  const calculateOrderTotal = (order: Order) => {
    // Si hay total_amount, usarlo (ya debería incluir gastos de envío)
    if (order.total_amount && order.total_amount > 0) {
      return order.total_amount
    }

    // Calcular desde los items si no hay total_amount
    const itemsTotal = order.items.reduce((sum, item) => {
      const price = item.price || 0
      const copies = item.copies || 1
      return sum + price * copies
    }, 0)

    // Agregar gastos de envío si existen
    const shippingCost = order.shipping_cost || 0

    return itemsTotal + shippingCost
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

  // Función para truncar nombres de archivo
  const truncateFileName = (fileName: string, maxLength = 40) => {
    if (!fileName) return "Archivo sin nombre"
    if (fileName.length <= maxLength) return fileName

    const extension = fileName.split(".").pop()
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."))

    if (extension && nameWithoutExtension) {
      const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 4) + "..."
      return `${truncatedName}.${extension}`
    }

    return fileName.substring(0, maxLength - 3) + "..."
  }

  // Función para calcular el subtotal antes del descuento
  const calculateSubtotal = (order: Order) => {
    const itemsTotal = order.items.reduce((sum, item) => {
      const price = item.price || 0
      const copies = item.copies || 1
      return sum + price * copies
    }, 0)
    return itemsTotal
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    // Calcular el rango de páginas a mostrar
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Ajustar el inicio si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Botón anterior
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2 rounded-xl"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>,
    )

    // Primera página si no está visible
    if (startPage > 1) {
      buttons.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(1)}
          className="mr-1 rounded-xl"
        >
          1
        </Button>,
      )
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>,
        )
      }
    }

    // Páginas visibles
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="mr-1 rounded-xl"
        >
          {i}
        </Button>,
      )
    }

    // Última página si no está visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>,
        )
      }
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          className="mr-1 rounded-xl"
        >
          {totalPages}
        </Button>,
      )
    }

    // Botón siguiente
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-1 rounded-xl"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>,
    )

    return buttons
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center" style={{ marginTop: "80px" }}>
          <div className="animate-pulse text-gray-600">Cargando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/account" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mis pedidos
            </h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Historial de pedidos
              </h2>
              {totalOrders > 0 && (
                <p className="text-sm text-gray-600">
                  Mostrando {(currentPage - 1) * ORDERS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ORDERS_PER_PAGE, totalOrders)} de {totalOrders} pedidos
                </p>
              )}
            </div>

            {orders.length === 0 && totalOrders === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-700 mb-3">No tienes pedidos</h3>
                <p className="text-gray-500 mb-6">Aún no has realizado ningún pedido.</p>
                <Link href="/imprimir">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Realizar un pedido
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderTotal = calculateOrderTotal(order)
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white/50"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 break-words">
                              Pedido #{order.id.substring(0, 8)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(order.created_at).toLocaleDateString("es-ES")}
                            </p>
                            {order.discount_code && (
                              <p className="text-sm text-green-600 mt-1 font-medium">
                                Descuento aplicado: {order.discount_code} (-{order.discount_amount?.toFixed(2)}€)
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col sm:items-end space-y-2">
                            <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {orderTotal.toFixed(2)}€
                            </p>
                            <span className={`text-xs px-3 py-1 rounded-full border ${statusInfo.color} inline-block`}>
                              {statusInfo.text}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-4">
                          <p className="text-sm font-medium mb-2 text-gray-700">Elementos:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {(order.items || []).slice(0, 2).map((item) => (
                              <li
                                key={item.id}
                                className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0"
                              >
                                <span className="break-words min-w-0 flex-1">
                                  {truncateFileName(item.file_name)} (x{item.copies || 1})
                                </span>
                                <span className="font-medium text-right sm:ml-4 flex-shrink-0">
                                  {((item.price || 0) * (item.copies || 1)).toFixed(2)}€
                                </span>
                              </li>
                            ))}
                            {(order.items || []).length > 2 && (
                              <li className="text-xs text-gray-500 mt-2">
                                Y {(order.items || []).length - 2} elemento(s) más...
                              </li>
                            )}
                          </ul>
                          {order.discount_code && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
                              <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>{calculateSubtotal(order).toFixed(2)}€</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>Descuento ({order.discount_code}):</span>
                                <span>-{order.discount_amount?.toFixed(2)}€</span>
                              </div>
                              {(order.shipping_cost || 0) > 0 && (
                                <div className="flex justify-between text-gray-600">
                                  <span>Envío:</span>
                                  <span>{order.shipping_cost?.toFixed(2)}€</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Link href={`/account/orders/${order.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                            >
                              Ver detalles <ExternalLink className="h-3 w-3 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">{renderPaginationButtons()}</div>
                )}

                {/* Información de paginación */}
                {totalPages > 1 && (
                  <div className="mt-4 text-center text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <Toaster />
    </main>
  )
}
