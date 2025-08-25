import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { BlogService } from "@/lib/blog-service"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogSearch } from "@/components/blog/blog-search"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"
import { Rss } from "lucide-react"
import type { Metadata } from "next"
import { generateCanonicalMetadata } from "@/lib/canonical-url"

interface BlogPageProps {
  searchParams: {
    page?: string
    search?: string
    category?: string
    tag?: string
  }
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const page = searchParams.page
  const search = new URLSearchParams()

  if (page && page !== "1") {
    search.set("page", page)
  }

  return {
    title: "Libercopy - Blog",
    description: "Consejos, guías y novedades sobre impresión y encuadernación",
    ...generateCanonicalMetadata("/blog", search),
  }
}

function BlogPostsSkeleton() {
  return (
    <div className="w-full overflow-x-hidden">
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <Skeleton className="h-8 w-32 mx-auto mb-4" />
              <Skeleton className="h-12 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-32 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <Skeleton className="h-6 w-24 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const page = Number.parseInt(searchParams.page || "1")
  const search = searchParams.search
  const category = searchParams.category
  const tag = searchParams.tag

  console.log("BlogContent - Starting with params:", { page, search, category, tag })

  try {
    // Test basic database connection first
    console.log("Testing database connection...")
    const { data: testData, error: testError } = await BlogService.testConnection()
    console.log("Database test result:", { testData, testError })

    console.log("Fetching blog posts...")
    const [postsData, categories] = await Promise.all([
      BlogService.getPosts({ page, search, category, tag }),
      BlogService.getCategories(),
    ])

    console.log("Blog posts data received:", {
      postsCount: postsData.posts.length,
      total: postsData.total,
      filteredTotal: postsData.filteredTotal,
      categoriesCount: categories.length,
    })

    return (
      <div className="w-full overflow-x-hidden">
        <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Navbar />
          <section className="relative py-20 md:py-32 overflow-hidden" style={{ paddingBottom: "4rem" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar con búsqueda */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <BlogSearch categories={categories} />
                </div>
              </div>

              {/* Contenido principal */}
              <div className="lg:col-span-3">
                {postsData.posts.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold mb-2">
                        {search || category ? "Resultados de búsqueda" : "Últimos posts"}
                      </h2>
                      <p className="text-gray-600">
                        {postsData.filteredTotal} post{postsData.filteredTotal !== 1 ? "s" : ""} encontrado
                        {postsData.filteredTotal !== 1 ? "s" : ""}
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
                      total={postsData.filteredTotal}
                      limit={postsData.limit}
                    />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No se encontraron posts</h3>
                    <p className="text-gray-600 mb-4">
                      {search || category ? "Intenta con otros términos de búsqueda" : "Aún no hay posts publicados"}
                    </p>
                    <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-100 rounded-lg">
                      <p className="font-semibold mb-2">Debug info:</p>
                      <p>Total posts: {postsData.total}</p>
                      <p>Filtered total: {postsData.filteredTotal}</p>
                      <p>Current page: {postsData.page}</p>
                      <p>Search params: {JSON.stringify({ search, category, tag })}</p>
                      <p>Categories available: {categories.length}</p>
                      <p>Database test: {testData ? "Connected" : "Failed"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog:", error)
    return (
      <div className="w-full overflow-x-hidden">
        <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-red-600">Error al cargar el blog</h3>
              <p className="text-gray-600 mb-4">Por favor, intenta de nuevo más tarde</p>
              <div className="text-sm text-gray-500 mt-4 p-4 bg-red-50 rounded-lg">
                <p className="font-semibold mb-2">Error details:</p>
                <p className="break-words">{error instanceof Error ? error.message : JSON.stringify(error)}</p>
                <p className="mt-2">Stack: {error instanceof Error ? error.stack : "No stack trace"}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<BlogPostsSkeleton />}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  )
}
