/**
 * Comprehensive Ping Manager
 * Coordinates both main thread and service worker ping services
 * for maximum reliability in keeping the application alive
 */

import pingService from './pingService'
import serviceWorkerRegistration from '../utils/serviceWorkerRegistration'

class PingManager {
  private isInitialized: boolean = false
  private useServiceWorker: boolean = true
  private fallbackToMainThread: boolean = true

  /**
   * Initialize the ping manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Ping Manager already initialized')
      return
    }

    console.log('Initializing Ping Manager...')

    try {
      // Try to register service worker first
      if (this.useServiceWorker) {
        const registration = await serviceWorkerRegistration.register()
        if (registration) {
          console.log('Service Worker ping service initialized')
          await serviceWorkerRegistration.startPing()
        } else {
          console.warn('Service Worker failed, falling back to main thread')
          this.useServiceWorker = false
        }
      }

      // Fallback to main thread if service worker fails
      if (!this.useServiceWorker && this.fallbackToMainThread) {
        console.log('Starting main thread ping service...')
        pingService.start()
      }

      this.isInitialized = true
      console.log('Ping Manager initialized successfully')
    } catch (error) {
      console.error('Ping Manager initialization failed:', error)

      // Ensure main thread service is running as fallback
      if (this.fallbackToMainThread) {
        console.log('Starting main thread ping service as fallback...')
        pingService.start()
        this.isInitialized = true
      }
    }
  }

  /**
   * Start all ping services
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      if (this.useServiceWorker) {
        await serviceWorkerRegistration.startPing()
      }

      if (this.fallbackToMainThread) {
        pingService.start()
      }

      console.log('All ping services started')
    } catch (error) {
      console.error('Failed to start ping services:', error)
    }
  }

  /**
   * Stop all ping services
   */
  async stop(): Promise<void> {
    try {
      if (this.useServiceWorker) {
        await serviceWorkerRegistration.stopPing()
      }

      if (this.fallbackToMainThread) {
        pingService.stop()
      }

      console.log('All ping services stopped')
    } catch (error) {
      console.error('Failed to stop ping services:', error)
    }
  }

  /**
   * Force immediate ping
   */
  async forcePing(): Promise<void> {
    try {
      if (this.useServiceWorker) {
        await serviceWorkerRegistration.forcePing()
      }

      if (this.fallbackToMainThread) {
        pingService.forcePing()
      }

      console.log('Force ping executed on all services')
    } catch (error) {
      console.error('Failed to execute force ping:', error)
    }
  }

  /**
   * Get comprehensive status of all ping services
   */
  async getStatus(): Promise<{
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
  }> {
    const status: {
      isInitialized: boolean
      serviceWorker: { isActive: boolean; isReady: boolean; lastPing?: string }
      mainThread: { isActive: boolean }
      overall: { isActive: boolean; primaryMethod: 'service-worker' | 'main-thread' | 'both' }
    } = {
      isInitialized: this.isInitialized,
      serviceWorker: {
        isActive: false,
        isReady: false,
        lastPing: undefined as string | undefined
      },
      mainThread: {
        isActive: false
      },
      overall: {
        isActive: false,
        primaryMethod: 'main-thread'
      }
    }

    try {
      // Get service worker status
      if (this.useServiceWorker) {
        try {
          const swStatus = await serviceWorkerRegistration.getStatus()
          status.serviceWorker = {
            isActive: swStatus.isActive,
            isReady: serviceWorkerRegistration.isReady(),
            lastPing: swStatus.lastPing
          }
        } catch (swError) {
          console.warn('Could not get Service Worker status:', swError);
          // Keep default inactive status for service worker
        }
      }

      // Get main thread status
      if (this.fallbackToMainThread) {
        const mainStatus = pingService.getStatus()
        status.mainThread = {
          isActive: mainStatus.isActive
        }
      }

      // Determine overall status
      const swActive = status.serviceWorker.isActive
      const mainActive = status.mainThread.isActive

      status.overall.isActive = swActive || mainActive

      if (swActive && mainActive) {
        status.overall.primaryMethod = 'both'
      } else if (swActive) {
        status.overall.primaryMethod = 'service-worker'
      } else {
        status.overall.primaryMethod = 'main-thread'
      }

      return status
    } catch (error) {
      console.error('Failed to get ping status:', error)
      return status
    }
  }

  /**
   * Configure ping manager behavior
   */
  configure(options: {
    useServiceWorker?: boolean
    fallbackToMainThread?: boolean
  }): void {
    if (options.useServiceWorker !== undefined) {
      this.useServiceWorker = options.useServiceWorker
    }

    if (options.fallbackToMainThread !== undefined) {
      this.fallbackToMainThread = options.fallbackToMainThread
    }

    console.log('Ping Manager configured:', {
      useServiceWorker: this.useServiceWorker,
      fallbackToMainThread: this.fallbackToMainThread
    })
  }

  /**
   * Cleanup and destroy ping manager
   */
  async destroy(): Promise<void> {
    try {
      await this.stop()

      if (this.useServiceWorker) {
        await serviceWorkerRegistration.unregister()
      }

      this.isInitialized = false
      console.log('Ping Manager destroyed')
    } catch (error) {
      console.error('Failed to destroy Ping Manager:', error)
    }
  }

  /**
   * Check if ping manager is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      const status = await this.getStatus()
      return status.overall.isActive
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Create singleton instance
const pingManager = new PingManager()

export default pingManager
