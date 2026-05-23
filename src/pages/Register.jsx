import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await register(form)
      navigate('/dashboard')
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to register')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur"
      >
        <p className="text-sm text-cyan-200">Start organizing</p>
        <h1 className="mt-2 text-3xl font-bold">Create your TaskFlow account</h1>
        <p className="mt-2 text-sm text-slate-200">Secure JWT auth, automatic reminders, and a real-time dashboard are waiting for you.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
            />
          </div>
          {error && <p className="rounded-xl bg-rose-500/20 px-3 py-2 text-sm text-rose-100">{error}</p>}
          <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">Register</button>
        </form>

        <p className="mt-4 text-sm text-slate-200">
          Already have an account? <Link to="/login" className="text-cyan-200">Login</Link>
        </p>
      </motion.div>
    </div>
  )
}
