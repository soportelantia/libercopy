"use client"

import Link from "next/link"
import { BlogService } from "@/lib/blog-service"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, ArrowLeft, Share2 } from 'lucide-react'
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostClientPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await BlogService.getPostBySlug(params.slug)
      if (!fetchedPost) {
        notFound()
      }
      setPost(fetchedPost)

      const related = await BlogService.getRelatedPosts(fetchedPost.id, fetchedPost.category_id)
      setRelatedPosts(related)
    }

    fetchPost()
  }, [params.slug])

  if (!post) {
    return <div>Loading...</div>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || "",
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert("URL copiada al portapapeles")
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Navegación */}
        <div className="mb-6">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Button>
          </Link>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Header del post */}
          <header className="mb-8">
            {/* Categoría */}
            {post.category && (
              <Badge variant="secondary" className="mb-4">
                {post.category.name}
              </Badge>
            )}

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>}

            {/* Metadatos */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.views_count} visualizaciones</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </Button>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Imagen destacada */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Contenido con estilos HTML */}
          <div className="mb-12">
            <div
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
              className="blog-content prose prose-lg max-w-none
                [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-8 [&>h1]:text-gray-900 [&>h1]:leading-tight
                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:mt-6 [&>h2]:text-gray-900 [&>h2]:leading-tight
                [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:mt-5 [&>h3]:text-gray-800 [&>h3]:leading-tight
                [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mb-2 [&>h4]:mt-4 [&>h4]:text-gray-800
                [&>h5]:text-base [&>h5]:font-semibold [&>h5]:mb-2 [&>h5]:mt-3 [&>h5]:text-gray-700
                [&>h6]:text-sm [&>h6]:font-semibold [&>h6]:mb-2 [&>h6]:mt-3 [&>h6]:text-gray-700
                [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-4 [&>p]:text-gray-700
                [&>a]:text-blue-600 [&>a]:underline [&>a]:decoration-2 [&>a]:underline-offset-2 hover:[&>a]:text-blue-800 hover:[&>a]:decoration-blue-800
                [&>ul]:mb-4 [&>ul]:pl-6 [&>ul>li]:list-disc [&>ul>li]:mb-2 [&>ul>li]:text-gray-700
                [&>ol]:mb-4 [&>ol]:pl-6 [&>ol>li]:list-decimal [&>ol>li]:mb-2 [&>ol>li]:text-gray-700
                [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:py-2 [&>blockquote]:mb-4 [&>blockquote]:bg-blue-50 [&>blockquote]:italic [&>blockquote]:text-gray-700
                [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>code]:text-gray-800
                [&>pre]:bg-gray-900 [&>pre]:text-white [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>pre>code]:bg-transparent [&>pre>code]:p-0
                [&>img]:rounded-lg [&>img]:shadow-md [&>img]:mb-4 [&>img]:max-w-full [&>img]:h-auto
                [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4 [&>table]:border [&>table]:border-gray-300
                [&>table>thead>tr>th]:bg-gray-100 [&>table>thead>tr>th]:p-3 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-semibold [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-gray-300
                [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-300
                [&>hr]:border-gray-300 [&>hr]:my-8
                [&>strong]:font-bold [&>strong]:text-gray-900
                [&>em]:italic [&>em]:text-gray-700
                [&>small]:text-sm [&>small]:text-gray-600
              "
            />
          </div>

          {/* Botón de compartir al final */}
          <div className="text-center py-6 border-t">
            <Button onClick={handleShare} className="mb-4">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir este post
            </Button>
          </div>
        </article>

        {/* Posts relacionados */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Posts relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Navegación al blog */}
        <div className="text-center mt-12">
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Ver todos los posts del blog
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
