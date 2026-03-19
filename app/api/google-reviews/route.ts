import { NextResponse } from "next/server"

const PLACE_ID = "ChIJQeMQUQBtEg0R3qHruQZ13Wo"
const MIN_RATING = 4

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=displayName,rating,userRatingCount,reviews&languageCode=es`

    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache 1 hora
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Google Places API error:", errorText)
      return NextResponse.json({ error: "Error fetching reviews" }, { status: response.status })
    }

    const data = await response.json()

    const allReviews = data.reviews ?? []

    // Filtrar solo reseñas con puntuación >= MIN_RATING y ordenar de mayor a menor
    const filtered = allReviews
      .filter((r: { rating: number }) => r.rating >= MIN_RATING)
      .sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating)

    return NextResponse.json({
      rating: data.rating ?? null,
      userRatingCount: data.userRatingCount ?? 0,
      reviews: filtered,
    })
  } catch (error) {
    console.error("[v0] Unexpected error fetching reviews:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
