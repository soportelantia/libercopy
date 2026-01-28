import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Building2 } from "lucide-react"
import { generateCanonicalMetadata } from "@/lib/canonical-url"

export const metadata: Metadata = {
  title: "Sobre Nosotros - LiberCopy",
  description:
    "Conoce la historia y valores de LiberCopy, tu servicio de impresión y distribución editorial de confianza.",
  ...generateCanonicalMetadata("/sobre-nosotros"),
}

export default function SobreNosotros() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              Grupo Lantia
            </Badge>

            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Sobre Nosotros</h1>
          </div>
        </div>
      </section>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Historia</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                LiberCopy forma parte del Grupo Lantia y nace con la misión de hacer accesibles los servicios de
                impresión de alta calidad a cualquier persona. Ya seas estudiante, profesional, emprendedor o
                particular, ponemos a tu alcance soluciones personalizadas y eficientes para tus necesidades de
                impresión.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Con una sólida trayectoria en el sector de la impresión y la tecnología, hemos creado una plataforma que
                une la tradición del buen hacer con la innovación digital. Ofrecemos un servicio integral que abarca
                desde la impresión bajo demanda hasta opciones de entrega flexibles, con la calidad y rapidez que
                buscas.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nuestra Misión</h2>
              <p className="text-gray-700 leading-relaxed">
                Facilitar el acceso a servicios de impresión y encuadernación profesionales, ofreciendo calidad
                excepcional, precios competitivos y un servicio personalizado que se adapte a las necesidades
                específicas de cada cliente. Creemos en el poder de las ideas impresas y trabajamos para que cada
                proyecto editorial tenga la mejor presentación posible.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Nuestros Valores</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Calidad</h3>
                  <p className="text-gray-700">
                    Utilizamos tecnología de vanguardia y materiales de primera calidad para garantizar resultados
                    excepcionales en cada proyecto.
                  </p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Innovación</h3>
                  <p className="text-gray-700">
                    Constantemente mejoramos nuestros procesos y servicios para ofrecer soluciones más eficientes y
                    sostenibles.
                  </p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Compromiso</h3>
                  <p className="text-gray-700">
                    Nos comprometemos con cada cliente para entregar sus proyectos en tiempo y forma, superando sus
                    expectativas.
                  </p>
                </div>
                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Sostenibilidad</h3>
                  <p className="text-gray-700">
                    Trabajamos con proveedores responsables y utilizamos procesos que minimizan nuestro impacto
                    ambiental.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">¿Por qué elegir LiberCopy?</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Más de 10 años de experiencia en el sector de la impresión</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Tecnología de impresión digital de última generación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Amplia variedad de formatos y opciones de encuadernación</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Servicio de atención al cliente personalizado</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Entrega rápida y segura en toda España</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Precios competitivos sin comprometer la calidad</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
