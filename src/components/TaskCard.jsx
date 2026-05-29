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
      className="rounded-xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-200' : task.priority === 'medium' ? 'bg-amber-500/20 text-amber-100' : 'bg-emerald-500/20 text-emerald-100'}`}>
              {task.priority}
            </span>
            <span className="rounded-full bg-slate-900/50 px-2 py-0.5 text-[9px] font-semibold text-slate-100">
              {task.category}
            </span>
          </div>
          <h3 className="mt-2 text-sm font-semibold line-clamp-2">{task.title}</h3>
          <p className="mt-1 text-xs text-slate-200 line-clamp-2">{task.description || 'No description provided.'}</p>
        </div>
        <button
          onClick={() => onToggle(task)}
          className={`rounded-full px-2 py-1 text-xs font-semibold shrink-0 ${task.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-white'}`}
        >
          {task.completed ? 'Done' : 'Todo'}
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-2 text-xs">
        <div>
          <p className="text-slate-400">Deadline</p>
          <p className="font-semibold text-xs">{deadline.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div>
          <p className="text-slate-400">Countdown</p>
          <p className={`font-semibold text-xs ${overdue ? 'text-rose-300' : 'text-cyan-200'}`}>{formatCountdown(remaining)}</p>
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <button onClick={() => onOpen(task)} className="rounded-lg bg-white/10 px-2 py-1 text-xs">Open</button>
        <button onClick={() => onDelete(task)} className="rounded-lg bg-rose-500/80 px-2 py-1 text-xs text-white">Delete</button>
      </div>
    </motion.article>
  )
}
