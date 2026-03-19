"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ReviewData {
  rating: number | null
  userRatingCount: number
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-label="Google">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function GoogleScoreBadge() {
  const [data, setData] = useState<ReviewData | null>(null)

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((res) => res.json())
      .then((json) => setData({ rating: json.rating, userRatingCount: json.userRatingCount }))
      .catch(() => {})
  }, [])

  if (!data || !data.rating) return null

  const fullStars = Math.floor(data.rating)
  const hasHalf = data.rating - fullStars >= 0.5

  return (
    <Card className="border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardContent className="p-5">
        <a
          href="https://share.google/hEO0ANx1idQylYW0W"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
          aria-label={`Ver perfil de LiberCopy en Google — ${data.rating.toFixed(1)} estrellas`}
        >
          <GoogleLogo />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 leading-none mb-1">Valoración en Google</p>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-gray-900 leading-none group-hover:text-yellow-600 transition-colors">{data.rating.toFixed(1)}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < fullStars
                        ? "fill-yellow-400 text-yellow-400"
                        : i === fullStars && hasHalf
                        ? "fill-yellow-200 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700 transition-colors">
              {data.userRatingCount} reseñas verificadas
            </p>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </CardContent>
    </Card>
  )
}
