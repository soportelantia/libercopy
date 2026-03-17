import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "6")
    const search = searchParams.get("search") || undefined
    const category = searchParams.get("category") || undefined
    const tag = searchParams.get("tag") || undefined
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(*)
      `)
      .order("published_at", { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (category) {
      const { data: cat } = await supabaseAdmin
        .from("blog_categories")
        .select("id")
        .eq("slug", category)
        .single()
      if (cat) query = query.eq("category_id", cat.id)
    }

    const { data: allPosts, error: postsError } = await query

    console.log("[v0] blog posts query result - count:", allPosts?.length, "error:", postsError)
    console.log("[v0] supabase url defined:", !!process.env.NEXT_PUBLIC_SUPABASE_URL, "key defined:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    if (postsError) {
      console.error("[v0] blog posts error detail:", postsError)
      return NextResponse.json({ error: postsError.message, detail: postsError }, { status: 500 })
    }

    let posts = (allPosts || []).map((post) => ({
      ...post,
      tags: [],
    }))

    if (tag) {
      posts = posts.filter((post) => post.tags.some((t: any) => t.slug === tag))
    }

    const total = posts.length
    const paginated = posts.slice(offset, offset + limit)

    return NextResponse.json({
      posts: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
