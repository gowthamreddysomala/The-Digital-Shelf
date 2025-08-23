export interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  price: number
  rating: number
  genre: string[]
  publishedDate: string
  isbn: string
  pageCount: number
  language: string
  publisher: string
  inStock: boolean
  featured: boolean
}

export interface SearchFilters {
  genre?: string
  priceRange?: {
    min?: number
    max?: number
  }
  rating?: number
  inStock?: boolean
}

export interface SearchParams {
  query?: string
  filters?: SearchFilters
  page?: number
  limit?: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Authentication types
export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token?: string
  username?: string
  role?: string
  message?: string
}

export interface User {
  username: string
  role: string
}



