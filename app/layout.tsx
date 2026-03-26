import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviders } from "./providers"
import CookieConsentModal from "@/components/cookie-consent-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Impresión de apuntes y documentos online barata | LiberCopy",
  description:
    "Sube tus apuntes y documentos en PDF, elige papel y encuadernación, recíbelos en 24‑48 h. Desde 0,02 €. Calidad premium. Empieza ahora",
  generator: "v0.dev",
  icons: {
    icon: [
      {
        url: "/libercopy-favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/libercopy-favicon.svg",
    apple: "/libercopy-favicon.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/libercopy-favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/libercopy-favicon.svg" />
        <link rel="apple-touch-icon" href="/libercopy-favicon.svg" />
        
        {/* JSON-LD Organization */}
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Libercopy",
              "url": "https://www.libercopy.es",
              "logo": "https://www.libercopy.es/libercopy-logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@libercopy.es",
                "contactType": "customer service",
                "availableLanguage": "Spanish",
              },
              "sameAs": [
                "https://instagram.com/libercopy",
                "https://tiktok.com/@libercopy",
                "https://x.com/LibercopyOnline",
                "https://www.facebook.com/share/1EpbbMPf2L/",
              ],
            }),
          }}
        />

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-3MM7JTV9PB"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3MM7JTV9PB');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AppProviders>
          {children}
          <CookieConsentModal />
        </AppProviders>
      </body>
    </html>
  )
}
