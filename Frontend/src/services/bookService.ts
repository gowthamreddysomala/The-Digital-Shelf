import { Book, PaginatedResponse, SearchParams } from '../types'
import { ENDPOINTS } from '../config/endpoints'

const API_BASE_URL = ENDPOINTS.BACKEND.BASE
const FALLBACK_IMAGE = '/fallback/book-cover.svg'

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Helper function to get book cover image with fallback
const getBookCoverImage = (imageUrl: string | null): string => {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl
  }
  return FALLBACK_IMAGE
}

export const bookService = {
  // Get all books with optional filtering
  async getBooks(params?: SearchParams): Promise<PaginatedResponse<Book>> {
    try {
      let url = `${API_BASE_URL}/books`
      const queryParams = new URLSearchParams()
      
      if (params?.query) {
        queryParams.append('query', params.query)
      }
      
      if (params?.page) {
        queryParams.append('page', params.page.toString())
      }
      
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString())
      }
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      
      const books = await response.json()
      
      // Transform backend data to frontend format
      const transformedBooks = books.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        viewCount: book.views || 0,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }))
      
      return {
        data: transformedBooks,
        total: transformedBooks.length,
        page: params?.page || 1,
        limit: params?.limit || 8,
        totalPages: Math.ceil(transformedBooks.length / (params?.limit || 8))
      }
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },

  // Get featured books
  async getFeaturedBooks(): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/featured`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured books')
      }
      
      const books = await response.json()
      
      return books.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        viewCount: book.views || 0,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }))
    } catch (error) {
      console.error('Error fetching featured books:', error)
      throw error
    }
  },

  // Get book by ID
  async getBookById(id: string): Promise<Book | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        if (response.status === 401) {
          throw new Error('Authentication required. Please login.')
        }
        throw new Error('Failed to fetch book')
      }
      
      const book = await response.json()
      
      return {
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        viewCount: book.views || 0,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  },

  // Search books
  async searchBooks(query: string): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to search books')
      }
      
      const books = await response.json()
      
      return books.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        viewCount: book.views || 0,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }))
    } catch (error) {
      console.error('Error searching books:', error)
      throw error
    }
  },

  // Increment book views
  async incrementView(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/books/${id}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error incrementing view:', error)
    }
  },

  // Get books by genre
  async getBooksByGenre(genre: string): Promise<Book[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/search?query=${encodeURIComponent(genre)}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch books by genre')
      }
      
      const books = await response.json()
      
      // Filter books by category/genre
      const genreBooks = books.filter((book: any) => 
        book.category && book.category.toLowerCase().includes(genre.toLowerCase())
      )
      
      return genreBooks.map((book: any) => ({
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }))
    } catch (error) {
      console.error('Error fetching books by genre:', error)
      throw error
    }
  },

  // Create new book (Admin only)
  async createBook(bookData: any): Promise<Book> {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to create book: ${errorText}`)
      }
      
      const book = await response.json()
      
      return {
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }
    } catch (error) {
      console.error('Error creating book:', error)
      throw error
    }
  },

  // Update book (Admin only)
  async updateBook(id: string, bookData: any): Promise<Book> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to update book: ${errorText}`)
      }
      
      const book = await response.json()
      
      return {
        id: book.id.toString(),
        title: book.title,
        author: book.author,
        description: book.description,
        coverImage: getBookCoverImage(book.image),
        price: book.price || 0,
        rating: book.rating,
        genre: book.category ? [book.category] : ['Fiction'],
        publishedDate: book.publishedDate || '',
        isbn: '',
        pageCount: 0,
        language: 'English',
        publisher: book.publisher || '',
        inStock: true,
        featured: book.featured || false,
        url: book.url || ''
      }
    } catch (error) {
      console.error('Error updating book:', error)
      throw error
    }
  },

  // Delete book (Admin only)
  async deleteBook(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete book')
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      throw error
    }
  }
}



