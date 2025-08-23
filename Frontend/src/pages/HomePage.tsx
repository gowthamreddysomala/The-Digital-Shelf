import {useState} from 'react'
import {useQuery} from 'react-query'
import {motion} from 'framer-motion'
import {BookOpen, Search, Star, TrendingUp, Lock, LogIn} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import BookCard from '../components/BookCard'
import {bookService} from '../services/bookService'
import {Book} from '../types'
import { useAuth } from '../contexts/AuthContext'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Fetch featured books (public access)
  const { data: featuredBooks, isLoading: isLoadingFeatured } = useQuery(
    'featuredBooks',
    bookService.getFeaturedBooks,
    {
      retry: false,
      onError: (error: any) => {
        console.error('Error fetching featured books:', error)
      }
    }
  )

  // Fetch all books (public access)
  const { data: allBooks, isLoading: isLoadingAll } = useQuery(
    'allBooks',
    () => bookService.getBooks({ query: '', limit: 8 }),
    {
      retry: false,
      onError: (error: any) => {
        console.error('Error fetching all books:', error)
      }
    }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gruvbox-light-primary dark:border-gruvbox-dark-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gruvbox-light-bg1/20 to-gruvbox-light-bg2/10 dark:from-gruvbox-dark-bg1/10 dark:to-gruvbox-dark-bg2/5" />
        <div className="relative z-10">
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="text-center py-16 px-4"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <BookOpen className="h-16 w-16 text-gruvbox-light-primary dark:text-gruvbox-dark-primary mx-auto mb-4" />
              <h1 className="text-5xl md:text-6xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-4 font-serif">
                Digital Bookshelf
              </h1>
              <p className="text-xl text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 max-w-2xl mx-auto leading-relaxed">
                Discover your next favorite book in our curated collection of timeless classics and modern masterpieces
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for books, authors, or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-gruvbox-light-bg0/40 dark:bg-gruvbox-dark-bg0/40 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 placeholder-gruvbox-light-fg3 dark:placeholder-gruvbox-dark-fg3 text-lg shadow-2xl shadow-black/20"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-xl hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white rounded-xl transition-colors duration-200 shadow-2xl"
                >
                  <Search className="h-6 w-6" />
                </button>
              </form>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/search?genre=fiction')}
                    className="px-6 py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-xl hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-2xl transition-colors duration-200 shadow-2xl shadow-black/20"
                  >
                    Browse Fiction
                  </button>
                  <button
                    onClick={() => navigate('/search?genre=classic')}
                    className="px-6 py-3 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl hover:bg-gruvbox-light-bg0/50 dark:hover:bg-gruvbox-dark-bg0/50 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-2xl transition-colors duration-200 border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 shadow-2xl shadow-black/20"
                  >
                    Classic Literature
                  </button>
                  <button
                    onClick={() => navigate('/search')}
                    className="px-6 py-3 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl hover:bg-gruvbox-light-bg0/50 dark:hover:bg-gruvbox-dark-bg0/50 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-2xl transition-colors duration-200 border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 shadow-2xl shadow-black/20"
                  >
                    View All Books
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-xl hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-2xl transition-colors duration-200 shadow-2xl shadow-black/20 flex items-center space-x-2"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login to Explore Books</span>
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Authentication Required Notice */}
      {!isAuthenticated && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <div className="bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-3xl p-8 shadow-2xl shadow-black/20">
            <Lock className="h-16 w-16 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-4">
              Unlock Enhanced Features
            </h2>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 max-w-2xl mx-auto mb-6">
              Browse our collection freely! Login to access detailed book information, create reading lists, and enjoy personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-xl hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-2xl transition-colors duration-200 shadow-2xl shadow-black/20"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl hover:bg-gruvbox-light-bg0/50 dark:hover:bg-gruvbox-dark-bg0/50 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-2xl transition-colors duration-200 border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 shadow-2xl shadow-black/20"
              >
                Register
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Featured Books Section - Public access */}
      {(
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow" />
              <h2 className="text-3xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Featured Books</h2>
              <Star className="h-6 w-6 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow" />
            </div>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 max-w-2xl mx-auto">
              Handpicked selections from our collection, featuring timeless classics and contemporary favorites
            </p>
          </motion.div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-2xl p-4 shadow-2xl shadow-black/20">
                    <div className="bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 h-64 rounded-xl mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 rounded" />
                      <div className="h-3 bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 rounded w-3/4" />
                      <div className="h-3 bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {featuredBooks?.map((book: Book, index: number) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* All Books Section - Public access */}
      {(
        <section className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
              <h2 className="text-3xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Explore Our Collection</h2>
              <TrendingUp className="h-6 w-6 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
            </div>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 max-w-2xl mx-auto">
              Dive into our extensive collection of books across all genres and discover new worlds
            </p>
          </motion.div>

          {isLoadingAll ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-2xl p-4 shadow-2xl shadow-black/20">
                    <div className="bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 h-64 rounded-xl mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 rounded" />
                      <div className="h-3 bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 rounded w-3/4" />
                      <div className="h-3 bg-gruvbox-light-bg2 dark:bg-gruvbox-dark-bg2 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {allBooks?.data.map((book: Book, index: number) => (
                <BookCard key={book.id} book={book} index={index} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center pt-8"
          >
            <button
              onClick={() => navigate('/search')}
              className="btn-primary text-lg px-8 py-4 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary shadow-2xl shadow-black/20"
            >
              View All Books
            </button>
          </motion.div>
        </section>
      )}

      {/* Stats Section - Public access */}
      {(
        <section className="bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-3xl p-8 shadow-2xl shadow-black/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-gruvbox-light-primary dark:text-gruvbox-dark-primary mb-2">
                {allBooks?.total || 0}+
              </div>
              <div className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Books Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gruvbox-light-primary dark:text-gruvbox-dark-primary mb-2">50+</div>
              <div className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Authors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gruvbox-light-primary dark:text-gruvbox-dark-primary mb-2">15+</div>
              <div className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Genres</div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}

export default HomePage
