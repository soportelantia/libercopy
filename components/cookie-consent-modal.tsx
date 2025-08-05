"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Cookie, Settings } from "lucide-react"
import Link from "next/link"

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsentModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted))
    setIsVisible(false)
    initializeCookies(allAccepted)
  }

  const handleAcceptSelected = () => {
    const selected = {
      ...preferences,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookie-consent", JSON.stringify(selected))
    setIsVisible(false)
    initializeCookies(selected)
  }

  const handleRejectAll = () => {
    const minimal = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("cookie-consent", JSON.stringify(minimal))
    setIsVisible(false)
    initializeCookies(minimal)
  }

  const initializeCookies = (prefs: any) => {
    if (prefs.analytics) console.log("Analytics enabled")
    if (prefs.marketing) console.log("Marketing enabled")
    if (prefs.functional) console.log("Functional enabled")
  }

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === "necessary") return
    setPreferences((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <Card className="w-full max-w-5xl rounded-xl shadow-lg border pointer-events-auto">
        <CardContent className="p-4 md:p-6">
          {!showSettings ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-blue-600" />
                  Configuración de Cookies
                </h2>
                <p className="text-sm text-gray-700">
                  Utilizamos cookies para mejorar su experiencia. Al hacer clic en "Aceptar todas", acepta el uso de todas las cookies.{" "}
                  <Link href="/politica-cookies" className="text-blue-600 hover:underline">
                    Más información
                  </Link>
                  .
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3 justify-end">
                <Button size="sm" onClick={handleAcceptAll}>Aceptar Todas</Button>
                <Button size="sm" variant="outline" onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4 mr-1" />
                  Configurar
                </Button>
                <Button size="sm" variant="outline" onClick={handleRejectAll}>Rechazar Todas</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Preferencias de Cookies</h3>
              {[
                {
                  label: "Cookies Necesarias",
                  description: "Esenciales para el funcionamiento del sitio web. No se pueden desactivar.",
                  type: "necessary" as const,
                  disabled: true,
                },
                {
                  label: "Cookies Funcionales",
                  description: "Mejoran la funcionalidad del sitio recordando sus preferencias.",
                  type: "functional" as const,
                },
                {
                  label: "Cookies de Análisis",
                  description: "Nos permiten analizar el uso del sitio para mejorar su experiencia.",
                  type: "analytics" as const,
                },
                {
                  label: "Cookies de Marketing",
                  description: "Usadas para mostrar publicidad personalizada.",
                  type: "marketing" as const,
                },
              ].map(({ label, description, type, disabled }) => (
                <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{label}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <div className="ml-4">
                    <button
                      disabled={disabled}
                      onClick={() => handlePreferenceChange(type)}
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences[type] ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-2 justify-end">
                <Button size="sm" onClick={handleAcceptSelected}>Guardar Preferencias</Button>
                <Button size="sm" variant="outline" onClick={() => setShowSettings(false)}>
                  Volver
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
