/**
 * Endpoint Configuration for Digital Shelf
 * Defines all API endpoints and ping URLs
 */

export const ENDPOINTS = {
  // Backend API Base URL
  BACKEND_BASE: 'https://the-digital-shelf.onrender.com/api',
  
  // Frontend Base URL
  FRONTEND_BASE: 'https://digitalshelf.netlify.app',
  
  // Backend API Endpoints
  BACKEND: {
    BASE: 'https://the-digital-shelf.onrender.com/api',
    BOOKS: 'https://the-digital-shelf.onrender.com/api/books',
    AUTH: 'https://the-digital-shelf.onrender.com/api/auth',
    HEALTH: 'https://the-digital-shelf.onrender.com/api/health',
    USERS: 'https://the-digital-shelf.onrender.com/api/users',
    // Specific endpoints for pinging
    BOOK_DETAIL: 'https://the-digital-shelf.onrender.com/api/books/1',
    AUTH_HEALTH: 'https://the-digital-shelf.onrender.com/api/auth/health'
  },
  
  // Frontend Endpoints
  FRONTEND: {
    BASE: 'https://digitalshelf.netlify.app',
    HEALTH: 'https://digitalshelf.netlify.app/api/health',
    NETLIFY_FUNCTIONS: 'https://digitalshelf.netlify.app/.netlify/functions/health',
    FALLBACK: 'https://digitalshelf.netlify.app/fallback'
  },
  
  // Ping Configuration
  PING: {
    // Frontend ping URLs (no-cors mode)
    FRONTEND_URLS: [
      'https://digitalshelf.netlify.app',
      'https://digitalshelf.netlify.app/api/health',
      'https://digitalshelf.netlify.app/.netlify/functions/health'
    ],
    
    // Backend ping URLs (cors mode)
    BACKEND_URLS: [
      'https://the-digital-shelf.onrender.com/api',
      'https://the-digital-shelf.onrender.com/api/books',
      'https://the-digital-shelf.onrender.com/api/auth/health',
      'https://the-digital-shelf.onrender.com/api/books/1'
    ],
    
    // All ping URLs combined
    ALL_URLS: [
      'https://digitalshelf.netlify.app',
      'https://digitalshelf.netlify.app/api/health',
      'https://digitalshelf.netlify.app/.netlify/functions/health',
      'https://the-digital-shelf.onrender.com/api',
      'https://the-digital-shelf.onrender.com/api/books',
      'https://the-digital-shelf.onrender.com/api/auth/health',
      'https://the-digital-shelf.onrender.com/api/books/1'
    ]
  }
}

// Ping intervals in milliseconds
export const PING_INTERVALS = {
  MAIN_THREAD: 4 * 60 * 1000,      // 4 minutes
  SERVICE_WORKER: 3 * 60 * 1000,   // 3 minutes
  USER_INTERACTION: 1000,           // 1 second debounce
  KEEP_ALIVE: 60 * 1000             // 1 minute
}

// Headers for different types of requests
export const PING_HEADERS = {
  FRONTEND: {
    'X-Ping': 'keep-alive',
    'X-Service': 'frontend-ping',
    'User-Agent': 'DigitalShelf-PingService/1.0'
  },
  
  BACKEND: {
    'X-Ping': 'keep-alive',
    'X-Service': 'backend-ping',
    'User-Agent': 'DigitalShelf-PingService/1.0',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  
  SERVICE_WORKER: {
    'X-Ping': 'keep-alive',
    'X-Source': 'service-worker',
    'X-Service': 'comprehensive-ping',
    'User-Agent': 'DigitalShelf-PingService/1.0'
  }
}

// Health check configuration
export const HEALTH_CHECK = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  SUCCESS_THRESHOLD: 0.8, // 80% success rate required
  BACKEND_ENDPOINTS: [
    'https://the-digital-shelf.onrender.com/api/books',
    'https://the-digital-shelf.onrender.com/api/auth/health'
  ]
}

export default ENDPOINTS
