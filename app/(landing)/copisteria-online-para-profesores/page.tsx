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
  ArrowRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  FileText,
  Layers,
  UploadCloud,
  Settings2,
  PackageCheck,
  BookOpen,
  ClipboardList,
  Clock,
  RefreshCw,
  Wifi,
} from "lucide-react"
import { buildServiceSchema, buildFaqSchema, type FaqItem } from "@/lib/schemas"

const PAGE_URL = "https://www.libercopy.es/copisteria-online-para-profesores"

const faqs: FaqItem[] = [
  {
    question: "¿Puedo imprimir exámenes y fichas para toda la clase?",
    answer:
      "Sí. Puedes indicar el número de copias que necesitas al configurar el pedido. Imprimimos desde una sola copia hasta cientos de ellas, manteniendo el mismo precio por página.",
  },
  {
    question: "¿Qué tipo de material didáctico podéis imprimir?",
    answer:
      "Imprimimos cualquier documento en PDF: exámenes, fichas de trabajo, apuntes propios, dossiers, presentaciones, guías didácticas y cualquier otro material que uses en clase.",
  },
  {
    question: "¿Puedo hacer pedidos recurrentes cada semana o mes?",
    answer:
      "Sí. Muchos docentes hacen pedidos periódicos para su material de clase. El proceso es siempre el mismo: sube el PDF, configura las opciones y realiza el pago. Cada pedido llega en 24-48 h.",
  },
  {
    question: "¿El material llega a mi domicilio o puedo indicar otra dirección?",
    answer:
      "Puedes indicar la dirección de entrega que quieras al finalizar el pedido. Algunos profesores prefieren recibirlo directamente en el centro educativo, siempre que sea una dirección válida de entrega.",
  },
  {
    question: "¿Ofrecéis descuentos por volumen para docentes?",
    answer:
      "El precio por página ya refleja economías de escala: cuanto más imprimes en un solo pedido, más barato resulta el coste por página. Puedes comprobarlo en nuestra calculadora de precios.",
  },
  {
    question: "¿Qué acabados son más habituales para material de clase?",
    answer:
      "Para fichas y exámenes de pocas páginas, el grapado es el acabado más habitual y económico. Para dossieres o unidades didácticas más largas, la encuadernación en espiral es la opción más práctica.",
  },
]

const serviceJsonLd = buildServiceSchema({
  name: "Copistería online para profesores",
  description:
    "Servicio de impresión y copistería online especializado en docentes. Exámenes, fichas, apuntes y material didáctico con envío a domicilio en toda España.",
  url: PAGE_URL,
  serviceType: "Copistería online para docentes",
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

export default function CopisteriaOnlineParaProfesoresPage() {
  return (
    <>
      <Script
        id="jsonld-service-profesores"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Script
        id="jsonld-faq-profesores"
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
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Para docentes y profesores
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight text-balance">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Copistería online para profesores
                  </span>{" "}
                  sin desplazamientos
                </h1>

                <p className="text-xl text-gray-600 mb-3 leading-relaxed">
                  Imprime exámenes, fichas, apuntes y material didáctico desde casa. Recíbelo impreso y listo para clase en 24-48 h.
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
                      Sube tu material y empieza
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
                    { icon: CheckCircle, color: "text-blue-500", text: "Cualquier número de copias" },
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
                  alt="Mascota de LiberCopy con material didáctico para profesores"
                  width={380}
                  height={380}
                  className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Qué puedes imprimir */}
        <section className="py-16 bg-white/70">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Material que los docentes{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  imprimen con Libercopy
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Cualquier documento en PDF, para cualquier etapa educativa y cualquier asignatura
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: ClipboardList,
                  color: "from-blue-500 to-blue-600",
                  title: "Exámenes y controles",
                  desc: "Imprime tantas copias como alumnos tengas. Sin depender de la fotocopiadora del centro ni de su disponibilidad.",
                },
                {
                  icon: FileText,
                  color: "from-purple-500 to-purple-600",
                  title: "Fichas de trabajo",
                  desc: "Actividades, ejercicios y fichas para repartir en clase. Listas para usar, sin preparación extra.",
                },
                {
                  icon: BookOpen,
                  color: "from-green-500 to-green-600",
                  title: "Apuntes y dossieres",
                  desc: "Material de teoría, resúmenes y unidades didácticas completas con el acabado que prefieras.",
                },
                {
                  icon: Layers,
                  color: "from-orange-500 to-orange-600",
                  title: "Presentaciones impresas",
                  desc: "Diapositivas en formato papel para que los alumnos puedan tomar apuntes encima durante la explicación.",
                },
                {
                  icon: RefreshCw,
                  color: "from-pink-500 to-pink-600",
                  title: "Pedidos recurrentes",
                  desc: "Gestiona fácilmente los pedidos periódicos de cada semana o trimestre sin complicarte con el proceso.",
                },
                {
                  icon: Wifi,
                  color: "from-teal-500 to-teal-600",
                  title: "100 % online",
                  desc: "Sin desplazamientos ni colas. Sube el PDF, configura el pedido y recíbelo en casa o en el centro.",
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
                Gestiona la impresión de tu material de clase sin salir de casa
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  icon: UploadCloud,
                  title: "Sube tu material en PDF",
                  description: "Arrastra los archivos o selecciónanos desde tu dispositivo. Puedes incluir varios archivos en un mismo pedido.",
                  color: "from-blue-500 to-blue-600",
                  bgColor: "from-blue-50 to-blue-100",
                },
                {
                  step: "2",
                  icon: Settings2,
                  title: "Configura copias y acabado",
                  description: "Elige BN o color, una o doble cara, el número de copias y el acabado: sin acabado, grapado o espiral.",
                  color: "from-purple-500 to-purple-600",
                  bgColor: "from-purple-50 to-purple-100",
                },
                {
                  step: "3",
                  icon: PackageCheck,
                  title: "Recibe el pedido",
                  description: "Confirma el pago y recibe el material impreso en 24-48 h laborables en la dirección que indiques.",
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
                    cuánto cuesta imprimir tu material de clase
                  </span>{" "}
                  antes de subir el PDF
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Obtén un presupuesto sin registro ni subida de archivos.
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
                  copistería online para profesores
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
              Tu material didáctico impreso y en tu puerta en 24-48 h
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Sin colas, sin fotocopiadora rota, sin desplazamientos. Solo sube el PDF y nosotros nos encargamos.
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
