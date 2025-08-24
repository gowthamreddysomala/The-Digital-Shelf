import {Link, useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Eye, ShoppingCart, Star, Download} from 'lucide-react'
import {Book} from '../types'
import {useAuth} from '../contexts/AuthContext'

interface BookCardProps {
  book: Book
  index?: number
}

const BookCard = ({ book, index = 0 }: BookCardProps) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleBookClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate('/login')
      return
    }
    // If authenticated, let the Link handle navigation normally
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-xl rounded-full text-white hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary transition-colors duration-200 shadow-2xl"
                onClick={(e) => e.preventDefault()}
              >
                <Eye className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gruvbox-light-green/90 dark:bg-gruvbox-dark-green/90 backdrop-blur-xl rounded-full text-white hover:bg-gruvbox-light-green dark:hover:bg-gruvbox-dark-green transition-colors duration-200 shadow-2xl"
                onClick={(e) => {
                  e.preventDefault()
                  if (book.url && book.url.trim() !== '') {
                    window.open(book.url, '_blank')
                  } else {
                    alert('Download link not available for this book')
                  }
                }}
              >
                <Download className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-xl rounded-full text-white hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary transition-colors duration-200 shadow-2xl"
                onClick={(e) => e.preventDefault()}
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

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

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-gruvbox-light-primary dark:text-gruvbox-dark-primary">
              {book.price < 1 ? 'Free' : `₹${book.price.toFixed(2)}`}
            </span>
            <span className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-sm">
              {book.pageCount} pages
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default BookCard
