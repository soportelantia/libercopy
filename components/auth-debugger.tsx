"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDebugger() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  const checkSession = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setError(error.message)
      } else {
        setSessionInfo(data)
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Depurador de Autenticación</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b2131] mx-auto"></div>
            <p className="mt-2">Verificando sesión...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="font-semibold">Estado de la sesión:</p>
              <p className="bg-gray-100 p-2 rounded mt-1">{sessionInfo?.session ? "Autenticado" : "No autenticado"}</p>
            </div>

            {sessionInfo?.session && (
              <>
                <div className="mb-4">
                  <p className="font-semibold">Usuario:</p>
                  <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto text-xs">
                    {JSON.stringify(sessionInfo.session.user, null, 2)}
                  </pre>
                </div>

                <div className="mb-4">
                  <p className="font-semibold">Token expira en:</p>
                  <p className="bg-gray-100 p-2 rounded mt-1">
                    {new Date(sessionInfo.session.expires_at * 1000).toLocaleString()}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-end mt-4">
              <Button onClick={checkSession} variant="outline" size="sm">
                Actualizar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
