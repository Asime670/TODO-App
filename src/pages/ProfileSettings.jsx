import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function ProfileSettings() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const { setTheme } = useTheme()
  const [form, setForm] = useState({ fullname: '', email: ''  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setForm((current) => ({ ...current, fullname: user.fullname, email: user.email, theme: user.theme || 'dark' }))
    }
  }, [user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const payload = { fullname: form.fullname, email: form.email}
 
      const res  = await fetch('https://agrofarms.cloud/api/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      setTheme(form.theme)
      setMessage('Profile updated successfully')
      location.href = '/dashboard'
    } catch (error) {
      setMessage(error?.message || 'Unable to update profile')
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 text-slate-50 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
        <p className="font-outfit text-sm text-cyan-200">Profile settings</p>
        <h1 className="font-satoshi mt-2 text-3xl font-bold">Manage your account</h1>
        <p className="font-outfit mt-2 text-sm text-slate-200">Update your name, email, password, and preferred theme.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="font-satoshi mb-1 block text-sm font-semibold">Name</label>
            <input value={form.fullname} onChange={(event) => setForm({ ...form, fullname: event.target.value })} className="font-outfit w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2" />
          </div>
          <div>
            <label className="font-satoshi mb-1 block text-sm font-semibold">Email</label>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="font-outfit w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2" />
          </div>
          
        

          {message && <p className="font-outfit rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{message}</p>}

          <div className="flex gap-3">
            <button type="submit" className="font-satoshi rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Save changes</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="font-outfit rounded-full border border-white/10 px-4 py-2">Back to dashboard</button>
          </div>
        </form>
      </div>
    </div>
  )
}
