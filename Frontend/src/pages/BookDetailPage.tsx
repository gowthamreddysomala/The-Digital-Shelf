import {Link, useParams} from 'react-router-dom'
import {useQuery} from 'react-query'
import {motion} from 'framer-motion'
import {ArrowLeft, BookOpen, Calendar, Globe, Share2, Star, User, Download, Check} from 'lucide-react'
import {bookService} from '../services/bookService'
import BookCard from '../components/BookCard'
import {useState} from 'react'

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [showCopied, setShowCopied] = useState(false)

  const { data: book, isLoading, error } = useQuery(
    ['book', id],
    () => bookService.getBookById(id!),
    {
      enabled: !!id
    }
  )

  const { data: relatedBooks } = useQuery(
    ['relatedBooks', book?.genre],
    () => bookService.getBooksByGenre(book?.genre[0] || ''),
    {
      enabled: !!book?.genre?.length
    }
  )

  const handleShare = async () => {
    if (book) {
      const bookUrl = window.location.href
      
      try {
        await navigator.clipboard.writeText(bookUrl)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = bookUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 2000)
      }
    }
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-400" />
      )
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-dark-700 rounded animate-pulse" />
          <div className="h-6 bg-dark-700 rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-dark-700 h-96 rounded-lg animate-pulse" />
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-dark-700 rounded animate-pulse" />
            <div className="h-6 bg-dark-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-dark-700 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">Please login to access the book</div>
          <div className="space-x-4">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      )
    }
    
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">Book not found</div>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Books</span>
        </Link>
      </motion.div>

      {/* Book Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="relative">
            <div className="aspect-[18/27] w-full max-w-sm mx-auto">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
            {book.featured && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-dark-900 px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </div>
            )}
            {!book.inStock && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </div>
            )}
          </div>
        </motion.div>

        {/* Book Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Title and Author */}
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-2 font-serif">
              {book.title}
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              by {book.author}
            </p>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(book.rating)}
              </div>
              <span className="text-gray-400">({book.rating} out of 5)</span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="text-3xl font-bold text-primary-400">
              {book.price < 1 ? 'Free' : `₹${book.price.toFixed(2)}`}
            </div>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2"
                onClick={() => {
                  if (book.url && book.url.trim() !== '') {
                    window.open(book.url, '_blank')
                  } else {
                    alert('Download link not available for this book')
                  }
                }}
              >
                <Download className="h-5 w-5" />
                <span>Download</span>
              </motion.button>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center space-x-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </motion.button>
                
                {/* Copy Success Popup */}
                {showCopied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gruvbox-light-green dark:bg-gruvbox-dark-green text-gruvbox-light-bg0 dark:text-gruvbox-dark-bg0 rounded-lg text-sm font-medium shadow-lg z-10 flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>URL copied to clipboard!</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Book Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary-400" />
                <div>
                  <span className="text-gray-400">Published:</span>
                  <span className="text-gray-100 ml-2">
                    {new Date(book.publishedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary-400" />
                <div>
                  <span className="text-gray-400">Pages:</span>
                  <span className="text-gray-100 ml-2">{book.pageCount}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-primary-400" />
                <div>
                  <span className="text-gray-400">Language:</span>
                  <span className="text-gray-100 ml-2">{book.language}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary-400" />
                <div>
                  <span className="text-gray-400">Publisher:</span>
                  <span className="text-gray-100 ml-2">{book.publisher}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary-400" />
                <div>
                  <span className="text-gray-400">ISBN:</span>
                  <span className="text-gray-100 ml-2">{book.isbn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {book.genre.map((genre, index) => (
                <Link
                  key={index}
                  to={`/search?genre=${encodeURIComponent(genre.toLowerCase())}`}
                  className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-full text-sm transition-colors duration-200"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Books */}
      {relatedBooks && relatedBooks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-100">Related Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {relatedBooks
              .filter(relatedBook => relatedBook.id !== book.id)
              .slice(0, 5)
              .map((relatedBook, index) => (
                <BookCard key={relatedBook.id} book={relatedBook} index={index} />
              ))}
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default BookDetailPage
