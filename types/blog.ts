export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  created_at: string
  updated_at: string
  category_id?: string
  author_id?: string
  views_count?: number
  reading_time?: number
  meta_title?: string
  meta_description?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at?: string
}

export interface BlogPostTag {
  id: string
  post_id: string
  tag_id: string
  created_at: string
}

export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory | null
  tags: BlogTag[]
}

export interface BlogSearchParams {
  search?: string
  category?: string
  tag?: string
  page?: number
  limit?: number
}

export interface BlogSearchResult {
  posts: BlogPostWithRelations[]
  total: number
  filteredTotal: number
  page: number
  limit: number
  totalPages: number
  categories: BlogCategory[]
  tags: BlogTag[]
}
