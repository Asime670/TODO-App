import { useEffect, useState } from 'react'

function formatForInput(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

const initialState = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'Personal',
  deadline: ''
}

function getFormState(initialData = {}) {
  return {
    ...initialState,
    ...initialData,
    deadline: formatForInput(initialData?.deadline)
  }
}

export default function TaskForm({ initialData = null, onSubmit, submitLabel = 'Create Task', onCancel }) {
  const [form, setForm] = useState(() => getFormState(initialData))

  useEffect(() => {
    setForm(getFormState(initialData))
  }, [
    initialData?.title,
    initialData?.description,

    initialData?.task_date,
    initialData?.task_time,
  ])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-satoshi block text-sm font-semibold mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="font-outfit w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="font-satoshi block text-sm font-semibold mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          rows={4}
          className="font-outfit w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 


        <div>
          <label className="font-satoshi block text-sm font-semibold mb-1">Date</label>
          <input
            required
            type="date"
            value={form.task_date}
            onChange={(event) => setForm({ ...form, task_date: event.target.value })}
            className="font-outfit w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="font-satoshi block text-sm font-semibold mb-1">Time</label>
          <input
            required
            type="time"
            value={form.task_time}
            onChange={(event) => setForm({ ...form, task_time: event.target.value })}
            className="font-outfit w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="font-outfit rounded-xl border border-white/10 px-4 py-2 text-sm">
            Cancel
          </button>
        )}
        <button type="submit" className="font-satoshi rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
