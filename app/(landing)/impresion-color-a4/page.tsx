"use client"

import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PriceCalculator from "@/components/price-calculator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Calculator,
  Printer,
  Truck,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Palette,
  FileText,
  GraduationCap,
  UploadCloud,
  Settings2,
  PackageCheck,
  Layers,
} from "lucide-react"
import { buildProductSchema, buildFaqSchema, type FaqItem } from "@/lib/schemas"

const PAGE_URL = "https://www.libercopy.es/impresion-color-a4"

const faqs: FaqItem[] = [
  {
    question: "¿Cuánto cuesta imprimir en color A4?",
    answer:
      "El precio de la impresión en color A4 empieza desde 0,09 € por página. Para grandes volúmenes el precio por página baja. Puedes calcular el coste exacto en nuestra calculadora sin necesidad de subir ningún archivo.",
  },
  {
    question: "¿La impresión en color es de calidad fotográfica?",
    answer:
      "Sí. Utilizamos impresoras láser de alta resolución que reproducen colores vivos y precisos. El resultado es apropiado para presentaciones, TFG con gráficas, material docente y cualquier documento con imágenes o infografías.",
  },
  {
    question: "¿Puedo imprimir a doble cara en color?",
    answer:
      "Sí, la impresión a doble cara también está disponible en color. Es una buena opción para reducir el número de hojas en documentos extensos con gráficas o tablas en color.",
  },
  {
    question: "¿Qué acabados puedo añadir a la impresión en color?",
    answer:
      "Puedes añadir grapado, encuadernación en espiral o dejar el documento sin acabado. El espiral es el más popular para trabajos académicos y presentaciones con muchas páginas.",
  },
  {
    question: "¿En qué plazo recibo mi pedido?",
    answer:
      "Los pedidos se entregan en 24-48 horas laborables en toda España peninsular. El envío es gratuito a partir de 25 €. Para pedidos menores, el coste de envío es de 3,99 €.",
  },
  {
    question: "¿Qué formato de archivo acepta Libercopy?",
    answer:
      "Solo aceptamos archivos en formato PDF. Este formato garantiza que los colores, fuentes y maquetación se impriman exactamente como los ves en pantalla, sin sorpresas.",
  },
]

const productJsonLd = buildProductSchema({
  name: "Impresión en color A4",
  description:
    "Servicio de impresión online en color para documentos, presentaciones y material académico en formato A4. Calidad láser, opciones de doble cara y encuadernado disponibles.",
  url: PAGE_URL,
  price: "0.06",
})

const faqJsonLd = buildFaqSchema(faqs)

function FAQItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-blue-500 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function ImpresionColorA4Page() {
  return (
    <>
      <Script
        id="jsonld-product-color"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="jsonld-faq-color"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <div className="order-2 lg:order-1">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                  <Palette className="w-4 h-4 mr-2" />
                  Impresión en color online
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-balance">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Impresión en color A4
                  </span>{" "}
                  online
                </h1>

                <p className="text-xl text-gray-600 mb-3 leading-relaxed">
                  Colores vivos y nítidos para presentaciones, TFG, material docente y cualquier documento que requiera impacto visual.
                </p>

                <p className="text-2xl font-bold text-blue-600 mb-8">
                  Desde{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    0,06 €/página
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link href="/imprimir">
                    <Button className="h-14 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-200">
                      <UploadCloud className="mr-2 h-5 w-5" />
                      Sube tu PDF y empieza
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("calculadora")?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="h-14 px-6 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent transition-all duration-200 flex items-center justify-center"
                  >
                    <div className="flex flex-col leading-tight text-center">
                      <span className="text-base font-medium">Calcula tu precio en 10 segundos</span>
                      <span className="text-xs text-gray-500">(sin subir archivo)</span>
                    </div>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                  {[
                    { icon: CheckCircle, color: "text-green-500", text: "Entrega en 24-48 h" },
                    { icon: CheckCircle, color: "text-blue-500", text: "Calidad láser profesional" },
                    { icon: CheckCircle, color: "text-purple-500", text: "Envío gratis desde 25 €" },
                    { icon: CheckCircle, color: "text-orange-500", text: "Pago 100 % seguro" },
                  ].map(({ icon: Icon, color, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${color} shrink-0`} />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <Image
                  src="/avatar-libercopy.png"
                  alt="Mascota de LiberCopy con documentos en color"
                  width={380}
                  height={380}
                  className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 bg-white/70">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Por qué elegir{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  la impresión en color de Libercopy
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calidad profesional con entrega a domicilio, sin desplazamientos ni colas
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Palette,
                  color: "from-blue-500 to-blue-600",
                  title: "Colores fieles al original",
                  desc: "Tecnología láser de alta resolución que reproduce exactamente los colores del PDF que nos envías, sin virados ni pérdida de saturación.",
                },
                {
                  icon: ImageIcon,
                  color: "from-purple-500 to-purple-600",
                  title: "Ideal para imágenes e infografías",
                  desc: "Fotografías, gráficas, mapas y elementos visuales complejos se imprimen con nitidez y detalle.",
                },
                {
                  icon: Layers,
                  color: "from-pink-500 to-pink-600",
                  title: "Doble cara disponible",
                  desc: "Ahorra páginas y reduce el volumen del documento con la opción de impresión a doble cara en color.",
                },
                {
                  icon: GraduationCap,
                  color: "from-green-500 to-green-600",
                  title: "Perfecto para TFG y TFM",
                  desc: "La opción preferida por universitarios para entregar el trabajo de fin de grado o máster con una presentación cuidada.",
                },
                {
                  icon: FileText,
                  color: "from-orange-500 to-orange-600",
                  title: "Presentaciones y dossieres",
                  desc: "Informes corporativos, presentaciones comerciales y catálogos con el impacto visual que merecen.",
                },
                {
                  icon: Truck,
                  color: "from-teal-500 to-teal-600",
                  title: "Envío a domicilio",
                  desc: "Recibes tu pedido en 24-48 h en toda España peninsular. Envío gratuito a partir de 25 €.",
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <Card
                  key={title}
                  className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Cómo funciona:{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  3 pasos y listo
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Sin complicaciones. De tu pantalla a tu buzón en menos de 48 horas
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  icon: UploadCloud,
                  title: "Sube tu PDF",
                  description: "Selecciona tu archivo PDF desde el ordenador o el móvil. Aceptamos archivos de hasta 50 MB.",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100",
                },
                {
                  step: "2",
                  icon: Settings2,
                  title: "Configura la impresión",
                  description: "Elige una o doble cara, número de copias y el acabado: sin acabado, grapado o espiral.",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100",
                },
                {
                  step: "3",
                  icon: PackageCheck,
                  title: "Recibe el pedido",
                  description: "Paga de forma segura y recibe tus documentos impresos en color en 24-48 h laborables.",
                  color: "from-green-500 to-green-600",
                  bgColor: "from-green-50 to-green-100",
                },
              ].map(({ step, icon: Icon, title, description, color, bgColor }) => (
                <div
                  key={step}
                  className={`relative flex flex-col items-center text-center p-8 bg-gradient-to-br ${bgColor} rounded-3xl shadow-md border border-white`}
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div
                    className={`absolute -top-4 -left-4 w-9 h-9 bg-gradient-to-r ${color} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md`}
                  >
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/imprimir">
                <Button className="h-14 px-10 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-200">
                  <Printer className="mr-2 h-5 w-5" />
                  Empezar pedido ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Calculadora ─── */}
        <section id="calculadora" className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
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
                    cuánto cuesta tu impresión en color
                  </span>{" "}
                  antes de subir el PDF
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Sin registro ni subida de archivos. Obtén un presupuesto en segundos.
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
                <Link
                  href="/calcular-precio"
                  className="mt-8 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
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

        {/* FAQ */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Preguntas frecuentes sobre{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  impresión en color A4
                </span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} {...faq} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
              Listo para imprimir en color desde casa
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Sube tu PDF, configura las opciones y recibe tu pedido en 24-48 h.
            </p>
            <Link href="/imprimir">
              <Button className="h-14 px-10 text-base font-semibold rounded-xl bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg">
                <ArrowRight className="mr-2 h-5 w-5" />
                Hacer mi pedido ahora
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}
