import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'
import {BookOpen, CheckCircle, Eye, EyeOff, Lock, User} from 'lucide-react'
import {authService} from '../services/authService'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) return
    
    setIsLoading(true)
    
    try {
      setError('') // Clear previous errors
      const response = await authService.register({
        username: formData.username,
        password: formData.password
      })
      
      if (response.token) {
        // Registration successful, redirect to login
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login with your new account.' 
          } 
        })
      } else {
        // Handle registration error
        setError(response.message || 'Registration failed')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      setError(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isPasswordValid = formData.password.length >= 8
  const doPasswordsMatch = formData.password === formData.confirmPassword

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
              Create Account
            </h1>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
              Join Digital Bookshelf and start your reading journey
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 placeholder-gruvbox-light-fg3 dark:placeholder-gruvbox-dark-fg3"
                  placeholder="Choose a username"
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 placeholder-gruvbox-light-fg3 dark:placeholder-gruvbox-dark-fg3"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 hover:text-gruvbox-light-fg dark:hover:text-gruvbox-dark-fg transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${isPasswordValid ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`} />
                <span className={`text-xs ${isPasswordValid ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`}>
                  At least 8 characters
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:border-transparent text-gruvbox-light-fg0 dark:text-gruvbox-dark-fg0 placeholder-gruvbox-light-fg3 dark:placeholder-gruvbox-dark-fg3"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 hover:text-gruvbox-light-fg dark:hover:text-gruvbox-dark-fg transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <CheckCircle className={`h-4 w-4 ${doPasswordsMatch && formData.confirmPassword ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`} />
                <span className={`text-xs ${doPasswordsMatch && formData.confirmPassword ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`}>
                  Passwords match
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 text-gruvbox-light-primary dark:text-gruvbox-dark-primary focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary"
              />
              <label className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="text-gruvbox-light-primary dark:text-gruvbox-dark-primary hover:text-gruvbox-light-primary/80 dark:hover:text-gruvbox-dark-primary/80"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy"
                  className="text-gruvbox-light-primary dark:text-gruvbox-dark-primary hover:text-gruvbox-light-primary/80 dark:hover:text-gruvbox-dark-primary/80"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !agreedToTerms || !isPasswordValid || !doPasswordsMatch}
              className="w-full py-3 bg-gruvbox-light-primary/90 dark:bg-gruvbox-dark-primary/90 backdrop-blur-sm hover:bg-gruvbox-light-primary dark:hover:bg-gruvbox-dark-primary text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20"></div>
            <span className="px-4 text-sm text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">or</span>
            <div className="flex-1 border-t border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20"></div>
          </div>

          {/* Social Register */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-xl transition-all duration-200 shadow-lg shadow-black/10">
              Continue with Google
            </button>
            <button className="w-full py-3 bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md hover:bg-gruvbox-light-bg0/80 dark:hover:bg-gruvbox-dark-bg0/80 border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium rounded-xl transition-all duration-200 shadow-lg shadow-black/10">
              Continue with GitHub
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
              Already have an account?{' '}
            </span>
            <Link
              to="/login"
              className="text-gruvbox-light-primary dark:text-gruvbox-dark-primary hover:text-gruvbox-light-primary/80 dark:hover:text-gruvbox-dark-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage

