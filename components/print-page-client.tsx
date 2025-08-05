"use client"

import { useSearchParams } from "next/navigation"
import PrintPage from "./print-page"

export default function PrintPageClient() {
  const searchParams = useSearchParams()

  return <PrintPage searchParams={searchParams} />
}
