import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import TaskForm from '../components/TaskForm'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      const token = sessionStorage.getItem('token')

      const response = await fetch(
        `https://agrofarms.cloud/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const result = await response.json()

      if (result.success) {
        setTask(result.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const remaining = useMemo(() => {
    if (!task?.remind_at) return null

    const ms =
      new Date(task.remind_at).getTime() - Date.now()

    const totalSeconds = Math.max(
      0,
      Math.floor(ms / 1000)
    )

    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor(
      (totalSeconds % 86400) / 3600
    )
    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    )
    const seconds = totalSeconds % 60

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
  }, [task])

  const handleUpdate = async (payload) => {
    try {
      const token = sessionStorage.getItem('token')

      const response = await fetch(
        `https://agrofarms.cloud/api/tasks/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      const result = await response.json()

      if (result.success) {
        setTask(result.data)
        setMessage('Task updated successfully')
        setIsEditing(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem('token')

      await fetch(
        `https://agrofarms.cloud/api/tasks/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggle = async () => {
    try {
      const token = sessionStorage.getItem('token')

      const nextStatus =
        task.status === 'completed'
          ? 'pending'
          : 'completed'

      const response = await fetch(
        `https://agrofarms.cloud/api/tasks/${id}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: nextStatus
          })
        }
      )

      const result = await response.json()

      if (result.success) {
        setTask(result.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-10 text-slate-50">
        Loading task...
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen px-6 py-10 text-slate-50">
        Task not found.
      </div>
    )
  }

  return (
    <div className="font-outfit min-h-screen px-4 py-8 text-slate-50 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">

          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-200">
                Task Detail
              </p>

              <h1 className="font-satoshi text-3xl font-bold">
                {task.title}
              </h1>

              <p className="mt-2 text-sm text-slate-200">
                {task.description ||
                  'No description provided'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setIsEditing(!isEditing)
                }
                className="rounded-full border border-white/10 px-4 py-2"
              >
                {isEditing
                  ? 'Cancel Edit'
                  : 'Edit Task'}
              </button>

              <button
                onClick={handleDelete}
                className="rounded-full bg-rose-500 px-4 py-2 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          

            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-sm text-slate-300">
                Task Date
              </p>
              <p className="mt-2 font-semibold">
                {new Date(
                  task.deadline
                ).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950/50 p-4">
              <p className="text-sm text-slate-300">
                Reminder
              </p>
              <p className="mt-2 font-semibold">
                {remaining}
              </p>
            </div>

          </div>

          <div className="mt-4 flex gap-3">

            <button
              onClick={handleToggle}
              className={`rounded-full px-4 py-2 font-semibold ${
                task.status === 'completed'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-cyan-500 text-slate-950'
              }`}
            >
              {task.status === 'completed'
                ? 'Mark Pending'
                : 'Mark Complete'}
            </button>

            <button
              onClick={() =>
                navigate('/dashboard')
              }
              className="rounded-full border border-white/10 px-4 py-2"
            >
              Back
            </button>

          </div>

          {message && (
            <p className="mt-4 rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
              {message}
            </p>
          )}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950 p-6"
          >
            <h2 className="font-satoshi text-2xl font-bold">
              Edit Task
            </h2>

            <div className="mt-4">
              <TaskForm
                initialData={task}
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}