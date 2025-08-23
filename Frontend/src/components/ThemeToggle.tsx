import {useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {Moon, Sun} from 'lucide-react'

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.body.classList.add('dark')
    } else {
      setIsDark(false)
      document.body.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative p-3 bg-gruvbox-light-bg0/30 dark:bg-gruvbox-dark-bg0/30 backdrop-blur-xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-primary dark:hover:text-gruvbox-dark-primary focus:outline-none focus:ring-2 focus:ring-gruvbox-light-primary dark:focus:ring-gruvbox-dark-primary focus:ring-offset-2 focus:ring-offset-gruvbox-light-bg dark:focus:ring-offset-gruvbox-dark-bg overflow-hidden group"
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gruvbox-light-yellow/20 to-gruvbox-light-orange/20 dark:from-gruvbox-dark-blue/20 dark:to-gruvbox-dark-purple/20 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Icon container with rotation */}
      <motion.div
        className="relative z-10"
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeInOut",
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ 
                opacity: 0, 
                scale: 0.5, 
                rotate: -90,
                y: 10
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.5, 
                rotate: 90,
                y: -10
              }}
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <Sun className="h-5 w-5 text-gruvbox-light-yellow" />
              {/* Sun rays effect */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <div className="absolute top-0 left-1/2 w-0.5 h-1 bg-gruvbox-light-yellow/60 rounded-full transform -translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1 bg-gruvbox-light-yellow/60 rounded-full transform -translate-x-1/2" />
                <div className="absolute left-0 top-1/2 w-1 h-0.5 bg-gruvbox-light-yellow/60 rounded-full transform -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-1 h-0.5 bg-gruvbox-light-yellow/60 rounded-full transform -translate-y-1/2" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ 
                opacity: 0, 
                scale: 0.5, 
                rotate: 90,
                y: -10
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.5, 
                rotate: -90,
                y: 10
              }}
              transition={{ 
                duration: 0.4,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <Moon className="h-5 w-5 text-gruvbox-dark-blue" />
              {/* Moon glow effect */}
              <motion.div
                className="absolute inset-0 bg-gruvbox-dark-blue/20 rounded-full blur-sm"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-gruvbox-light-primary/20 dark:bg-gruvbox-dark-primary/20 rounded-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

export default ThemeToggle
