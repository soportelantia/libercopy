"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { LocationSelector } from "@/components/location-selector"
import { toast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export type Address = {
  id: string
  user_id: string
  name: string
  recipient_name: string
  address_line: string
  postal_code: string
  province: string
  municipality: string
  phone: string
  is_default: boolean
  created_at?: string
}

type AddressFormProps = {
  address?: Address
  userId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function AddressForm({ address, userId, onSuccess, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Omit<Address, "id" | "user_id" | "created_at">>({
    name: address?.name || "",
    recipient_name: address?.recipient_name || "",
    address_line: address?.address_line || "",
    postal_code: address?.postal_code || "",
    province: address?.province || "",
    municipality: address?.municipality || "",
    phone: address?.phone || "",
    is_default: address?.is_default || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_default: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Si es la dirección predeterminada, primero quitamos la marca de predeterminada de todas las direcciones
      if (formData.is_default) {
        await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId)
      }

      if (address?.id) {
        // Actualizar dirección existente
        const { error } = await supabase
          .from("user_addresses")
          .update({
            name: formData.name,
            recipient_name: formData.recipient_name,
            address_line: formData.address_line,
            postal_code: formData.postal_code,
            province: formData.province,
            municipality: formData.municipality,
            phone: formData.phone,
            is_default: formData.is_default,
          })
          .eq("id", address.id)
          .eq("user_id", userId)

        if (error) throw error

        toast({
          title: "Dirección actualizada",
          description: "La dirección ha sido actualizada correctamente.",
        })
      } else {
        // Crear nueva dirección
        const { error } = await supabase.from("user_addresses").insert({
          user_id: userId,
          name: formData.name,
          recipient_name: formData.recipient_name,
          address_line: formData.address_line,
          postal_code: formData.postal_code,
          province: formData.province,
          municipality: formData.municipality,
          phone: formData.phone,
          is_default: formData.is_default,
        })

        if (error) throw error

        toast({
          title: "Dirección añadida",
          description: "La dirección ha sido añadida correctamente.",
        })
      }

      // Refrescar la página o ejecutar callback de éxito
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Error al guardar la dirección:", error)
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al guardar la dirección.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la dirección</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej: Casa, Trabajo, etc."
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recipient_name">Nombre del destinatario</Label>
        <Input
          id="recipient_name"
          name="recipient_name"
          placeholder="Nombre completo"
          value={formData.recipient_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line">Dirección</Label>
        <Input
          id="address_line"
          name="address_line"
          placeholder="Calle, número, piso, etc."
          value={formData.address_line}
          onChange={handleInputChange}
          required
        />
      </div>

      <LocationSelector
        selectedProvince={formData.province}
        selectedMunicipality={formData.municipality}
        onProvinceChange={(province) => setFormData((prev) => ({ ...prev, province, municipality: "" }))}
        onMunicipalityChange={(municipality) => setFormData((prev) => ({ ...prev, municipality }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Código postal</Label>
          <Input
            id="postal_code"
            name="postal_code"
            placeholder="Código postal"
            value={formData.postal_code}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono de contacto</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox id="is_default" checked={formData.is_default} onCheckedChange={handleCheckboxChange} />
        <Label htmlFor="is_default" className="cursor-pointer">
          Establecer como dirección predeterminada
        </Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : address?.id ? "Actualizar dirección" : "Añadir dirección"}
        </Button>
      </div>
    </form>
  )
}
