"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import BlogPostClientPage from "./BlogPostClientPage"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"
import type { BlogPostWithRelations } from "@/types/blog"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPostWithRelations | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPostWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    if (!slug) return
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`)
        if (res.status === 404) {
          setNotFoundError(true)
          return
        }
        if (!res.ok) throw new Error("Error cargando post")
        const data = await res.json()
        setPost(data.post)
        setRelatedPosts(data.relatedPosts || [])
      } catch {
        setNotFoundError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-6 w-24 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </main>
    )
  }

  if (notFoundError || !post) {
    notFound()
  }

  return <BlogPostClientPage post={post!} relatedPosts={relatedPosts} />
}
