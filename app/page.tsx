"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import ShippingBanner from '@/components/shipping-banner'
import GoogleReviews from "@/components/google-reviews"
import {
  FileText,
  Printer,
  Truck,
  Shield,
  Star,
  CheckCircle,
  Upload,
  Settings,
  ShoppingCart,
  Award,
  Users,
  Zap,
  Calculator,
  ArrowRight,
} from "lucide-react"
// FileText and ArrowRight kept for use in features/how-it-works sections
import PriceCalculator from "@/components/price-calculator"

export default function HomePage() {
  const [stats, setStats] = useState({
    orders: 0,
    customers: 0,
    satisfaction: 0,
  })

  useEffect(() => {
    // Animate counters
    const animateCounter = (target: number, setter: (value: number) => void) => {
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(current))
        }
      }, 30)
    }

    animateCounter(15000, (value) => setStats((prev) => ({ ...prev, orders: value })))
    animateCounter(5000, (value) => setStats((prev) => ({ ...prev, customers: value })))
    animateCounter(98, (value) => setStats((prev) => ({ ...prev, satisfaction: value })))
  }, [])

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Servicio de impresión profesional
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Imprime tus apuntes baratos y recíbelos en 48h
              </span>

            </h1>
            <h2 className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sube tu PDF, calcula el precio al instante y olvídate del resto
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/imprimir">
                <Button
                  className="h-14 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-200"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Sube tu PDF ahora
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="h-14 px-6 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent transition-all duration-200 flex items-center justify-center"
              >
                <div className="flex flex-col leading-tight text-center">
                  <span className="text-base font-medium">
                    Calcula tu precio en 10 segundos
                  </span>
                  <span className="text-xs text-gray-500">
                    (sin subir archivo)
                  </span>
                </div>
              </Button>
            </div>
            <h3 className="text-md text-gray-600 mb-8 max-w-3xl mx-auto">
              Sube tu PDF → Calculamos el precio → Lo recibes en casa
            </h3>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Entrega en 24-48h</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span>Desde 0,02€/página</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <span>Envío gratis desde 25€</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-orange-500" />
                <span>Pago 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Banner */}
      <ShippingBanner />

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LiberCopy para imprimir tus Apuntes
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia de impresión con tecnología avanzada y servicio personalizado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Printer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Calidad Premium</h3>
                <p className="text-gray-600">
                  Impresión de alta calidad con equipos profesionales y materiales premium
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Entrega Rápida</h3>
                <p className="text-gray-600">Recibe tus documentos en 24-48h con nuestro servicio de entrega express</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Pago Seguro</h3>
                <p className="text-gray-600">
                  Transacciones 100% seguras con encriptación SSL y múltiples métodos de pago
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Atención al cliente</h3>
                <p className="text-gray-600">Especializada y disponible cuando lo necesites</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cómo{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                funciona el proceso de Impresión
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Proceso simple y rápido en solo 3 pasos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">1. Sube tu archivo</h3>
                <p className="text-gray-600">Arrastra y suelta tu PDF o selecciónalo desde tu dispositivo</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">2. Configura opciones</h3>
                <p className="text-gray-600">Elige el tipo de impresión, papel, acabado y número de copias</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingCart className="h-10 w-10 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-xl font-semibold mb-4">3. Realiza el pedido</h3>
                <p className="text-gray-600">Añade al carrito, paga de forma segura y recibe en tu domicilio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Calculator Section */}
      <section id="calculadora" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: text */}
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                <Calculator className="w-4 h-4 mr-2" />
                Calcula tu precio al instante
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sabe exactamente{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  cuánto te va a costar
                </span>{" "}
                antes de subir tu archivo
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Introduce el número de paginas, elige si quieres color o blanco y negro, las caras y el acabado. Obtendrás el precio total en segundos, sin sorpresas.
              </p>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Precios actualizados desde nuestra base de datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <span>Sin necesidad de crear cuenta ni subir ningun fichero</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />
                  <span>IVA incluido en el precio mostrado</span>
                </div>
              </div>
              <Link href="/calcular-precio" className="mt-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                Abrir calculadora completa
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: calculator */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <PriceCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats.orders.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Documentos impresos</div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats.customers.toLocaleString()}+
              </div>
              <div className="text-gray-600 font-medium">Clientes satisfechos</div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats.satisfaction}%
              </div>
              <div className="text-gray-600 font-medium">Satisfacción</div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                24-48h
              </div>
              <div className="text-gray-600 font-medium">Entrega rápida</div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Empieza a Imprimir con LiberCopy?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes que confían en nosotros para sus necesidades de impresión
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link href="/imprimir">

              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                <Printer className="mr-2 h-5 w-5" />
                <h3>Sube tus apuntes ahora</h3>
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl bg-transparent"
              >
                Más información
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
