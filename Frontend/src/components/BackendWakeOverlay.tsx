  import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ENDPOINTS, HEALTH_CHECK } from '../config/endpoints'
import { Github, Heart, BookOpen, Activity, Globe, Server, Wifi } from 'lucide-react'
import pingManager from '../services/pingManager'

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<boolean> => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { method: 'GET', signal: controller.signal })
    return res.ok
  } catch (_) {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

const tryHealthEndpoints = async (endpoints: string[], attempts: number, timeoutMs: number): Promise<boolean> => {
  for (let i = 0; i < attempts; i++) {
    for (const url of endpoints) {
      const ok = await fetchWithTimeout(url, timeoutMs)
      if (ok) return true
    }
    // brief backoff between attempts
    await new Promise((r) => setTimeout(r, Math.min(1500 + i * 500, 4000)))
  }
  return false
}

const BackendWakeOverlay = () => {
  const [isReady, setIsReady] = useState(false)
  const [message, setMessage] = useState('Waking up the backend, please wait 2-3 Minutes.')
  const [pingStatus, setPingStatus] = useState<{
    isInitialized: boolean
    serviceWorker: { isActive: boolean; isReady: boolean; lastPing?: string }
    mainThread: { isActive: boolean }
    overall: { isActive: boolean; primaryMethod: 'service-worker' | 'main-thread' | 'both' }
  } | null>(null)
  const [backendHealth, setBackendHealth] = useState<{
    isHealthy: boolean
    responseTime: number
    lastCheck: Date
  } | null>(null)

  const endpoints = useMemo(() => {
    // Prefer explicit HEALTH if available, else fallback list
    const list: string[] = []
    if (ENDPOINTS.BACKEND.HEALTH) list.push(ENDPOINTS.BACKEND.HEALTH)
    list.push(...HEALTH_CHECK.BACKEND_ENDPOINTS)
    return Array.from(new Set(list))
  }, [])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const ok = await tryHealthEndpoints(endpoints, HEALTH_CHECK.RETRY_ATTEMPTS, HEALTH_CHECK.TIMEOUT)
      if (!mounted) return
      if (ok) {
        setIsReady(true)
        setMessage('')
      } else {
        // As a last attempt, ping the books base which often starts sooner
        const fallbackOk = await fetchWithTimeout(ENDPOINTS.BACKEND.BOOKS, HEALTH_CHECK.TIMEOUT)
        if (mounted && fallbackOk) {
          setIsReady(true)
          setMessage('')
        } else {
          setMessage('Backend is starting up. You can browse UI; data may be delayed.')
          // Hide overlay after showing info to avoid blocking indefinitely
          setTimeout(() => mounted && setIsReady(true), 3000)
        }
      }
    }
    run()
    return () => { mounted = false }
  }, [endpoints])

  // Live self-ping status (like footer)
  useEffect(() => {
    let interval: number | null = null
    const updateStatus = async () => {
      try {
        const status = await pingManager.getStatus()
        setPingStatus(status)
      } catch (err) {
        // ignore
      }
    }
    updateStatus()
    interval = window.setInterval(updateStatus, 10000)
    return () => { if (interval) window.clearInterval(interval) }
  }, [])

  // Backend health and response time (like footer)
  useEffect(() => {
    let interval: number | null = null
    const checkBackendHealth = async () => {
      try {
        const start = Date.now()
        const res = await fetch(ENDPOINTS.BACKEND.BOOKS, {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'X-Ping': 'overlay-health-check' }
        })
        setBackendHealth({ isHealthy: res.ok, responseTime: Date.now() - start, lastCheck: new Date() })
      } catch (_) {
        setBackendHealth({ isHealthy: false, responseTime: 0, lastCheck: new Date() })
      }
    }
    checkBackendHealth()
    interval = window.setInterval(checkBackendHealth, 15000)
    return () => { if (interval) window.clearInterval(interval) }
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center backdrop-blur-md bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl px-6 py-5 shadow-2xl border border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 bg-gruvbox-light-bg0/90 dark:bg-gruvbox-dark-bg0/90 text-gruvbox-light-fg dark:text-gruvbox-dark-fg w-[90%] max-w-md"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gruvbox-light-blue/20 dark:bg-gruvbox-dark-blue/20 flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-gruvbox-light-blue dark:border-gruvbox-dark-blue border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <div className="font-semibold">Starting backend</div>
                <div className="text-sm opacity-80">{message}</div>
              </div>
            </div>

            {/* Live service status */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
                <span className="opacity-80">Self-Ping:</span>
                <span className={`${pingStatus ? (pingStatus.overall.isActive ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-red dark:text-gruvbox-dark-red') : 'opacity-60'}`}>
                  {pingStatus ? (pingStatus.overall.isActive ? 'Active' : 'Inactive') : 'Checking...'}
                </span>
                <span className="text-xs">
                  {pingStatus ? (pingStatus.overall.isActive ? '🟢' : '🔴') : '⏳'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gruvbox-light-aqua dark:text-gruvbox-dark-aqua" />
                <span className="opacity-80">Frontend:</span>
                <span className="text-gruvbox-light-green dark:text-gruvbox-dark-green">Active</span>
                <span className="text-xs">🟢</span>
              </div>

              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-gruvbox-light-purple dark:text-gruvbox-dark-purple" />
                <span className="opacity-80">Backend:</span>
                <span className={`${backendHealth ? (backendHealth.isHealthy ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-red dark:text-gruvbox-dark-red') : 'opacity-60'}`}>
                  {backendHealth ? (backendHealth.isHealthy ? 'Healthy' : 'Unhealthy') : 'Checking...'}
                </span>
                {backendHealth && (
                  <span className="opacity-70">{backendHealth.responseTime} ms</span>
                )}
              </div>

              {pingStatus && (
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-gruvbox-light-yellow dark:text-gruvbox-dark-yellow" />
                  <span className="opacity-80">Method:</span>
                  <span className="capitalize">{pingStatus.overall.primaryMethod.replace('-', ' ')}</span>
                </div>
              )}
            </div>

            {/* Developer and Backend details */}
            <div className="mt-4 space-y-2 text-sm border-t border-gruvbox-light-bg3/20 dark:border-gruvbox-dark-bg3/20 pt-3">
              <div className="flex items-center justify-between">
                <span className="opacity-80">Developer</span>
                <a
                  href="https://github.com/gowthamreddysomala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-gruvbox-light-blue dark:text-gruvbox-dark-blue hover:opacity-80"
                >
                  <Github className="h-4 w-4" />
                  <span>Gowtham Reddy</span>
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-80">Backend</span>
                <span className="text-right">
                  Spring Boot 3 • PostgreSQL • Render
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-80">API</span>
                <a
                  href={ENDPOINTS.BACKEND.BASE.replace('/api','/api')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate max-w-[60%] text-gruvbox-light-fg dark:text-gruvbox-dark-fg hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue"
                  title={ENDPOINTS.BACKEND.BASE}
                >
                  {ENDPOINTS.BACKEND.BASE}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Footer details on overlay */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="px-4 py-4 border-t border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 bg-gruvbox-light-bg0/90 dark:bg-gruvbox-dark-bg0/90">
              <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-sm">
                  <BookOpen className="h-5 w-5 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
                  <span>© {currentYear} Digital Shelf</span>
                </div>
                <div className="flex items-center space-x-2 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 text-sm">
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
                  <a 
                    href="https://github.com/gowthamreddysomala/The-Digital-Shelf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 ml-3 text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 hover:text-gruvbox-light-blue dark:hover:text-gruvbox-dark-blue"
                  >
                    <Github className="h-4 w-4" />
                    <span>Source</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BackendWakeOverlay


