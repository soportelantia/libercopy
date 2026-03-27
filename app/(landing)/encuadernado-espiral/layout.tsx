import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Encuadernado en espiral online | LiberCopy",
  description:
    "Encuaderna tus documentos en espiral con tapa y contraportada. Ideal para temarios, apuntes, TFG y manuales. Envío a domicilio en 24-48 h en toda España.",
  alternates: {
    canonical: "https://www.libercopy.es/encuadernado-espiral",
  },
  openGraph: {
    title: "Encuadernado en espiral online | LiberCopy",
    description:
      "Encuadernación en espiral profesional para temarios, apuntes y trabajos académicos. Sube tu PDF y recíbelo listo para estudiar.",
    url: "https://www.libercopy.es/encuadernado-espiral",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
