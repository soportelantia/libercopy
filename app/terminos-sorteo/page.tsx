import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Gift } from "lucide-react"
import { generateCanonicalMetadata } from "@/lib/canonical-url"

export const metadata: Metadata = {
  title: "Términos y Condiciones del Sorteo - LiberCopy",
  description: "Bases legales y términos y condiciones del sorteo en redes sociales de LiberCopy.",
  ...generateCanonicalMetadata("/terminos-sorteo"),
}

export default function TerminosSorteo() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Gift className="w-4 h-4 mr-2" />
              Sorteo en Redes Sociales
            </Badge>

            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Términos y Condiciones del Sorteo</h1>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Entidad Organizadora</h2>
                <p className="text-gray-700 mb-4">El presente sorteo está organizado por:</p>
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Ámbito de Aplicación</h2>
                <p className="text-gray-700">
                  Las presentes bases legales regulan el sorteo organizado por LiberCopy en sus redes sociales oficiales
                  (Instagram, Facebook, Twitter/X, etc.). La participación en este sorteo implica la aceptación íntegra
                  de estas bases.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Duración del Sorteo</h2>
                <p className="text-gray-700 mb-4">El sorteo tendrá la siguiente duración:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>
                    <strong>Fecha de inicio:</strong> Se especificará en la publicación del sorteo
                  </li>
                  <li>
                    <strong>Fecha de finalización:</strong> Se especificará en la publicación del sorteo
                  </li>
                  <li>
                    <strong>Anuncio del ganador:</strong> Se realizará dentro de las 48 horas siguientes al cierre del
                    sorteo
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Requisitos de Participación</h2>
                <p className="text-gray-700 mb-4">Podrán participar en el sorteo todas aquellas personas que:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Sean mayores de 18 años</li>
                  <li>Residan en España</li>
                  <li>Cumplan con los requisitos específicos indicados en la publicación del sorteo</li>
                  <li>Acepten las presentes bases legales</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Quedan excluidos de participar los empleados de LiberCopy y sus familiares directos.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Mecánica del Sorteo</h2>
                <p className="text-gray-700 mb-4">
                  Para participar en el sorteo, los usuarios deberán cumplir con los requisitos específicos indicados en
                  cada publicación, que podrán incluir:
                </p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Seguir la cuenta oficial de LiberCopy en la red social correspondiente</li>
                  <li>Dar "me gusta" a la publicación del sorteo</li>
                  <li>Comentar la publicación según las instrucciones indicadas</li>
                  <li>Etiquetar a uno o varios amigos en los comentarios</li>
                  <li>Compartir la publicación (si se especifica)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Selección del Ganador</h2>
                <p className="text-gray-700 mb-4">
                  El ganador será seleccionado de forma aleatoria mediante herramientas de sorteo online verificables
                  entre todos los participantes que cumplan con los requisitos establecidos.
                </p>
                <p className="text-gray-700">
                  El ganador será contactado a través de mensaje privado en la red social correspondiente y deberá
                  responder en un plazo máximo de 7 días naturales. En caso de no responder en dicho plazo, se procederá
                  a seleccionar un nuevo ganador.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Premio</h2>
                <p className="text-gray-700 mb-4">
                  El premio consistirá en lo especificado en cada publicación del sorteo. El premio:
                </p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>No es transferible ni canjeable por dinero en efectivo</li>
                  <li>No incluye gastos adicionales no especificados expresamente</li>
                  <li>Será entregado en las condiciones y plazos indicados en la publicación</li>
                  <li>Los gastos de envío correrán a cargo de LiberCopy dentro del territorio español</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Protección de Datos</h2>
                <p className="text-gray-700 mb-4">
                  Los datos personales facilitados por los participantes serán tratados por LiberCopy con la finalidad
                  de gestionar el sorteo y contactar con el ganador.
                </p>
                <p className="text-gray-700 mb-4">
                  La base legal para el tratamiento es el consentimiento del interesado al participar en el sorteo. Los
                  datos se conservarán durante el tiempo necesario para gestionar el sorteo y cumplir con las
                  obligaciones legales.
                </p>
                <p className="text-gray-700">
                  Los participantes pueden ejercer sus derechos de acceso, rectificación, supresión, limitación,
                  portabilidad y oposición enviando un correo electrónico a info@libercopy.es.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Responsabilidades</h2>
                <p className="text-gray-700 mb-4">LiberCopy se reserva el derecho de:</p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Modificar las presentes bases por causas justificadas</li>
                  <li>Cancelar o suspender el sorteo por causas de fuerza mayor</li>
                  <li>Descalificar a participantes que incumplan las bases o actúen de forma fraudulenta</li>
                  <li>Resolver cualquier situación no prevista en estas bases</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  LiberCopy no se hace responsable de problemas técnicos, errores o fallos en las redes sociales que
                  puedan afectar a la participación en el sorteo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Publicidad del Sorteo</h2>
                <p className="text-gray-700">
                  Al participar en el sorteo, el ganador autoriza a LiberCopy a publicar su nombre de usuario y/o imagen
                  de perfil en las redes sociales para anunciar el resultado del sorteo, salvo que manifieste
                  expresamente su oposición.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Independencia de las Redes Sociales</h2>
                <p className="text-gray-700">
                  Este sorteo no está patrocinado, avalado, administrado ni asociado de ninguna manera con Instagram,
                  Facebook, Twitter/X o cualquier otra red social. Los participantes liberan completamente a estas
                  plataformas de cualquier responsabilidad relacionada con el sorteo.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Legislación Aplicable</h2>
                <p className="text-gray-700">
                  Estas bases se rigen por la legislación española. Para cualquier controversia derivada del sorteo,
                  serán competentes los Juzgados y Tribunales de Sevilla, renunciando expresamente las partes a
                  cualquier otro fuero que pudiera corresponderles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Aceptación de las Bases</h2>
                <p className="text-gray-700">
                  La participación en este sorteo implica la aceptación íntegra de las presentes bases legales.
                  LiberCopy se reserva el derecho de interpretar estas bases y resolver cualquier situación no prevista
                  en las mismas.
                </p>
              </section>

              <div className="text-sm text-gray-500 pt-8 border-t">
                <p>Última actualización: Enero 2025</p>
                <p className="mt-2">
                  Para cualquier consulta sobre el sorteo, puede contactar con nosotros en info@libercopy.es
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
