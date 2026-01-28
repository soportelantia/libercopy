import type { Metadata } from "next"
import { generateCanonicalMetadata } from "@/lib/canonical-url"
import HomeClientPage from "./home-client"

export const metadata: Metadata = {
  title: "Impresión de apuntes y documentos online barata | LiberCopy",
  description:
    "Sube tus apuntes y documentos en PDF, elige papel y encuadernación, recíbelos en 24‑48 h. Desde 0,02 €. Calidad premium. Empieza ahora",
  ...generateCanonicalMetadata("/"),
}

export default function HomePage() {
  return <HomeClientPage />
}
