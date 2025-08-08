import { supabase } from "@/lib/supabase/client"
import type { BlogCategory, BlogTag, BlogSearchParams, BlogSearchResult, BlogPostWithRelations } from "@/types/blog"

export class BlogService {
  // Obtener posts con filtros y paginación
  static async getPosts(params: BlogSearchParams = {}): Promise<BlogSearchResult> {
    const { search, category, tag, page = 1, limit = 6 } = params
    const offset = (page - 1) * limit

    console.log("BlogService.getPosts called with params:", params)

    try {
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(
            tag:blog_tags(*)
          )
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })

      // Aplicar filtros
      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
      }

      if (category) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", category)
          .single()

        if (categoryError) {
          console.error("Error fetching category:", categoryError)
        } else if (categoryData) {
          query = query.eq("category_id", categoryData.id)
        }
      }

      // Obtener total de posts para paginación
      const { count, error: countError } = await query.select("*", { count: "exact", head: true })
      
      if (countError) {
        console.error("Error getting count:", countError)
        throw countError
      }

      const total = count || 0
      console.log("Total posts found:", total)

      // Obtener posts con paginación
      const { data: posts, error } = await query.range(offset, offset + limit - 1)

      if (error) {
        console.error("Error fetching blog posts:", error)
        throw error
      }

      console.log("Raw posts data:", posts)

      // Transformar datos para incluir tags correctamente
      const transformedPosts: BlogPostWithRelations[] = (posts || []).map((post) => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
      }))

      console.log("Transformed posts:", transformedPosts)

      // Filtrar por tag si se especifica
      let filteredPosts = transformedPosts
      if (tag) {
        filteredPosts = transformedPosts.filter((post) => 
          post.tags.some((t) => t.slug === tag)
        )
        console.log("Posts filtered by tag:", filteredPosts)
      }

      // Obtener categorías y tags para filtros
      const [categoriesResult, tagsResult] = await Promise.all([
        supabase.from("blog_categories").select("*").order("name"),
        supabase.from("blog_tags").select("*").order("name"),
      ])

      if (categoriesResult.error) {
        console.error("Error fetching categories:", categoriesResult.error)
      }
      if (tagsResult.error) {
        console.error("Error fetching tags:", tagsResult.error)
      }

      const result = {
        posts: filteredPosts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        categories: categoriesResult.data || [],
        tags: tagsResult.data || [],
      }

      console.log("Final result:", result)
      return result

    } catch (error) {
      console.error("BlogService.getPosts error:", error)
      throw error
    }
  }

  // Obtener un post por slug
  static async getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    try {
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(
            tag:blog_tags(*)
          )
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single()

      if (error) {
        console.error("Error fetching blog post:", error)
        return null
      }

      if (!post) return null

      // Incrementar contador de visualizaciones
      await supabase
        .from("blog_posts")
        .update({ views_count: (post.views_count || 0) + 1 })
        .eq("id", post.id)

      // Transformar datos
      return {
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
      }
    } catch (error) {
      console.error("BlogService.getPostBySlug error:", error)
      return null
    }
  }

  // Obtener posts relacionados
  static async getRelatedPosts(postId: string, categoryId?: string, limit = 3): Promise<BlogPostWithRelations[]> {
    try {
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(*),
          tags:blog_post_tags(
            tag:blog_tags(*)
          )
        `)
        .eq("status", "published")
        .neq("id", postId)
        .order("published_at", { ascending: false })
        .limit(limit)

      if (categoryId) {
        query = query.eq("category_id", categoryId)
      }

      const { data: posts, error } = await query

      if (error) {
        console.error("Error fetching related posts:", error)
        return []
      }

      return (posts || []).map((post) => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag).filter(Boolean) || [],
      }))
    } catch (error) {
      console.error("BlogService.getRelatedPosts error:", error)
      return []
    }
  }

  // Obtener categorías
  static async getCategories(): Promise<BlogCategory[]> {
    try {
      const { data, error } = await supabase.from("blog_categories").select("*").order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("BlogService.getCategories error:", error)
      return []
    }
  }

  // Obtener tags
  static async getTags(): Promise<BlogTag[]> {
    try {
      const { data, error } = await supabase.from("blog_tags").select("*").order("name")

      if (error) {
        console.error("Error fetching tags:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("BlogService.getTags error:", error)
      return []
    }
  }
}
