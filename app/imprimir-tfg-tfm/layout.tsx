import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Imprimir TFG y TFM online | LiberCopy",
  description:
    "Imprime y encuaderna tu TFG o TFM con acabado profesional. Impresión en color o BN, encuadernado en espiral o tapa blanda. Envío a domicilio en toda España en 24-48 h.",
  alternates: {
    canonical: "https://www.libercopy.es/imprimir-tfg-tfm",
  },
  openGraph: {
    title: "Imprimir TFG y TFM online | LiberCopy",
    description:
      "Tu trabajo de fin de grado o máster impreso con la presentación que merece. Calidad profesional y envío a domicilio.",
    url: "https://www.libercopy.es/imprimir-tfg-tfm",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
