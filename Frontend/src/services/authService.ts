import {AuthRequest, AuthResponse} from '../types'
import { ENDPOINTS } from '../config/endpoints'

const API_BASE_URL = ENDPOINTS.BACKEND.BASE

export const authService = {
  // Login user
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('jwt_token', data.token)
        localStorage.setItem('username', data.username)
        localStorage.setItem('role', data.role)
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Register user
  async register(credentials: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      const data = await response.json()
      
      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('jwt_token', data.token)
        localStorage.setItem('username', data.username)
        localStorage.setItem('role', data.role)
      }

      return data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
  },

  // Get current user info
  getCurrentUser(): { username: string; role: string } | null {
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')
    
    if (username && role) {
      return { username, role }
    }
    
    return null
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token')
    return !!token
  },

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem('jwt_token')
  },

  // Check if token is expired (basic check)
  isTokenExpired(): boolean {
    const token = localStorage.getItem('jwt_token')
    if (!token) return true

    try {
      // Basic JWT expiration check (you might want to use a proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error parsing JWT token:', error)
      return true
    }
  },

  // Refresh token (you might implement this based on your backend)
  async refreshToken(): Promise<boolean> {
    try {
      const token = this.getToken()
      if (!token) return false

      // You can implement token refresh logic here
      // For now, we'll just check if the current token is valid
      return !this.isTokenExpired()
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }
}


