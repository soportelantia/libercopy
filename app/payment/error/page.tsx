"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import Footer from "@/components/footer"
export default function PaymentErrorPage() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#8b2131] mb-4">Error en el pago</h1>
          <p className="text-gray-600 mb-8">
            Ha ocurrido un error al procesar tu pago. No se ha realizado ningún cargo. Por favor, inténtalo de nuevo.
          </p>
          <div className="space-y-4">
            <Button onClick={() => router.push("/checkout/summary")} className="w-full">
              Intentar de nuevo
            </Button>
            <Button onClick={() => router.push("/cart")} variant="outline" className="w-full">
              Volver al carrito
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}
