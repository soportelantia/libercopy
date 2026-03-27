"use client"

import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
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
  AlertCircle,
  Calculator,
  ArrowRight,
  FileText,
  Layers,
  Scissors,
  Home,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "¿Puedo imprimir temarios de más de 1.000 páginas?",
    answer:
      "Sí, no hay límite de páginas. Podemos dividir el temario en varios tomos encuadernados para que sea más cómodo de manejar y estudiar.",
  },
  {
    question: "¿Cuánto cuesta imprimir un temario de oposiciones?",
    answer:
      "Depende del número de páginas, el color y el acabado elegido. La impresión en blanco y negro doble cara parte desde 0,02€ por página. Usa nuestra calculadora para obtener el precio exacto de tu temario en segundos.",
  },
  {
    question: "¿En cuánto tiempo recibo el pedido?",
    answer:
      "El plazo habitual es de 24 a 48 horas laborables desde que confirmamos el pedido. Los envíos se realizan a toda España peninsular.",
  },
  {
    question: "¿Qué tipos de encuadernado ofrecéis para temarios?",
    answer:
      "Ofrecemos encuadernado en espiral (muy cómodo para abrir el temario completamente plano), grapado y fresado con tapa. Para volúmenes grandes recomendamos el espiral.",
  },
  {
    question: "¿Puedo elegir imprimir en blanco y negro o en color?",
    answer:
      "Sí. Puedes elegir blanco y negro para el máximo ahorro o color si tu temario incluye esquemas, mapas o imágenes importantes. También puedes combinar páginas en color con el resto en blanco y negro.",
  },
  {
    question: "¿Aceptáis archivos en formato Word o solo PDF?",
    answer:
      "Aceptamos principalmente PDF, que es el formato que garantiza que el diseño y la maquetación se mantienen exactamente como los tienes. Si tienes un archivo Word o similar, te recomendamos exportarlo a PDF antes de subirlo.",
  },
]

export default function ImprimirTemariosOposicionesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Impresión de temarios de oposiciones online",
    provider: {
      "@type": "Organization",
      name: "Libercopy",
      url: "https://www.libercopy.es",
    },
    areaServed: {
      "@type": "Country",
      name: "España",
    },
    description:
      "Servicio online para imprimir temarios y apuntes de oposiciones con diferentes acabados: blanco y negro, color, doble cara, grapado o espiral. Envío a domicilio en toda España.",
    url: "https://www.libercopy.es/imprimir-temarios-oposiciones",
    serviceType: "Impresión bajo demanda",
  }

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Script
        id="jsonld-service-temarios"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      <Script
        id="jsonld-faq-temarios"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                <BookMarked className="w-4 h-4 mr-2" />
                Impresión para opositores
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-balance">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Imprimir temarios de oposiciones
                </span>{" "}
                online
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sube tu temario, elige el acabado y recíbelo en casa listo para estudiar. Sin colas, sin impresoras que
                fallan, sin perder tiempo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <span>Desde 0,02€/página en B/N</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                  <span>Encuadernado profesional</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />
                  <span>Envío a toda España</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <Image
                src="/avatar-libercopy.png"
                alt="Mascota de LiberCopy con temario de oposiciones"
                width={380}
                height={380}
                className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Problema / Objeciones ─── */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
              Imprimir un temario en casa es{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                caro, lento y agotador
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Un temario completo de oposiciones puede superar las 2.000 páginas. La tinta, el papel, los atascos de
              impresora y el tiempo que pierdes organizando las hojas hacen que no salga a cuenta. Necesitas un material
              cómodo para estudiar durante meses, no folios sueltos apilados.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Printer,
                  label: "Sin imprimir cientos de páginas en casa",
                  color: "from-red-400 to-orange-400",
                },
                {
                  icon: FileText,
                  label: "Con el acabado cómodo para estudiar",
                  color: "from-orange-400 to-yellow-400",
                },
                {
                  icon: Layers,
                  label: "Con claridad y orden desde el primer día",
                  color: "from-yellow-400 to-green-400",
                },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-md border border-gray-100"
                >
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
              Pensado para quien estudia en serio y necesita material que aguante meses de estudio intensivo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ideal para temarios largos</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sin límite de páginas. Dividimos en tomos si es necesario para que el manejo sea cómodo durante todo
                  tu estudio.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Printer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Blanco y negro o color</h3>
                <p className="text-gray-600 leading-relaxed">
                  Elige B/N para máximo ahorro o imprime en color si tu temario tiene esquemas, mapas o imágenes
                  importantes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Doble cara</h3>
                <p className="text-gray-600 leading-relaxed">
                  La impresión a doble cara reduce el grosor del temario a la mitad y hace que sea mucho más manejable
                  para estudiar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Scissors className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Grapado o espiral</h3>
                <p className="text-gray-600 leading-relaxed">
                  El espiral permite abrir el temario completamente plano sobre la mesa, algo muy útil para subrayar y
                  tomar notas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Envío cómodo a casa</h3>
                <p className="text-gray-600 leading-relaxed">
                  Recíbelo en tu domicilio en 24-48h. No tienes que desplazarte a ninguna copistería ni perder tiempo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ahorro en grandes volúmenes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cuantas más páginas, menor coste por hoja. Imprimir un temario completo de oposiciones nunca había
                  sido tan económico.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Cómo funciona ─── */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Cómo funciona{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  en 3 pasos
                </span>
              </h2>
              <p className="text-lg text-gray-600">Sin complicaciones, desde tu móvil o tu ordenador</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Sube tu temario en PDF",
                  description:
                    "Accede a la página de pedido y sube tu archivo. Aceptamos PDFs de cualquier tamaño. Si tienes el temario en varios archivos, puedes combinarlos.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "02",
                  title: "Elige el acabado",
                  description:
                    "Selecciona blanco y negro o color, impresión a una o doble cara, y el tipo de encuadernado: grapado, espiral o fresado. Verás el precio final al instante.",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  step: "03",
                  title: "Recíbelo en casa",
                  description:
                    "Confirma el pedido y paga de forma segura. Tu temario llegará impreso, encuadernado y listo para estudiar en 24-48 horas laborables.",
                  color: "from-blue-500 to-purple-600",
                },
              ].map(({ step, title, description, color }) => (
                <div key={step} className="flex gap-6 items-start">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-lg`}
                  >
                    {step}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/imprimir">
                <Button className="h-14 px-10 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-200">
                  <Printer className="mr-2 h-5 w-5" />
                  Empezar mi pedido
                </Button>
              </Link>
            </div>
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

      {/* ─── FAQ ─── */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Preguntas{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  frecuentes
                </span>
              </h2>
              <p className="text-lg text-gray-600">Todo lo que necesitas saber antes de hacer tu pedido</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span className="font-semibold text-gray-800">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Avatar / Confianza ─── */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-6 border border-blue-100">
              <div className="shrink-0">
                <Image
                  src="/avatar-libercopy.png"
                  alt="Mascota de LiberCopy"
                  width={100}
                  height={100}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800 mb-2 text-balance">
                  Tu temario, impreso y listo para estudiar
                </p>
                <p className="text-gray-500 leading-relaxed text-sm">
                  En LiberCopy nos encargamos de que tu material llegue en perfecto estado, bien encuadernado y con la
                  calidad que necesitas para preparar tu oposición sin distracciones.
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
            Imprime tu temario de oposiciones ahora
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Sube el PDF, elige el acabado y lo enviamos a tu puerta listo para estudiar
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
