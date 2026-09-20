import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { useI18n } from '../i18n/useI18n'
import { getStorage, setStorage } from '../utils/storage'

type Tab = 'tasks' | 'focus' | 'notes'

interface Task {
  id: string
  title: string
  done: boolean
}

interface ProductivityData {
  tasks: Task[]
  notes: string
}

const STORAGE_KEY = 'productivity-data'
const FOCUS_SECONDS = 25 * 60

const copy = {
  zh: {
    title: '效率工具',
    subtitle: '今天也做一点有意义的事',
    tasks: '待办',
    focus: '专注',
    notes: '随手记',
    addTask: '添加一项待办…',
    add: '添加',
    empty: '还没有待办，写下第一件事吧',
    clear: '清除已完成',
    remaining: '项未完成',
    focusHint: '一次只做一件事',
    start: '开始专注',
    pause: '暂停',
    resume: '继续',
    reset: '重置',
    complete: '本轮专注完成，休息一下吧',
    notePlaceholder: '临时想法、电话号码、稍后要处理的内容…',
    saved: '已自动保存在本地',
    close: '关闭效率工具',
    open: '效率工具',
  },
  en: {
    title: 'Productivity',
    subtitle: 'Make a little progress today',
    tasks: 'Tasks',
    focus: 'Focus',
    notes: 'Notes',
    addTask: 'Add a task…',
    add: 'Add',
    empty: 'No tasks yet. Add the first one.',
    clear: 'Clear completed',
    remaining: 'remaining',
    focusHint: 'One thing at a time',
    start: 'Start focus',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    complete: 'Focus session complete. Take a break!',
    notePlaceholder: 'Quick thoughts, phone numbers, things to handle later…',
    saved: 'Saved locally automatically',
    close: 'Close productivity tools',
    open: 'Productivity tools',
  },
} as const

