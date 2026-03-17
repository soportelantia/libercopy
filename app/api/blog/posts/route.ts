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

    let postsQuery = supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (search) {
      postsQuery = postsQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (category) {
      const { data: cat } = await supabaseAdmin
        .from("blog_categories")
        .select("id")
        .eq("slug", category)
        .single()
      if (cat) postsQuery = postsQuery.eq("category_id", cat.id)
    }

    const { data: allPosts, error: postsError } = await postsQuery

    if (postsError) {
      return NextResponse.json({ error: postsError.message, detail: postsError }, { status: 500 })
    }

    // Obtener categorías por separado y mapearlas
    const { data: allCategories } = await supabaseAdmin.from("blog_categories").select("*")
    const categoriesMap = Object.fromEntries((allCategories || []).map((c) => [c.id, c]))

    const posts = (allPosts || []).map((post) => ({
      ...post,
      category: categoriesMap[post.category_id] || null,
      tags: [],
    }))

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
