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
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FileText, ShoppingCart, Printer, CheckCircle, Star, ArrowLeft, Calculator } from "lucide-react"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { pricingService } from "@/lib/pricing-service"
import Footer from "@/components/footer"
import ShippingBanner from "@/components/shipping-banner"
export type PrintOptions = {
  paperSize: "a4"
  paperType: "normal"
  paperWeight: "80g"
  printType: "bw" | "color"
  printForm: "oneSided" | "doubleSided"
  orientation: "vertical" | "horizontal"
  pagesPerSide: "one"
  finishing: "none" | "stapled" | "twoHoles" | "laminated" | "bound" | "fourHoles"
  copies: number
  comments: string
}

const defaultOptions: PrintOptions = {
  paperSize: "a4",
  paperType: "normal",
  paperWeight: "80g",
  printType: "bw",
  printForm: "oneSided",
  orientation: "vertical",
  pagesPerSide: "one",
  finishing: "none",
  copies: 1,
  comments: "",
}

export default function ImprimirPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToCart, cart, removeFromCart } = useCart()

  // Check if editing existing item
  const editId = searchParams.get("edit")
  const isEditing = !!editId
  const editingItem = isEditing ? cart.find((item) => item.id === editId) : null

  const [printOptions, setPrintOptions] = useState<PrintOptions>(defaultOptions)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [price, setPrice] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize editing data
  useEffect(() => {
    if (editingItem && !isInitialized) {
      // Set options from editing item
      setPrintOptions({
        paperSize: "a4",
        paperType: "normal",
        paperWeight: editingItem.options?.paperWeight || "80g",
        printType: editingItem.options?.printType || "bw",
        printForm: editingItem.options?.printForm || "oneSided",
        orientation: editingItem.options?.orientation || "vertical",
        pagesPerSide: "one",
        finishing: editingItem.options?.finishing || "none",
        copies: editingItem.options?.copies || 1,
        comments: editingItem.comments || "",
      })

      // Create simulated file for editing
      if (editingItem.fileName && editingItem.fileUrl) {
        const simulatedFile = {
          name: editingItem.fileName,
          size: editingItem.fileSize || 0,
          type: "application/pdf",
          pageCount: editingItem.pageCount || 0,
          isProcessing: false,
          pageCountIsReal: true,
          fileUrl: editingItem.fileUrl,
          tempPath: editingItem.tempPath,
          tempUserId: editingItem.tempUserId,
          arrayBuffer: async () => new ArrayBuffer(0),
          slice: () => new Blob(),
          stream: () => new ReadableStream(),
          text: async () => "",
        }

        setUploadedFiles([simulatedFile])
        setTotalPages(editingItem.pageCount || 0)
      }

      setIsInitialized(true)
    } else if (!editingItem && !isInitialized) {
      // Check URL parameters for initial options
      const finishingParam = searchParams.get("finishing")
      if (finishingParam) {
        setPrintOptions((prev) => ({
          ...prev,
          finishing: finishingParam as PrintOptions["finishing"],
        }))
      }
      setIsInitialized(true)
    }
  }, [editingItem, isInitialized, searchParams])

  // Calculate price when options or pages change
  const calculatePrice = useCallback(async () => {
    if (totalPages === 0 || uploadedFiles.length === 0) {
      setPrice(0)
      return
    }

    setIsCalculating(true)
    try {
      // Get base price per page from database
      const basePricePerPage = await pricingService.getPrice("print_type", printOptions.printType)

      // Get discount for double-sided if applicable
      let discountPerPage = 0
      if (printOptions.printForm === "doubleSided") {
        discountPerPage = await pricingService.getPrice("print_form", "doubleSided")
      }

      // Calculate final price per page
      const finalPricePerPage = basePricePerPage + discountPerPage

      // Total pages to print
      const totalPagesToPrint = Math.max(0, totalPages)

      // Base price for all pages
      const totalBasePrice = finalPricePerPage * totalPagesToPrint

      // Finishing cost from database
      const finishingCost = await pricingService.getPrice("finishing", printOptions.finishing)

      // Multiply by number of copies
      const total = (totalBasePrice + finishingCost) * printOptions.copies

      setPrice(Number.parseFloat(total.toFixed(2)))
    } catch (error) {
      console.error("Error calculating price:", error)
      setPrice(0)
    } finally {
      setIsCalculating(false)
    }
  }, [uploadedFiles, totalPages, printOptions])

  useEffect(() => {
    if (isInitialized) {
      calculatePrice()
    }
  }, [calculatePrice, isInitialized])

  const handleUpdateOptions = (options: Partial<PrintOptions>) => {
    setPrintOptions((prev) => ({ ...prev, ...options }))
  }

  const handleUpdateFiles = (files: any[]) => {
    setUploadedFiles(files)
    if (files.length === 0) {
      setTotalPages(0)
      setPrice(0)
    }
  }

  const handleUpdatePageCount = (fileName: string, pageCount: number) => {
    setTotalPages(pageCount)
  }

  const handleAddToCart = async () => {
    // Validation
    if (printOptions.finishing === "stapled" && totalPages > 60) {
      toast({
        title: "Demasiadas páginas para grapado",
        description: "El grapado solo está disponible para documentos de hasta 60 páginas.",
        variant: "destructive",
      })
      return
    }

    if (uploadedFiles.length === 0) {
      toast({
        title: "No hay archivos seleccionados",
        description: "Por favor, sube al menos un documento para imprimir",
        variant: "destructive",
      })
      return
    }

    if (totalPages === 0) {
      toast({
        title: "Error en el conteo de páginas",
        description: "No se pudo determinar el número de páginas del documento",
        variant: "destructive",
      })
      return
    }

    if (price === 0) {
      toast({
        title: "Error en el cálculo de precio",
        description: "No se pudo calcular el precio del producto",
        variant: "destructive",
      })
      return
    }

    // Check if any PDF is still processing
    const processingFiles = uploadedFiles.filter((file) => file.isProcessing)
    if (processingFiles.length > 0) {
      toast({
        title: "Archivos en proceso",
        description: "El archivo aún está siendo analizado. Por favor, espera un momento.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    try {
      const file = uploadedFiles[0]

      if (isEditing && editId) {
        // Update existing item
        const updatedItem = {
          id: editId,
          name: file.name,
          fileName: file.name,
          fileSize: file.size,
          pageCount: totalPages,
          fileUrl: file.fileUrl,
          tempPath: file.tempPath,
          tempUserId: file.tempUserId,
          options: {
            paperSize: printOptions.paperSize,
            paperType: printOptions.paperType,
            paperWeight: printOptions.paperWeight,
            printType: printOptions.printType,
            printForm: printOptions.printForm,
            orientation: printOptions.orientation,
            pagesPerSide: printOptions.pagesPerSide,
            finishing: printOptions.finishing,
            copies: printOptions.copies,
          },
          comments: printOptions.comments,
          price: price / printOptions.copies, // Price per unit
          quantity: printOptions.copies,
          imageUrl: "",
        }

        // Remove old item and add updated one
        removeFromCart(editId)
        addToCart(updatedItem)

        toast({
          title: "¡Producto actualizado!",
          description: `El producto ha sido actualizado en el carrito por ${price.toFixed(2)}€`,
        })

        router.push("/cart")
      } else {
        // Create new cart item
        const cartItem = {
          id: uuidv4(),
          name: file.name,
          fileName: file.name,
          fileSize: file.size,
          pageCount: totalPages,
          fileUrl: file.fileUrl,
          tempPath: file.tempPath,
          tempUserId: file.tempUserId,
          options: {
            paperSize: printOptions.paperSize,
            paperType: printOptions.paperType,
            paperWeight: printOptions.paperWeight,
            printType: printOptions.printType,
            printForm: printOptions.printForm,
            orientation: printOptions.orientation,
            pagesPerSide: printOptions.pagesPerSide,
            finishing: printOptions.finishing,
            copies: printOptions.copies,
          },
          comments: printOptions.comments,
          price: price / printOptions.copies, // Price per unit
          quantity: printOptions.copies,
          imageUrl: "",
        }

        addToCart(cartItem)

        toast({
          title: "¡Añadido al carrito!",
          description: `${file.name} añadido al carrito por ${price.toFixed(2)}€`,
        })

        // Reset form
        setUploadedFiles([])
        setPrintOptions(defaultOptions)
        setPrice(0)
        setTotalPages(0)
        router.push("/cart")
      }
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

  const handleCancelEdit = () => {
    router.push("/cart")
  }

  if (!isInitialized) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Edit Banner */}
      {isEditing && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Editando: {editingItem?.fileName}</span>
              </div>
              <button onClick={handleCancelEdit} className="text-white hover:text-gray-200 underline">
                Cancelar edición
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Printer className="w-4 h-4 mr-2" />
              {isEditing ? "Editar producto" : "Servicio de impresión profesional"}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              {isEditing ? (
                <>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Edita
                  </span>{" "}
                  tu producto
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Imprime
                  </span>{" "}
                  tus apuntes y documentos
                  <br className="hidden md:block" />
                  con calidad profesional
                </>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
              {isEditing
                ? "Modifica las opciones de tu producto y actualízalo en el carrito"
                : "Sube tu PDF, elige tus opciones de impresión y recibe tus documentos con la mejor calidad."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm md:text-base">Calidad garantizada</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span className="text-sm md:text-base">Entrega rápida</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <span className="text-sm md:text-base">Pago seguro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Banner */}
      <ShippingBanner />

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Mobile-first responsive layout */}
          <div className="max-w-7xl mx-auto">
            {/* Mobile Layout - Stack vertically */}
            <div className="block xl:hidden space-y-6">
              {/* File Upload */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <span>{isEditing ? "Archivo actual" : "Sube tu documento"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                  <FileUploader
                    files={uploadedFiles}
                    onUpdateFiles={handleUpdateFiles}
                    onUpdatePageCount={handleUpdatePageCount}
                    disabled={isEditing}
                  />
                  {isEditing && (
                    <p className="text-sm text-gray-500 mt-4">
                      Para cambiar el archivo, cancela la edición y crea un nuevo producto.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Print Options */}
              {uploadedFiles.length > 0 && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2">
                      <Printer className="h-6 w-6 text-green-600" />
                      <span>Opciones de impresión</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-8">
                    <PrintForm options={printOptions} onUpdateOptions={handleUpdateOptions} />
                  </CardContent>
                </Card>
              )}

              {/* Summary - Mobile */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-6 w-6 text-purple-600" />
                    <span>Resumen del pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-4">
                      {/* File Info */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="truncate">{uploadedFiles[0]?.name || "Documento"}</span>
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          {totalPages > 0 && (
                            <p className="flex items-center justify-between">
                              <span className="font-medium">📄 Páginas:</span>
                              <Badge variant="secondary" className="text-xs">
                                {totalPages}
                              </Badge>
                            </p>
                          )}
                          <p className="flex items-center justify-between">
                            <span className="font-medium">📋 Copias:</span>
                            <span>{printOptions.copies}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="font-medium">🖨️ Tipo:</span>
                            <span>{printOptions.printType === "bw" ? "B/N" : "Color"}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="font-medium">📏 Tamaño:</span>
                            <span>{printOptions.paperSize.toUpperCase()}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="font-medium">📄 Papel:</span>
                            <span>{printOptions.paperWeight}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="font-medium">🔄 Caras:</span>
                            <span>{printOptions.printForm === "oneSided" ? "Una" : "Doble"}</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="font-medium">✂️ Acabado:</span>
                            <span className="text-right">
                              {printOptions.finishing === "none"
                                ? "Sin acabado"
                                : printOptions.finishing === "stapled"
                                  ? "Grapado"
                                  : printOptions.finishing === "bound"
                                    ? "Encuadernado"
                                    : printOptions.finishing}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Warning for stapled */}
                      {printOptions.finishing === "stapled" && totalPages > 60 && (
                        <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded-xl">
                          ⚠️ El grapado solo está disponible para documentos de hasta 60 páginas.
                        </div>
                      )}

                      {/* Total Price */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {isCalculating ? "..." : `${price.toFixed(2)}€`}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <Button
                            onClick={handleAddToCart}
                            disabled={
                              isAddingToCart ||
                              isCalculating ||
                              uploadedFiles.length === 0 ||
                              totalPages === 0 ||
                              price === 0
                            }
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
                          >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {isAddingToCart ? "Procesando..." : isEditing ? "Actualizar producto" : "Añadir al carrito"}
                          </Button>

                          {isEditing && (
                            <Button
                              variant="outline"
                              className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl bg-transparent"
                              size="lg"
                              onClick={handleCancelEdit}
                            >
                              Cancelar edición
                            </Button>
                          )}
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

              {/* Cart Preview - Mobile */}
              {cart.length > 0 && (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
                        Carrito ({cart.length})
                      </h3>
                      <Link href="/cart">
                        <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                          Ver carrito
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {cart.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                          <span className="truncate">{item.fileName}</span>
                          <span className="font-medium">{item.price?.toFixed(2)}€</span>
                        </div>
                      ))}
                      {cart.length > 2 && <p className="text-xs text-gray-500">Y {cart.length - 2} más...</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Services Info - Mobile (moved below summary) */}
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    ¿Por qué elegirnos?
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Calidad profesional garantizada</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                      <span>Entrega rápida en 24-48h</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                      <span>Precios competitivos</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                      <span>Soporte técnico especializado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop Layout - Side by side */}
            <div className="hidden xl:block">
              {/* Left Column - Forms */}
              <div className="pr-80 space-y-8">
                {/* File Upload */}
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <span>{isEditing ? "Archivo actual" : "Sube tu documento"}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <FileUploader
                      files={uploadedFiles}
                      onUpdateFiles={handleUpdateFiles}
                      onUpdatePageCount={handleUpdatePageCount}
                      disabled={isEditing}
                    />
                    {isEditing && (
                      <p className="text-sm text-gray-500 mt-4">
                        Para cambiar el archivo, cancela la edición y crea un nuevo producto.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Print Options */}
                {uploadedFiles.length > 0 && (
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-xl">
                      <CardTitle className="flex items-center space-x-2">
                        <Printer className="h-6 w-6 text-green-600" />
                        <span>Opciones de impresión</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <PrintForm options={printOptions} onUpdateOptions={handleUpdateOptions} />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Fixed Floating Summary */}
              <div className="fixed top-20 right-4 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto z-40 space-y-6">
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-xl">
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="h-6 w-6 text-purple-600" />
                      <span>Resumen del pedido</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {uploadedFiles.length > 0 ? (
                      <div className="space-y-4">
                        {/* File Info */}
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            {uploadedFiles[0]?.name || "Documento"}
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            {totalPages > 0 && (
                              <p className="flex items-center">
                                <span className="font-medium">📄 Páginas:</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {totalPages}
                                </Badge>
                              </p>
                            )}
                            <p>
                              <span className="font-medium">📋 Copias:</span> {printOptions.copies}
                            </p>
                            <p>
                              <span className="font-medium">🖨️ Tipo:</span>{" "}
                              {printOptions.printType === "bw" ? "Blanco y negro" : "Color"}
                            </p>
                            <p>
                              <span className="font-medium">📏 Tamaño:</span> {printOptions.paperSize.toUpperCase()}
                            </p>
                            <p>
                              <span className="font-medium">📄 Papel:</span> {printOptions.paperWeight} (
                              {printOptions.paperType})
                            </p>
                            <p>
                              <span className="font-medium">🔄 Caras:</span>{" "}
                              {printOptions.printForm === "oneSided" ? "Una cara" : "Doble cara"}
                            </p>
                            <p>
                              <span className="font-medium">✂️ Acabado:</span>{" "}
                              {printOptions.finishing === "none"
                                ? "Sin acabado"
                                : printOptions.finishing === "stapled"
                                  ? "Grapado"
                                  : printOptions.finishing === "bound"
                                    ? "Encuadernado"
                                    : printOptions.finishing}
                            </p>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        {totalPages > 0 && (
                          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                            <p className="font-medium text-gray-700 mb-1">💰 Desglose de precios:</p>
                            <p>
                              • Precio por página: {(price / Math.max(1, totalPages * printOptions.copies)).toFixed(4)}€
                            </p>
                            <p>• Total páginas: {totalPages * printOptions.copies}</p>
                          </div>
                        )}

                        {/* Warning for stapled */}
                        {printOptions.finishing === "stapled" && totalPages > 60 && (
                          <div className="bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-2 rounded-xl">
                            ⚠️ El grapado solo está disponible para documentos de hasta 60 páginas.
                          </div>
                        )}

                        {/* Total Price */}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {isCalculating ? "..." : `${price.toFixed(2)}€`}
                            </span>
                          </div>

                          <div className="space-y-3">
                            <Button
                              onClick={handleAddToCart}
                              disabled={
                                isAddingToCart ||
                                isCalculating ||
                                uploadedFiles.length === 0 ||
                                totalPages === 0 ||
                                price === 0
                              }
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transform hover:scale-105 transition-all duration-200"
                            >
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              {isAddingToCart
                                ? "Procesando..."
                                : isEditing
                                  ? "Actualizar producto"
                                  : "Añadir al carrito"}
                            </Button>

                            {isEditing && (
                              <Button
                                variant="outline"
                                className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl bg-transparent"
                                size="lg"
                                onClick={handleCancelEdit}
                              >
                                Cancelar edición
                              </Button>
                            )}
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
                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
                          Carrito ({cart.length})
                        </h3>
                        <Link href="/cart">
                          <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                            Ver carrito
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {cart.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-sm text-gray-600 flex justify-between">
                            <span className="truncate">{item.fileName}</span>
                            <span className="font-medium">{item.price?.toFixed(2)}€</span>
                          </div>
                        ))}
                        {cart.length > 2 && <p className="text-xs text-gray-500">Y {cart.length - 2} más...</p>}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Services Info - Desktop (moved below cart preview, no sticky) */}
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      ¿Por qué elegirnos?
                    </h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>Calidad profesional garantizada</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                        <span>Entrega rápida en 24-48h</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                        <span>Precios competitivos</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0" />
                        <span>Soporte técnico especializado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <Toaster />
    </main>
  )
}
