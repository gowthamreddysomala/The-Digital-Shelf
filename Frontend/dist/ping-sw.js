/**
 * Service Worker for Digital Shelf Ping Service
 * Keeps both frontend and backend applications alive by sending periodic requests
 */

const CACHE_NAME = 'digitalshelf-ping-v2'
const PING_INTERVAL = 3 * 60 * 1000 // 3 minutes (slightly more frequent than main service)
const FRONTEND_PING_URLS = [
  'https://digitalshelf.netlify.app',
  'https://digitalshelf.netlify.app/api/health',
  'https://digitalshelf.netlify.app/.netlify/functions/health'
]
const BACKEND_PING_URLS = [
  'https://the-digital-shelf.onrender.com/api',
  'https://the-digital-shelf.onrender.com/api/books',
  'https://the-digital-shelf.onrender.com/api/auth/health',
  'https://the-digital-shelf.onrender.com/api/books/1'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Ping Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Ping Service Worker cache opened')
        // Cache both frontend and backend URLs
        return cache.addAll([...FRONTEND_PING_URLS, ...BACKEND_PING_URLS])
      })
      .catch((error) => {
        console.error('Ping Service Worker cache failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Ping Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Start ping service when service worker activates
let pingInterval = null

function startPingService() {
  if (pingInterval) {
    clearInterval(pingInterval)
  }
  
  console.log('Starting comprehensive ping service in Service Worker (Frontend + Backend)...')
  
  // Send initial ping
  sendComprehensivePing()
  
  // Set up periodic pinging
  pingInterval = setInterval(() => {
    sendComprehensivePing()
  }, PING_INTERVAL)
}

function stopPingService() {
  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
    console.log('Stopped ping service in Service Worker')
  }
}

async function sendComprehensivePing() {
  console.log('Service Worker: Sending comprehensive ping to all services...')
  
  // Ping frontend services
  await pingFrontend()
  
  // Ping backend services
  await pingBackend()
}

async function pingFrontend() {
  console.log('Service Worker: Pinging frontend services...')
  
  for (const url of FRONTEND_PING_URLS) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'X-Ping': 'keep-alive',
          'X-Source': 'service-worker',
          'X-Service': 'frontend-ping',
          'User-Agent': 'DigitalShelf-PingService/1.0'
        }
      })
      
      console.log(`Service Worker: Frontend ping successful to ${url}`)
      
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME)
      cache.put(url, response.clone())
      
      break
    } catch (error) {
      console.warn(`Service Worker: Frontend ping failed to ${url}:`, error)
      continue
    }
  }
}

async function pingBackend() {
  console.log('Service Worker: Pinging backend services...')
  
  for (const url of BACKEND_PING_URLS) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'X-Ping': 'keep-alive',
          'X-Source': 'service-worker',
          'X-Service': 'backend-ping',
          'User-Agent': 'DigitalShelf-PingService/1.0',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log(`Service Worker: Backend ping successful to ${url} - Status: ${response.status}`)
        
        // Try to parse response to verify it's working
        try {
          const data = await response.json()
          console.log(`Service Worker: Backend response data:`, data)
        } catch (parseError) {
          console.log(`Service Worker: Backend response received but not JSON: ${response.statusText}`)
        }
        
        // Cache successful responses
        const cache = await caches.open(CACHE_NAME)
        cache.put(url, response.clone())
        
        break
      } else {
        console.warn(`Service Worker: Backend ping failed to ${url} - Status: ${response.status}`)
      }
    } catch (error) {
      console.warn(`Service Worker: Backend ping failed to ${url}:`, error)
      continue
    }
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data
  
  switch (type) {
    case 'START_PING':
      startPingService()
      break
    case 'STOP_PING':
      stopPingService()
      break
    case 'FORCE_PING':
      sendComprehensivePing()
      break
    case 'GET_STATUS':
      event.ports[0].postMessage({
        isActive: !!pingInterval,
        lastPing: new Date().toISOString()
      })
      break
    case 'TEST_BACKEND':
      pingBackend().then(() => {
        event.ports[0].postMessage({
          backendTest: 'completed',
          timestamp: new Date().toISOString()
        })
      })
      break
    default:
      console.log('Unknown message type:', type)
  }
})

// Handle push notifications (if needed for future features)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  const options = {
    body: 'Digital Shelf is keeping your services alive!',
    icon: '/fallback/book-cover.svg',
    badge: '/fallback/book-cover.svg',
    tag: 'digitalshelf-ping',
    data: {
      url: 'https://digitalshelf.netlify.app'
    }
  }
  
  event.waitUntil(
    self.registration.showNotification('Digital Shelf', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('https://digitalshelf.netlify.app')
  )
})

// Start ping service automatically when service worker loads
startPingService()

// Keep service worker alive with periodic activity
setInterval(() => {
  // Send a keep-alive signal
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'PING_KEEP_ALIVE',
        timestamp: Date.now(),
        services: {
          frontend: FRONTEND_PING_URLS.length,
          backend: BACKEND_PING_URLS.length
        }
      })
    })
  })
}, 60000) // Every minute
