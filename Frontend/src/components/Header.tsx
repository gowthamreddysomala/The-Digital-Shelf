import {useState} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {motion} from 'framer-motion'
import {BookOpen, Menu, Search, ShoppingCart, X, User, LogOut, Home} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  // Check if we're on the home page
  const isHomePage = location.pathname === '/'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="mx-4 mt-4 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 sticky top-4 z-50 shadow-2xl shadow-black/20 rounded-3xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 bg-gruvbox-light-primary/20 dark:bg-gruvbox-dark-primary/20 rounded-xl sm:rounded-2xl"
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
            </motion.div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-serif">
              Digital Bookshelf
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Home button - only show when not on home page */}
            {!isHomePage && (
              <Link 
                to="/" 
                className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200 font-medium px-4 py-2 rounded-xl hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30 flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            )}
            <Link 
              to="/search" 
              className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200 font-medium px-4 py-2 rounded-xl hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30"
            >
              Browse
            </Link>
            <Link 
              to="/search?genre=fiction" 
              className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200 font-medium px-4 py-2 rounded-xl hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30"
            >
              Fiction
            </Link>
            <Link 
              to="/search?genre=non-fiction" 
              className="text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-dark-primary dark:hover:text-gruvbox-light-primary transition-colors duration-200 font-medium px-4 py-2 rounded-xl hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30"
            >
              Non-Fiction
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books, authors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input pr-10 bg-gruvbox-light-bg0/50 dark:bg-gruvbox-dark-bg0/50 backdrop-blur-xl border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 rounded-2xl hover:bg-gruvbox-light-bg0/50 dark:hover:bg-gruvbox-dark-bg0/50"
            >
              <ShoppingCart className="h-6 w-6" />
            </motion.button>

            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="flex items-center space-x-2 px-4 py-2 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 rounded-2xl">
                  <User className="h-4 w-4 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
                  <span className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
                    {user?.username}
                  </span>
                  <span className="text-xs text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                    ({user?.role})
                  </span>
                </div>
                
                {/* Admin Link */}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gruvbox-light-yellow/20 dark:bg-gruvbox-dark-yellow/20 backdrop-blur-sm hover:bg-gruvbox-light-yellow/30 dark:hover:bg-gruvbox-dark-yellow/30 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow font-medium rounded-xl transition-all duration-200 flex items-center space-x-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Admin</span>
                    </motion.button>
                  </Link>
                )}
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gruvbox-light-bg2/30 dark:bg-gruvbox-dark-bg2/30 backdrop-blur-sm hover:bg-gruvbox-light-bg2/50 dark:hover:bg-gruvbox-dark-bg2/50 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              /* Login Button */
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-sm hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-gruvbox-light-fg0 dark:text-white font-medium rounded-2xl transition-all duration-200 shadow-lg shadow-black/20"
                >
                  Login
                </motion.button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-3 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 rounded-2xl hover:bg-gruvbox-light-bg0/50 dark:hover:bg-gruvbox-dark-bg0/50"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-6">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pr-10 bg-gruvbox-light-bg0/50 dark:bg-gruvbox-dark-bg0/50 backdrop-blur-xl border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-2xl"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary transition-colors duration-200"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-xl rounded-b-3xl overflow-hidden"
          >
            <nav className="py-6 space-y-2 px-4">
              {/* Home button - only show when not on home page */}
              {!isHomePage && (
                <Link 
                  to="/" 
                  className="block px-4 py-3 text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30 transition-colors duration-200 rounded-2xl flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              )}
              <Link 
                to="/search" 
                className="block px-4 py-3 text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30 transition-colors duration-200 rounded-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                to="/search?genre=fiction" 
                className="block px-4 py-3 text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30 transition-colors duration-200 rounded-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Fiction
              </Link>
              <Link 
                to="/search?genre=non-fiction" 
                className="block px-4 py-3 text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary hover:bg-gruvbox-light-bg0/30 dark:hover:bg-gruvbox-dark-bg0/30 transition-colors duration-200 rounded-2xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Non-Fiction
              </Link>
              
              {/* Mobile Authentication Section */}
              <div className="pt-4 border-t border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-4 py-3 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 rounded-2xl text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
                        <span className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
                          {user?.username}
                        </span>
                      </div>
                      <span className="text-xs text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                        {user?.role}
                      </span>
                    </div>
                    
                    {/* Admin Link for Mobile */}
                    {user?.role === 'ADMIN' && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-3 bg-gruvbox-light-yellow/20 dark:bg-gruvbox-dark-yellow/20 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow font-medium rounded-2xl text-center flex items-center justify-center space-x-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-gruvbox-light-bg2/30 dark:bg-gruvbox-dark-bg2/30 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-2xl text-center flex items-center justify-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="block px-4 py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 text-gruvbox-light-fg0 dark:text-white font-medium rounded-2xl text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header
