import { motion } from 'framer-motion'
import { Github, Heart, BookOpen, Code, Database, Shield, Zap, Globe, Wifi, Activity, Server } from 'lucide-react'
import { useState, useEffect } from 'react'
import pingManager from '../services/pingManager'
import { ENDPOINTS } from '../config/endpoints'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [pingStatus, setPingStatus] = useState<{
    isInitialized: boolean
    serviceWorker: { isActive: boolean; isReady: boolean; lastPing?: string }
    mainThread: { isActive: boolean }
    overall: { isActive: boolean; primaryMethod: string }
  } | null>(null)
  const [backendHealth, setBackendHealth] = useState<{
    isHealthy: boolean
    responseTime: number
    lastCheck: Date
  } | null>(null)

  // Update ping status periodically
  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = await pingManager.getStatus()
        setPingStatus(status)
      } catch (error) {
        console.error('Failed to get ping status:', error)
      }
    }

    // Initial update
    updateStatus()

    // Update every 10 seconds
    const interval = setInterval(updateStatus, 10000)

    return () => clearInterval(interval)
  }, [])

  // Check backend health
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const startTime = Date.now()
        const response = await fetch(ENDPOINTS.BACKEND.BOOKS, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Ping': 'footer-health-check'
          }
        })
        
        const responseTime = Date.now() - startTime
        const isHealthy = response.ok
        
        setBackendHealth({
          isHealthy,
          responseTime,
          lastCheck: new Date()
        })
      } catch (error) {
        setBackendHealth({
          isHealthy: false,
          responseTime: 0,
          lastCheck: new Date()
        })
      }
    }

    // Initial check
    checkBackendHealth()

    // Check every 60 seconds
    const interval = setInterval(checkBackendHealth, 60000)

    return () => clearInterval(interval)
  }, [])

  const techStack = [
    { name: 'Spring Boot 3.5.4', icon: Code, color: 'text-gruvbox-light-green dark:text-gruvbox-dark-green' },
    { name: 'React 18 + TypeScript', icon: Zap, color: 'text-gruvbox-light-blue dark:text-gruvbox-dark-blue' },
    { name: 'PostgreSQL + H2', icon: Database, color: 'text-gruvbox-light-blue dark:text-gruvbox-dark-blue' },
    { name: 'Tailwind CSS + Framer Motion', icon: Globe, color: 'text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua' },
    { name: 'JWT + Spring Security', icon: Shield, color: 'text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow' },
    { name: 'Docker + Maven', icon: Code, color: 'text-gruvbox-light-purple dark:text-gruvbox-dark-purple' },
  ]

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-red dark:text-gruvbox-dark-red'
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? '🟢' : '🔴'
  }

  return (
    <footer className="relative mt-20 bg-gradient-to-r from-gruvbox-light-bg1 via-gruvbox-light-bg0 to-gruvbox-light-bg1 dark:from-gruvbox-dark-bg1 dark:via-gruvbox-dark-bg0 dark:to-gruvbox-dark-bg1 border-t border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Project Info */}
            <div className="space-y-4 lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-8 w-8 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
                <h3 className="text-xl font-bold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Digital Shelf</h3>
              </motion.div>
              <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 leading-relaxed text-sm">
                A modern digital bookshelf application built with cutting-edge technologies. 
                Discover, explore, and manage your digital library with style.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4 lg:col-span-1">
              <h4 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Built With</h4>
              <div className="grid grid-cols-1 gap-3">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-2"
                  >
                    <tech.icon className={`h-4 w-4 ${tech.color} flex-shrink-0`} />
                    <span className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 truncate">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 lg:col-span-1">
              <h4 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200 text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/search" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200 text-sm">
                    Search Books
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200 text-sm">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue transition-colors duration-200 text-sm">
                    Register
                  </a>
                </li>
              </ul>
            </div>

            {/* Service Status */}
            <div className="space-y-4 lg:col-span-1">
              <h4 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Service Status</h4>
              
              {/* Self-Ping Service Status */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-gruvbox-light-blue dark:text-gruvbox-dark-blue flex-shrink-0" />
                  <span className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Self-Ping:</span>
                  <span className={`text-sm font-medium ${pingStatus ? getStatusColor(pingStatus.overall.isActive) : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`}>
                    {pingStatus ? (pingStatus.overall.isActive ? 'Active' : 'Inactive') : 'Checking...'}
                  </span>
                  <span className="text-xs">
                    {pingStatus ? getStatusIcon(pingStatus.overall.isActive) : '⏳'}
                  </span>
                </div>

                {/* Frontend Status */}
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua flex-shrink-0" />
                  <span className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Frontend:</span>
                  <span className="text-sm text-gruvbox-light-green dark:text-gruvbox-dark-green font-medium">
                    Active
                  </span>
                  <span className="text-xs">🟢</span>
                </div>

                {/* Backend Status */}
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-gruvbox-light-purple dark:text-gruvbox-dark-purple flex-shrink-0" />
                  <span className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Backend:</span>
                  <span className={`text-sm font-medium ${backendHealth ? getStatusColor(backendHealth.isHealthy) : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`}>
                    {backendHealth ? (backendHealth.isHealthy ? 'Healthy' : 'Unhealthy') : 'Checking...'}
                  </span>
                  <span className="text-xs">
                    {backendHealth ? getStatusIcon(backendHealth.isHealthy) : '⏳'}
                  </span>
                </div>

                {/* Ping Method */}
                {pingStatus && (
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow flex-shrink-0" />
                    <span className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Method:</span>
                    <span className="text-sm text-gruvbox-light-fg dark:text-gruvbox-dark-fg font-medium capitalize">
                      {pingStatus.overall.primaryMethod.replace('-', ' ')}
                    </span>
                  </div>
                )}

                {/* Last Update */}
                {pingStatus && (
                  <div className="text-xs text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 pt-2 border-t border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20">
                    Last ping: {pingStatus.serviceWorker.lastPing ? new Date(pingStatus.serviceWorker.lastPing).toLocaleTimeString() : 'N/A'}
                  </div>
                )}
              </div>
            </div>

            {/* Developer Info & GitHub Stats */}
            <div className="space-y-4 lg:col-span-1">
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
                  <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                  <span className="text-sm">@gowthamreddysomala</span>
                </motion.a>
                <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 leading-relaxed">
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
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-center sm:text-left"
              >
                <span>© {currentYear} Digital Shelf. All rights reserved.</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-center sm:text-right"
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
