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
  Printer,
  Truck,
  BookOpen,
  Zap,
  Calculator,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  FileText,
  Paperclip,
  UploadCloud,
  Settings2,
  PackageCheck,
} from "lucide-react"
import { buildProductSchema, buildFaqSchema } from "@/lib/schemas"

const PAGE_URL = "https://www.libercopy.es/impresion-blanco-y-negro-a4"

const faqs = [
  {
    question: "¿Cuánto cuesta imprimir en blanco y negro A4?",
    answer:
      "El precio de la impresión en blanco y negro A4 empieza desde 0,02 € por página en doble cara para grandes volúmenes. Para una cara, el precio habitual es de 0,05 €/página. Puedes calcular el precio exacto sin subir ningún archivo en nuestra calculadora.",
  },
  {
    question: "¿Puedo imprimir mis apuntes a doble cara?",
    answer:
      "Sí. La impresión a doble cara está disponible para todos los pedidos en blanco y negro A4. Es la opción más económica y también la más habitual para apuntes, temarios y documentos largos.",
  },
  {
    question: "¿Qué acabados puedo añadir a mi impresión?",
    answer:
      "Puedes añadir grapado (para documentos de hasta 100 páginas), espiral, perforado de 2 o 4 agujeros, o dejar el documento sin acabado. El espiral es la opción más popular para temarios y apuntes de oposiciones.",
  },
  {
    question: "¿Cuánto tarda en llegar el pedido?",
    answer:
      "Los pedidos se entregan en 24-48 horas laborables en toda la España peninsular. El envío es gratuito en pedidos a partir de 25 €. Para pedidos menores, el coste de envío es de 3,99 €.",
  },
  {
    question: "¿Qué formato de archivo necesito para imprimir?",
    answer:
      "Aceptamos únicamente archivos en formato PDF. Este formato garantiza que el diseño y la maquetación del documento se impriman exactamente como los ves en pantalla, sin errores de fuentes ni de márgenes.",
  },
  {
    question: "¿Puedo imprimir documentos muy largos de una sola vez?",
    answer:
      "Sí, estamos especializados en documentos de gran volumen como temarios de oposiciones, apuntes universitarios completos o manuales. El límite por archivo es de 50 MB. Si tu documento es más grande, puedes dividirlo en varios archivos y añadirlos al mismo pedido.",
  },
]

const productJsonLd = buildProductSchema({
  name: "Impresión en blanco y negro A4",
  description:
    "Servicio de impresión online en blanco y negro para apuntes, temarios y documentos en formato A4. Opciones de doble cara, grapado y espiral disponibles.",
  url: PAGE_URL,
  price: "0.02",
})

const faqJsonLd = buildFaqSchema(faqs)

