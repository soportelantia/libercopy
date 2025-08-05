"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { BlogCategory } from "@/types/blog"

interface BlogSearchProps {
  categories: BlogCategory[]
}

export function BlogSearch({ categories }: BlogSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "all") params.set("category", category)

    const queryString = params.toString()
    router.push(`/blog${queryString ? `?${queryString}` : ""}`)
  }

  const handleClear = () => {
    setSearch("")
    setCategory("all")
    router.push("/blog")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
      <h3 className="text-lg font-semibold">Buscar en el blog</h3>

      {/* Buscador de texto */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>

      {/* Filtro por categoría */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botones */}
      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1">
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
        {(search || category !== "all") && (
          <Button variant="outline" onClick={handleClear}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filtros activos */}
      {(search || category !== "all") && (
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600 mb-2">Filtros activos:</p>
          <div className="flex flex-wrap gap-2">
            {search && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Texto: "{search}"</span>}
            {category !== "all" && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                Categoría: {categories.find((c) => c.slug === category)?.name}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
