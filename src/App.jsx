import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TaskDetail from './pages/TaskDetail'
import ProfileSettings from './pages/ProfileSettings'

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks/:id"
        element={
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </motion.button>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ThemeToggleButton />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
