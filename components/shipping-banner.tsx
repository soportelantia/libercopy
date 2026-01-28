import { Truck } from "lucide-react"

export default function ShippingBanner() {
  return (
    <div className="bg-blue-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center px-5 py-2 rounded-full border border-[#2563eb] shadow-sm bg-white space-x-2">
            <Truck className="w-4 h-4 text-[#2563eb]" />
            <p className="text-sm text-[#2563eb] font-medium">
              Envío gratis
              <span className="text-gray-600 font-normal ml-2">
                en pedidos superiores a 25€ | Solo 3.99€ en pedidos menores
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
