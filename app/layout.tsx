import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CookieConsentModal } from "@/components/cookie-consent-modal"
import CanonicalHead from "@/components/canonical-head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Libercopy - Impresión y Encuadernación Online",
    template: "%s | Libercopy",
  },
  description:
    "Servicio de impresión y encuadernación online. Imprime tus documentos, apuntes y trabajos con la mejor calidad y recíbelos en casa.",
  keywords: ["impresión", "encuadernación", "online", "documentos", "apuntes", "trabajos"],
  authors: [{ name: "Libercopy" }],
  creator: "Libercopy",
  publisher: "Libercopy",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.com",
    siteName: "Libercopy",
    title: "Libercopy - Impresión y Encuadernación Online",
    description:
      "Servicio de impresión y encuadernación online. Imprime tus documentos, apuntes y trabajos con la mejor calidad y recíbelos en casa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Libercopy - Impresión y Encuadernación Online",
    description:
      "Servicio de impresión y encuadernación online. Imprime tus documentos, apuntes y trabajos con la mejor calidad y recíbelos en casa.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/libercopy-favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/libercopy-favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <CanonicalHead />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <CookieConsentModal />
        </Providers>
      </body>
    </html>
  )
}
