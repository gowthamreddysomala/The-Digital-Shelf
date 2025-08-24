import {useState, useEffect} from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import {motion} from 'framer-motion'
import {BookOpen, Eye, EyeOff, Lock, User} from 'lucide-react'
import {useAuth} from '../contexts/AuthContext'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
  }, [location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    console.log('Login attempt with username:', username)
    
    try {
      const response = await login({
        username: username,
        password: password
      })
      
      console.log('Login response:', response)
      
      if (response.token) {
        // Login successful, redirect to home
        console.log('Login successful, redirecting to home')
        navigate('/')
      } else {
        // Handle login error
        console.log('Login failed:', response.message)
        setError(response.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gruvbox-light-bg0/40 dark:bg-gruvbox-dark-bg0/40 backdrop-blur-xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-3xl p-8 shadow-2xl shadow-black/20"
        >
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gruvbox-light-primary/20 dark:bg-gruvbox-dark-primary/20 rounded-2xl mb-4"
            >
              <BookOpen className="h-8 w-8 text-gruvbox-light-primary dark:text-gruvbox-dark-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
              Welcome Back
            </h1>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
              Sign in to your Digital Bookshelf account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gruvbox-light-green/20 dark:bg-gruvbox-dark-green/20 border border-gruvbox-light-green/30 dark:border-gruvbox-dark-green/30 text-gruvbox-light-green dark:text-gruvbox-dark-green px-4 py-3 rounded-xl text-sm"
              >
                {successMessage}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gruvbox-light-red/20 dark:bg-gruvbox-dark-red/20 border border-gruvbox-light-red/30 dark:border-gruvbox-dark-red/30 text-gruvbox-light-red dark:text-gruvbox-dark-red px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}
            <div>
              <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 placeholder-gruvbox-light-fg3 dark:placeholder-gruvbox-dark-fg3"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 placeholder-gruvbox-light-fg3 dark:placeholder-gruvbox-dark-fg3"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 hover:text-gruvbox-light-fg dark:hover:text-gruvbox-dark-fg transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 text-gruvbox-light-primary dark:text-gruvbox-dark-primary focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary"
                />
                <span className="ml-2 text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gruvbox-light-primary dark:text-gruvbox-dark-primary hover:text-gruvbox-light-primary/80 dark:hover:text-gruvbox-dark-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-sm hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
              Don't have an account?{' '}
            </span>
            <Link
              to="/register"
              className="text-gruvbox-light-primary dark:text-gruvbox-dark-primary hover:text-gruvbox-light-primary/80 dark:hover:text-gruvbox-dark-primary/80 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage

