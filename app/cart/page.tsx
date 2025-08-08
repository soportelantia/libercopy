"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, FileText, ShoppingBag, ArrowRight, Edit, Plus, Minus } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const totalPrice = getTotalPrice()

  const handleCheckout = () => {
    router.push("/shipping")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
      <Navbar />

      <div className="w-full px-4 py-12 overflow-x-hidden" style={{marginTop: '40px'}}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-4xl font-bold gradient-text mb-4">Tu carrito de compra</h1>
            <p className="text-gray-600 text-sm sm:text-base">Revisa tus documentos antes de proceder al pago</p>
          </div>

          {cart.length === 0 ? (
            <Card className="border-0 shadow-2xl w-full">
              <CardContent className="p-8 sm:p-16 text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
                  Añade documentos para imprimir desde nuestra página principal y aparecerán aquí.
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold w-full sm:w-auto">
                    Comenzar a imprimir
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="w-full space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8 overflow-x-hidden">
              <div className="w-full lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-xl w-full">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Documentos ({cart.length})</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs sm:text-sm w-fit">
                        {cart.length} {cart.length === 1 ? "artículo" : "artículos"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      {cart.map((item) => (
                        <CartItemCard
                          key={item.id}
                          item={item}
                          onRemove={() => removeFromCart(item.id)}
                          onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full space-y-6">
                <Card className="lg:sticky lg:top-24 border-0 shadow-xl w-full">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Resumen del pedido</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4 mb-6">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Subtotal (sin IVA):</span>
                        <span className="font-medium">{(totalPrice / 1.21).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">IVA (21%):</span>
                        <span className="font-medium">{(totalPrice - totalPrice / 1.21).toFixed(2)}€</span>
                      </div>
                      <div className="border-t pt-3 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-base sm:text-lg font-bold">Total:</span>
                          <span className="text-xl sm:text-2xl font-bold text-blue-600">{totalPrice.toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl text-sm sm:text-base"
                        size="lg"
                        onClick={handleCheckout}
                      >
                        Proceder al pago
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl bg-transparent text-sm sm:text-base"
                        size="lg"
                        onClick={clearCart}
                      >
                        Vaciar carrito
                      </Button>
                    </div>

                    <div className="mt-6 p-3 sm:p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center space-x-2 text-blue-700 text-xs sm:text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="font-medium">Envío gratuito en pedidos superiores a 25€</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

type CartItemCardProps = {
  item: any
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

function CartItemCard({ item, onRemove, onUpdateQuantity }: CartItemCardProps) {
  const [quantity, setQuantity] = useState(item.options?.copies || item.quantity || 1)
  const router = useRouter()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)
    onUpdateQuantity(newQuantity)
  }

  const getReadableOption = (key: string, value: string) => {
    const options: Record<string, Record<string, string>> = {
      paperSize: { a4: "A4", a3: "A3" },
      paperType: {
        normal: "80 gr",
        cardstock: "Cartulina",
        photo: "Fotográfico",
        premium: "100 gr",
        recycled: "Reciclado 80 gr",
        glossy: "Satinado 135 gr",
        matte: "Mate 120 gr",
      },
      printType: { bw: "Blanco y negro", color: "Color", colorPro: "Color PRO" },
      printForm: { oneSided: "Una cara", doubleSided: "Doble cara" },
      pagesPerSide: { one: "Una página por cara", multiple: "Múltiples páginas por cara" },
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

  const displayName = item.fileName || item.name || "Documento sin nombre"
  const pageCount = item.pageCount || "N/A"

  return (
    <Card className="border-2 border-gray-100 hover:border-blue-200 transition-all card-hover w-full">
      <CardContent className="p-4 sm:p-6">
        <div className="w-full overflow-hidden">
          <div className="flex flex-col space-y-4">
            {/* Header with icon and title */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base break-words">{displayName}</h3>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 gap-y-2 text-xs sm:text-sm text-gray-600 break-words">
              {pageCount !== "N/A" && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Páginas:</span>
                  <Badge variant="secondary" className="text-xs">
                    {pageCount}
                  </Badge>
                </div>
              )}
              {item.options && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Tamaño:</span>
                    <span>{getReadableOption("paperSize", item.options.paperSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Papel:</span>
                    <span>{getReadableOption("paperType", item.options.paperType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Impresión:</span>
                    <span>{getReadableOption("printType", item.options.printType)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Caras:</span>
                    <span>{getReadableOption("printForm", item.options.printForm)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Acabado:</span>
                    <span>{getReadableOption("finishing", item.options.finishing)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Quantity and actions */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Copias:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="w-12 sm:w-14 text-center border-0 p-1 sm:p-2 h-8 sm:h-10 font-semibold text-xs sm:text-sm"
                    min={1}
                  />
                  <button
                    className="p-1.5 sm:p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                <span className="text-lg sm:text-xl font-bold text-blue-600">
                  {(item.price * quantity).toFixed(2)}€
                </span>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/imprimir?edit=${item.id}`)}
                    className="text-gray-500 hover:text-blue-600 p-1.5 sm:p-2"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-gray-500 hover:text-red-600 p-1.5 sm:p-2"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
