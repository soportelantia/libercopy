"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calculator, Minus, Plus, Printer, ArrowRight } from "lucide-react"
import Link from "next/link"
import { pricingService } from "@/lib/pricing-service"

type PrintType = "bw" | "color"
type PrintForm = "oneSided" | "doubleSided"
type Finishing = "none" | "stapled" | "bound"

export default function PriceCalculator() {
  const [pages, setPages] = useState<number | "">(10)
  const [copies, setCopies] = useState(1)
  const [printType, setPrintType] = useState<PrintType>("bw")
  const [printForm, setPrintForm] = useState<PrintForm>("oneSided")
  const [finishing, setFinishing] = useState<Finishing>("none")
  const [price, setPrice] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculatePrice = useCallback(async () => {
    if (!pages || pages <= 0) {
      setPrice(null)
      return
    }
    setIsCalculating(true)
    try {
      const basePricePerPage = await pricingService.getPrice("print_type", printType)
      let discountPerPage = 0
      if (printForm === "doubleSided") {
        discountPerPage = await pricingService.getPrice("print_form", "doubleSided")
      }
      const finalPricePerPage = basePricePerPage + discountPerPage
      const totalBasePrice = finalPricePerPage * pages
      const finishingCost = await pricingService.getPrice("finishing", finishing)
      const total = (totalBasePrice + finishingCost) * copies
      setPrice(Number.parseFloat(total.toFixed(2)))
    } catch {
      setPrice(null)
    } finally {
      setIsCalculating(false)
    }
  }, [pages, copies, printType, printForm, finishing])

  useEffect(() => {
    calculatePrice()
  }, [calculatePrice])

  const handlePagesChange = (increment: boolean) => {
    setPages((prev) => Math.max(1, (Number(prev) || 0) + (increment ? 1 : -1)))
  }

  const handlePagesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "") {
      setPages("")
    } else {
      const num = parseInt(val, 10)
      if (!isNaN(num) && num >= 0) setPages(num)
    }
  }

  const handlePagesBlur = () => {
    if (!pages || Number(pages) < 1) setPages(1)
  }

  const handleCopiesChange = (increment: boolean) => {
    setCopies((prev) => Math.max(1, increment ? prev + 1 : prev - 1))
  }

  const setPagesPreset = (value: number) => setPages(value)
  const pagesNum = Number(pages) || 0

  return (
    <div className="space-y-6">
      {/* Pages */}
      <div className="space-y-3">
        <Label htmlFor="calc-pages" className="text-sm font-semibold text-gray-700">Número de paginas</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handlePagesChange(false)}
            disabled={pagesNum <= 1}
            className="h-9 w-9 rounded-full shrink-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            id="calc-pages"
            type="number"
            min={1}
            value={pages}
            onChange={handlePagesInput}
            onBlur={handlePagesBlur}
            className="w-20 h-9 text-center font-semibold text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handlePagesChange(true)}
            className="h-9 w-9 rounded-full shrink-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <div className="flex gap-2 flex-wrap">
            {[10, 20, 50, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => setPagesPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${pagesNum === preset
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Print Type */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Tipo de impresión</Label>
        <RadioGroup
          value={printType}
          onValueChange={(v) => setPrintType(v as PrintType)}
          className="grid grid-cols-2 gap-3"
        >
          <div
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${printType === "bw" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            <RadioGroupItem value="bw" id="calc-bw" />
            <Label htmlFor="calc-bw" className="cursor-pointer flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">B/N</span>
              </div>
              <span className="text-sm font-medium">Blanco y negro</span>
            </Label>
          </div>
          <div
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${printType === "color" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            <RadioGroupItem value="color" id="calc-color" />
            <Label htmlFor="calc-color" className="cursor-pointer flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">C</span>
              </div>
              <span className="text-sm font-medium">Color</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Print Form */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Caras de impresion</Label>
        <RadioGroup
          value={printForm}
          onValueChange={(v) => setPrintForm(v as PrintForm)}
          className="grid grid-cols-2 gap-3"
        >
          <div
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${printForm === "oneSided" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            <RadioGroupItem value="oneSided" id="calc-one" />
            <Label htmlFor="calc-one" className="cursor-pointer">
              <span className="text-sm font-medium">Una cara</span>
            </Label>
          </div>
          <div
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${printForm === "doubleSided" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
          >
            <RadioGroupItem value="doubleSided" id="calc-double" />
            <Label htmlFor="calc-double" className="cursor-pointer">
              <span className="text-sm font-medium">Doble cara</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Finishing */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Acabado</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "none", label: "Sin acabado" },
            { value: "stapled", label: "Grapado" },
            { value: "bound", label: "Encuadernado" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFinishing(opt.value as Finishing)}
              className={`p-2.5 border rounded-lg text-xs font-medium transition-all text-center ${finishing === opt.value
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Copies */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">Copias</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleCopiesChange(false)}
            disabled={copies <= 1}
            className="h-9 w-9 rounded-full shrink-0"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <div className="flex items-center justify-center w-16 h-9 border rounded-lg bg-gray-50 font-semibold text-base">
            {copies}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleCopiesChange(true)}
            className="h-9 w-9 rounded-full shrink-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Result */}
      <div className="mt-2 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <span className="font-medium">Precio estimado</span>
          </div>
          <div className="text-right">
            {isCalculating ? (
              <div className="animate-pulse text-2xl font-bold">...</div>
            ) : price !== null ? (
              <div className="text-3xl font-bold">{price.toFixed(2)}€</div>
            ) : (
              <div className="text-2xl font-bold">—</div>
            )}
            <div className="text-xs text-blue-100 mt-0.5">IVA incluido</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        El precio final puede variar segun el número exacto de paginas de tu PDF
      </p>

      {/* CTA */}
      <Link href="/imprimir">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-11 text-sm font-semibold">
          <Printer className="mr-2 h-4 w-4" />
          Hacer el pedido ahora
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
