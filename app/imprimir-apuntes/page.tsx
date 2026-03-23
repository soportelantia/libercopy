"use client"

import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Printer,
  Truck,
  BookOpen,
  Zap,
  AlertCircle,
  Library,
  Clock,
  GraduationCap,
  Calculator,
  ArrowRight,
  Users,
} from "lucide-react"

export default function ImprimirApuntesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            {/* Left: copy & CTAs */}
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                <GraduationCap className="w-4 h-4 mr-2" />
                Impresión para estudiantes
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-balance">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Imprime tus apuntes baratos
                </span>{" "}
                sin salir de casa
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sube tu PDF, calcula el precio al instante y recíbelo sin salir de casa
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/imprimir">
                  <Button className="h-14 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-200">
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
                    <span className="text-base font-medium">Calcula tu precio en 10 segundos</span>
                    <span className="text-xs text-gray-500">(sin subir archivo)</span>
                  </div>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mb-6 font-medium">
                Sube tu PDF → Calculamos el precio → Lo recibes en casa
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Entrega en 24-48h</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <span>Desde 0,02€/página</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />
                  <span>Envío gratis desde 25€</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-orange-500 shrink-0" />
                  <span>Pago 100% seguro</span>
                </div>
              </div>
            </div>

            {/* Right: avatar */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <Image
                src="/avatar-libercopy.png"
                alt="Mascota de LiberCopy con apuntes y tablet"
                width={380}
                height={380}
                className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problema Section */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              ¿Cansado de imprimir en la{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                biblioteca o gastar de más?
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Las colas en la biblioteca, las impresoras que fallan justo antes del examen, o los precios abusivos en
              copisterías de campus son historia. Con LiberCopy imprimes desde casa, al precio más bajo del mercado, y lo
              recibes en tiempo récord.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Library,
                  label: "Sin colas en biblioteca",
                  color: "from-red-400 to-orange-400",
                },
                {
                  icon: Clock,
                  label: "Sin esperas de última hora",
                  color: "from-orange-400 to-yellow-400",
                },
                {
                  icon: AlertCircle,
                  label: "Sin sorpresas en el precio",
                  color: "from-yellow-400 to-green-400",
                },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 text-center">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Por qué los estudiantes{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                eligen LiberCopy
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Diseñado específicamente para las necesidades de la vida universitaria
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ideal para apuntes largos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Imprime temarios completos, trabajos de fin de grado o apuntes de todo el cuatrimestre sin
                  preocuparte por el coste.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Precios bajos para estudiantes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Desde 0,02€ por página en blanco y negro. Sin cuotas ni suscripciones. Pagas solo lo que imprimes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Entrega rápida antes de exámenes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Recibe tus apuntes en 24-48h directamente en tu domicilio. Nunca más llegues sin material al examen.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculadora Section */}
      <section id="calculadora" className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Left: text */}
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                <Calculator className="w-4 h-4 mr-2" />
                Calcula tu precio al instante
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Sabe exactamente{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  cuánto cuestan tus apuntes
                </span>{" "}
                antes de subir el PDF
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Introduce el número de páginas, elige color o blanco y negro, las caras y el acabado. Precio total en
                segundos, sin sorpresas.
              </p>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Precios actualizados desde nuestra base de datos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <span>Sin necesidad de crear cuenta ni subir ningún fichero</span>
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

      {/* Avatar + Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-8">
              <div className="shrink-0">
                <Image
                  src="/avatar-libercopy.png"
                  alt="Mascota de LiberCopy"
                  width={120}
                  height={120}
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Comunidad LiberCopy
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-2 text-balance">
                  Más de miles de estudiantes ya imprimen con LiberCopy
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Desde apuntes de primer año hasta TFGs y TFMs, confían en nosotros para llegar preparados a sus
                  exámenes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
            Imprime tus apuntes ahora
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Sube tu PDF, recibe el precio al instante y con un clic lo enviamos a tu puerta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/imprimir">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                <Printer className="mr-2 h-5 w-5" />
                Sube tus apuntes ahora
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

      <Footer />
    </main>
  )
}
