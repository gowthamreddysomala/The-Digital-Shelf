import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Server, Globe, Wifi, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import pingManager from '../services/pingManager'
import { ENDPOINTS } from '../config/endpoints'

interface PingStatus {
  isInitialized: boolean
  serviceWorker: {
    isActive: boolean
    isReady: boolean
    lastPing?: string
  }
  mainThread: {
    isActive: boolean
  }
  overall: {
    isActive: boolean
    primaryMethod: 'service-worker' | 'main-thread' | 'both'
  }
}

const PingDashboard = () => {
  const [status, setStatus] = useState<PingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [backendHealth, setBackendHealth] = useState<{
    isHealthy: boolean
    responseTime: number
    lastCheck: Date
  } | null>(null)

  // Update status periodically
  useEffect(() => {
    const updateStatus = async () => {
      try {
        const currentStatus = await pingManager.getStatus()
        setStatus(currentStatus)
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Failed to get ping status:', error)
      }
    }

    // Initial update
    updateStatus()

    // Update every 5 seconds
    const interval = setInterval(updateStatus, 5000)

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
            'X-Ping': 'health-check'
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

    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleForcePing = async () => {
    setIsLoading(true)
    try {
      await pingManager.forcePing()
      // Update status after force ping
      const currentStatus = await pingManager.getStatus()
      setStatus(currentStatus)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Force ping failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-gruvbox-light-green dark:text-gruvbox-dark-green' : 'text-gruvbox-light-red dark:text-gruvbox-dark-red'
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />
  }

  if (!status) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="h-6 w-6 animate-spin text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3" />
        <span className="ml-2 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">Loading ping status...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gruvbox-light-bg0/60 dark:bg-gruvbox-dark-bg0/60 backdrop-blur-md border border-gruvbox-light-bg3/30 dark:border-gruvbox-dark-bg3/30 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
          <h3 className="text-lg font-semibold text-gruvbox-light-fg dark:text-gruvbox-dark-fg">
            Service Health Dashboard
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={handleForcePing}
            disabled={isLoading}
            className="p-2 rounded-lg bg-gruvbox-light-bg1/60 dark:bg-gruvbox-dark-bg1/60 hover:bg-gruvbox-light-bg1/80 dark:hover:bg-gruvbox-dark-bg1/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gruvbox-light-bg1/40 dark:bg-gruvbox-dark-bg1/40 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
            <div>
              <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Overall Status</p>
              <p className={`font-medium ${getStatusColor(status.overall.isActive)}`}>
                {status.overall.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gruvbox-light-bg1/40 dark:bg-gruvbox-dark-bg1/40 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Server className="h-5 w-5 text-gruvbox-light-purple dark:text-gruvbox-dark-purple" />
            <div>
              <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Primary Method</p>
              <p className="font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg capitalize">
                {status.overall.primaryMethod.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gruvbox-light-bg1/40 dark:bg-gruvbox-dark-bg1/40 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Wifi className="h-5 w-5 text-gruvbox-light-green dark:text-gruvbox-dark-green" />
            <div>
              <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">Backend Health</p>
              <p className={`font-medium ${backendHealth ? getStatusColor(backendHealth.isHealthy) : 'text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3'}`}>
                {backendHealth ? (backendHealth.isHealthy ? 'Healthy' : 'Unhealthy') : 'Checking...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-4">
        {/* Service Worker Status */}
        <div className="bg-gruvbox-light-bg1/30 dark:bg-gruvbox-dark-bg1/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Server className="h-5 w-5 text-gruvbox-light-purple dark:text-gruvbox-dark-purple" />
              <div>
                <p className="font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Service Worker</p>
                <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                  Background ping service
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.serviceWorker.isActive)}
              <span className={`text-sm ${getStatusColor(status.serviceWorker.isActive)}`}>
                {status.serviceWorker.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          {status.serviceWorker.lastPing && (
            <p className="text-xs text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3 mt-2">
              Last ping: {new Date(status.serviceWorker.lastPing).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Main Thread Status */}
        <div className="bg-gruvbox-light-bg1/30 dark:bg-gruvbox-dark-bg1/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-gruvbox-light-blue dark:text-gruvbox-dark-blue" />
              <div>
                <p className="font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Main Thread</p>
                <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                  Foreground ping service
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status.mainThread.isActive)}
              <span className={`text-sm ${getStatusColor(status.mainThread.isActive)}`}>
                {status.mainThread.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Backend Health Details */}
        {backendHealth && (
          <div className="bg-gruvbox-light-bg1/30 dark:bg-gruvbox-dark-bg1/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-gruvbox-light-green dark:text-gruvbox-dark-green" />
                <div>
                  <p className="font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg">Backend API</p>
                  <p className="text-sm text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2">
                    {ENDPOINTS.BACKEND.BASE}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(backendHealth.isHealthy)}
                <span className={`text-sm ${getStatusColor(backendHealth.isHealthy)}`}>
                  {backendHealth.isHealthy ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">
              Response time: {backendHealth.responseTime}ms | 
              Last check: {backendHealth.lastCheck.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Ping Endpoints Info */}
      <div className="mt-6 p-4 bg-gruvbox-light-bg2/20 dark:bg-gruvbox-dark-bg2/20 rounded-lg">
        <h4 className="text-sm font-medium text-gruvbox-light-fg dark:text-gruvbox-dark-fg mb-2">
          Ping Endpoints
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 mb-1">Frontend:</p>
            <ul className="space-y-1 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">
              {ENDPOINTS.PING.FRONTEND_URLS.map((url, index) => (
                <li key={index} className="truncate">{url}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-gruvbox-light-fg2 dark:text-gruvbox-dark-fg2 mb-1">Backend:</p>
            <ul className="space-y-1 text-gruvbox-light-fg3 dark:text-gruvbox-dark-fg3">
              {ENDPOINTS.PING.BACKEND_URLS.map((url, index) => (
                <li key={index} className="truncate">{url}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PingDashboard