function ProductivityPanel() {
  const { language } = useI18n()
  const t = copy[language]
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [seconds, setSeconds] = useState(FOCUS_SECONDS)
  const [running, setRunning] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getStorage<ProductivityData>(STORAGE_KEY).then((saved) => {
      if (saved) {
        setTasks(saved.tasks ?? [])
        setNotes(saved.notes ?? '')
      }
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!loaded) return
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => {
      setStorage<ProductivityData>(STORAGE_KEY, { tasks, notes })
    }, 400)
    return () => {
      if (noteTimer.current) clearTimeout(noteTimer.current)
    }
  }, [notes, loaded, tasks])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false)
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running])

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  const remaining = useMemo(
    () => tasks.filter((task) => !task.done).length,
    [tasks]
  )
  const progress = ((FOCUS_SECONDS - seconds) / FOCUS_SECONDS) * 100
  const time = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`

  const addTask = (event: FormEvent) => {
    event.preventDefault()
    const title = taskTitle.trim()
    if (!title) return
    setTasks((value) => [
      ...value,
      { id: crypto.randomUUID(), title, done: false },
    ])
    setTaskTitle('')
  }

  const resetTimer = () => {
    setRunning(false)
    setSeconds(FOCUS_SECONDS)
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'tasks', label: t.tasks, icon: 'mdi:checkbox-marked-circle-outline' },
    { id: 'focus', label: t.focus, icon: 'mdi:timer-outline' },
    { id: 'notes', label: t.notes, icon: 'mdi:notebook-outline' },
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group absolute bottom-4 left-4 z-30 flex h-11 items-center gap-2 rounded-full bg-white/10 px-3 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
        title={t.open}
      >
        <Icon
          icon="mdi:checkbox-marked-circle-outline"
          width="22"
          height="22"
        />
        {remaining > 0 && (
          <span className="text-xs font-medium tabular-nums">{remaining}</span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[380px] max-w-full flex-col border-r border-white/10 bg-slate-950/90 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!open}
      >
        <header className="flex items-start justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-white">{t.title}</h2>
            <p className="mt-1 text-sm text-white/45">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label={t.close}
          >
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </header>

        <nav className="mx-5 mt-5 grid grid-cols-3 rounded-xl bg-white/5 p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm transition ${tab === item.id ? 'bg-white/15 text-white shadow-sm' : 'text-white/45 hover:text-white/80'}`}
            >
              <Icon icon={item.icon} width="17" height="17" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'tasks' && (
            <div className="space-y-4">
              <form onSubmit={addTask} className="flex gap-2">
                <input
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder={t.addTask}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/70"
                />
                <button
                  disabled={!taskTitle.trim()}
                  className="rounded-xl bg-primary px-4 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-40"
                >
                  {t.add}
                </button>
              </form>
              <div className="space-y-2">
                {tasks.length === 0 && (
                  <div className="py-16 text-center">
                    <Icon
                      icon="mdi:clipboard-text-outline"
                      width="38"
                      height="38"
                      className="mx-auto mb-3 text-white/20"
                    />
                    <p className="text-sm text-white/35">{t.empty}</p>
                  </div>
                )}
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3 transition hover:bg-white/10"
                  >
                    <button
                      onClick={() =>
                        setTasks((value) =>
                          value.map((item) =>
                            item.id === task.id
                              ? { ...item, done: !item.done }
                              : item
                          )
                        )
                      }
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${task.done ? 'border-primary bg-primary text-white' : 'border-white/30 text-transparent hover:border-white/60'}`}
                    >
                      <Icon icon="mdi:check" width="14" height="14" />
                    </button>
                    <span
                      className={`min-w-0 flex-1 break-words text-sm ${task.done ? 'text-white/30 line-through' : 'text-white/85'}`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() =>
                        setTasks((value) =>
                          value.filter((item) => item.id !== task.id)
                        )
                      }
                      className="p-1 text-white/20 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                      aria-label="Delete"
                    >
                      <Icon icon="mdi:delete-outline" width="17" height="17" />
                    </button>
                  </div>
                ))}
              </div>
              {tasks.length > 0 && (
                <div className="flex items-center justify-between pt-2 text-xs text-white/35">
                  <span>
                    {remaining} {t.remaining}
                  </span>
                  {tasks.some((task) => task.done) && (
                    <button
                      onClick={() =>
                        setTasks((value) => value.filter((task) => !task.done))
                      }
                      className="hover:text-white/70"
                    >
                      {t.clear}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'focus' && (
            <div className="flex flex-col items-center pt-10 text-center">
              <div
                className="relative flex h-52 w-52 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#F97D1C ${progress}%, rgba(255,255,255,.08) 0)`,
                }}
              >
                <div className="absolute inset-[7px] rounded-full bg-slate-950/95" />
                <div className="relative">
                  <p className="text-5xl font-light tabular-nums text-white">
                    {time}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/35">
                    {t.focusHint}
                  </p>
                </div>
              </div>
              {seconds === 0 && (
                <p className="mt-6 text-sm text-primary-300">{t.complete}</p>
              )}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() =>
                    seconds === 0 ? resetTimer() : setRunning((value) => !value)
                  }
                  className="flex min-w-32 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-600"
                >
                  <Icon
                    icon={running ? 'mdi:pause' : 'mdi:play'}
                    width="18"
                    height="18"
                  />
                  {seconds === FOCUS_SECONDS
                    ? t.start
                    : running
                      ? t.pause
                      : seconds === 0
                        ? t.reset
                        : t.resume}
                </button>
                {seconds !== FOCUS_SECONDS && seconds !== 0 && (
                  <button
                    onClick={resetTimer}
                    className="rounded-xl bg-white/10 px-4 text-sm text-white/60 transition hover:bg-white/15 hover:text-white"
                  >
                    {t.reset}
                  </button>
                )}
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div className="flex h-full min-h-[420px] flex-col">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notePlaceholder}
                className="min-h-[360px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/85 outline-none placeholder:text-white/25 focus:border-white/20"
              />
              <p className="mt-3 flex items-center gap-1.5 text-xs text-white/30">
                <Icon icon="mdi:check-circle-outline" width="14" height="14" />
                {t.saved}
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default ProductivityPanel
