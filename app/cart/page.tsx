"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, FileText, ShoppingBag, ArrowRight, Edit, Plus, Minus } from "lucide-react"
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
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50 overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 py-12" style={{marginTop: '40px'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Tu carrito de compra</h1>
            <p className="text-gray-600">Revisa tus documentos antes de proceder al pago</p>
          </div>

          {cart.length === 0 ? (
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Añade documentos para imprimir desde nuestra página principal y aparecerán aquí.
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold">
                    Comenzar a imprimir
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <span>Documentos ({cart.length})</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {cart.length} {cart.length === 1 ? "artículo" : "artículos"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
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

              <div className="space-y-6">
                <Card className="sticky top-24 border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingBag className="h-6 w-6 text-purple-600" />
                      <span>Resumen del pedido</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal (sin IVA):</span>
                        <span className="font-medium">{(totalPrice / 1.21).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">IVA (21%):</span>
                        <span className="font-medium">{(totalPrice - totalPrice / 1.21).toFixed(2)}€</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-2xl font-bold text-blue-600">{totalPrice.toFixed(2)}€</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
                        size="lg"
                        onClick={handleCheckout}
                      >
                        Proceder al pago
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl bg-transparent"
                        size="lg"
                        onClick={clearCart}
                      >
                        Vaciar carrito
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center space-x-2 text-blue-700 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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

      {/* Footer */}
      <Footer />
    </main>
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
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 w-full overflow-hidden">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 mb-2 truncate">{displayName}</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 mb-4 break-words">
              {pageCount !== "N/A" && (
                <div className="flex items-center">
                  <span className="font-medium">Páginas:</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {pageCount}
                  </Badge>
                </div>
              )}
              {item.options && (
                <>
                  <div>
                    <span className="font-medium">Tamaño:</span>{" "}
                    {getReadableOption("paperSize", item.options.paperSize)}
                  </div>
                  <div>
                    <span className="font-medium">Papel:</span>{" "}
                    {getReadableOption("paperType", item.options.paperType)}
                  </div>
                  <div>
                    <span className="font-medium">Impresión:</span>{" "}
                    {getReadableOption("printType", item.options.printType)}
                  </div>
                  <div>
                    <span className="font-medium">Caras:</span>{" "}
                    {getReadableOption("printForm", item.options.printForm)}
                  </div>
                  <div>
                    <span className="font-medium">Acabado:</span>{" "}
                    {getReadableOption("finishing", item.options.finishing)}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Copias:</span>
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="w-14 min-w-0 max-w-[3.5rem] text-center border-0 p-2 h-10 font-semibold"
                    min={1}
                  />
                  <button
                    className="p-2 hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">
                  {(item.price * quantity).toFixed(2)}€
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/imprimir?edit=${item.id}`)}
                    className="text-gray-500 hover:text-blue-600 p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-gray-500 hover:text-red-600 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
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
