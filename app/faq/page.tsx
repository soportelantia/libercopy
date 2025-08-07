"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  CreditCard,
  Truck,
  Settings,
  HelpCircle,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

type FAQItem = {
  id: string
  question: string
  answer: string | React.ReactNode
  category: "general" | "printing" | "payment" | "shipping" | "technical"
  tags: string[]
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: "what-is-libercopy",
    question: "¿Qué es LiberCopy?",
    answer: (
      <div className="space-y-3">
        <p>LiberCopy es tu servicio de impresión profesional online que te permite:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">Imprimir documentos y apuntes con calidad profesional</span>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">Encuadernar y dar acabados especiales</span>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">Recibir tus pedidos en casa</span>
          </div>
          
        </div>
      </div>
    ),
    category: "general",
    tags: ["servicio", "impresión", "online", "profesional"],
  },
  {
    id: "how-it-works",
    question: "¿Cómo funciona el servicio?",
    answer: (
      <div className="space-y-4">
        <p>Nuestro proceso es muy sencillo:</p>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-semibold text-blue-800">Sube tu archivo</h4>
              <p className="text-sm text-blue-700">Arrastra y suelta tu PDF o selecciónalo desde tu dispositivo</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-semibold text-green-800">Configura opciones</h4>
              <p className="text-sm text-green-700">Elige tipo de papel, color, acabados y número de copias</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-semibold text-purple-800">Realiza el pago</h4>
              <p className="text-sm text-purple-700">Paga de forma segura con tarjeta, PayPal o Bizum</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
            <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h4 className="font-semibold text-orange-800">Recibe tu pedido</h4>
              <p className="text-sm text-orange-700">Te lo enviamos a casa en 24-48 horas laborables</p>
            </div>
          </div>
        </div>
      </div>
    ),
    category: "general",
    tags: ["proceso", "funcionamiento", "pasos", "tutorial"],
  },
  {
    id: "office-location",
    question: "¿Dónde están ubicados?",
    answer: (
      <div className="space-y-3">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 text-white rounded-full p-2">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Oficina Principal</h4>
              <p className="text-gray-600">Plaza Magdalena 9, 3º Planta</p>
              <p className="text-gray-600">41001 Sevilla, España</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Horarios:</strong> Lunes a Viernes 9:00-18:00
          </p>
        </div>
      </div>
    ),
    category: "general",
    tags: ["ubicación", "oficina", "dirección", "sevilla"],
  },

  // Printing Questions
  {
    id: "supported-formats",
    question: "¿Qué formatos de archivo aceptan?",
    answer: (
      <div className="space-y-3">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Actualmente solo aceptamos archivos <strong>PDF</strong> para garantizar la mejor calidad de impresión.
          </AlertDescription>
        </Alert>
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">¿Por qué solo PDF?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Mantiene el formato original exacto</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Preserva la calidad de imágenes y texto</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Compatible con todos los dispositivos</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Evita problemas de compatibilidad</span>
            </li>
          </ul>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Consejo:</strong> Puedes convertir documentos Word, Excel o PowerPoint a PDF desde el propio
            programa usando "Guardar como PDF".
          </p>
        </div>
      </div>
    ),
    category: "printing",
    tags: ["formatos", "pdf", "archivos", "compatibilidad"],
  },
  {
    id: "paper-types",
    question: "¿Qué tipos de papel ofrecen?",
    answer: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-green-500 text-white">Disponible</Badge>
            </div>
            <h4 className="font-semibold text-blue-800">Papel 80g</h4>
            <p className="text-sm text-blue-700">Papel estándar ideal para documentos cotidianos</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 opacity-75">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">Próximamente</Badge>
            </div>
            <h4 className="font-semibold text-gray-600">Papel 90g</h4>
            <p className="text-sm text-gray-500">Papel de mayor grosor para documentos importantes</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 opacity-75">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary">Próximamente</Badge>
            </div>
            <h4 className="font-semibold text-gray-600">Papel 100g Premium</h4>
            <p className="text-sm text-gray-500">Papel premium para presentaciones profesionales</p>
          </div>
        </div>
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Estamos trabajando para ampliar nuestra gama de papeles. ¡Pronto tendrás más opciones disponibles!
          </AlertDescription>
        </Alert>
      </div>
    ),
    category: "printing",
    tags: ["papel", "tipos", "gramaje", "calidad"],
  },
  {
    id: "print-options",
    question: "¿Qué opciones de impresión tienen?",
    answer: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <h4 className="font-semibold text-purple-800 mb-3">Tipos de Impresión</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Blanco y negro</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Color</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-3">Orientación</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Vertical (Retrato)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Horizontal (Paisaje)</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-3">Caras</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Una cara</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Doble cara (ahorra papel)</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <h4 className="font-semibold text-orange-800 mb-3">Acabados</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Sin acabado</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Grapado (hasta 100 páginas)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">2 agujeros</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">4 agujeros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    category: "printing",
    tags: ["opciones", "impresión", "acabados", "configuración"],
  },
  {
    id: "file-size-limit",
    question: "¿Cuál es el tamaño máximo de archivo?",
    answer: (
      <div className="space-y-3">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            El tamaño máximo por archivo es de <strong>50MB</strong>.
          </AlertDescription>
        </Alert>
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">¿Por qué este límite?</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Garantiza tiempos de subida rápidos</li>
            <li>Evita problemas de conexión</li>
            <li>Optimiza el procesamiento de archivos</li>
            <li>Mejora la experiencia de usuario</li>
          </ul>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Consejo:</strong> Si tu archivo es muy grande, puedes dividirlo en partes más pequeñas o reducir la
            calidad de las imágenes.
          </p>
        </div>
      </div>
    ),
    category: "printing",
    tags: ["tamaño", "límite", "archivo", "subida"],
  },

  // Payment Questions
  {
    id: "payment-methods",
    question: "¿Qué métodos de pago aceptan?",
    answer: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-blue-800">Tarjeta</h4>
            <p className="text-sm text-blue-700">Visa, Mastercard, American Express</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center">
            <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-sm font-bold">PP</span>
            </div>
            <h4 className="font-semibold text-purple-800">PayPal</h4>
            <p className="text-sm text-purple-700">Pago seguro con tu cuenta PayPal</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center">
            <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-sm font-bold">BZ</span>
            </div>
            <h4 className="font-semibold text-green-800">Bizum</h4>
            <p className="text-sm text-green-700">Pago instantáneo desde tu móvil</p>
          </div>
        </div>
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Todos los pagos están protegidos con cifrado SSL y cumplen con los estándares PCI DSS.
          </AlertDescription>
        </Alert>
      </div>
    ),
    category: "payment",
    tags: ["pago", "métodos", "tarjeta", "paypal", "bizum"],
  },
  {
    id: "payment-security",
    question: "¿Es seguro el pago online?",
    answer: (
      <div className="space-y-3">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Sí, utilizamos los más altos estándares de seguridad para proteger tus datos.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-2">Certificaciones</h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>Certificado SSL 256-bit</li>
              <li>Cumplimiento PCI DSS</li>
              <li>Encriptación de extremo a extremo</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">Protección</h4>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>No almacenamos datos de tarjetas</li>
              <li>Procesadores certificados</li>
              <li>Monitoreo 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    category: "payment",
    tags: ["seguridad", "pago", "ssl", "protección"],
  },

  // Shipping Questions
  {
    id: "shipping-cost",
    question: "¿Cuánto cuesta el envío?",
    answer: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge className="bg-green-500 text-white">Envío Gratis</Badge>
            </div>
            <h4 className="font-semibold text-green-800">Pedidos ≥ 25€</h4>
            <p className="text-sm text-green-700">Sin coste adicional de envío</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="h-5 w-5 text-blue-500" />
              <Badge variant="secondary">2.99</Badge>
            </div>
            <h4 className="font-semibold text-blue-800">Pedidos &lt; 25€</h4>
            <p className="text-sm text-blue-700">Tarifa fija de envío</p>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <h4 className="font-semibold text-purple-800 mb-2">Zonas de envío</h4>
          <p className="text-sm text-purple-700">
            Realizamos envíos a toda España peninsular. Para Baleares, Canarias, Ceuta y Melilla, consulta condiciones
            especiales.
          </p>
        </div>
      </div>
    ),
    category: "shipping",
    tags: ["envío", "coste", "gratis", "tarifa"],
  },
  {
    id: "delivery-time",
    question: "¿Cuánto tardan en llegar los pedidos?",
    answer: (
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <Truck className="h-6 w-6 text-blue-500" />
            <h4 className="font-semibold text-gray-800">Tiempo de entrega estándar</h4>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              24-48h
            </div>
            <p className="text-sm text-gray-600">días laborables</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <h5 className="font-semibold text-green-800 text-sm">Pedidos urgentes</h5>
            <p className="text-xs text-green-700">Contacta con nosotros para opciones de entrega express</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <h5 className="font-semibold text-orange-800 text-sm">Seguimiento</h5>
            <p className="text-xs text-orange-700">Recibirás un código de seguimiento por email</p>
          </div>
        </div>
      </div>
    ),
    category: "shipping",
    tags: ["entrega", "tiempo", "envío", "seguimiento"],
  },

  // Technical Questions
  {
    id: "browser-compatibility",
    question: "¿Qué navegadores son compatibles?",
    answer: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-center">
            <div className="text-2xl mb-1">🌐</div>
            <p className="text-sm font-semibold">Chrome</p>
            <p className="text-xs text-gray-600">v90+</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg text-center">
            <div className="text-2xl mb-1">🦊</div>
            <p className="text-sm font-semibold">Firefox</p>
            <p className="text-xs text-gray-600">v88+</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-100 rounded-lg text-center">
            <div className="text-2xl mb-1">🧭</div>
            <p className="text-sm font-semibold">Safari</p>
            <p className="text-xs text-gray-600">v14+</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg text-center">
            <div className="text-2xl mb-1">🔷</div>
            <p className="text-sm font-semibold">Edge</p>
            <p className="text-xs text-gray-600">v90+</p>
          </div>
        </div>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Para la mejor experiencia, recomendamos mantener tu navegador actualizado a la última versión.
          </AlertDescription>
        </Alert>
      </div>
    ),
    category: "technical",
    tags: ["navegadores", "compatibilidad", "requisitos"],
  },
  {
    id: "upload-problems",
    question: "Tengo problemas para subir archivos, ¿qué hago?",
    answer: (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Si tienes problemas para subir archivos, prueba estas soluciones:</AlertDescription>
        </Alert>
        <div className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">1. Verifica tu conexión</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>Asegúrate de tener una conexión estable a internet</li>
              <li>Prueba a recargar la página</li>
              <li>Intenta desde otra red WiFi si es posible</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-2">2. Revisa el archivo</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>Confirma que es un archivo PDF</li>
              <li>Verifica que no supera los 50MB</li>
              <li>Asegúrate de que no está corrupto</li>
            </ul>
          </div>
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <h4 className="font-semibold text-purple-800 mb-2">3. Prueba otro navegador</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>Cambia a Chrome, Firefox o Safari</li>
              <li>Desactiva temporalmente extensiones</li>
              <li>Limpia la caché del navegador</li>
            </ul>
          </div>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-sm text-orange-700">
            <strong>¿Sigues teniendo problemas?</strong> Contacta con nuestro soporte técnico en info@libercopy.es
          </p>
        </div>
      </div>
    ),
    category: "technical",
    tags: ["problemas", "subida", "archivos", "solución"],
  },
]

