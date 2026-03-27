import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Imprimir apuntes online | LiberCopy",
  description:
    "Imprime tus apuntes universitarios online sin salir de casa. Blanco y negro o color, doble cara, grapado o espiral. Envío a domicilio en toda España. Desde 0,02 €/página.",
  alternates: {
    canonical: "https://www.libercopy.es/imprimir-apuntes-online",
  },
  openGraph: {
    title: "Imprimir apuntes online | LiberCopy",
    description:
      "Sube tus apuntes en PDF, elige acabado y recíbelos impresos en casa. La forma más cómoda de estudiar con papel.",
    url: "https://www.libercopy.es/imprimir-apuntes-online",
    siteName: "LiberCopy",
    locale: "es_ES",
    type: "website",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
