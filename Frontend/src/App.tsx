import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BookDetailPage from './pages/BookDetailPage'
import SearchResultsPage from './pages/SearchResultsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import { AuthProvider } from './contexts/AuthContext'
import pingManager from './services/pingManager'

function App() {
  // Initialize ping manager when app starts
  useEffect(() => {
    const initializePingService = async () => {
      try {
        console.log('Initializing ping services for Digital Shelf...')
        await pingManager.initialize()
        console.log('Ping services initialized successfully')
      } catch (error) {
        console.error('Failed to initialize ping services:', error)
      }
    }

    initializePingService()

    // Cleanup when app unmounts
    return () => {
      pingManager.destroy().catch(console.error)
    }
  }, [])

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gruvbox-light-bg dark:bg-gruvbox-dark-bg relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,241,199,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(40,40,40,0.1),transparent_50%)] pointer-events-none" />
        
        <Header />
        <main className="container mx-auto px-4 pb-8 relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HomePage />
                  </motion.div>
                } 
              />
              <Route 
                path="/book/:id" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BookDetailPage />
                  </motion.div>
                } 
              />
              <Route 
                path="/search" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SearchResultsPage />
                  </motion.div>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoginPage />
                  </motion.div>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <RegisterPage />
                  </motion.div>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AdminPage />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App
