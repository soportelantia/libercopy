"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getSupabaseClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

interface OrderStatusManagerProps {
  orderId: string
  currentStatus: string
  onStatusUpdate?: () => void
}

export function OrderStatusManager({ orderId, currentStatus, onStatusUpdate }: OrderStatusManagerProps) {
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shippingCompany, setShippingCompany] = useState("")
  const [trackingUrl, setTrackingUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = getSupabaseClient()

  const handleUpdateStatus = async () => {
    setIsUpdating(true)

    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      // Si el estado es "shipped", añadir los campos de seguimiento
      if (newStatus === "shipped") {
        if (trackingNumber) updateData.tracking_number = trackingNumber
        if (shippingCompany) updateData.shipping_company = shippingCompany
        if (trackingUrl) updateData.tracking_url = trackingUrl
        if (notes) updateData.shipping_notes = notes
      }

      const { error } = await supabase.from("orders").update(updateData).eq("id", orderId)

      if (error) throw error

      toast({
        title: "Estado actualizado",
        description: "El estado del pedido ha sido actualizado correctamente.",
      })

      if (onStatusUpdate) {
        onStatusUpdate()
      }
    } catch (error: any) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Estado del Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="status">Estado del pedido</Label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendiente de pago</SelectItem>
              <SelectItem value="completed">Pagado</SelectItem>
              <SelectItem value="processing">En procesamiento</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {newStatus === "shipped" && (
          <>
            <div>
              <Label htmlFor="shippingCompany">Empresa de mensajería</Label>
              <Select value={shippingCompany} onValueChange={setShippingCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correos">Correos</SelectItem>
                  <SelectItem value="seur">SEUR</SelectItem>
                  <SelectItem value="mrw">MRW</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="nacex">Nacex</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trackingNumber">Número de seguimiento</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ej: 1234567890"
              />
            </div>

            <div>
              <Label htmlFor="trackingUrl">URL de seguimiento</Label>
              <Input
                id="trackingUrl"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas del envío</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales sobre el envío..."
                rows={3}
              />
            </div>
          </>
        )}

        <Button onClick={handleUpdateStatus} disabled={isUpdating} className="w-full">
          {isUpdating ? "Actualizando..." : "Actualizar Estado"}
        </Button>
      </CardContent>
    </Card>
  )
}
