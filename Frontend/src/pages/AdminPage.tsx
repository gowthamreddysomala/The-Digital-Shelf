import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Plus, Edit, Trash2, Search, Star, Save, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Book } from '../types'
import { bookService } from '../services/bookService'

interface BookFormData {
  title: string
  author: string
  publisher: string
  publishedDate: string
  description: string
  category: string
  image: string
  url: string
  rating: number
  price: number
  featured: boolean
}

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    publisher: '',
    publishedDate: '',
    description: '',
    category: '',
    image: '',
    url: '',
    rating: 5,
    price: 0,
    featured: false
  })

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (user?.role !== 'ADMIN') {
      navigate('/')
      return
    }
    
    fetchBooks()
  }, [isAuthenticated, user, navigate])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await bookService.getBooks({ limit: 100 })
      setBooks(response.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      ...(name === 'rating' && { rating: parseInt(value) || 0 }),
      ...(name === 'price' && { price: parseFloat(value) || 0 })
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      publisher: '',
      publishedDate: '',
      description: '',
      category: '',
      image: '',
      url: '',
      rating: 5,
      price: 0,
      featured: false
    })
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        publishedDate: formData.publishedDate,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        url: formData.url,
        rating: formData.rating,
        price: formData.price,
        featured: formData.featured
      }

      await bookService.createBook(bookData)
      setShowAddForm(false)
      resetForm()
      fetchBooks()
    } catch (error) {
      console.error('Error adding book:', error)
      alert(`Failed to add book: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBook) return

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        publisher: formData.publisher,
        publishedDate: formData.publishedDate,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        url: formData.url,
        rating: formData.rating,
        price: formData.price,
        featured: formData.featured
      }

      await bookService.updateBook(editingBook.id, bookData)
      setEditingBook(null)
      resetForm()
      fetchBooks()
    } catch (error) {
      console.error('Error updating book:', error)
      alert(`Failed to update book: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return
    }

    try {
      await bookService.deleteBook(bookId)
      fetchBooks()
    } catch (error) {
      console.error('Error deleting book:', error)
      alert('Failed to delete book. Please try again.')
    }
  }

  const startEdit = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      publishedDate: book.publishedDate,
      description: book.description,
      category: book.genre[0] || '',
      image: book.coverImage,
      url: '',
      rating: book.rating,
      price: book.price,
      featured: book.featured
    })
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gruvbox-light-bg dark:bg-gruvbox-dark-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                Manage your digital bookshelf collection
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                  Welcome, {user?.username}
                </p>
                <p className="text-xs text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">
                  Administrator
                </p>
              </div>
              <div className="w-12 h-12 bg-gruvbox-light-primary/20 dark:bg-gruvbox-dark-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3" />
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
            />
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-sm hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-black/20 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Book</span>
          </button>
        </motion.div>

        {/* Books Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gruvbox-light-bg0/40 dark:bg-gruvbox-dark-bg0/40 backdrop-blur-xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/20"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gruvbox-light-primary dark:border-gruvbox-dark-primary mx-auto"></div>
              <p className="mt-4 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Loading books...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gruvbox-light-bg1/50 dark:bg-gruvbox-dark-bg1/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Book</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Author</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Featured</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gruvbox-light-bg2/20 dark:divide-gruvbox-dark-bg2/20">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gruvbox-light-bg1/20 dark:hover:bg-gruvbox-dark-bg1/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-lg shadow-md"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/fallback/book-cover.svg'
                            }}
                          />
                          <div>
                            <p className="font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">{book.title}</p>
                            <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">{book.publisher}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gruvbox-light-fg dark:text-gruvbox-dark-fg">{book.author}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gruvbox-light-bg2/30 dark:bg-gruvbox-dark-bg2/30 text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
                          {book.genre[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow fill-current" />
                          <span className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg">{book.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
                        {book.price < 1 ? 'Free' : `₹${book.price.toFixed(2)}`}
                      </td>
                      <td className="px-6 py-4">
                        {book.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gruvbox-light-yellow/20 dark:bg-gruvbox-dark-yellow/20 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gruvbox-light-bg3/30 dark:bg-gruvbox-dark-bg3/30 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => startEdit(book)}
                            className="p-2 hover:bg-gruvbox-light-bg2/30 dark:hover:bg-gruvbox-dark-bg2/30 rounded-lg transition-colors"
                            title="Edit book"
                          >
                            <Edit className="h-4 w-4 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-2 hover:bg-gruvbox-light-red/20 dark:hover:bg-gruvbox-dark-red/20 rounded-lg transition-colors"
                            title="Delete book"
                          >
                            <Trash2 className="h-4 w-4 text-gruvbox-light-red dark:text-gruvbox-dark-red" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredBooks.length === 0 && (
                <div className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 mx-auto mb-4" />
                  <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                    {searchQuery ? 'No books found matching your search.' : 'No books available.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Book Form Modal */}
        {(showAddForm || editingBook) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gruvbox-light-bg0/95 dark:bg-gruvbox-dark-bg0/95 backdrop-blur-xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
                  {editingBook ? 'Edit Book' : 'Add New Book'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingBook(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-gruvbox-light-bg1/50 dark:hover:bg-gruvbox-dark-bg1/50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2" />
                </button>
              </div>

              <form onSubmit={editingBook ? handleEditBook : handleAddBook} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Published Date
                    </label>
                    <input
                      type="date"
                      name="publishedDate"
                      value={formData.publishedDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Category/Genre
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Rating (1-5)
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                      Book URL
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/book"
                      className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 resize-none"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="rounded border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 text-gruvbox-light-primary dark:text-gruvbox-dark-primary focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary"
                  />
                  <label className="text-sm text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
                    Mark as featured book
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingBook(null)
                      resetForm()
                    }}
                    className="px-6 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-sm hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-black/20 flex items-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>{editingBook ? 'Update Book' : 'Add Book'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
