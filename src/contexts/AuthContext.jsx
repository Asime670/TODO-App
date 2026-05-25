import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AUTH_KEY = 'taskflow-session'
const USERS_KEY = 'taskflow-users'

const defaultTheme = () => (
  typeof window !== 'undefined' ? window.localStorage.getItem('taskflow-theme') || 'dark' : 'dark'
)

function readStoredUsers() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeStoredUsers(users) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStoredSession(user) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

function clearStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_KEY)
}

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredSession())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      writeStoredSession(user)
    }
  }, [user])

  const login = async (credentials) => {
    // Accept any credentials, create a fake user object
    const nextUser = {
      id: `${Date.now()}-${Math.random()}`,
      name: credentials.email.split('@')[0] || 'User',
      email: credentials.email,
      password: credentials.password,
      theme: defaultTheme()
    }
    setUser(nextUser)
    writeStoredSession(nextUser)
    return { user: nextUser }
  }

  const register = async (payload) => {
    // Accept any registration, create a fake user object
    const nextUser = {
      id: `${Date.now()}-${Math.random()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      theme: payload.theme || defaultTheme()
    }
    setUser(nextUser)
    writeStoredSession(nextUser)
    return { user: nextUser }
  }

  const logout = async () => {
    setUser(null)
    clearStoredSession()
  }

  const updateProfile = async (payload) => {
    const users = readStoredUsers()
    const index = users.findIndex((item) => item.email === user?.email)

    if (index === -1) {
      throw new Error('Unable to update profile.')
    }

    const nextUser = {
      ...users[index],
      ...payload,
      theme: payload.theme || users[index].theme || defaultTheme()
    }

    if (!payload.password) {
      nextUser.password = users[index].password
    }

    users[index] = {
      ...users[index],
      ...payload,
      password: payload.password || users[index].password,
      theme: payload.theme || users[index].theme || defaultTheme()
    }

    writeStoredUsers(users)
    setUser(nextUser)
    writeStoredSession(nextUser)

    return { user: nextUser }
  }

  const refreshUser = () => {
    const sessionUser = readStoredSession()
    setUser(sessionUser)
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile, refreshUser }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
