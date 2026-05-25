const STORAGE_KEY = 'taskflow-tasks'

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getSeedTasks() {
  const anchor = new Date()
  const day = 24 * 60 * 60 * 1000

  return [
    {
      _id: createId(),
      title: 'Ship the sprint review deck',
      description: 'Finish the summary and align the rollout plan with product.',
      priority: 'high',
      category: 'Work',
      deadline: new Date(anchor.getTime() + 1.5 * day).toISOString(),
      completed: false
    },
    {
      _id: createId(),
      title: 'Plan the weekly focus block',
      description: 'Block an uninterrupted hour for the top three priorities.',
      priority: 'medium',
      category: 'Personal',
      deadline: new Date(anchor.getTime() + 2.5 * day).toISOString(),
      completed: false
    },
    {
      _id: createId(),
      title: 'Review onboarding notes',
      description: 'Update the welcome doc and confirm the first-run checklist.',
      priority: 'low',
      category: 'Ops',
      deadline: new Date(anchor.getTime() + 4 * day).toISOString(),
      completed: true
    }
  ]
}

function readState() {
  if (typeof window === 'undefined') {
    return { tasks: getSeedTasks() }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return { tasks: getSeedTasks() }
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed?.tasks)) {
      return { tasks: getSeedTasks() }
    }

    return parsed
  } catch {
    return { tasks: getSeedTasks() }
  }
}

function writeState(nextState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
}

export function getTasks() {
  return readState().tasks
}

export function saveTasks(tasks) {
  const nextState = { tasks }
  writeState(nextState)
  return tasks
}

export function addTask(payload) {
  const task = {
    _id: createId(),
    title: payload.title,
    description: payload.description || '',
    priority: payload.priority || 'medium',
    category: payload.category || 'Personal',
    deadline: payload.deadline,
    completed: false
  }

  const tasks = [task, ...getTasks()]
  saveTasks(tasks)
  return task
}

export function updateStoredTask(taskId, updates) {
  const tasks = getTasks()
  const updatedTasks = tasks.map((task) => task._id === taskId ? { ...task, ...updates } : task)
  saveTasks(updatedTasks)
  return updatedTasks.find((task) => task._id === taskId)
}

export function deleteStoredTask(taskId) {
  const tasks = getTasks().filter((task) => task._id !== taskId)
  saveTasks(tasks)
}

export function getStoredTask(taskId) {
  return getTasks().find((task) => task._id === taskId) || null
}
