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
  /** URL of the product image. Defaults to the Libercopy logo. */
  image?: string
  priceValidUntil?: string
}

export interface ServiceSchemaOptions {
  name: string
  description: string
  url: string
  serviceType: string
  /** URL of an image representing the service. Defaults to the Libercopy logo. */
  image?: string
}

const BRAND = {
  "@type": "Brand",
  name: "Libercopy",
} as const

const SELLER = {
  "@type": "Organization",
  name: "Libercopy",
  url: "https://www.libercopy.es",
} as const

const DEFAULT_IMAGE = "https://www.libercopy.es/libercopy-logo.png"

/**
 * Shared shipping details block required by Google Search Console.
 * Covers all of Spain (ES) with 24–48 h delivery.
 */
const SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "3.99",
    currency: "EUR",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "ES",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 0,
      maxValue: 1,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 2,
      unitCode: "DAY",
    },
  },
} as const

/**
 * Shared merchant return policy required by Google Search Console.
 */
const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "ES",
  returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
  merchantReturnDays: 0,
} as const

/**
 * Static aggregate rating based on Libercopy's Google reviews.
 * Update ratingValue / ratingCount periodically.
 */
const AGGREGATE_RATING = {
  "@type": "AggregateRating",
  ratingValue: "4.9",
  reviewCount: "47",
  bestRating: "5",
  worstRating: "1",
} as const

/** Schema for pages with a clear product + price (e.g. /impresion-color-a4) */
export function buildProductSchema(opts: ProductSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.image ?? DEFAULT_IMAGE,
    brand: BRAND,
    url: opts.url,
    aggregateRating: AGGREGATE_RATING,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: opts.price,
      priceValidUntil: opts.priceValidUntil ?? "2027-12-31",
      availability: "https://schema.org/InStock",
      url: opts.url,
      seller: SELLER,
      shippingDetails: SHIPPING_DETAILS,
      hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
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
    image: opts.image ?? DEFAULT_IMAGE,
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
