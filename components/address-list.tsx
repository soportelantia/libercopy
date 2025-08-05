"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { MapPin, Edit, Trash2, Plus, Check } from "lucide-react"
import AddressForm, { type Address } from "@/components/address-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type AddressListProps = {
  userId: string
  selectable?: boolean
  onSelect?: (address: Address) => void
  selectedAddressId?: string
}

export default function AddressList({ userId, selectable = false, onSelect, selectedAddressId }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const fetchAddresses = async () => {
    setIsLoading(true)
    try {
      // Obtener direcciones del usuario
      const { data: addressesData, error: addressesError } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false })

      if (addressesError) throw addressesError

      // Procesar cada dirección para obtener los nombres de provincia y municipio
      const processedAddresses = await Promise.all(
        (addressesData || []).map(async (address) => {
          // Obtener nombre de la provincia
          const { data: provinceData } = await supabase
            .from("provinces")
            .select("name")
            .eq("id", address.province)
            .single()

          // Obtener nombre del municipio
          const { data: municipalityData } = await supabase
            .from("municipalities")
            .select("name")
            .eq("id", address.municipality)
            .single()

          return {
            ...address,
            province_name: provinceData?.name || address.province,
            municipality_name: municipalityData?.name || address.municipality,
          }
        }),
      )

      setAddresses(processedAddresses || [])
    } catch (error) {
      console.error("Error al cargar direcciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las direcciones.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchAddresses()
    }
  }, [userId])

  const handleSetDefault = async (addressId: string) => {
    try {
      // Primero quitamos la marca de predeterminada de todas las direcciones
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId)

      // Luego establecemos la dirección seleccionada como predeterminada
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", addressId)
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Dirección predeterminada",
        description: "La dirección ha sido establecida como predeterminada.",
      })

      fetchAddresses()
    } catch (error) {
      console.error("Error al establecer dirección predeterminada:", error)
      toast({
        title: "Error",
        description: "No se pudo establecer la dirección como predeterminada.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (addressId: string) => {
    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", addressId).eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada correctamente.",
      })

      fetchAddresses()
    } catch (error) {
      console.error("Error al eliminar dirección:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setIsEditDialogOpen(true)
  }

  const handleFormSuccess = () => {
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setEditingAddress(null)
    fetchAddresses()
  }

  if (isLoading) {
    return <div className="text-center py-8">Cargando direcciones...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Añadir dirección
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Añadir nueva dirección</DialogTitle>
            </DialogHeader>
            <AddressForm userId={userId} onSuccess={handleFormSuccess} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No tienes direcciones guardadas</h3>
          <p className="text-gray-500 mb-4">Añade una dirección para agilizar tus compras futuras.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`border ${
                address.is_default
                  ? "border-[#2E5FEB] bg-[#2E5FEB]/20"
                  : selectedAddressId === address.id
                    ? "border-[#f47d30] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
              } transition-colors`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <h4 className="font-medium">{address.name}</h4>
                    {address.is_default && (
                      <span className="ml-2 text-xs bg-[#2E5FEB] text-white px-2 py-0.5 rounded-full">
                        Predeterminada
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    {!selectable && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(address)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta dirección?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(address.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium">{address.recipient_name}</p>
                  <p>{address.address_line}</p>
                  <p>
                    {address.postal_code}, {address.municipality_name || address.municipality},{" "}
                    {address.province_name || address.province}
                  </p>
                  <p>España</p>
                  <p className="mt-2">Tel: {address.phone}</p>
                </div>

                <div className="mt-4 flex justify-end">
                  {selectable ? (
                    <Button
                      variant={selectedAddressId === address.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => onSelect && onSelect(address)}
                      className={selectedAddressId === address.id ? "bg-[#2E5FEB]" : ""}
                    >
                      {selectedAddressId === address.id ? (
                        <>
                          <Check className="h-4 w-4 mr-1" /> Seleccionada
                        </>
                      ) : (
                        "Seleccionar"
                      )}
                    </Button>
                  ) : (
                    !address.is_default && (
                      <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                        Establecer como predeterminada
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Diálogo para editar dirección */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar dirección</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <AddressForm
              address={editingAddress}
              userId={userId}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
