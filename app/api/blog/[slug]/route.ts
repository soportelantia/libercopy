import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const { data: post, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Incrementar vistas
    await supabaseAdmin
      .from("blog_posts")
      .update({ views_count: (post.views_count || 0) + 1 })
      .eq("id", post.id)

    // Obtener categoría por separado
    const { data: allCategories } = await supabaseAdmin.from("blog_categories").select("*")
    const categoriesMap = Object.fromEntries((allCategories || []).map((c) => [c.id, c]))

    const transformed = {
      ...post,
      category: categoriesMap[post.category_id] || null,
      tags: [],
    }

    // Posts relacionados
    let relatedQuery = supabaseAdmin
      .from("blog_posts")
      .select("*")
      .neq("id", post.id)
      .order("published_at", { ascending: false })
      .limit(3)

    if (post.category_id) {
      relatedQuery = relatedQuery.eq("category_id", post.category_id)
    }

    const { data: related } = await relatedQuery
    const relatedPosts = (related || []).map((p) => ({
      ...p,
      category: categoriesMap[p.category_id] || null,
      tags: [],
    }))

    return NextResponse.json({ post: transformed, relatedPosts })
  } catch (error: any) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
