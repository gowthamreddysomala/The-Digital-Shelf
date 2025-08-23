import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/authService'
import { AuthRequest, AuthResponse, User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: AuthRequest) => Promise<AuthResponse>
  register: (credentials: AuthRequest) => Promise<AuthResponse>
  logout: () => void
  checkAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = () => {
    try {
      const currentUser = authService.getCurrentUser()
      const token = authService.getToken()
      
      if (currentUser && token && !authService.isTokenExpired()) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        // Clear invalid tokens
        if (token) {
          authService.logout()
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      authService.logout()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.login(credentials)
      
      if (response.token && response.username && response.role) {
        const user: User = {
          username: response.username,
          role: response.role
        }
        setUser(user)
        setIsAuthenticated(true)
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      const response = await authService.register(credentials)
      
      if (response.token && response.username && response.role) {
        const user: User = {
          username: response.username,
          role: response.role
        }
        setUser(user)
        setIsAuthenticated(true)
      }
      
      return response
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


