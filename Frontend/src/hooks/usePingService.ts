import { useEffect, useState, useCallback } from 'react'
import pingService from '../services/pingService'

/**
 * React hook for managing the ping service
 * Automatically starts the service when the component mounts
 * and stops it when the component unmounts
 */
export const usePingService = () => {
  const [isActive, setIsActive] = useState(false)

  // Start the ping service
  const startPing = useCallback(() => {
    pingService.start()
    setIsActive(true)
  }, [])

  // Stop the ping service
  const stopPing = useCallback(() => {
    pingService.stop()
    setIsActive(false)
  }, [])

  // Force a ping immediately
  const forcePing = useCallback(() => {
    pingService.forcePing()
  }, [])

  // Get current status
  const getStatus = useCallback(() => {
    return pingService.getStatus()
  }, [])

  // Auto-start service when component mounts
  useEffect(() => {
    // Start the service
    startPing()

    // Cleanup when component unmounts
    return () => {
      stopPing()
    }
  }, [startPing, stopPing])

  // Update status periodically
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const status = getStatus()
      setIsActive(status.isActive)
    }, 1000)

    return () => clearInterval(statusInterval)
  }, [getStatus])

  return {
    isActive,
    startPing,
    stopPing,
    forcePing,
    getStatus
  }
}
