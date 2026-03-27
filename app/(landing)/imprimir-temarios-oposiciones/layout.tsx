import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Imprimir temarios de oposiciones online | LiberCopy",
  description:
    "Imprime tu temario de oposiciones sin salir de casa. Blanco y negro o color, doble cara, encuadernado en espiral o grapado. Envío a domicilio en toda España. Desde 0,02€/página.",
  alternates: {
    canonical: "https://www.libercopy.es/imprimir-temarios-oposiciones",
  },
  openGraph: {
    title: "Imprimir temarios de oposiciones online | LiberCopy",
    description:
      "Sube tu temario, elige acabado y recíbelo listo para estudiar. Impresión profesional para opositores con envío a domicilio.",
    url: "https://www.libercopy.es/imprimir-temarios-oposiciones",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
