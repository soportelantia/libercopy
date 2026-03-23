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
  BookMarked,
  Zap,
  TrendingDown,
  Calculator,
  ArrowRight,
  Package,
  ShieldCheck,
} from "lucide-react"

export default function CopisteriaOposicionesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <BookMarked className="w-4 h-4 mr-2" />
              Impresión para opositores
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-balance">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Imprime tu temario de oposiciones
              </span>{" "}
              sin complicaciones
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Miles de páginas organizadas, listas para estudiar
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/imprimir">
                <Button className="h-14 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-200">
                  <Printer className="mr-2 h-5 w-5" />
                  Sube tu temario ahora
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

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <span>Ahorro en grandes volúmenes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Encuadernado resistente</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />
                <span>Envío rápido a toda España</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Sección Dolor ─── */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Sabemos lo que es imprimir{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                cientos o miles de páginas.
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Te lo ponemos fácil. Un temario de oposición puede superar las 2.000 páginas. Llevar ese volumen a una
              copistería local es caro, lento y agotador. En LiberCopy lo subimos, lo imprimimos y lo enviamos a tu
              puerta, listo para estudiar.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Beneficios ─── */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Todo lo que necesitas para{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                preparar tu oposición
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pensado para quien estudia en serio y necesita material duradero
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingDown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ahorro en grandes volúmenes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cuantas más páginas, menor es el coste por hoja. Imprimir un temario completo nunca había sido tan
                  económico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Encuadernado duradero</h3>
                <p className="text-gray-600 leading-relaxed">
                  Acabados resistentes que aguantan meses de estudio intensivo: espiral, tapa dura o fresado. Tu
                  temario siempre en perfecto estado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ideal para estudiar sin distracciones</h3>
                <p className="text-gray-600 leading-relaxed">
                  El papel ayuda a la concentración y la retención. Olvida las pantallas y centra toda tu energía en
                  aprobar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Calculadora ─── */}
      <section id="calculadora" className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                <Calculator className="w-4 h-4 mr-2" />
                Calcula tu precio al instante
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Sabe exactamente{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  cuánto cuesta tu temario
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

            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <PriceCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Packs ─── */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Packs pensados para{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                opositores
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Elige el volumen que necesitas y ahorra desde el primer pedido
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Pack 500 */}
            <Card className="border-2 border-blue-100 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Pack</p>
                    <h3 className="text-2xl font-bold text-gray-800">500 páginas</h3>
                    <p className="text-lg font-semibold text-blue-600">9,15 €</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Impresión doble cara B/N</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Encuadernado en espiral incluido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Ideal para un bloque de temario</span>
                  </li>
                </ul>
                <Link href="/imprimir">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                    Pedir este pack
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pack 1000 */}
            <Card className="border-2 border-purple-200 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-1">
                  Mas popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Pack</p>
                    <h3 className="text-2xl font-bold text-gray-800">1000 páginas</h3>
                    <p className="text-lg font-semibold text-purple-600">16,65 €</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Impresión doble cara B/N</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Encuadernado en espiral incluido</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Mayor ahorro por página</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>Temario completo en un solo pedido</span>
                  </li>
                </ul>
                <Link href="/imprimir">
                  <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                    Pedir este pack
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Avatar Section (secundario) ─── */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl shadow-md p-8 flex flex-col sm:flex-row items-center gap-6 border border-blue-100">
              <div className="shrink-0">
                <Image
                  src="/avatar-libercopy.png"
                  alt="Mascota de LiberCopy"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 mb-2 text-balance">
                  Te ayudamos a preparar tu oposición sin complicaciones
                </p>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Desde el primer tema hasta el último anexo, en LiberCopy nos encargamos de que tu material llegue
                  impreso, encuadernado y listo para estudiar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Final ─── */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
            Calcula tu pedido de oposiciones
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Sube tu temario, recibe el precio al instante y lo enviamos a tu puerta listo para estudiar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/imprimir">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
              >
                <Printer className="mr-2 h-5 w-5" />
                Sube tu temario ahora
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-xl bg-transparent"
            >
              <Calculator className="mr-2 h-5 w-5" />
              Calcular precio
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
