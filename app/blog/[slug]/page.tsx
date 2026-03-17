import { BlogService } from "@/lib/blog-service"
import BlogPostClientPage from "./BlogPostClientPage"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await BlogService.getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post no encontrado - Libercopy",
    }
  }

  return {
    title: `${post.title} - Blog Libercopy`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      images: post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await BlogService.getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await BlogService.getRelatedPosts(post.id, post.category_id)

  return <BlogPostClientPage post={post} relatedPosts={relatedPosts} />
}
