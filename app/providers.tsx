"use client"

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Ld0Cn0rAAAAABwEbgbZj7z9n3oXdei1nAkr8Vhq"
      scriptProps={{ async: true, defer: true }}
    >
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </GoogleReCaptchaProvider>
  )
}
