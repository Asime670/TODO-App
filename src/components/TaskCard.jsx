import { motion } from 'framer-motion'

function formatCountdown(ms) {
  if (ms <= 0) {
    return 'Overdue'
  }

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

export default function TaskCard({ task, now, onToggle, onDelete, onOpen }) {
  const deadline = new Date(task.deadline)
  const remaining = deadline.getTime() - now
  const overdue = remaining <= 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-200' : task.priority === 'medium' ? 'bg-amber-500/20 text-amber-100' : 'bg-emerald-500/20 text-emerald-100'}`}>
              {task.priority}
            </span>
            <span className="rounded-full bg-slate-900/50 px-2 py-1 text-[10px] font-semibold text-slate-100">
              {task.category}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{task.title}</h3>
          <p className="mt-2 text-sm text-slate-200">{task.description || 'No description provided.'}</p>
        </div>
        <button
          onClick={() => onToggle(task)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${task.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-white'}`}
        >
          {task.completed ? 'Completed' : 'Mark done'}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div>
          <p className="text-slate-300">Deadline</p>
          <p className="font-semibold">{deadline.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-slate-300">Countdown</p>
          <p className={`font-semibold ${overdue ? 'text-rose-300' : 'text-cyan-200'}`}>{formatCountdown(remaining)}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={() => onOpen(task)} className="rounded-xl bg-white/10 px-3 py-2 text-sm">Open</button>
        <button onClick={() => onDelete(task)} className="rounded-xl bg-rose-500/80 px-3 py-2 text-sm text-white">Delete</button>
      </div>
    </motion.article>
  )
}
