"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { getCanonicalUrl } from "@/lib/canonical-url"
import { Suspense } from "react"

function CanonicalLinkInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const canonicalUrl = getCanonicalUrl(pathname, searchParams)

  return <link rel="canonical" href={canonicalUrl} />
}

export default function CanonicalLink() {
  return (
    <Suspense fallback={null}>
      <CanonicalLinkInner />
    </Suspense>
  )
}
