"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import ShippingBanner from "@/components/shipping-banner"
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
} from "lucide-react"

export default function HomeClientPage() {
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
                Imprime tus Apuntes y Documentos
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              De forma rápida y económica desde 0,02€
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/imprimir">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Empezar a imprimir
                </Button>
              </Link>
              <Link href="/encuadernar">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-xl bg-white/80 backdrop-blur-sm"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Encuadernación
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Calidad garantizada</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-500" />
                <span>Precios competitivos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-orange-500" />
                <span>Pago seguro</span>
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
