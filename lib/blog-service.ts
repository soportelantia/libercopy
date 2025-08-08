import { supabase } from "@/lib/supabase/client"
import type { BlogCategory, BlogTag, BlogSearchParams, BlogSearchResult, BlogPostWithRelations } from "@/types/blog"

export class BlogService {
  // Obtener posts con filtros y paginación
  static async getPosts(params: BlogSearchParams = {}): Promise<BlogSearchResult> {
    const { search, category, tag, page = 1, limit = 6 } = params
    const offset = (page - 1) * limit

    console.log("BlogService.getPosts called with params:", params)

    try {
      // Primero obtenemos los posts básicos sin relaciones complejas
      let baseQuery = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")

      // Aplicar filtros de búsqueda
      if (search) {
        baseQuery = baseQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // Aplicar filtro de categoría
      if (category) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", category)
          .single()

        if (categoryError) {
          console.error("Error fetching category:", categoryError)
        } else if (categoryData) {
          baseQuery = baseQuery.eq("category_id", categoryData.id)
        }
      }

      // Obtener todos los posts que coinciden con los filtros
      const { data: allFilteredPosts, error: allPostsError } = await baseQuery
        .order("published_at", { ascending: false })

      if (allPostsError) {
        console.error("Error fetching all filtered posts:", allPostsError)
        throw allPostsError
      }

      console.log("All filtered posts before tag filtering:", allFilteredPosts?.length || 0)

      if (!allFilteredPosts || allFilteredPosts.length === 0) {
        return {
          posts: [],
          total: 0,
          filteredTotal: 0,
          page,
          limit,
          totalPages: 0,
          categories: await this.getCategories(),
          tags: await this.getTags(),
        }
      }

      // Obtener las categorías para todos los posts
      const categoryIds = [...new Set(allFilteredPosts.map(post => post.category_id).filter(Boolean))]
      let categoriesMap: Record<string, BlogCategory> = {}
      
      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*")
          .in("id", categoryIds)

        if (categoriesError) {
          console.error("Error fetching post categories:", categoriesError)
        } else if (categories) {
          categoriesMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat
            return acc
          }, {} as Record<string, BlogCategory>)
        }
      }

      // Obtener los tags para todos los posts
      const postIds = allFilteredPosts.map(post => post.id)
      let postTagsMap: Record<string, BlogTag[]> = {}

      if (postIds.length > 0) {
        const { data: postTags, error: postTagsError } = await supabase
          .from("blog_post_tags")
          .select(`
            post_id,
            blog_tags (*)
          `)
          .in("post_id", postIds)

        if (postTagsError) {
          console.error("Error fetching post tags:", postTagsError)
        } else if (postTags) {
          postTagsMap = postTags.reduce((acc, pt) => {
            if (!acc[pt.post_id]) {
              acc[pt.post_id] = []
            }
            if (pt.blog_tags) {
              acc[pt.post_id].push(pt.blog_tags as BlogTag)
            }
            return acc
          }, {} as Record<string, BlogTag[]>)
        }
      }

      // Transformar datos para incluir relaciones
      let transformedPosts: BlogPostWithRelations[] = allFilteredPosts.map((post) => ({
        ...post,
        category: post.category_id ? categoriesMap[post.category_id] || null : null,
        tags: postTagsMap[post.id] || [],
      }))

      // Filtrar por tag si se especifica
      if (tag) {
        transformedPosts = transformedPosts.filter((post) => 
          post.tags.some((t) => t.slug === tag)
        )
        console.log("Posts after tag filtering:", transformedPosts.length)
      }

      // Calcular el total después de todos los filtros
      const filteredTotal = transformedPosts.length
      const totalPages = Math.ceil(filteredTotal / limit)

      // Aplicar paginación manualmente
      const paginatedPosts = transformedPosts.slice(offset, offset + limit)

      console.log("Final paginated posts:", paginatedPosts.length)
      console.log("Filtered total:", filteredTotal)

      // Obtener categorías y tags para filtros
      const [categoriesResult, tagsResult] = await Promise.all([
        this.getCategories(),
        this.getTags(),
      ])

      const result = {
        posts: paginatedPosts,
        total: filteredTotal,
        filteredTotal: filteredTotal,
        page,
        limit,
        totalPages,
        categories: categoriesResult,
        tags: tagsResult,
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
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single()

      if (error) {
        console.error("Error fetching blog post:", error)
        return null
      }

      if (!post) return null

      // Obtener la categoría del post
      let category: BlogCategory | null = null
      if (post.category_id) {
        const { data: categoryData, error: categoryError } = await supabase
          .from("blog_categories")
          .select("*")
          .eq("id", post.category_id)
          .single()

        if (categoryError) {
          console.error("Error fetching post category:", categoryError)
        } else {
          category = categoryData
        }
      }

      // Obtener los tags del post
      const { data: postTags, error: postTagsError } = await supabase
        .from("blog_post_tags")
        .select(`
          blog_tags (*)
        `)
        .eq("post_id", post.id)

      let tags: BlogTag[] = []
      if (postTagsError) {
        console.error("Error fetching post tags:", postTagsError)
      } else if (postTags) {
        tags = postTags.map(pt => pt.blog_tags as BlogTag).filter(Boolean)
      }

      // Incrementar contador de visualizaciones
      await supabase
        .from("blog_posts")
        .update({ views_count: (post.views_count || 0) + 1 })
        .eq("id", post.id)

      // Transformar datos
      return {
        ...post,
        category,
        tags,
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
        .select("*")
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

      if (!posts || posts.length === 0) {
        return []
      }

      // Obtener categorías para los posts relacionados
      const categoryIds = [...new Set(posts.map(post => post.category_id).filter(Boolean))]
      let categoriesMap: Record<string, BlogCategory> = {}
      
      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*")
          .in("id", categoryIds)

        if (!categoriesError && categories) {
          categoriesMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat
            return acc
          }, {} as Record<string, BlogCategory>)
        }
      }

      // Obtener tags para los posts relacionados
      const postIds = posts.map(post => post.id)
      let postTagsMap: Record<string, BlogTag[]> = {}

      const { data: postTags, error: postTagsError } = await supabase
        .from("blog_post_tags")
        .select(`
          post_id,
          blog_tags (*)
        `)
        .in("post_id", postIds)

      if (!postTagsError && postTags) {
        postTagsMap = postTags.reduce((acc, pt) => {
          if (!acc[pt.post_id]) {
            acc[pt.post_id] = []
          }
          if (pt.blog_tags) {
            acc[pt.post_id].push(pt.blog_tags as BlogTag)
          }
          return acc
        }, {} as Record<string, BlogTag[]>)
      }

      return posts.map((post) => ({
        ...post,
        category: post.category_id ? categoriesMap[post.category_id] || null : null,
        tags: postTagsMap[post.id] || [],
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
