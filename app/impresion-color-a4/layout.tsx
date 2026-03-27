import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impresión en color A4 online | LiberCopy",
  description:
    "Imprime tus documentos en color A4 desde casa. Calidad fotográfica, papel de alta gramaje y envío a domicilio en 24-48 h. Ideal para TFG, presentaciones y material didáctico. Desde 0,09 €/página.",
  alternates: {
    canonical: "https://www.libercopy.es/impresion-color-a4",
  },
  openGraph: {
    title: "Impresión en color A4 online | LiberCopy",
    description:
      "Colores vivos y precisos para tus presentaciones, trabajos y material docente. Sube tu PDF y recíbelo en casa.",
    url: "https://www.libercopy.es/impresion-color-a4",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
