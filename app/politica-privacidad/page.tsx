import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Info } from "lucide-react"
import { generateCanonicalMetadata } from "@/lib/canonical-url"

export const metadata: Metadata = {
  title: "Política de Privacidad - LiberCopy",
  description:
    "Política de privacidad de LiberCopy. Información sobre el tratamiento de datos personales y derechos de los usuarios.",
  ...generateCanonicalMetadata("/politica-privacidad"),
}

export default function PoliticaPrivacidad() {
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

            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Política de Privacidad</h1>
          </div>
        </div>
      </section>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Responsable del Tratamiento</h2>
                <p className="text-gray-700 mb-4">El responsable del tratamiento de sus datos personales es:</p>
                <ul className="text-gray-700 space-y-2">
                  <li>
                    <strong>Denominación:</strong> LiberCopy - Grupo Lantia
                  </li>
                  <li>
                    <strong>Correo electrónico:</strong> info@libercopy.es
                  </li>
                  <li>
                    <strong>Sitio web:</strong> www.libercopy.es
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Finalidades del Tratamiento</h2>
                <p className="text-gray-700 mb-4">Tratamos sus datos personales para las siguientes finalidades:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Gestión de pedidos y prestación de servicios de impresión y encuadernación</li>
                  <li>Comunicación con el cliente y atención al cliente</li>
                  <li>Facturación y gestión contable</li>
                  <li>Envío de comunicaciones comerciales (con su consentimiento)</li>
                  <li>Cumplimiento de obligaciones legales</li>
                  <li>Mejora de nuestros servicios y experiencia del usuario</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Base Legal del Tratamiento</h2>
                <p className="text-gray-700 mb-4">Las bases legales que legitiman el tratamiento de sus datos son:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Ejecución contractual:</strong> Para la prestación de nuestros servicios
                  </li>
                  <li>
                    <strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales
                  </li>
                  <li>
                    <strong>Interés legítimo:</strong> Para la mejora de nuestros servicios
                  </li>
                  <li>
                    <strong>Obligación legal:</strong> Para el cumplimiento de obligaciones fiscales y contables
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Datos que Recopilamos</h2>
                <p className="text-gray-700 mb-4">Los tipos de datos personales que podemos recopilar incluyen:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Datos de identificación (nombre, apellidos, DNI/NIE)</li>
                  <li>Datos de contacto (dirección, teléfono, email)</li>
                  <li>Datos de facturación y pago</li>
                  <li>Datos de navegación y uso del sitio web</li>
                  <li>Archivos subidos para impresión</li>
                  <li>Preferencias de servicios</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Conservación de Datos</h2>
                <p className="text-gray-700">
                  Conservaremos sus datos personales durante el tiempo necesario para cumplir con las finalidades para
                  las que fueron recogidos y, en todo caso, durante los plazos establecidos por la legislación
                  aplicable. Los datos de facturación se conservarán durante el plazo legalmente establecido (6 años
                  desde la última anotación).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Destinatarios de los Datos</h2>
                <p className="text-gray-700 mb-4">Sus datos personales podrán ser comunicados a:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Proveedores de servicios de impresión y logística</li>
                  <li>Entidades financieras para el procesamiento de pagos</li>
                  <li>Administraciones públicas cuando sea legalmente requerido</li>
                  <li>Proveedores de servicios tecnológicos (hosting, email, etc.)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Sus Derechos</h2>
                <p className="text-gray-700 mb-4">Usted tiene derecho a:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Acceso:</strong> Obtener información sobre el tratamiento de sus datos
                  </li>
                  <li>
                    <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
                  </li>
                  <li>
                    <strong>Supresión:</strong> Solicitar la eliminación de sus datos
                  </li>
                  <li>
                    <strong>Limitación:</strong> Restringir el tratamiento de sus datos
                  </li>
                  <li>
                    <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado
                  </li>
                  <li>
                    <strong>Oposición:</strong> Oponerse al tratamiento de sus datos
                  </li>
                  <li>
                    <strong>Retirada del consentimiento:</strong> En cualquier momento
                  </li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Para ejercer estos derechos, puede contactarnos en: info@libercopy.es
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Seguridad</h2>
                <p className="text-gray-700">
                  Hemos implementado medidas técnicas y organizativas apropiadas para proteger sus datos personales
                  contra el acceso no autorizado, la alteración, divulgación o destrucción. Utilizamos cifrado SSL,
                  acceso restringido y sistemas de backup seguros.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Cookies</h2>
                <p className="text-gray-700">
                  Utilizamos cookies para mejorar la funcionalidad de nuestro sitio web y analizar el uso del mismo.
                  Para más información, consulte nuestra
                  <a href="/politica-cookies" className="text-blue-600 hover:underline">
                    {" "}
                    Política de Cookies
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Reclamaciones</h2>
                <p className="text-gray-700">
                  Si considera que el tratamiento de sus datos personales no se ajusta a la normativa, puede presentar
                  una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
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
