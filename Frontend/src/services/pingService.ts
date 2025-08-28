/**
 * Ping Service - Prevents application from going to sleep
 * by sending periodic requests to keep both frontend and backend services alive
 */

class PingService {
  private pingInterval: number | null = null
  private isActive: boolean = false
  private readonly PING_INTERVAL = 4 * 60 * 1000 // 4 minutes (more frequent for better reliability)
  private readonly FRONTEND_PING_URLS = [
    'https://digitalshelf.netlify.app',
    'https://digitalshelf.netlify.app/api/health',
    'https://digitalshelf.netlify.app/.netlify/functions/health'
  ]
  private readonly BACKEND_PING_URLS = [
    'https://the-digital-shelf.onrender.com/api',
    'https://the-digital-shelf.onrender.com/api/books',
    'https://the-digital-shelf.onrender.com/api/auth/health',
    'https://the-digital-shelf.onrender.com/api/books/1' // Specific book endpoint
  ]

  /**
   * Start the ping service
   */
  start(): void {
    if (this.isActive) {
      console.log('Ping service is already running')
      return
    }

    this.isActive = true
    console.log('Starting comprehensive ping service (Frontend + Backend)...')

    // Send initial ping to both services
    this.sendComprehensivePing()

    // Set up interval for periodic pings
    this.pingInterval = setInterval(() => {
      this.sendComprehensivePing()
    }, this.PING_INTERVAL)

    // Add event listeners to detect when app becomes visible
    this.addVisibilityListeners()
  }

  /**
   * Stop the ping service
   */
  stop(): void {
    if (!this.isActive) {
      return
    }

    this.isActive = false
    console.log('Stopping ping service...')

    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    this.removeVisibilityListeners()
  }

  /**
   * Send comprehensive ping to both frontend and backend
   */
  private async sendComprehensivePing(): Promise<void> {
    console.log('Sending comprehensive ping to all services...')
    
    // Ping frontend services
    await this.pingFrontend()
    
    // Ping backend services
    await this.pingBackend()
  }

  /**
   * Ping frontend services
   */
  private async pingFrontend(): Promise<void> {
    console.log('Pinging frontend services...')
    
    for (const url of this.FRONTEND_PING_URLS) {
      try {
        await fetch(url, {
          method: 'GET',
          mode: 'no-cors', // Avoid CORS issues
          cache: 'no-cache',
          headers: {
            'X-Ping': 'keep-alive',
            'X-Service': 'frontend-ping',
            'User-Agent': 'DigitalShelf-PingService/1.0'
          }
        });
        console.log(`Frontend ping successful to ${url}`)
        break // Exit loop if successful
      } catch (error) {
        console.warn(`Frontend ping failed to ${url}:`, error)
        continue // Try next URL
      }
    }
  }

  /**
   * Ping backend services
   */
  private async pingBackend(): Promise<void> {
    console.log('Pinging backend services...')
    
    for (const url of this.BACKEND_PING_URLS) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors', // Backend supports CORS
          cache: 'no-cache',
          headers: {
            'X-Ping': 'keep-alive',
            'X-Service': 'backend-ping',
            'User-Agent': 'DigitalShelf-PingService/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          console.log(`Backend ping successful to ${url} - Status: ${response.status}`)
          
          // Try to parse response to verify it's working
          try {
            const data = await response.json()
            console.log(`Backend response data:`, data)
          } catch (parseError) {
            console.log(`Backend response received but not JSON: ${response.statusText}`)
          }
          
          break // Exit loop if successful
        } else {
          console.warn(`Backend ping failed to ${url} - Status: ${response.status}`)
        }
      } catch (error) {
        console.warn(`Backend ping failed to ${url}:`, error)
        continue // Try next URL
      }
    }
  }
  /**
   * Add visibility change listeners to optimize pinging
   */
  private addVisibilityListeners(): void {
    // Ping when page becomes visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
    
    // Ping when window gains focus
    window.addEventListener('focus', this.handleWindowFocus)
    
    // Ping when user interacts with the page
    document.addEventListener('click', this.handleUserInteraction)
    document.addEventListener('keydown', this.handleUserInteraction)
    document.addEventListener('scroll', this.handleUserInteraction)
  }

  /**
   * Remove visibility change listeners
   */
  private removeVisibilityListeners(): void {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    window.removeEventListener('focus', this.handleWindowFocus)
    document.removeEventListener('click', this.handleUserInteraction)
    document.removeEventListener('keydown', this.handleUserInteraction)
    document.removeEventListener('scroll', this.handleUserInteraction)
  }

  /**
   * Handle visibility change events
   */
  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      console.log('Page became visible, sending comprehensive ping...')
      this.sendComprehensivePing()
    }
  }

  /**
   * Handle window focus events
   */
  private handleWindowFocus = (): void => {
    console.log('Window gained focus, sending comprehensive ping...')
    this.sendComprehensivePing()
  }

  /**
   * Handle user interaction events
   */
  private handleUserInteraction = (): void => {
    // Debounce user interactions to avoid excessive pinging
    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout)
    }
    
    this.userInteractionTimeout = setTimeout(() => {
      console.log('User interaction detected, sending comprehensive ping...')
      this.sendComprehensivePing()
    }, 1000) // Wait 1 second after last interaction
  }

  private userInteractionTimeout: number | null = null

  /**
   * Get service status
   */
  getStatus(): { isActive: boolean; lastPing?: Date } {
    return {
      isActive: this.isActive
    }
  }

  /**
   * Force a ping immediately
   */
  forcePing(): void {
    console.log('Force comprehensive ping requested...')
    this.sendComprehensivePing()
  }

  /**
   * Test backend connectivity specifically
   */
  async testBackendConnectivity(): Promise<boolean> {
    try {
      const response = await fetch('https://the-digital-shelf.onrender.com/api/books', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Ping': 'connectivity-test'
        }
      })
      
      const isHealthy = response.ok
      console.log(`Backend connectivity test: ${isHealthy ? 'SUCCESS' : 'FAILED'} - Status: ${response.status}`)
      
      return isHealthy
    } catch (error) {
      console.error('Backend connectivity test failed:', error)
      return false
    }
  }
}

// Create singleton instance
const pingService = new PingService()

export default pingService
