"use client"

import { usePathname } from "next/navigation"
import Head from "next/head"

export default function CanonicalHead() {
  const pathname = usePathname()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.com"
  const canonicalUrl = `${baseUrl}${pathname}`

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}
