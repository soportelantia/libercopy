"use client"

import Link from "next/link"
import { Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/libercopy-white.svg"
                alt="LiberCopy - grupo lantia"
                className="h-20 w-auto transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Tu servicio de impresión y distribución editorial de confianza. Calidad profesional, entrega rápida y
              precios competitivos.
            </p>

            {/* Redes Sociales */}
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/libercopy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Síguenos en Instagram"
              >
                <Instagram size={24} />
              </a>
              
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/imprimir" className="hover:text-white transition-colors">
                  Impresión
                </Link>
              </li>
              <li>
                <Link href="/encuadernar" className="hover:text-white transition-colors">
                  Encuadernación
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>info@libercopy.es</li>
            </ul>
          </div>
        </div>

        {/* Enlaces legales */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
            <Link href="/aviso-legal" className="text-gray-400 hover:text-white transition-colors">
              Aviso Legal
            </Link>
            <Link href="/politica-privacidad" className="text-gray-400 hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/condiciones-compra" className="text-gray-400 hover:text-white transition-colors">
              Condiciones de Compra
            </Link>
            <Link href="/politica-cookies" className="text-gray-400 hover:text-white transition-colors">
              Política de Cookies
            </Link>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 LiberCopy - Grupo Lantia. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
