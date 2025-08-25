import { type NextRequest, NextResponse } from "next/server"
import { BlogService } from "@/lib/blog-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    const params = {
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "10"),
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      tag: searchParams.get("tag") || undefined,
    }

    const result = await BlogService.getPosts(params)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Error fetching blog posts" }, { status: 500 })
  }
}
