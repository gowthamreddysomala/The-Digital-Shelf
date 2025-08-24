import { motion } from 'framer-motion'
import { Github, Heart, BookOpen, Code, Database, Shield, Zap, Globe } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const techStack = [
    { name: 'Spring Boot 3.5.4', icon: Code, color: 'text-green-500' },
    { name: 'React 18 + TypeScript', icon: Zap, color: 'text-blue-500' },
    { name: 'PostgreSQL + H2', icon: Database, color: 'text-blue-700' },
    { name: 'Tailwind CSS + Framer Motion', icon: Globe, color: 'text-cyan-500' },
    { name: 'JWT + Spring Security', icon: Shield, color: 'text-yellow-500' },
    { name: 'Docker + Maven', icon: Code, color: 'text-purple-500' },
  ]

  return (
    <footer className="relative mt-20 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-t border-gray-700">
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
                <BookOpen className="h-8 w-8 text-blue-500" />
                <h3 className="text-xl font-bold text-white">Digital Shelf</h3>
              </motion.div>
              <p className="text-gray-300 leading-relaxed">
                A modern digital bookshelf application built with cutting-edge technologies. 
                Discover, explore, and manage your digital library with style.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Built With</h4>
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
                    <span className="text-sm text-gray-300">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/search" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Search Books
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
                    Register
                  </a>
                </li>
              </ul>
            </div>

            {/* Developer Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Developer</h4>
              <div className="space-y-3">
                <motion.a
                  href="https://github.com/gowthamreddysomala"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-200 group"
                >
                  <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>@gowthamreddysomala</span>
                </motion.a>
                <p className="text-sm text-gray-300">
                  Spring Boot enthusiast | JPA & Database Schema Design | Backend Development | Clean Code Advocate
                </p>
                
                {/* GitHub Stats */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Repositories:</span>
                    <span className="text-blue-400 font-medium">15+</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Followers:</span>
                    <span className="text-blue-400 font-medium">10+</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Location:</span>
                    <span className="text-blue-400 font-medium">Punjab, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gray-300"
              >
                <span>© {currentYear} Digital Shelf. All rights reserved.</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 text-gray-300"
              >
                <span>Built with</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>by</span>
                <a 
                  href="https://github.com/gowthamreddysomala" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
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
