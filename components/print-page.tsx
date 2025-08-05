"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import FileUploader from "@/components/file-uploader"
import PrintForm from "@/components/print-form"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  FileText,
  ShoppingCart,
  Printer,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Users,
  Award,
  Mail,
} from "lucide-react"
import Link from "next/link"

export type PrintOptions = {
  paperSize: string
  paperWeight: string
  printType: string
  printForm: string
  orientation: string
  finishing: string
  copies: number
  comments: string
  pagesPerSide: string
}

const defaultOptions: PrintOptions = {
  paperSize: "a4",
  paperWeight: "80g",
  printType: "bw",
  printForm: "oneSided",
  orientation: "vertical",
  finishing: "none",
  copies: 1,
  comments: "",
  pagesPerSide: "one",
}

export default function PrintPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToCart, cart } = useCart()
  const { user } = useAuth()

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState<number>(0)
  const [options, setOptions] = useState<PrintOptions>(defaultOptions)
  const [price, setPrice] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Check for URL parameters to set initial options
  useEffect(() => {
    const finishing = searchParams.get("finishing")
    if (finishing) {
      setOptions((prev) => ({ ...prev, finishing }))
    }
  }, [searchParams])

  const calculatePrice = useCallback(async () => {
    if (!uploadedFile || pageCount === 0) {
      setPrice(0)
      return
    }

    setIsCalculating(true)
    try {
      const response = await fetch("/api/calculate-price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageCount,
          options,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPrice(data.price || 0)
      } else {
        console.error("Error calculating price")
        setPrice(0)
      }
    } catch (error) {
      console.error("Error calculating price:", error)
      setPrice(0)
    } finally {
      setIsCalculating(false)
    }
  }, [uploadedFile, pageCount, options])

  useEffect(() => {
    calculatePrice()
  }, [calculatePrice])

  const handleAddToCart = async () => {
    if (!uploadedFile || !fileUrl) {
      toast({
        title: "Error",
        description: "Por favor, sube un archivo antes de añadir al carrito.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)
    try {
      const cartItem = {
        id: Date.now().toString(),
        fileName: uploadedFile.name,
        fileUrl: fileUrl,
        fileSize: uploadedFile.size,
        pageCount: pageCount,
        options: options,
        price: price,
        quantity: options.copies,
      }

      addToCart(cartItem)

      toast({
        title: "Añadido al carrito",
        description: `${uploadedFile.name} se ha añadido al carrito correctamente.`,
      })

      // Reset form
      setUploadedFile(null)
      setFileUrl(null)
      setPageCount(0)
      setOptions(defaultOptions)
      setPrice(0)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "No se pudo añadir el archivo al carrito.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    if (uploadedFile && fileUrl) {
      router.push("/cart")
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200">
              ✨ Servicio de impresión profesional
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Imprime</span> tus documentos
              <br />
              con calidad profesional
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Sube tu archivo PDF y obtén impresiones de alta calidad con múltiples opciones de acabado. Rápido, fácil y
              profesional.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Calidad garantizada</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-5 w-5 text-purple-500" />
                <span>Pago seguro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="card-hover border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span>Sube tu archivo</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <FileUploader
                    onFileUpload={(file, url, pages) => {
                      setUploadedFile(file)
                      setFileUrl(url)
                      setPageCount(pages)
                    }}
                  />
                </CardContent>
              </Card>

              {uploadedFile && (
                <Card className="card-hover border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2">
                      <Printer className="h-6 w-6 text-green-600" />
                      <span>Opciones de impresión</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <PrintForm
                      options={options}
                      onUpdateOptions={(newOptions) => setOptions((prev) => ({ ...prev, ...newOptions }))}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Summary Section */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-6 w-6 text-purple-600" />
                    <span>Resumen del pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-2">{uploadedFile.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>📄 {pageCount} páginas</p>
                          <p>
                            📋 {options.copies} {options.copies === 1 ? "copia" : "copias"}
                          </p>
                          <p>🖨️ {options.printType === "bw" ? "Blanco y negro" : "Color"}</p>
                          <p>📏 {options.paperSize.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {isCalculating ? "..." : `${price.toFixed(2)}€`}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <Button
                            onClick={handleAddToCart}
                            disabled={isAddingToCart || isCalculating}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl"
                          >
                            {isAddingToCart ? "Añadiendo..." : "Añadir al carrito"}
                          </Button>

                          <Button
                            onClick={handleBuyNow}
                            disabled={isAddingToCart || isCalculating}
                            variant="outline"
                            className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl bg-transparent"
                          >
                            Comprar ahora
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Sube un archivo para ver el resumen</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cart Preview */}
              {cart.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Carrito ({cart.length})</h3>
                      <Link href="/cart">
                        <Button variant="outline" size="sm">
                          Ver carrito
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {cart.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                          <span className="truncate">{item.fileName}</span>
                          <span>{item.price?.toFixed(2)}€</span>
                        </div>
                      ))}
                      {cart.length > 2 && <p className="text-xs text-gray-500">Y {cart.length - 2} más...</p>}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Por qué elegir Liberiscopy?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos el mejor servicio de impresión con tecnología de vanguardia y atención personalizada
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Rápido y eficiente</h3>
              <p className="text-gray-600">
                Procesamos tu pedido en minutos. Impresión rápida sin comprometer la calidad.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Calidad profesional</h3>
              <p className="text-gray-600">
                Utilizamos equipos de última generación para garantizar resultados excepcionales.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Atención personalizada</h3>
              <p className="text-gray-600">
                Nuestro equipo está siempre disponible para ayudarte con cualquier consulta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Documentos impresos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Clientes satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24h</div>
              <div className="text-blue-100">Tiempo de entrega</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Satisfacción del cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <div>
                  <span className="text-2xl font-bold">Liberiscopy</span>
                  <div className="text-sm text-gray-400">grupo lantia</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Tu servicio de impresión y distribución editorial de confianza. Calidad profesional, entrega rápida y
                precios competitivos.
              </p>
              <div className="flex space-x-4">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-400 ml-2">4.9/5 - 500+ reseñas</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Servicios</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Impresión
                  </Link>
                </li>
                <li>
                  <Link href="/encuadernar" className="hover:text-white transition-colors">
                    Encuadernación
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@liberiscopy.es
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Liberiscopy - Grupo Lantia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </main>
  )
}
