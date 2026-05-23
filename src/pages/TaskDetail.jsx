import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import TaskForm from '../components/TaskForm'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const loadTask = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/tasks/${id}`)
      setTask(data.task)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load task')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTask()
  }, [id])

  const remaining = useMemo(() => {
    if (!task) return null
    const ms = new Date(task.deadline).getTime() - Date.now()
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }, [task])

  const handleUpdate = async (payload) => {
    try {
      await api.put(`/tasks/${id}`, payload)
      setIsEditing(false)
      await loadTask()
      setMessage('Task updated successfully')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update task')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${id}`)
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete task')
    }
  }

  const handleToggle = async () => {
    try {
      await api.put(`/tasks/${id}`, { completed: !task.completed })
      await loadTask()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update task')
    }
  }

  if (loading) {
    return <div className="min-h-screen px-6 py-10 text-slate-50">Loading task...</div>
  }

  if (!task) {
    return <div className="min-h-screen px-6 py-10 text-slate-50">Task not found.</div>
  }

  return (
    <div className="min-h-screen px-4 py-8 text-slate-50 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-200">Task detail</p>
              <h1 className="text-3xl font-bold">{task.title}</h1>
              <p className="mt-2 text-sm text-slate-200">{task.description || 'No description provided.'}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsEditing((value) => !value)} className="rounded-full border border-white/10 px-4 py-2">{isEditing ? 'Cancel edit' : 'Edit task'}</button>
              <button onClick={handleDelete} className="rounded-full bg-rose-500 px-4 py-2 font-semibold">Delete</button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-sm text-slate-200">Priority</p>
              <p className="mt-2 font-semibold">{task.priority}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-sm text-slate-200">Category</p>
              <p className="mt-2 font-semibold">{task.category}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-sm text-slate-200">Deadline</p>
              <p className="mt-2 font-semibold">{new Date(task.deadline).toLocaleString()}</p>
            </div>
            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-sm text-slate-200">Remaining</p>
              <p className="mt-2 font-semibold">{remaining}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleToggle} className={`rounded-full px-4 py-2 font-semibold ${task.completed ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'}`}>
              {task.completed ? 'Mark incomplete' : 'Mark complete'}
            </button>
            <button onClick={() => navigate('/dashboard')} className="rounded-full border border-white/10 px-4 py-2">Back to dashboard</button>
          </div>

          {message && <p className="mt-4 rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{message}</p>}
        </div>

        {isEditing && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-slate-950 p-6">
            <h2 className="text-2xl font-bold">Edit task</h2>
            <div className="mt-4">
              <TaskForm initialData={task} onSubmit={handleUpdate} submitLabel="Save changes" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
