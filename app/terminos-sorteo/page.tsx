import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Gift } from "lucide-react"
import { generateCanonicalMetadata } from "@/lib/canonical-url"

export const metadata: Metadata = {
  title: "Términos y Condiciones del Sorteo - LiberCopy",
  description:
    "Términos y condiciones del sorteo en redes sociales de LiberCopy. Bases legales y requisitos de participación.",
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
                    <strong>Nombre comercial:</strong> LiberCopy - Grupo Lantia
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
                  Las presentes bases regulan el sorteo organizado por LiberCopy en sus redes sociales oficiales
                  (Instagram, Facebook, Twitter/X, TikTok). La participación en el sorteo implica la aceptación íntegra
                  de estas bases.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Duración del Sorteo</h2>
                <p className="text-gray-700 mb-4">
                  El sorteo tendrá una duración determinada que se especificará en la publicación del sorteo en redes
                  sociales, indicando claramente:
                </p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Fecha y hora de inicio del sorteo</li>
                  <li>Fecha y hora de finalización del sorteo</li>
                  <li>Fecha prevista para el anuncio del ganador/a</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  LiberCopy se reserva el derecho de modificar estas fechas por causas justificadas, comunicándolo a
                  través de sus redes sociales.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Requisitos de Participación</h2>
                <p className="text-gray-700 mb-4">
                  Podrán participar en el sorteo todas las personas que cumplan los siguientes requisitos:
                </p>
                <ul className="text-gray-700 space-y-2 list-disc list-inside">
                  <li>Ser mayor de 18 años</li>
                  <li>Residir en España (península y Baleares)</li>
                  <li>Seguir la cuenta oficial de LiberCopy en la red social donde se realiza el sorteo</li>
                  <li>
                    Cumplir con las condiciones específicas indicadas en la publicación del sorteo (comentar, etiquetar,
                    compartir, etc.)
                  </li>
                  <li>Tener un perfil público o permitir que LiberCopy pueda verificar su participación</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Quedan excluidos de participar los empleados de LiberCopy y sus familiares directos (cónyuge, padres,
                  hijos y hermanos).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Mecánica del Sorteo</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">5.1 Forma de Participación</h3>
                    <p className="text-gray-700">
                      Para participar en el sorteo, los usuarios deberán seguir las instrucciones específicas indicadas
                      en la publicación del sorteo, que pueden incluir: seguir la cuenta, dar "me gusta" a la
                      publicación, comentar, etiquetar a amigos, compartir la publicación, o cualquier otra acción que
                      se especifique.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">5.2 Número de Participaciones</h3>
                    <p className="text-gray-700">
                      Cada usuario podrá participar una única vez en el sorteo, salvo que en las bases específicas se
                      indique lo contrario. Las participaciones duplicadas o fraudulentas serán descalificadas.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">5.3 Selección del Ganador</h3>
                    <p className="text-gray-700">
                      El ganador/a será seleccionado de forma aleatoria mediante herramientas de sorteo online
                      verificables (como Easypromos, Sortea2, o similares) entre todos los participantes que cumplan con
                      los requisitos establecidos.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Premio</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">6.1 Descripción del Premio</h3>
                    <p className="text-gray-700">
                      El premio consistirá en lo especificado en la publicación del sorteo, que puede incluir: servicios
                      de impresión gratuitos, descuentos, productos físicos, o cualquier otro premio que se detalle
                      expresamente.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">6.2 Entrega del Premio</h3>
                    <p className="text-gray-700">
                      El premio se entregará en un plazo máximo de 30 días desde la comunicación al ganador/a. Los
                      gastos de envío dentro de España peninsular y Baleares correrán a cargo de LiberCopy. Para envíos
                      a Canarias, Ceuta y Melilla, se evaluará cada caso particular.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">6.3 Intransferibilidad</h3>
                    <p className="text-gray-700">
                      El premio no es transferible ni canjeable por dinero en efectivo. No se admitirá ningún cambio o
                      modificación del premio por otro de características diferentes.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Comunicación con el Ganador</h2>
                <p className="text-gray-700 mb-4">
                  El ganador/a será anunciado públicamente en la red social donde se realizó el sorteo y será contactado
                  mediante mensaje directo (DM) en un plazo máximo de 48 horas desde la finalización del sorteo.
                </p>
                <p className="text-gray-700 mb-4">
                  El ganador/a deberá responder al mensaje en un plazo máximo de 7 días naturales proporcionando sus
                  datos personales (nombre completo, DNI/NIE, dirección postal completa, teléfono de contacto y correo
                  electrónico) para poder recibir el premio.
                </p>
                <p className="text-gray-700">
                  Si el ganador/a no responde en el plazo establecido o no proporciona los datos necesarios, se
                  entenderá que renuncia al premio y se procederá a seleccionar un nuevo ganador/a mediante el mismo
                  sistema de sorteo aleatorio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Protección de Datos Personales</h2>
                <p className="text-gray-700 mb-4">
                  Los datos personales facilitados por el ganador/a serán tratados por LiberCopy con la finalidad
                  exclusiva de gestionar la entrega del premio del sorteo.
                </p>
                <p className="text-gray-700 mb-4">
                  La base legal del tratamiento es el consentimiento del interesado y la ejecución de la relación
                  derivada de la participación en el sorteo. Los datos se conservarán durante el tiempo necesario para
                  cumplir con la finalidad para la que fueron recogidos y para determinar las posibles responsabilidades
                  que se pudieran derivar de dicha finalidad.
                </p>
                <p className="text-gray-700">
                  El participante podrá ejercer sus derechos de acceso, rectificación, supresión, limitación,
                  portabilidad y oposición dirigiéndose a info@libercopy.es. Para más información, consulte nuestra
                  <a href="/politica-privacidad" className="text-blue-600 hover:underline ml-1">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Responsabilidades y Limitaciones</h2>
                <ul className="text-gray-700 space-y-3 list-disc list-inside">
                  <li>
                    LiberCopy no se hace responsable de problemas técnicos, fallos en las redes sociales, o cualquier
                    otra circunstancia ajena a su control que pueda afectar al desarrollo del sorteo.
                  </li>
                  <li>
                    LiberCopy se reserva el derecho de descalificar a cualquier participante que utilice métodos
                    fraudulentos, perfiles falsos, bots, o cualquier práctica que vulnere las condiciones del sorteo o
                    las normas de la red social.
                  </li>
                  <li>
                    LiberCopy no se hace responsable de los datos erróneos o falsos proporcionados por los
                    participantes.
                  </li>
                  <li>
                    Este sorteo no está patrocinado, avalado, administrado ni asociado de ninguna manera con Instagram,
                    Facebook, Twitter/X, TikTok o cualquier otra red social donde se realice.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modificación y Cancelación</h2>
                <p className="text-gray-700">
                  LiberCopy se reserva el derecho de modificar, suspender o cancelar el sorteo en cualquier momento por
                  causas justificadas (fuerza mayor, problemas técnicos, cambios en las políticas de las redes sociales,
                  etc.), comunicándolo a través de sus canales oficiales. En caso de cancelación, no existirá ningún
                  tipo de compensación para los participantes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Aceptación de las Bases</h2>
                <p className="text-gray-700">
                  La participación en este sorteo implica la aceptación íntegra de las presentes bases. LiberCopy se
                  reserva el derecho de interpretar estas bases y resolver cualquier cuestión derivada del sorteo. Las
                  decisiones de LiberCopy serán inapelables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Legislación Aplicable y Jurisdicción</h2>
                <p className="text-gray-700">
                  Estas bases se rigen por la legislación española. Para cualquier controversia derivada de la
                  interpretación o aplicación de estas bases, las partes se someten expresamente a los Juzgados y
                  Tribunales de Sevilla, renunciando a cualquier otro fuero que pudiera corresponderles.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Publicación de las Bases</h2>
                <p className="text-gray-700">
                  Las presentes bases estarán disponibles durante todo el período del sorteo en la página web
                  www.libercopy.es/terminos-sorteo y podrán ser consultadas por cualquier participante.
                </p>
              </section>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">Información Importante</h3>
                <p className="text-gray-700 text-sm">
                  Este sorteo es una promoción de LiberCopy y no está patrocinado, avalado ni administrado por ninguna
                  red social. Al participar, los usuarios liberan completamente a las redes sociales de cualquier
                  responsabilidad. Para cualquier consulta sobre el sorteo, contacte con info@libercopy.es
                </p>
              </div>

              <div className="text-sm text-gray-500 pt-8 border-t">
                <p>Última actualización: Enero 2025</p>
                <p className="mt-2">
                  Estas bases pueden ser actualizadas. Se recomienda consultar la versión más reciente en
                  www.libercopy.es/terminos-sorteo
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
