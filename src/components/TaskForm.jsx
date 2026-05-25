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
    initialData?.priority,
    initialData?.category,
    initialData?.deadline
  ])

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          required
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1">Priority</label>
          <select
            value={form.priority}
            onChange={(event) => setForm({ ...form, priority: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <input
            required
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Deadline</label>
          <input
            required
            type="datetime-local"
            value={form.deadline}
            onChange={(event) => setForm({ ...form, deadline: event.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-xl border border-white/10 px-4 py-2 text-sm">
            Cancel
          </button>
        )}
        <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
