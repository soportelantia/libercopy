/**
 * JSON-LD schema helpers for Libercopy landing pages.
 * Use buildProductSchema for pages with a clear product/price offer.
 * Use buildServiceSchema for use-case / audience pages.
 * Always pair with buildFaqSchema.
 */

export interface FaqItem {
  question: string
  answer: string
}

export interface ProductSchemaOptions {
  name: string
  description: string
  url: string
  price: string
  priceValidUntil?: string
}

export interface ServiceSchemaOptions {
  name: string
  description: string
  url: string
  serviceType: string
}

const BRAND = {
  "@type": "Brand",
  name: "Libercopy",
} as const

const SELLER = {
  "@type": "Organization",
  name: "Libercopy",
} as const

/** Schema for pages with a clear product + price (e.g. /impresion-color-a4) */
export function buildProductSchema(opts: ProductSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    brand: BRAND,
    url: opts.url,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: opts.price,
      priceValidUntil: opts.priceValidUntil ?? "2026-12-31",
      availability: "https://schema.org/InStock",
      url: opts.url,
      seller: SELLER,
    },
  }
}

/** Schema for use-case pages without a single fixed price (e.g. /copisteria-online-para-profesores) */
export function buildServiceSchema(opts: ServiceSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: opts.url,
    provider: {
      "@type": "Organization",
      name: "Libercopy",
      url: "https://www.libercopy.es",
    },
    areaServed: {
      "@type": "Country",
      name: "Spain",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: opts.url,
    },
  }
}

/** FAQPage schema, reusable across all landing pages */
export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
