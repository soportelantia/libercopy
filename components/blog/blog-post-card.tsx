import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"
import type { BlogPost } from "@/types/blog"

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        {post.featured_image && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Categoría */}
          {post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}

          {/* Título */}
          <h3 className="text-xl font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Metadatos */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count}</span>
              </div>
            </div>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
              Leer más →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
