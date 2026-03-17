"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSearch } from "@/components/blog/blog-search"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"
import { Rss } from "lucide-react"
import type { BlogCategory, BlogPostWithRelations } from "@/types/blog"

interface PostsData {
  posts: BlogPostWithRelations[]
  total: number
  page: number
  limit: number
  totalPages: number
}

function BlogPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-full">
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BlogContent() {
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get("page") || "1")
  const search = searchParams.get("search") || undefined
  const category = searchParams.get("category") || undefined
  const tag = searchParams.get("tag") || undefined

  const [postsData, setPostsData] = useState<PostsData | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const postsParams = new URLSearchParams()
        postsParams.set("page", String(page))
        if (search) postsParams.set("search", search)
        if (category) postsParams.set("category", category)
        if (tag) postsParams.set("tag", tag)

        const [postsRes, catsRes] = await Promise.all([
          fetch(`/api/blog/posts?${postsParams.toString()}`),
          fetch("/api/blog/categories"),
        ])

        if (!postsRes.ok) throw new Error("Error cargando posts")
        if (!catsRes.ok) throw new Error("Error cargando categorías")

        const [postsJson, catsJson] = await Promise.all([postsRes.json(), catsRes.json()])
        setPostsData(postsJson)
        setCategories(catsJson)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, search, category, tag])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <BlogSearch categories={categories} />
        </div>
      </div>
      <div className="lg:col-span-3">
        {error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2 text-red-600">Error al cargar el blog</h3>
            <p className="text-gray-600">Por favor, intenta de nuevo más tarde</p>
          </div>
        ) : loading ? (
          <BlogPostsSkeleton />
        ) : postsData && postsData.posts.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                {search || category ? "Resultados de búsqueda" : "Últimos posts"}
              </h2>
              <p className="text-gray-600">
                {postsData.total} post{postsData.total !== 1 ? "s" : ""} encontrado
                {postsData.total !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postsData.posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            <BlogPagination
              currentPage={postsData.page}
              totalPages={postsData.totalPages}
              total={postsData.total}
              limit={postsData.limit}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No se encontraron posts</h3>
            <p className="text-gray-600 mb-4">
              {search || category ? "Intenta con otros términos de búsqueda" : "Aún no hay posts publicados"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BlogPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <Rss className="w-4 h-4 mr-2" />
              De Interés
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Nuestros artículos
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Consejos, guías y novedades sobre impresión y encuadernación
            </p>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<BlogPostsSkeleton />}>
          <BlogContent />
        </Suspense>
      </div>
    </main>
  )
}
