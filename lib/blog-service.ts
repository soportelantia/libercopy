import { supabase } from "@/lib/supabase/client"
import type { BlogCategory, BlogTag, BlogSearchParams, BlogSearchResult, BlogPostWithRelations } from "@/types/blog"

export class BlogService {
  // Test database connection
  static async testConnection() {
    try {
      console.log("Testing Supabase connection...")
      const { data, error } = await supabase
        .from("blog_posts")
        .select("count", { count: "exact", head: true })

      console.log("Connection test result:", { data, error })
      return { data, error }
    } catch (error) {
      console.error("Connection test failed:", error)
      return { data: null, error }
    }
  }

  // Obtener posts con filtros y paginación
  static async getPosts(params: BlogSearchParams = {}): Promise<BlogSearchResult> {
    const { search, category, tag, page = 1, limit = 6 } = params
    const offset = (page - 1) * limit

    console.log("BlogService.getPosts called with params:", params)

    try {
      // Primero verificamos si existen las tablas
      console.log("Checking if blog_posts table exists...")
      const { data: tableCheck, error: tableError } = await supabase
        .from("blog_posts")
        .select("id")
        .limit(1)

      if (tableError) {
        console.error("Table check failed:", tableError)
        throw new Error(`Blog posts table not accessible: ${tableError.message}`)
      }

      console.log("Table exists, found posts:", tableCheck?.length || 0)

      // Obtener todos los posts sin filtros primero para debug
      console.log("Fetching all posts for debug...")
      const { data: allPosts, error: allPostsError } = await supabase
        .from("blog_posts")
        .select("*")

      console.log("All posts in database:", {
        count: allPosts?.length || 0,
        posts: allPosts?.map(p => ({ id: p.id, title: p.title, status: p.status })) || []
      })

      if (allPostsError) {
        console.error("Error fetching all posts:", allPostsError)
      }

      // Ahora construir la query con filtros
      let baseQuery = supabase
        .from("blog_posts")
        .select("*")

      // Solo filtrar por published si hay posts
      if (allPosts && allPosts.length > 0) {
        baseQuery = baseQuery.eq("status", "published")
      }

      // Aplicar filtros de búsqueda
      if (search) {
        baseQuery = baseQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // Aplicar filtro de categoría
      if (category) {
        console.log("Filtering by category:", category)
        const { data: categoryData, error: categoryError } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", category)
          .single()

        if (categoryError) {
          console.error("Error fetching category:", categoryError)
        } else if (categoryData) {
          console.log("Found category:", categoryData)
          baseQuery = baseQuery.eq("category_id", categoryData.id)
        } else {
          console.log("No category found with slug:", category)
        }
      }

      // Obtener posts filtrados
      console.log("Executing filtered query...")
      const { data: filteredPosts, error: filteredError } = await baseQuery
        .order("created_at", { ascending: false })

      if (filteredError) {
        console.error("Error fetching filtered posts:", filteredError)
        throw filteredError
      }

      console.log("Filtered posts result:", {
        count: filteredPosts?.length || 0,
        posts: filteredPosts?.map(p => ({ id: p.id, title: p.title, status: p.status })) || []
      })

      if (!filteredPosts || filteredPosts.length === 0) {
        console.log("No posts found after filtering")
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
      const categoryIds = [...new Set(filteredPosts.map(post => post.category_id).filter(Boolean))]
      let categoriesMap: Record<string, BlogCategory> = {}
      
      console.log("Fetching categories for posts:", categoryIds)
      
      if (categoryIds.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*")
          .in("id", categoryIds)

        if (categoriesError) {
          console.error("Error fetching post categories:", categoriesError)
        } else if (categories) {
          console.log("Found categories:", categories)
          categoriesMap = categories.reduce((acc, cat) => {
            acc[cat.id] = cat
            return acc
          }, {} as Record<string, BlogCategory>)
        }
      }

      // Obtener los tags para todos los posts
      const postIds = filteredPosts.map(post => post.id)
      let postTagsMap: Record<string, BlogTag[]> = {}

      console.log("Fetching tags for posts:", postIds)

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
          console.log("Found post tags:", postTags)
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
      let transformedPosts: BlogPostWithRelations[] = filteredPosts.map((post) => ({
        ...post,
        category: post.category_id ? categoriesMap[post.category_id] || null : null,
        tags: postTagsMap[post.id] || [],
      }))

      console.log("Transformed posts:", transformedPosts.length)

      // Filtrar por tag si se especifica
      if (tag) {
        console.log("Filtering by tag:", tag)
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

      console.log("Final result:", {
        paginatedCount: paginatedPosts.length,
        filteredTotal,
        totalPages,
        page
      })

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

      return result

    } catch (error) {
      console.error("BlogService.getPosts error:", error)
      throw error
    }
  }

  // Obtener un post por slug
  static async getPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    try {
      console.log("Fetching post by slug:", slug)
      
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

      if (!post) {
        console.log("No post found with slug:", slug)
        return null
      }

      console.log("Found post:", post)

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
      try {
        await supabase
          .from("blog_posts")
          .update({ views_count: (post.views_count || 0) + 1 })
          .eq("id", post.id)
      } catch (updateError) {
        console.error("Error updating view count:", updateError)
        // No throw, just log the error
      }

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
      console.log("Fetching related posts for:", postId, "category:", categoryId)
      
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .neq("id", postId)
        .order("created_at", { ascending: false })
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
        console.log("No related posts found")
        return []
      }

      console.log("Found related posts:", posts.length)

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
      console.log("Fetching categories...")
      const { data, error } = await supabase.from("blog_categories").select("*").order("name")

      if (error) {
        console.error("Error fetching categories:", error)
        return []
      }

      console.log("Found categories:", data?.length || 0)
      return data || []
    } catch (error) {
      console.error("BlogService.getCategories error:", error)
      return []
    }
  }

  // Obtener tags
  static async getTags(): Promise<BlogTag[]> {
    try {
      console.log("Fetching tags...")
      const { data, error } = await supabase.from("blog_tags").select("*").order("name")

      if (error) {
        console.error("Error fetching tags:", error)
        return []
      }

      console.log("Found tags:", data?.length || 0)
      return data || []
    } catch (error) {
      console.error("BlogService.getTags error:", error)
      return []
    }
  }
}
