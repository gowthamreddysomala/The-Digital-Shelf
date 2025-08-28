import {Link, useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Eye, Star} from 'lucide-react'
import {Book} from '../types'
import {useAuth} from '../contexts/AuthContext'
import {useState, useEffect} from 'react'

interface BookCardProps {
  book: Book
  index?: number
}

const BookCard = ({ book, index = 0 }: BookCardProps) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [viewCount, setViewCount] = useState(book.viewCount || 0)

  // Load view count from localStorage on component mount
  useEffect(() => {
    const storedViews = localStorage.getItem(`book_views_${book.id}`)
    if (storedViews) {
      setViewCount(parseInt(storedViews))
    }
  }, [book.id])

  const incrementViewCount = async () => {
    const newCount = viewCount + 1
    setViewCount(newCount)
    localStorage.setItem(`book_views_${book.id}`, newCount.toString())
    
    // Also update the book object for immediate UI update
    book.viewCount = newCount
    // Send increment to backend (best-effort)
    try {
      const { bookService } = await import('../services/bookService')
      bookService.incrementView(book.id)
    } catch (e) {
      // ignore network errors for UX
    }
  }

  const handleBookClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate('/login')
      return
    }
    // Increment view count when book is clicked
    incrementViewCount()
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-400" />
      )
    }

    return stars
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 shadow-2xl shadow-black/20 hover:shadow-3xl hover:shadow-black/30 transition-all duration-300 cursor-pointer p-4"
    >
      <Link to={`/book/${book.id}`} onClick={handleBookClick}>
        {/* Book Cover */}
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <div className="aspect-[18/27] w-full">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {/* Removed hover quick action icons */}

          {/* Stock Status */}
          {!book.inStock && (
            <div className="absolute top-2 right-2 bg-gruvbox-light-red/90 dark:bg-gruvbox-dark-red/90 backdrop-blur-xl text-white px-3 py-1 rounded-full text-xs font-medium shadow-2xl">
              Out of Stock
            </div>
          )}

          {/* Featured Badge */}
          {book.featured && (
            <div className="absolute top-2 left-2 bg-gruvbox-light-yellow/90 dark:bg-gruvbox-dark-yellow/90 backdrop-blur-xl text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 px-3 py-1 rounded-full text-xs font-medium shadow-2xl">
              Featured
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg group-hover:text-gruvbox-light-primary dark:group-hover:text-gruvbox-dark-primary transition-colors duration-200 line-clamp-2">
            {book.title}
          </h3>
          
          <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-sm font-medium">
            by {book.author}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            {renderStars(book.rating)}
            <span className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-sm ml-1">
              ({book.rating})
            </span>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1">
            {book.genre.slice(0, 2).map((genre, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gruvbox-light-bg0/40 dark:bg-gruvbox-dark-bg0/40 backdrop-blur-xl text-gruvbox-light-fg dark:text-gruvbox-dark-fg text-xs rounded-full border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20"
              >
                {genre}
              </span>
            ))}
            {book.genre.length > 2 && (
              <span className="px-2 py-1 bg-gruvbox-light-bg0/40 dark:bg-gruvbox-dark-bg0/40 backdrop-blur-xl text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-xs rounded-full border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20">
                +{book.genre.length - 2}
              </span>
            )}
          </div>

          {/* Price and Views */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-gruvbox-light-primary dark:text-gruvbox-dark-primary">
              {book.price < 1 ? 'Free' : `₹${book.price.toFixed(2)}`}
            </span>
            <div className="flex items-center space-x-1 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-sm">
              <Eye className="h-3 w-3" />
              <span>{viewCount} views</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BookCard
