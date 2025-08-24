import { motion } from 'framer-motion'
import { Github, Heart, BookOpen, Code, Database, Shield, Zap, Globe } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const techStack = [
    { name: 'Spring Boot 3.5.4', icon: Code, color: 'text-gruvbox-light-green dark:text-gruvbox-dark-green' },
    { name: 'React 18 + TypeScript', icon: Zap, color: 'text-gruvbox-light-blue dark:text-gruvbox-dark-blue' },
    { name: 'PostgreSQL + H2', icon: Database, color: 'text-gruvbox-light-blue dark:text-gruvbox-dark-blue' },
    { name: 'Tailwind CSS + Framer Motion', icon: Globe, color: 'text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua' },
    { name: 'JWT + Spring Security', icon: Shield, color: 'text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow' },
    { name: 'Docker + Maven', icon: Code, color: 'text-gruvbox-light-purple dark:text-gruvbox-dark-purple' },
  ]

  return (
    <footer className="relative mt-20 bg-gradient-to-r from-gruvbox-light-bg1 via-gruvbox-light-bg0 to-gruvbox-light-bg1 dark:from-gruvbox-dark-bg1 dark:via-gruvbox-dark-bg0 dark:to-gruvbox-dark-bg1 border-t border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Project Info */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-8 w-8 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
                <h3 className="text-xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Digital Shelf</h3>
              </motion.div>
              <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 leading-relaxed">
                A modern digital bookshelf application built with cutting-edge technologies. 
                Discover, explore, and manage your digital library with style.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Built With</h4>
              <div className="grid grid-cols-2 gap-3">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <tech.icon className={`h-4 w-4 ${tech.color}`} />
                    <span className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/search" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200">
                    Search Books
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200">
                    Register
                  </a>
                </li>
              </ul>
            </div>

            {/* Developer Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Developer</h4>
              <div className="space-y-3">
                <motion.a
                  href="https://github.com/gowthamreddysomala"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center space-x-2 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200 group"
                >
                  <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>@gowthamreddysomala</span>
                </motion.a>
                <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                  Spring Boot enthusiast | JPA & Database Schema Design | Backend Development | Clean Code Advocate
                </p>
                
                {/* GitHub Stats */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                    <span>Repositories:</span>
                    <span className="text-gruvbox-light-blue dark:text-gruvbox-dark-blue font-medium">15+</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                    <span>Followers:</span>
                    <span className="text-gruvbox-light-blue dark:text-gruvbox-dark-blue font-medium">10+</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                    <span>Location:</span>
                    <span className="text-gruvbox-light-blue dark:text-gruvbox-dark-blue font-medium">Punjab, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2"
              >
                <span>© {currentYear} Digital Shelf. All rights reserved.</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2"
              >
                <span>Built with</span>
                <Heart className="h-4 w-4 text-gruvbox-light-red dark:text-gruvbox-dark-red animate-pulse" />
                <span>by</span>
                <a 
                  href="https://github.com/gowthamreddysomala" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gruvbox-light-blue dark:text-gruvbox-dark-blue hover:text-gruvbox-light-blue/80 dark:hover:text-gruvbox-dark-blue/80 transition-colors duration-200 font-medium"
                >
                  Gowtham Reddy
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