const categories = [
  { id: "general", name: "General", icon: HelpCircle, color: "from-blue-500 to-purple-500" },
  { id: "printing", name: "Impresión", icon: FileText, color: "from-green-500 to-blue-500" },
  { id: "payment", name: "Pagos", icon: CreditCard, color: "from-purple-500 to-pink-500" },
  { id: "shipping", name: "Envíos", icon: Truck, color: "from-orange-500 to-red-500" },
  { id: "technical", name: "Técnico", icon: Settings, color: "from-cyan-500 to-blue-500" },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("general")
  const [expandedItems, setExpandedItems] = useState([])

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesSearch =
        searchTerm === "" ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = activeCategory === "general" || faq.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, activeCategory])

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const currentCategory = categories.find((cat) => cat.id === activeCategory)

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{paddingBottom: "4rem"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <HelpCircle className="w-4 h-4 mr-2" />
              Centro de ayuda
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent" style={{marginRight: '20px'}}>
                Preguntas 
              </span>
              
              <span className="text-gray-800">Frecuentes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Encuentra respuestas rápidas a las dudas más comunes sobre nuestro servicio de impresión profesional
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl">
                  <div className="flex items-center p-4">
                    <Search className="h-6 w-6 text-gray-400 mr-3" />
                    <Input
                      type="text"
                      placeholder="Buscar en preguntas frecuentes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center space-x-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm md:text-base font-medium">{faqData.length} preguntas respondidas</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm md:text-base font-medium">Soporte 24/7</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-sm md:text-base font-medium">Respuesta inmediata</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-white/60 backdrop-blur-sm p-2 rounded-2xl border border-white/50">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeCategory === category.id
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                          : "text-gray-600 hover:text-gray-800 hover:bg-white/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {/* FAQ Content */}
              <div className="mt-8">
                {filteredFAQs.length === 0 ? (
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
                      <p className="text-gray-600 mb-6">
                        No hay preguntas que coincidan con tu búsqueda "{searchTerm}"
                      </p>
                      <Button
                        onClick={() => setSearchTerm("")}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Limpiar búsqueda
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Category Header */}
                    {currentCategory && (
                      <div className="text-center mb-8">
                        <div
                          className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${currentCategory.color} text-white shadow-lg`}
                        >
                          <currentCategory.icon className="h-6 w-6" />
                          <span className="font-semibold text-lg">{currentCategory.name}</span>
                          <Badge variant="secondary" className="bg-white/20 text-white border-0">
                            {filteredFAQs.length}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* FAQ Items */}
                    {filteredFAQs.map((faq) => {
                      const isExpanded = expandedItems.includes(faq.id)
                      const categoryInfo = categories.find((cat) => cat.id === faq.category)

                      return (
                        <Card
                          key={faq.id}
                          className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                          <CardHeader
                            className="cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300"
                            onClick={() => toggleExpanded(faq.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                {categoryInfo && (
                                  <div
                                    className={`p-2 rounded-xl bg-gradient-to-r ${categoryInfo.color} text-white flex-shrink-0`}
                                  >
                                    <categoryInfo.icon className="h-5 w-5" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <CardTitle className="text-lg md:text-xl text-gray-800 mb-2 text-left">
                                    {faq.question}
                                  </CardTitle>
                                  <div className="flex flex-wrap gap-2">
                                    {faq.tags.slice(0, 3).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs bg-gray-100 text-gray-600"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                {isExpanded ? (
                                  <ChevronUp className="h-6 w-6 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </CardHeader>

                          {isExpanded && (
                            <CardContent className="pt-0 pb-6 px-6">
                              <div className="pl-16 md:pl-20">
                                <div className="prose prose-sm max-w-none text-gray-700">{faq.answer}</div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿No encuentras lo que buscas?</h2>
              <p className="text-xl text-white/90 mb-8">
                Nuestro equipo de soporte está aquí para ayudarte con cualquier duda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                <Mail className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-white/80">info@libercopy.es</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Teléfono</h3>
                <p className="text-sm text-white/80">Lun-Vie 9:00-18:00</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contactar soporte
                </Button>
              </Link>
              <Link href="/imprimir">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl bg-transparent"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Empezar a imprimir
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
