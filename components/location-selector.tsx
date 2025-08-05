"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProvinces, getMunicipalitiesByProvince, type Province, type Municipality } from "@/lib/location-service"

type LocationSelectorProps = {
  selectedProvince: string
  selectedMunicipality: string
  onProvinceChange: (province: string) => void
  onMunicipalityChange: (municipality: string) => void
}

export function LocationSelector({
  selectedProvince,
  selectedMunicipality,
  onProvinceChange,
  onMunicipalityChange,
}: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true)
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false)

  // Cargar provincias al montar el componente
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true)
      try {
        const data = await getProvinces()
        setProvinces(data)
      } catch (error) {
        console.error("Error al cargar provincias:", error)
      } finally {
        setIsLoadingProvinces(false)
      }
    }

    loadProvinces()
  }, [])

  // Cargar municipios cuando cambia la provincia seleccionada
  // Modificar el useEffect que carga los municipios para que solo dependa de selectedProvince
  useEffect(() => {
    const loadMunicipalities = async () => {
      if (!selectedProvince) {
        setMunicipalities([])
        return
      }

      setIsLoadingMunicipalities(true)
      try {
        const data = await getMunicipalitiesByProvince(selectedProvince)
        setMunicipalities(data)

        // Si el municipio seleccionado no está en la nueva lista, resetear
        const municipalityExists = data.some((m) => m.id === selectedMunicipality)
        if (!municipalityExists && selectedMunicipality) {
          onMunicipalityChange("")
        }
      } catch (error) {
        console.error(`Error al cargar municipios para la provincia ${selectedProvince}:`, error)
      } finally {
        setIsLoadingMunicipalities(false)
      }
    }

    loadMunicipalities()
  }, [selectedProvince, selectedMunicipality, onMunicipalityChange])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="province">Provincia</Label>
        <Select value={selectedProvince} onValueChange={onProvinceChange} disabled={isLoadingProvinces}>
          <SelectTrigger id="province">
            <SelectValue placeholder={isLoadingProvinces ? "Cargando provincias..." : "Selecciona una provincia"} />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((province) => (
              <SelectItem key={province.id} value={province.id}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="municipality">Municipio</Label>
        <Select
          value={selectedMunicipality}
          onValueChange={onMunicipalityChange}
          disabled={!selectedProvince || isLoadingMunicipalities || municipalities.length === 0}
        >
          <SelectTrigger id="municipality">
            <SelectValue
              placeholder={
                isLoadingMunicipalities
                  ? "Cargando municipios..."
                  : !selectedProvince
                    ? "Selecciona primero una provincia"
                    : "Selecciona un municipio"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((municipality) => (
              <SelectItem key={municipality.id} value={municipality.id}>
                {municipality.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
