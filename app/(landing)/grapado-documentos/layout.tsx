import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Grapado de documentos online | LiberCopy",
  description:
    "Imprime y grapa tus documentos online. Acabado rápido y económico para informes, exámenes y dossieres de hasta 100 páginas. Envío a domicilio en 24-48 h en toda España.",
  alternates: {
    canonical: "https://www.libercopy.es/grapado-documentos",
  },
  openGraph: {
    title: "Grapado de documentos online | LiberCopy",
    description:
      "Documentos impresos y grapados con acabado profesional. Rápido, económico y sin desplazamientos.",
    url: "https://www.libercopy.es/grapado-documentos",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
