import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

export default function ProfileSettings() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', theme: user?.theme || 'dark' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setForm((current) => ({ ...current, name: user.name, email: user.email, theme: user.theme || 'dark' }))
    }
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const payload = { name: form.name, email: form.email, theme: form.theme }
      if (form.password) payload.password = form.password
      await updateProfile(payload)
      setMessage('Profile updated successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update profile')
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 text-slate-50 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
        <p className="text-sm text-cyan-200">Profile settings</p>
        <h1 className="mt-2 text-3xl font-bold">Manage your account</h1>
        <p className="mt-2 text-sm text-slate-200">Update your name, email, password, and preferred theme.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Name</label>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">New password</label>
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2" placeholder="Leave blank to keep current password" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold">Theme</label>
            <select value={form.theme} onChange={(event) => setForm({ ...form, theme: event.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {message && <p className="rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{message}</p>}

          <div className="flex gap-3">
            <button type="submit" className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Save changes</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="rounded-full border border-white/10 px-4 py-2">Back to dashboard</button>
          </div>
        </form>
      </div>
    </div>
  )
}
