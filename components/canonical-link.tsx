"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { getCanonicalUrl } from "@/lib/canonical-url"

export default function CanonicalLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const canonicalUrl = getCanonicalUrl(pathname, searchParams)

  return <link rel="canonical" href={canonicalUrl} />
}
