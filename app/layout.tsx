import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviders } from "./providers"
import CookieConsentModal from "@/components/cookie-consent-modal"
import CanonicalLink from "@/components/canonical-link"

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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3MM7JTV9PB"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3MM7JTV9PB');
            `,
          }}
        />
        <link rel="icon" href="/libercopy-favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/libercopy-favicon.svg" />
        <link rel="apple-touch-icon" href="/libercopy-favicon.svg" />
        <CanonicalLink />
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
