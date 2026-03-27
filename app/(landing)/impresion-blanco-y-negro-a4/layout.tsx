import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impresión en blanco y negro A4 online | Desde 0,02 €/página | LiberCopy",
  description:
    "Imprime tus apuntes, temarios y documentos en blanco y negro A4 desde 0,02 €/página. Doble cara, grapado o espiral disponibles. Envío a domicilio en 24-48 h. Calcula tu precio al instante.",
  alternates: {
    canonical: "https://www.libercopy.es/impresion-blanco-y-negro-a4",
  },
  openGraph: {
    title: "Impresión en blanco y negro A4 online | LiberCopy",
    description:
      "Imprime tus apuntes, temarios y documentos en blanco y negro A4 desde 0,02 €/página. Envío a domicilio en 24-48 h.",
    url: "https://www.libercopy.es/impresion-blanco-y-negro-a4",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function ImpresionBlancoNegroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
