"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ShippingBanner from "@/components/shipping-banner"
import PriceCalculator from "@/components/price-calculator"
import { Badge } from "@/components/ui/badge"
import { Calculator, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CalcularPrecioPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden" style={{ paddingBottom: "3rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Calculator className="w-4 h-4 mr-2" />
              Calculadora de precio
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Calcula el precio
              </span>{" "}
              de tu impresion
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Introduce el numero de paginas y elige tus opciones para obtener un presupuesto instantaneo.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sin necesidad de subir archivo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Precios en tiempo real</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span>IVA incluido</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ShippingBanner />

      {/* Calculator */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Calculadora de impresion
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <PriceCalculator />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
