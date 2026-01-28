/**
 * Utility functions for generating canonical URLs
 */

export function getCanonicalUrl(pathname: string, searchParams?: URLSearchParams): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.es"

  // Remove trailing slash if present
  const cleanPathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname

  // For blog pages with pagination, include page parameter in canonical
  if (cleanPathname === "/blog" && searchParams?.get("page")) {
    const page = searchParams.get("page")
    if (page && page !== "1") {
      return `${baseUrl}${cleanPathname}?page=${page}`
    }
  }

  // For all other pages, use clean pathname without query parameters
  return `${baseUrl}${cleanPathname}`
}

export function generateCanonicalMetadata(pathname: string, searchParams?: URLSearchParams) {
  return {
    alternates: {
      canonical: getCanonicalUrl(pathname, searchParams),
    },
  }
}
