import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Info  } from "lucide-react"
export const metadata: Metadata = {
  title: "Condiciones Generales de Compra - LiberCopy",
  description:
    "Condiciones generales de compra de LiberCopy. Términos y condiciones para la contratación de servicios.",
}

export default function CondicionesCompra() {
  return (
  <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{paddingBottom: "4rem"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Info className="w-4 h-4 mr-2" />
              Grupo Lantia
            </Badge>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Condiciones Generales de Compra</h1>
            
          </div>
        </div>
      </section>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objeto y Ámbito de Aplicación</h2>
              <p className="text-gray-700">
                Las presentes condiciones generales regulan la contratación de servicios de impresión y encuadernación
                ofrecidos por LiberCopy - Grupo Lantia a través de su sitio web www.libercopy.es. La realización de un
                pedido implica la aceptación expresa de estas condiciones.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Servicios Ofrecidos</h2>
              <p className="text-gray-700 mb-4">LiberCopy ofrece los siguientes servicios:</p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>Impresión digital en diversos formatos y calidades</li>
                <li>Servicios de encuadernación (rústica, tapa dura, espiral, etc.)</li>
                <li>Impresión de documentos académicos y profesionales</li>
                <li>Servicios de distribución y envío</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Proceso de Pedido</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3.1 Realización del Pedido</h3>
                  <p className="text-gray-700">
                    El cliente deberá subir los archivos a imprimir, seleccionar las opciones de impresión y
                    encuadernación, y proporcionar los datos de facturación y envío.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3.2 Confirmación</h3>
                  <p className="text-gray-700">
                    Una vez realizado el pedido, el cliente recibirá un email de confirmación con los detalles del mismo
                    y el número de pedido.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3.3 Revisión Técnica</h3>
                  <p className="text-gray-700">
                    LiberCopy se reserva el derecho de revisar los archivos y contactar al cliente si detecta problemas
                    técnicos que puedan afectar la calidad del resultado final.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Precios y Pago</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4.1 Precios</h3>
                  <p className="text-gray-700">
                    Los precios mostrados en el sitio web incluyen IVA. LiberCopy se reserva el derecho de modificar los
                    precios sin previo aviso, aunque respetará los precios vigentes en el momento de la confirmación del
                    pedido.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">4.2 Formas de Pago</h3>
                  <p className="text-gray-700">
                    Se aceptan las siguientes formas de pago: tarjeta de crédito/débito, PayPal, transferencia bancaria
                    y Bizum. El pago debe realizarse antes del inicio de la producción.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Plazos de Entrega</h2>
              <p className="text-gray-700 mb-4">
                Los plazos de entrega son orientativos y se calculan desde la confirmación del pago y la aprobación
                técnica de los archivos. Los plazos pueden variar según:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>Tipo de servicio solicitado</li>
                <li>Cantidad de ejemplares</li>
                <li>Complejidad del trabajo</li>
                <li>Disponibilidad de materiales</li>
                <li>Época del año (períodos de alta demanda)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Envío y Entrega</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6.1 Modalidades de Envío</h3>
                  <p className="text-gray-700">
                    Ofrecemos diferentes modalidades de envío: estándar, urgente y recogida en punto de entrega. Los
                    gastos de envío se calcularán según el peso, destino y modalidad elegida.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6.2 Responsabilidad en el Transporte</h3>
                  <p className="text-gray-700">
                    LiberCopy no se hace responsable de retrasos o daños causados por la empresa de transporte. En caso
                    de incidencias, colaboraremos en la gestión de reclamaciones.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Derecho de Desistimiento</h2>
              <p className="text-gray-700">
                Debido a la naturaleza personalizada de nuestros servicios, no se admite el derecho de desistimiento una
                vez iniciada la producción. El cliente puede cancelar el pedido únicamente antes del inicio de la
                producción, previa comunicación por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Garantías y Reclamaciones</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">8.1 Garantía de Calidad</h3>
                  <p className="text-gray-700">
                    Garantizamos la calidad de nuestros servicios conforme a los estándares profesionales. En caso de
                    defectos de impresión o encuadernación, procederemos a la reimpresión sin coste adicional.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">8.2 Plazo de Reclamación</h3>
                  <p className="text-gray-700">
                    Las reclamaciones por defectos deben comunicarse en un plazo máximo de 7 días desde la recepción del
                    pedido.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Propiedad Intelectual</h2>
              <p className="text-gray-700">
                El cliente declara ser titular de los derechos de propiedad intelectual de los archivos enviados para
                impresión, o contar con la autorización necesaria para su reproducción. LiberCopy no se hace responsable
                del uso indebido de contenidos protegidos por derechos de autor.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitación de Responsabilidad</h2>
              <p className="text-gray-700">
                La responsabilidad de LiberCopy se limita al importe del pedido. No nos hacemos responsables de daños
                indirectos, lucro cesante o perjuicios derivados del uso de nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Modificaciones</h2>
              <p className="text-gray-700">
                LiberCopy se reserva el derecho de modificar estas condiciones en cualquier momento. Las modificaciones
                serán efectivas desde su publicación en el sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Legislación Aplicable y Jurisdicción</h2>
              <p className="text-gray-700">
                Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se
                someten a los juzgados y tribunales del domicilio del consumidor o de la sede de LiberCopy.
              </p>
            </section>

            <div className="text-sm text-gray-500 pt-8 border-t">
              <p>Última actualización: Enero 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </main>
  )
}
