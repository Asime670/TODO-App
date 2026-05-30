import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  console.log(user)
 

  if (!loading && !user) {
    console.warn('[Auth] Protected route denied, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  return children
}
