import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    console.info('[UI] Login form submitted', { email: form.email })

    try {
      await login(form)
      console.info('[UI] Login success, redirecting to dashboard', { email: form.email })
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.'
      setError(message)
      console.error('[UI] Login failed', { email: form.email, message })
    }
  }

  return (
    <div className="font-outfit flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur"
      >
        <p className="font-outfit text-sm text-cyan-200">Welcome back</p>
        <h1 className="font-satoshi mt-2 text-3xl font-bold">Sign in to TaskFlow</h1>
        <p className="font-outfit mt-2 text-sm text-slate-200">Use your account to resume planning and tracking your work.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-satoshi mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="font-outfit w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
            />
          </div>
          <div>
            <label className="font-satoshi mb-1 block text-sm font-semibold">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="font-outfit w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
            />
          </div>

          {error ? (
            <p role="alert" className="font-outfit rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="font-satoshi w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <p className="font-outfit mt-4 text-sm text-slate-200">
          New here? <Link to="/register" className="text-cyan-200">Create an account</Link>
        </p>
      </motion.div>
    </div>
  )
}
