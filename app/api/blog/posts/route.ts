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
        category:blog_categories(*),
        tags:blog_post_tags(tag:blog_tags(*))
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

    const { data: allPosts } = await query

    let posts = (allPosts || []).map((post) => ({
      ...post,
      tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
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
