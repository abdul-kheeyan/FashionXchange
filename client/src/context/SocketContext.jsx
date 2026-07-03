import { createContext, useContext, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { token } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (token) {
      // Connect with auth token
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling'],
      })

      socketRef.current.on('connect', () => {
        console.log('[SOCKET] Connected:', socketRef.current.id)
      })

      socketRef.current.on('disconnect', () => {
        console.log('[SOCKET] Disconnected')
      })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [token])

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

export default SocketContext
