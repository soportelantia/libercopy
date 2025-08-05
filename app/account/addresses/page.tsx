"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import AddressList from "@/components/address-list"
import Footer from "@/components/footer"
export default function AddressesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
    setIsLoading(false)
  }, [user, router])

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center" style={{ marginTop: "80px" }}>
          <div className="animate-pulse text-gray-600">Cargando...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-12" style={{ marginTop: "80px" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/account" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mis direcciones
            </h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-gray-200/50">
            {user && <AddressList userId={user.id} />}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <Toaster />
    </main>
  )
}
