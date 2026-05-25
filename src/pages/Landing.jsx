import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Smart reminders',
    body: 'Trigger calm nudges and due-soon alerts before tasks slip past your deadline.',
    icon: '⏱'
  },
  {
    title: 'Live focus board',
    body: 'Track progress, search priorities, and switch between board and calendar views instantly.',
    icon: '◎'
  },
  {
    title: 'Glass-mode calm',
    body: 'A low-noise dashboard with a dark and light palette that keeps every detail readable.',
    icon: '✦'
  }
]

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay }
})

export default function Landing() {
  return (
    <div className="min-h-screen px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <nav className="sticky top-4 z-30 mx-auto max-w-6xl">
        <div className="glass-card flex flex-wrap items-center justify-between gap-4 rounded-full px-4 py-3 sm:px-5">
          <div>
            <p
              className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--accent)]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              TaskFlow
            </p>
            <p className="text-sm text-[var(--muted)]">Plan clearly. Ship confidently.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost rounded-full px-4 py-2 text-sm">
              Login
            </Link>
            <Link to="/register" className="btn-primary rounded-full px-4 py-2 text-sm font-semibold text-[#031017]">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 pb-8 pt-6 sm:pt-8">
        <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-sm text-[var(--fg)]"
            >
              <span className="pulse-dot" />
              Task management for fast-moving teams
            </motion.div>

            <motion.h1
              {...fadeUp(0.12)}
              className="mt-5 text-[clamp(2.8rem,5vw,4.3rem)] leading-[0.95]"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800 }}
            >
              Organize work with <span className="text-[var(--accent)]">clarity</span>.
            </motion.h1>

            <motion.p
              {...fadeUp(0.24)}
              className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg"
              style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}
            >
              TaskFlow gives you a calm space to capture priorities, keep deadlines visible, and move your projects from planning to completion without the noise.
            </motion.p>

            <motion.div {...fadeUp(0.36)} className="mt-6 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary rounded-full px-5 py-3 text-sm font-semibold text-[#031017]">
                Create account
              </Link>
              <Link to="/login" className="btn-ghost rounded-full px-5 py-3 text-sm font-semibold">
                View dashboard
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.48)} className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['24/7', 'Always-on focus'],
                ['3 views', 'Board, calendar, detail'],
                ['Instant sync', 'Local workspace updates']
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3">
                  <p className="text-base font-semibold text-[var(--fg)]">{title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.18)} className="glass-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Live snapshot</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--fg)]">This week at a glance</h2>
              </div>
              <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-xs text-[var(--accent)]">
                Live
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[var(--glass-border)] bg-[rgba(8,15,22,0.4)] px-4 py-4">
                <p className="text-sm text-[var(--muted)]">Total tasks</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--fg)]">24</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Across 3 priorities</p>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--glass-border)] bg-[rgba(8,15,22,0.4)] px-4 py-4">
                <p className="text-sm text-[var(--muted)]">Due soon</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--fg)]">5</p>
                <p className="mt-2 text-sm text-[var(--muted)]">Ready for action today</p>
              </div>
            </div>

            <div className="mt-4 rounded-[1.6rem] border border-[var(--glass-border)] bg-[rgba(6,12,17,0.65)] p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="text-[var(--muted)]">Completion</p>
                  <p className="mt-1 font-semibold text-[var(--fg)]">72% of this week is covered</p>
                </div>
                <span className="rounded-full bg-[rgba(0,229,200,0.12)] px-3 py-1 text-xs text-[var(--accent)]">+12%</span>
              </div>

              <div className="progress-track mt-4">
                <div className="progress-fill" />
                <span className="progress-tip" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.2rem] border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                <div>
                  <p className="text-sm text-[var(--muted)]">Upcoming task</p>
                  <p className="mt-1 font-semibold text-[var(--fg)]">Finalize demo launch checklist</p>
                </div>
                <span className="text-sm font-semibold text-[var(--accent)]">18m left</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-4">
          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                {...fadeUp(0.6 + index * 0.12)}
                className="feature-card"
              >
                <div className="feature-icon">{feature.icon}</div>
                <h2 className="mt-4 text-lg font-semibold text-[var(--fg)]">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{feature.body}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