function FAQItem({ question, answer }: { question: string; answer: string }) {
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

export default function ImpresionBlancoNegroA4Page() {
  return (
    <>
      <Script
        id="jsonld-product-bn"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Script
        id="jsonld-faq-bn"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />

        {/* ─── Hero ─── */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              {/* Left: copy & CTAs */}
              <div className="order-2 lg:order-1">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                  <Printer className="w-4 h-4 mr-2" />
                  Impresión online barata
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-balance">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Impresión en blanco y negro A4
                  </span>{" "}
                  online
                </h1>

                <p className="text-xl text-gray-600 mb-3 leading-relaxed">
                  Ideal para estudiantes, opositores y profesores. Sube tu PDF y recíbelo impreso en casa.
                </p>

                <p className="text-2xl font-bold text-blue-600 mb-8">
                  Desde{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    0,02 €/página
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
                    <span>Entrega en 24-48 h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 shrink-0" />
                    <span>Doble cara disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />
                    <span>Envío gratis desde 25 €</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500 shrink-0" />
                    <span>Pago 100 % seguro</span>
                  </div>
                </div>
              </div>

              {/* Right: avatar */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                <Image
                  src="/avatar-libercopy.png"
                  alt="Mascota de LiberCopy con documentos en blanco y negro"
                  width={380}
                  height={380}
                  className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Beneficios ─── */}
        <section className="py-16 bg-white/70">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Todo lo que necesitas para{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  imprimir sin complicaciones
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Calidad profesional, precios bajos y comodidad desde casa
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Clara y legible</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Impresión con contraste óptimo. Textos, esquemas y tablas se ven con nitidez en cada página.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Layers className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Doble cara disponible</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Ahorra papel y dinero imprimiendo por ambas caras. Perfecto para apuntes largos y temarios de oposición.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Ideal para apuntes y temarios</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Diseñada para documentos académicos. Desde apuntes universitarios hasta temarios completos de oposiciones.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Envío a domicilio</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Recibes tu pedido en 24-48 h sin salir de casa. Envío gratis a partir de 25 € en toda España peninsular.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sm:col-span-2 md:col-span-1">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Paperclip className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Grapado o espiral</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Añade grapado para documentos cortos o encuadernación en espiral para temarios y cuadernos de estudio.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ─── Cómo funciona ─── */}
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
                Sin complicaciones. De tu ordenador a tu buzón en menos de 48 horas
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  icon: UploadCloud,
                  title: "Sube tu archivo",
                  description:
                    "Arrastra tu PDF o selecciónalo desde tu dispositivo. Aceptamos archivos de hasta 50 MB.",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100",
                },
                {
                  step: "2",
                  icon: Settings2,
                  title: "Configura la impresión",
                  description:
                    "Elige una o doble cara, número de copias y el acabado que necesitas: sin acabado, grapado o espiral.",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100",
                },
                {
                  step: "3",
                  icon: PackageCheck,
                  title: "Recibe el pedido en casa",
                  description:
                    "Confirma el pago de forma segura y recibe tus documentos impresos en 24-48 h laborables.",
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

        {/* ─── Casos de uso ─── */}
        <section className="py-16 bg-white/70">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Para quién está pensado este{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  servicio de impresión
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Cualquier persona que necesite imprimir documentos sin perder tiempo ni gastar de más
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: BookOpen,
                  title: "Estudiantes universitarios",
                  description:
                    "Apuntes de carrera, trabajos de fin de grado, resúmenes y esquemas para estudiar con papel. Sin depender de la impresora del campus ni de la biblioteca.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: FileText,
                  title: "Opositores",
                  description:
                    "Temarios extensos de centenares o miles de páginas que necesitan una impresión económica, duradera y bien organizada para meses de estudio intensivo.",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: GraduationCap,
                  title: "Profesores y docentes",
                  description:
                    "Fichas, exámenes, apuntes propios y material didáctico para repartir en clase. Pedidos recurrentes con acabado profesional sin necesitar una imprenta.",
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: Layers,
                  title: "Documentos largos y corporativos",
                  description:
                    "Manuales, informes, contratos y documentación técnica que necesitan impresión clara y económica sin importar el volumen de páginas.",
                  color: "from-orange-500 to-orange-600",
                },
              ].map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="flex gap-5 p-6 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shrink-0`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
                  </div>
                </div>
              ))}
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
                    cuánto cuesta tu impresión
                  </span>{" "}
                  antes de subir el PDF
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Introduce el número de páginas, elige una o doble cara y el acabado. Precio total en segundos, sin sorpresas.
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Preguntas frecuentes sobre{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  impresión en blanco y negro A4
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Resolvemos las dudas más comunes antes de que hagas tu pedido
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-gray-600 mb-4">
                ¿Tienes otra duda?{" "}
                <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4">
                  Visita nuestra página de preguntas frecuentes
                </Link>{" "}
                o escríbenos a{" "}
                <a
                  href="mailto:info@libercopy.es"
                  className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
                >
                  info@libercopy.es
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
              Imprime tus documentos en blanco y negro ahora
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Sube tu PDF, calcula el precio al instante y recíbelo impreso en tu domicilio en 24-48 h
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/imprimir">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Printer className="mr-2 h-5 w-5" />
                  Empezar pedido
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
    </>
  )
}
