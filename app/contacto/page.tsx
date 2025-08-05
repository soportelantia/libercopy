import dynamic from "next/dynamic"
import type { Metadata } from "next"

// Importar dinámicamente el componente cliente para evitar errores SSR
const ContactPageClient = dynamic(() => import("./ContactPageClient"))

export const metadata: Metadata = {
  title: "Contacto - LiberCopy",
  description: "Ponte en contacto con nosotros. Plaza Magdalena 9, 3º Planta 41001 Sevilla. Email: info@libercopy.es",
}

export default function ContactPage() {
  return <ContactPageClient />
}
