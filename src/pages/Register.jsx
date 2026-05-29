import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    console.info('[UI] Register form submitted', { email: form.email })

    try {
      await register(form)
      console.info('[UI] Register success, redirecting to dashboard', { email: form.email })
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create an account. Please try again.'
      setError(message)
      console.error('[UI] Register failed', { email: form.email, message })
    }
  }

  return (
    <div className="font-outfit flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur"
      >
        <p className="font-outfit text-sm text-cyan-200">Start organizing</p>
        <h1 className="font-satoshi mt-2 text-3xl font-bold">Create your TaskFlow account</h1>
        <p className="font-outfit mt-2 text-sm text-slate-200">Secure your workspace, keep tasks moving, and get back to planning fast.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-satoshi mb-1 block text-sm font-semibold">Name</label>
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="font-outfit w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
            />
          </div>
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
              autoComplete="new-password"
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
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="font-outfit mt-4 text-sm text-slate-200">
          Already have an account? <Link to="/login" className="text-cyan-200">Login</Link>
        </p>
      </motion.div>
    </div>
  )
}
