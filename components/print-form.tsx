"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, FileText, Palette, RotateCcw, Copy, Scissors } from "lucide-react"

interface PrintOptions {
  paperSize: "a4"
  paperType: "normal"
  paperWeight: "80g" | "90g" | "100g"
  printType: "bw" | "color"
  printForm: "oneSided" | "doubleSided"
  orientation: "vertical" | "horizontal"
  pagesPerSide: "one"
  finishing: "none" | "stapled" | "twoHoles" | "laminated" | "bound" | "fourHoles"
  copies: number
  comments: string
}

interface PrintFormProps {
  options: PrintOptions
  onUpdateOptions: (options: Partial<PrintOptions>) => void
}

export default function PrintForm({ options, onUpdateOptions }: PrintFormProps) {
  const handleCopiesChange = (increment: boolean) => {
    const newCopies = increment ? options.copies + 1 : Math.max(1, options.copies - 1)
    onUpdateOptions({ copies: newCopies })
  }

  const finishingOptions = [
    { value: "none", label: "Sin acabado", icon: "📄", description: "Sin acabado adicional" },
    { value: "stapled", label: "Grapado", icon: "📎", description: "Grapado en esquina superior izquierda" },
    /*{ value: "twoHoles", label: "2 agujeros", icon: "⚪", description: "Perforado con 2 agujeros" },
    { value: "fourHoles", label: "4 agujeros", icon: "⚪⚪", description: "Perforado con 4 agujeros" },*/
    { value: "bound", label: "Encuadernado", icon: "📖", description: "Encuadernación con espiral" },
    //{ value: "laminated", label: "Plastificado", icon: "🛡️", description: "Plastificado para protección" },
  ]

  return (
    <div className="space-y-8">
      {/* Print Type */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-blue-600" />
          <Label className="text-lg font-semibold">Tipo de impresión</Label>
        </div>
        <RadioGroup
          value={options.printType}
          onValueChange={(value) => onUpdateOptions({ printType: value as "bw" | "color" })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="bw" id="bw" />
            <Label htmlFor="bw" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">B/N</span>
                </div>
                <div>
                  <div className="font-medium">Blanco y negro</div>
                  <div className="text-sm text-gray-500">Impresión monocromática</div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="color" id="color" />
            <Label htmlFor="color" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
                <div>
                  <div className="font-medium">Color</div>
                  <div className="text-sm text-gray-500">Impresión a todo color</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Paper Weight */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-green-600" />
          <Label className="text-lg font-semibold">Gramaje del papel</Label>
        </div>
        <RadioGroup
          value={options.paperWeight}
          onValueChange={(value) => onUpdateOptions({ paperWeight: value as "80g" | "90g" | "100g" })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="80g" id="80g" />
            <Label htmlFor="80g" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">80</span>
                </div>
                <div>
                  <div className="font-medium">80g</div>
                  <div className="text-sm text-gray-500">Papel estándar</div>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
            <RadioGroupItem value="90g" id="90g" disabled />
            <Label htmlFor="90g" className="flex-1 cursor-not-allowed">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">90</span>
                </div>
                <div>
                  <div className="font-medium text-gray-400">90g</div>
                  <div className="text-sm text-gray-400">Papel estándar</div>
                  <div className="text-xs text-orange-500 mt-1">Estarán disponibles próximamente</div>
                </div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg bg-gray-50 opacity-60 cursor-not-allowed">
            <RadioGroupItem value="100g" id="100g" disabled />
            <Label htmlFor="100g" className="flex-1 cursor-not-allowed">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">100</span>
                </div>
                <div>
                  <div className="font-medium text-gray-400">100g</div>
                  <div className="text-sm text-gray-400">Papel Premium</div>
                  <div className="text-xs text-orange-500 mt-1">Estarán disponibles próximamente</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Print Form */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Copy className="h-5 w-5 text-purple-600" />
          <Label className="text-lg font-semibold">Caras de impresión</Label>
        </div>
        <RadioGroup
          value={options.printForm}
          onValueChange={(value) => onUpdateOptions({ printForm: value as "oneSided" | "doubleSided" })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="oneSided" id="oneSided" />
            <Label htmlFor="oneSided" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 border-2 border-blue-300 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium">Una cara</div>
                  <div className="text-sm text-gray-500">Impresión por una sola cara</div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="doubleSided" id="doubleSided" />
            <Label htmlFor="doubleSided" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium">Doble cara</div>
                  <div className="text-sm text-gray-500">Impresión por ambas caras</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Orientation */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <RotateCcw className="h-5 w-5 text-orange-600" />
          <Label className="text-lg font-semibold">Orientación</Label>
        </div>
        <RadioGroup
          value={options.orientation}
          onValueChange={(value) => onUpdateOptions({ orientation: value as "vertical" | "horizontal" })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="vertical" id="vertical" />
            <Label htmlFor="vertical" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-8 bg-gray-200 border border-gray-400 rounded"></div>
                <div>
                  <div className="font-medium">Vertical</div>
                  <div className="text-sm text-gray-500">Orientación vertical (retrato)</div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="horizontal" id="horizontal" />
            <Label htmlFor="horizontal" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-6 bg-gray-200 border border-gray-400 rounded"></div>
                <div>
                  <div className="font-medium">Horizontal</div>
                  <div className="text-sm text-gray-500">Orientación horizontal (paisaje)</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Finishing Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Scissors className="h-5 w-5 text-red-600" />
          <Label className="text-lg font-semibold">Tipo de acabado</Label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 gap-4">
          {finishingOptions.map((option) => (
            <div
              key={option.value}
              className={`col-span-1 sm:col-span-1 lg:col-span-1 xl:col-span-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                options.finishing === option.value
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onUpdateOptions({ finishing: option.value as PrintOptions["finishing"] })}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{option.icon}</div>
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
                {options.finishing === option.value && (
                  <Badge variant="default" className="text-xs">
                    Seleccionado
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copies */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Copy className="h-5 w-5 text-indigo-600" />
          <Label className="text-lg font-semibold">Número de copias</Label>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleCopiesChange(false)}
            disabled={options.copies <= 1}
            className="h-10 w-10 rounded-full"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center w-20 h-10 border rounded-lg bg-gray-50">
            <span className="text-lg font-semibold">{options.copies}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleCopiesChange(true)}
            className="h-10 w-10 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Comentarios adicionales (opcional)</Label>
        <Textarea
          placeholder="Añade cualquier comentario o instrucción especial para tu pedido..."
          value={options.comments}
          onChange={(e) => onUpdateOptions({ comments: e.target.value })}
          className="min-h-[100px] resize-none"
        />
      </div>
    </div>
  )
}
