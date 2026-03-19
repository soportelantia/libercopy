import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const PLACE_ID = "ChIJQeMQUQBtEg0R3qHruQZ13Wo"
const MIN_RATING = 4

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
  url.searchParams.set("place_id", PLACE_ID)
  url.searchParams.set("fields", "name,rating,user_ratings_total,reviews")
  url.searchParams.set("language", "es")
  url.searchParams.set("reviews_sort", "newest")
  url.searchParams.set("key", apiKey)

  console.log("[v0] Fetching from:", url.toString().replace(apiKey, "REDACTED"))

  try {
    const response = await fetch(url.toString(), { cache: "no-store" })

    const data = await response.json()

    console.log("[v0] Google API status:", data.status)

    if (data.status !== "OK") {
      console.error("[v0] Google Places API error:", JSON.stringify(data))
      return NextResponse.json({ error: data.error_message ?? data.status }, { status: 500 })
    }

    const allReviews = data.result.reviews ?? []

    const filtered = allReviews
      .filter((r: { rating: number }) => r.rating >= MIN_RATING)
      .sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating)

    return NextResponse.json({
      rating: data.result.rating ?? null,
      userRatingCount: data.result.user_ratings_total ?? 0,
      reviews: filtered,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
