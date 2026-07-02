import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('fastion_token'))
  const [loading, setLoading] = useState(true)

  // Fetch current user on mount / token change
  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const { data } = await api.get('/auth/me')
          setUser(data.user)
        } catch {
          // Token invalid / expired
          logout()
        }
      }
      setLoading(false)
    }
    init()
  }, [token])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    const { token: newToken, user: newUser } = data
    localStorage.setItem('fastion_token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    const { token: newToken, user: newUser } = data
    localStorage.setItem('fastion_token', newToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('fastion_token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((updated) => {
    setUser(prev => ({ ...prev, ...updated }))
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
