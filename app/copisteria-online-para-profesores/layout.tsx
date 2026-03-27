import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Copistería online para profesores | LiberCopy",
  description:
    "Servicio de impresión online para docentes y profesores. Imprime exámenes, fichas, apuntes y material didáctico con envío a domicilio en 24-48 h. Sin necesidad de ir a una copistería.",
  alternates: {
    canonical: "https://www.libercopy.es/copisteria-online-para-profesores",
  },
  openGraph: {
    title: "Copistería online para profesores | LiberCopy",
    description:
      "Gestiona la impresión de tu material didáctico desde casa. Exámenes, fichas y apuntes impresos y enviados en 24-48 h.",
    url: "https://www.libercopy.es/copisteria-online-para-profesores",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
