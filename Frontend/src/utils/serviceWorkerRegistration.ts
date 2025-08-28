/**
 * Service worker registration and control helpers for ping service
 */

const SW_URL = '/ping-sw.js'

let registration: ServiceWorkerRegistration | null = null
let ready = false

async function register(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser')
    return null
  }

  try {
    registration = await navigator.serviceWorker.register(SW_URL)
    await navigator.serviceWorker.ready
    ready = true
    console.log('Ping Service Worker registered')
    return registration
  } catch (error) {
    console.error('Failed to register Ping Service Worker:', error)
    registration = null
    ready = false
    return null
  }
}

function isReady(): boolean {
  return ready
}

function postMessage(type: string, data?: unknown): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!registration || !registration.active) {
      reject(new Error('Service worker not active'))
      return
    }

    const messageChannel = new MessageChannel()
    messageChannel.port1.onmessage = (event) => resolve(event.data)
    registration.active.postMessage({ type, data }, [messageChannel.port2])
  })
}

async function startPing(): Promise<void> {
  await postMessage('START_PING')
}

async function stopPing(): Promise<void> {
  await postMessage('STOP_PING')
}

async function forcePing(): Promise<void> {
  await postMessage('FORCE_PING')
}

async function getStatus(): Promise<{ isActive: boolean; lastPing?: string }>{
  const response = await postMessage('GET_STATUS')
  return response as { isActive: boolean; lastPing?: string }
}

async function unregister(): Promise<void> {
  try {
    if (registration) {
      await registration.unregister()
      registration = null
      ready = false
      console.log('Ping Service Worker unregistered')
    }
  } catch (error) {
    console.error('Failed to unregister Ping Service Worker:', error)
  }
}

const serviceWorkerRegistration = {
  register,
  isReady,
  startPing,
  stopPing,
  forcePing,
  getStatus,
  unregister
}

export default serviceWorkerRegistration
