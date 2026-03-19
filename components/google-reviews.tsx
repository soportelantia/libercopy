"use client"

import { useEffect, useState } from "react"
import { Star, ExternalLink, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const GOOGLE_MAPS_URL = `https://search.google.com/local/reviews?placeid=ChIJQeMQUQBtEg0R3qHruQZ13Wo`
const WRITE_REVIEW_URL = "https://g.page/r/Cd6h67kGdd1qEAE/review"

interface Review {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text?: string
}

interface ReviewsData {
  rating: number
  userRatingCount: number
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Valoración: ${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-label="Google" role="img">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function Avatar({ name, photoUri }: { name: string; photoUri?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  if (photoUri) {
    return (
      <img
        src={photoUri}
        alt={name}
        crossOrigin="anonymous"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    )
  }

  return (
    <div
      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export default function GoogleReviews() {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching reviews")
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-20 bg-white/60">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
            <Star className="w-4 h-4 mr-2 fill-white" />
            Reseñas de Google
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Lo que dicen nuestros{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              clientes
            </span>
          </h2>

          {/* Puntuación global */}
          {data && (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-1" aria-label={`Valoración media: ${data.rating} de 5 estrellas`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-7 h-7 ${star <= Math.round(data.rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-5xl font-bold text-gray-900">{data.rating.toFixed(1).replace(".", ",")}</span>
              <div className="text-left">
                <p className="text-sm text-gray-500">{data.userRatingCount} reseñas en</p>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                >
                  <GoogleLogo />
                  <span>Google</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Estados: cargando / error / reseñas */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {error && (
          <p className="text-center text-gray-500 py-10">
            No se pudieron cargar las reseñas en este momento.
          </p>
        )}

        {!loading && !error && data && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {data.reviews.map((review, index) => (
              <Card
                key={index}
                className="border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                      aria-hidden="true"
                    >
                      {review.author_name.trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {(() => {
                          const parts = review.author_name.trim().split(" ")
                          const first = parts[0]
                          const lastInitial = parts.length > 1 ? ` ${parts[parts.length - 1].charAt(0).toUpperCase()}.` : ""
                          return `${first}${lastInitial}`
                        })()}
                      </p>
                      <p className="text-xs text-gray-400">{review.relative_time_description}</p>
                    </div>
                    <GoogleLogo />
                  </div>
                  <StarRating rating={review.rating} />
                  {review.text && (
                    <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-4">
                      {review.text}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            Ver todas las reseñas en Google
          </a>
          <a
            href={WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Star className="w-4 h-4 fill-white" />
            Dejar una reseña
          </a>
        </div>
      </div>
    </section>
  )
}
