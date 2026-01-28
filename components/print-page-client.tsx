"use client"

import { useSearchParams } from "next/navigation"
import PrintPage from "./print-page"
import { Suspense } from "react"

function PrintPageClientInner() {
  const searchParams = useSearchParams()
  return <PrintPage searchParams={searchParams} />
}

export default function PrintPageClient() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PrintPageClientInner />
    </Suspense>
  )
}
