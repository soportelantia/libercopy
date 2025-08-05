"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

export function BlogPagination({ currentPage, totalPages, total, limit }: BlogPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }
    const queryString = params.toString()
    return `/blog${queryString ? `?${queryString}` : ""}`
  }

  const goToPage = (page: number) => {
    router.push(createPageUrl(page))
  }

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, total)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Información de resultados */}
      <div className="text-sm text-gray-600">
        Mostrando {startItem} - {endItem} de {total} posts
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {/* Primera página */}
          {currentPage > 3 && (
            <>
              <Button variant={1 === currentPage ? "default" : "outline"} size="sm" onClick={() => goToPage(1)}>
                1
              </Button>
              {currentPage > 4 && <span className="px-2">...</span>}
            </>
          )}

          {/* Páginas alrededor de la actual */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return page >= currentPage - 2 && page <= currentPage + 2
            })
            .map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}

          {/* Última página */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="px-2">...</span>}
              <Button
                variant={totalPages === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>

        {/* Botón siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
