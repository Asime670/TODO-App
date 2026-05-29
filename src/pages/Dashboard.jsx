import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { addTask, deleteStoredTask, getTasks, saveTasks, updateStoredTask } from '../lib/taskStorage'
import { useAuth } from '../contexts/AuthContext'

const statCards = [
  { key: 'total', label: 'Total' },
  { key: 'completed', label: 'Completed' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' }
]

function buildCalendarDays(referenceDate) {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  return Array.from({ length: 42 }, (_, index) => {
    const day = index - startOffset + 1
    if (day < 1 || day > daysInMonth) {
      return null
    }

    return new Date(year, month, day)
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState(() => getTasks())
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [view, setView] = useState('board')
  const [showCreate, setShowCreate] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [alarmTask, setAlarmTask] = useState(null)
  const [alarmOpen, setAlarmOpen] = useState(false)
  const [message, setMessage] = useState('')
  const triggeredAlarms = useRef(new Set())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    tasks.forEach((task) => {
      const deadline = new Date(task.deadline).getTime()
      if (task.completed || deadline > now) {
        return
      }

      if (!triggeredAlarms.current.has(task._id)) {
        triggeredAlarms.current.add(task._id)
        setAlarmTask(task)
        setAlarmOpen(true)

        if (typeof window !== 'undefined' && window.AudioContext) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext
          const context = new AudioContextClass()
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          oscillator.type = 'sine'
          oscillator.frequency.value = 880
          gain.gain.value = 0.05
          oscillator.connect(gain)
          gain.connect(context.destination)
          oscillator.start()

          setTimeout(() => {
            oscillator.stop()
            gain.disconnect()
            oscillator.disconnect()
            context.close()
          }, 4000)
        }
      }
    })
  }, [tasks, now])

  const categories = useMemo(() => ['all', ...new Set(tasks.map((task) => task.category))], [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'completed' ? task.completed : !task.completed)

      return matchesSearch && matchesPriority && matchesCategory && matchesStatus
    })
  }, [tasks, search, priorityFilter, categoryFilter, statusFilter])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const pending = total - completed
    const overdue = tasks.filter((task) => !task.completed && new Date(task.deadline).getTime() < now).length

    return { total, completed, pending, overdue }
  }, [tasks, now])

  const calendarDays = useMemo(() => buildCalendarDays(new Date()), [])

  const handleCreate = (payload) => {
    addTask(payload)
    setTasks(getTasks())
    setShowCreate(false)
    setMessage('Task created successfully')
  }

  const handleToggle = (task) => {
    updateStoredTask(task._id, { completed: !task.completed })
    setTasks(getTasks())
  }

  const handleDelete = (task) => {
    deleteStoredTask(task._id)
    setTasks(getTasks())
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="font-outfit min-h-screen px-4 py-6 text-slate-50 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-4">
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-6 flex flex-col gap-3">
            <div>
              <p className="font-outfit text-xs text-cyan-200">TaskFlow</p>
              <h1 className="font-satoshi mt-1 text-xl font-semibold">Dashboard</h1>
              <p className="font-outfit mt-1 text-xs text-slate-200">Welcome back, {user?.name || 'there'}.</p>
            </div>

            <div className="grid gap-2">
              <button onClick={() => setView('board')} className="font-satoshi rounded-lg bg-cyan-500 px-3 py-2 text-left text-sm font-semibold text-slate-950">Overview</button>
              <button onClick={() => setView('calendar')} className="font-outfit rounded-lg border border-white/10 px-3 py-2 text-left text-sm">Calendar</button>
              <button onClick={() => navigate('/profile')} className="font-outfit rounded-lg border border-white/10 px-3 py-2 text-left text-sm">Profile</button>
              <button onClick={handleLogout} className="font-outfit rounded-lg border border-rose-400/50 px-3 py-2 text-left text-sm text-rose-100">Logout</button>
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="font-outfit text-xs text-slate-200">Current focus</p>
              <p className="font-satoshi mt-1 text-base font-semibold">{stats.pending} pending tasks</p>
              <p className="font-outfit mt-0.5 text-xs text-slate-200">{stats.overdue} overdue items.</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-outfit text-xs text-cyan-200">Focus dashboard</p>
                <h2 className="font-satoshi text-2xl font-semibold">Stay ahead of every deadline</h2>
              </div>
              <button onClick={() => setShowCreate(true)} className="font-satoshi rounded-full bg-cyan-500 px-3 py-1.5 text-sm font-semibold text-slate-950">
                + New task
              </button>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.key} className="rounded-lg border border-white/10 bg-slate-950/40 p-3">
                  <p className="font-outfit text-xs text-slate-300">{card.label}</p>
                  <p className="font-satoshi mt-1 text-xl font-bold">{stats[card.key]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks"
                  className="font-outfit rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-sm"
                />
                <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="font-outfit rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-sm">
                  <option value="all">All priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="font-outfit rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-sm">
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="font-outfit rounded-lg border border-white/10 bg-slate-950/40 px-3 py-1.5 text-sm">
                  <option value="all">All statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setView('board')} className={`font-satoshi rounded-full px-3 py-1.5 text-sm font-semibold ${view === 'board' ? 'bg-cyan-500 text-slate-950' : 'border border-white/10'}`}>Board</button>
                <button onClick={() => setView('calendar')} className={`font-satoshi rounded-full px-3 py-1.5 text-sm font-semibold ${view === 'calendar' ? 'bg-cyan-500 text-slate-950' : 'border border-white/10'}`}>Calendar</button>
              </div>
            </div>

            {message && <p className="font-outfit mt-4 rounded-xl bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{message}</p>}

            {view === 'calendar' ? (
              <div className="mt-6 grid gap-3 md:grid-cols-7">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="font-satoshi text-center text-sm font-semibold text-cyan-100">{day}</div>
                ))}
                {calendarDays.map((day, index) => {
                  const dayTasks = day ? filteredTasks.filter((task) => new Date(task.deadline).toDateString() === day.toDateString()) : []
                  return (
                    <div key={index} className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/30 p-2">
                      {day && (
                        <>
                          <p className="font-satoshi text-sm font-semibold">{day.getDate()}</p>
                          <div className="mt-2 space-y-1">
                            {dayTasks.slice(0, 3).map((task) => (
                              <p key={task._id} className="font-outfit truncate rounded bg-white/5 px-2 py-1 text-[11px]">{task.title}</p>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    now={now}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onOpen={(selected) => navigate(`/tasks/${selected._id}`)}
                  />
                ))}
                {!filteredTasks.length && <div className="font-outfit rounded-2xl border border-dashed border-white/10 p-8 text-slate-200">No tasks yet. Create your first task to get started.</div>}
              </div>
            )}
          </div>
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-5">
            <h2 className="font-satoshi text-xl font-semibold">Create a new task</h2>
            <p className="font-outfit mt-1 text-xs text-slate-200">Add the details and set the deadline to start tracking it.</p>
            <div className="mt-3">
              <TaskForm
                onSubmit={handleCreate}
                submitLabel="Create task"
                onCancel={() => setShowCreate(false)}
              />
            </div>
          </motion.div>
        </div>
      )}

      {alarmOpen && alarmTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-2xl border border-rose-400/40 bg-slate-950 p-5">
            <p className="font-outfit text-xs text-rose-200">Deadline reached</p>
            <h2 className="font-satoshi mt-1 text-xl font-semibold">{alarmTask.title}</h2>
            <p className="font-outfit mt-2 text-xs text-slate-200">This task is now overdue. Open it to review, update, or complete it.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setAlarmOpen(false); navigate(`/tasks/${alarmTask._id}`) }} className="font-satoshi rounded-full bg-rose-500 px-3 py-1.5 text-sm font-semibold text-white">View task</button>
              <button onClick={() => setAlarmOpen(false)} className="font-outfit rounded-full border border-white/10 px-3 py-1.5 text-sm">Dismiss</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
