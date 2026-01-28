import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Info } from "lucide-react"
import { generateCanonicalMetadata } from "@/lib/canonical-url"

export const metadata: Metadata = {
  title: "Aviso Legal - LiberCopy",
  description:
    "Aviso legal de LiberCopy - Grupo Lantia. Información sobre la titularidad y condiciones de uso del sitio web.",
  ...generateCanonicalMetadata("/aviso-legal"),
}

export default function AvisoLegal() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Info className="w-4 h-4 mr-2" />
              Grupo Lantia
            </Badge>

            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Aviso Legal</h1>
          </div>
        </div>
      </section>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Aviso Legal</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Datos Identificativos</h2>
                <p className="text-gray-700 mb-4">
                  En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio,
                  de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan
                  los siguientes datos:
                </p>
                <ul className="text-gray-700 space-y-2">
                  <li>
                    <strong>Denominación social:</strong> Lantia Publishing SL
                  </li>
                  <li>
                    <strong>Domicilio:</strong> Plaza Magdalena 9, 3º Planta 41001 Sevilla
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong> info@libercopy.es
                  </li>
                  <li>
                    <strong>Sitio Web:</strong> www.libercopy.es
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Objeto</h2>
                <p className="text-gray-700">
                  El presente sitio web tiene por objeto facilitar al público, en general, el conocimiento de las
                  actividades que esta organización realiza y de los servicios que presta, así como permitir la
                  contratación de servicios de impresión y encuadernación online.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Condiciones de Uso</h2>
                <p className="text-gray-700 mb-4">
                  La utilización del sitio web le otorga la condición de usuario, e implica la aceptación completa de
                  todas las cláusulas y condiciones de uso incluidas en las páginas:
                </p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>
                    Si no está conforme con todas y cada una de estas cláusulas y condiciones absténgase de utilizar
                    este sitio web.
                  </li>
                  <li>El acceso a este sitio web es responsabilidad exclusiva de los usuarios.</li>
                  <li>
                    El simple acceso a este sitio web no supone entablar una relación comercial entre LiberCopy y el
                    usuario.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Responsabilidad</h2>
                <p className="text-gray-700 mb-4">
                  LiberCopy no se hace responsable de la información y contenidos almacenados, a título enunciativo pero
                  no limitativo, en foros, chats, generadores de blogs, comentarios, redes sociales o cualquier otro
                  medio que permita a terceros publicar contenidos de forma independiente en la página web del
                  prestador.
                </p>
                <p className="text-gray-700">
                  Sin embargo, y en cumplimiento de lo dispuesto en los artículos 11 y 16 de la LSSI-CE, LiberCopy se
                  pone a disposición de todos los usuarios, autoridades y fuerzas de seguridad, colaborando de forma
                  activa en la retirada o en su caso bloqueo de todos aquellos contenidos que puedan afectar o
                  contravenir la legislación nacional o internacional, derechos de terceros o la moral y el orden
                  público.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Propiedad Intelectual e Industrial</h2>
                <p className="text-gray-700">
                  LiberCopy por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e
                  industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo,
                  imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores,
                  estructura y diseño, selección de materiales usados, programas de ordenador necesarios para su
                  funcionamiento, acceso y uso, etc.), titularidad de LiberCopy o bien de sus licenciantes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Modificaciones</h2>
                <p className="text-gray-700">
                  LiberCopy se reserva el derecho de efectuar sin previo aviso las modificaciones que considere
                  oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se
                  presten a través de la misma como la forma en la que éstos aparezcan presentados o localizados en su
                  portal.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Legislación Aplicable y Jurisdicción</h2>
                <p className="text-gray-700">
                  Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de
                  las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten
                  expresamente las partes, siendo competentes para la resolución de todos los conflictos derivados o
                  relacionados con su uso los Juzgados y Tribunales españoles.
                </p>
              </section>

              <div className="text-sm text-gray-500 pt-8 border-t">
                <p>Última actualización: Enero 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
