import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  { title: 'Smart reminders', body: 'Automated email reminders fire 30 minutes before each deadline.' },
  { title: 'Live countdowns', body: 'Every task shows a real-time countdown and overdue status.' },
  { title: 'Calm focus mode', body: 'Dark/light themes and glassmorphism cards keep the dashboard polished.' }
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.18),transparent_20%)] px-6 py-10 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-lg font-semibold">TaskFlow</p>
            <p className="text-sm text-slate-200">Build momentum, never miss a deadline.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm">Login</Link>
            <Link to="/register" className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Get started</Link>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div>
            <p className="mb-3 inline-flex rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-sm">Task Management System</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Plan boldly, prioritize faster, and finish every task on time.</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-200 md:text-lg">
              TaskFlow gives you secure auth, live task tracking, smart notification emails, and an elegant dashboard that keeps your day in motion.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/register" className="rounded-full bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Create account</Link>
              <Link to="/dashboard" className="rounded-full border border-white/10 px-5 py-3 font-semibold">Open dashboard</Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-200">Total tasks</p>
                <p className="mt-2 text-3xl font-bold">24</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-sm text-slate-200">Due soon</p>
                <p className="mt-2 text-3xl font-bold">5</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4 sm:col-span-2">
                <p className="text-sm text-slate-200">Progress</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/8 p-5 backdrop-blur"
            >
              <h2 className="text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-200">{feature.body}</p>
            </motion.article>
          ))}
        </section>
      </div>
    </div>
  )
}
