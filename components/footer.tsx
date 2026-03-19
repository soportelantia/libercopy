"use client"

import Link from "next/link"
import { Instagram } from "lucide-react"

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
              <a
                href="https://tiktok.com/@libercopy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Síguenos en TikTok"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://x.com/LibercopyOnline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Síguenos en X"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.245 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1EpbbMPf2L/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Síguenos en Facebook"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
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
