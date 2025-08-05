import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import Footer from "@/components/footer"
import { Info  } from "lucide-react"
export const metadata: Metadata = {
  title: "Política de Cookies - LiberCopy",
  description:
    "Política de cookies de LiberCopy. Información sobre el uso de cookies y tecnologías similares en nuestro sitio web.",
}

export default function PoliticaCookies() {
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
            
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Política de Cookies</h1>
            
          </div>
        </div>
      </section>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          

          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. ¿Qué son las Cookies?</h2>
              <p className="text-gray-700">
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio
                web. Permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, para
                que no tenga que volver a configurarlas cada vez que regrese al sitio o navegue de una página a otra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. ¿Cómo Utilizamos las Cookies?</h2>
              <p className="text-gray-700 mb-4">En LiberCopy utilizamos cookies para:</p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>Mantener su sesión activa mientras navega por el sitio</li>
                <li>Recordar sus preferencias de configuración</li>
                <li>Mantener los productos en su carrito de compra</li>
                <li>Analizar cómo utiliza nuestro sitio web para mejorarlo</li>
                <li>Personalizar el contenido y los anuncios</li>
                <li>Proporcionar funciones de redes sociales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Tipos de Cookies que Utilizamos</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies Estrictamente Necesarias</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Cookies de sesión de usuario</li>
                    <li>Cookies de carrito de compra</li>
                    <li>Cookies de seguridad</li>
                    <li>Cookies de preferencias de idioma</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies de Rendimiento</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies recopilan información sobre cómo utiliza el sitio web para ayudarnos a mejorarlo.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Google Analytics</li>
                    <li>Cookies de tiempo de carga de página</li>
                    <li>Cookies de seguimiento de errores</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies de Funcionalidad</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies permiten que el sitio web recuerde las elecciones que hace para proporcionarle
                    funciones mejoradas y contenido personalizado.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Preferencias de usuario</li>
                    <li>Configuración de tema (claro/oscuro)</li>
                    <li>Configuración de accesibilidad</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies de Marketing</h3>
                  <p className="text-gray-700 mb-2">
                    Estas cookies se utilizan para mostrarle anuncios relevantes y medir la efectividad de nuestras
                    campañas publicitarias.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Cookies de redes sociales</li>
                    <li>Cookies de seguimiento de conversiones</li>
                    <li>Cookies de remarketing</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies de Terceros</h2>
              <p className="text-gray-700 mb-4">
                Algunos de nuestros socios también pueden establecer cookies en su dispositivo cuando visita nuestro
                sitio. Estos incluyen:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>
                  <strong>Google Analytics:</strong> Para análisis de tráfico web
                </li>
                <li>
                  <strong>PayPal:</strong> Para procesamiento de pagos
                </li>
                <li>
                  <strong>Redes Sociales:</strong> Para funciones de compartir en redes sociales
                </li>
                <li>
                  <strong>Proveedores de Chat:</strong> Para soporte al cliente en línea
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Duración de las Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies de Sesión</h3>
                  <p className="text-gray-700">Se eliminan automáticamente cuando cierra su navegador.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cookies Persistentes</h3>
                  <p className="text-gray-700">
                    Permanecen en su dispositivo durante un período específico o hasta que las elimine manualmente. La
                    duración varía desde unos días hasta varios años, dependiendo del propósito de la cookie.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Gestión de Cookies</h2>
              <p className="text-gray-700 mb-4">Puede controlar y gestionar las cookies de varias maneras:</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Panel de Configuración de Cookies</h3>
                  <p className="text-gray-700">
                    Puede gestionar sus preferencias de cookies utilizando nuestro panel de configuración que aparece
                    cuando visita nuestro sitio por primera vez.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Configuración del Navegador</h3>
                  <p className="text-gray-700 mb-2">
                    La mayoría de los navegadores web permiten controlar las cookies a través de su configuración:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>
                      <strong>Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies
                    </li>
                    <li>
                      <strong>Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies
                    </li>
                    <li>
                      <strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Cookies
                    </li>
                    <li>
                      <strong>Edge:</strong> Configuración &gt; Privacidad &gt; Cookies
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Consecuencias de Desactivar las Cookies</h2>
              <p className="text-gray-700 mb-4">
                Si decide desactivar las cookies, algunas funciones de nuestro sitio web pueden no funcionar
                correctamente:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>No podrá mantener productos en su carrito de compra</li>
                <li>Tendrá que iniciar sesión cada vez que visite el sitio</li>
                <li>Sus preferencias no se recordarán</li>
                <li>Algunas funciones personalizadas no estarán disponibles</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Actualizaciones de esta Política</h2>
              <p className="text-gray-700">
                Podemos actualizar esta Política de Cookies ocasionalmente para reflejar cambios en las cookies que
                utilizamos o por razones operativas, legales o reglamentarias. Le recomendamos que revise esta página
                periódicamente para mantenerse informado sobre nuestro uso de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contacto</h2>
              <p className="text-gray-700">
                Si tiene alguna pregunta sobre nuestra Política de Cookies, puede contactarnos en:
                <br />
                <strong>Email:</strong> info@libercopy.es
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
