"use client"

import { Check } from "lucide-react"

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Envío", description: "Método de envío" },
  { id: 2, name: "Pago", description: "Método de pago" },
  { id: 3, name: "Resumen", description: "Confirmar pedido" },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full py-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className="relative flex items-center">
              {/* Línea conectora */}
              {stepIdx !== 0 && (
                <div
                  className="absolute left-0 right-0 -translate-x-full top-4 h-0.5 w-full bg-gray-200"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full transition-all duration-300 ${
                      step.id <= currentStep ? "bg-[#2E5FEB] w-full" : "bg-gray-200 w-0"
                    }`}
                  />
                </div>
              )}

              {/* Icono del paso */}
              <div className="relative flex flex-col items-center group">
                <span className="h-8 w-8 flex items-center justify-center">
                  {step.id < currentStep ? (
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#2E5FEB] z-10">
                      <Check className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                  ) : step.id === currentStep ? (
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#2E5FEB] bg-white z-10">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#2E5FEB]" aria-hidden="true" />
                    </div>
                  ) : (
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white z-10">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                    </div>
                  )}
                </span>

                {/* Texto del paso */}
                <div className="mt-3 text-center">
                  <div className="text-sm font-medium text-gray-900">{step.name}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>

              {/* Espacio entre pasos - reducido para evitar huecos */}
              {stepIdx !== steps.length - 1 && <div className="w-12 sm:w-16" />}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
