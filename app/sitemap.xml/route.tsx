import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = getSupabaseServer()

    // Obtener posts del blog publicados
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://libercopy.es"
    const currentDate = new Date().toISOString().split("T")[0]

    // Páginas estáticas del sitio
    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/imprimir", priority: "0.9", changefreq: "monthly" },
      { url: "/encuadernar", priority: "0.9", changefreq: "monthly" },
      { url: "/blog", priority: "0.8", changefreq: "weekly" },
      { url: "/sobre-nosotros", priority: "0.7", changefreq: "monthly" },
      { url: "/contacto", priority: "0.7", changefreq: "monthly" },
      { url: "/faq", priority: "0.6", changefreq: "monthly" },
      { url: "/aviso-legal", priority: "0.3", changefreq: "yearly" },
      { url: "/politica-privacidad", priority: "0.3", changefreq: "yearly" },
      { url: "/politica-cookies", priority: "0.3", changefreq: "yearly" },
    ]

    // Generar XML del sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Agregar páginas estáticas
    staticPages.forEach((page) => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    })

    // Agregar posts del blog dinámicamente
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach((post) => {
        const lastmod = post.updated_at
          ? new Date(post.updated_at).toISOString().split("T")[0]
          : new Date(post.created_at).toISOString().split("T")[0]

        sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      })
    }

    sitemap += `</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache por 1 hora
      },
    })
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return new NextResponse("Error generating sitemap", { status: 500 })
  }
}
