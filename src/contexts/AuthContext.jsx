import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    setUser(data.user)
    return data
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  const updateProfile = async (payload) => {
    const { data } = await api.put('/profile', payload)
    setUser(data.user)
    return data
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile, refreshUser: fetchUser }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
