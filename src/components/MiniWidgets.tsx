import { useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { useI18n } from '../i18n/useI18n'

type Widget = 'calendar' | 'calculator' | 'countdown' | 'progress'
type Operator = '+' | '−' | '×' | '÷'

const copy = {
  zh: {
    widgets: '小组件',
    calendar: '日历',
    calculator: '计算器',
    countdown: '倒计时',
    progress: '今日进度',
    today: '今天',
    start: '开始',
    pause: '暂停',
    resume: '继续',
    reset: '重置',
    done: '时间到！',
    elapsed: '今天已过去',
    remaining: '距离今天结束',
    year: '今年已过去',
    close: '关闭小组件',
  },
  en: {
    widgets: 'Widgets',
    calendar: 'Calendar',
    calculator: 'Calculator',
    countdown: 'Countdown',
    progress: 'Day progress',
    today: 'Today',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    done: 'Time is up!',
    elapsed: 'Day elapsed',
    remaining: 'Until tomorrow',
    year: 'Year elapsed',
    close: 'Close widget',
  },
} as const

const widgetMeta: Record<Widget, { icon: string; color: string }> = {
  calendar: { icon: 'mdi:calendar-month-outline', color: 'text-sky-300' },
  calculator: {
    icon: 'mdi:calculator-variant-outline',
    color: 'text-violet-300',
  },
  countdown: { icon: 'mdi:timer-sand', color: 'text-amber-300' },
  progress: { icon: 'mdi:chart-donut', color: 'text-emerald-300' },
}

function CalendarWidget({ language }: { language: 'zh' | 'en' }) {
  const today = new Date()
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const days = new Date(year, month + 1, 0).getDate()
  const start = new Date(year, month, 1).getDay()
  const weekday =
    language === 'zh'
      ? ['日', '一', '二', '三', '四', '五', '六']
      : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const title = cursor.toLocaleDateString(
    language === 'zh' ? 'zh-CN' : 'en-US',
    { month: 'long', year: 'numeric' }
  )

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          className="widget-icon-button"
        >
          <Icon icon="mdi:chevron-left" width="20" />
        </button>
        <button
          onClick={() =>
            setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
          }
          className="text-sm font-medium text-white/90 hover:text-white"
        >
          {title}
        </button>
        <button
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          className="widget-icon-button"
        >
          <Icon icon="mdi:chevron-right" width="20" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {weekday.map((day) => (
          <span key={day} className="pb-2 text-[11px] text-white/35">
            {day}
          </span>
        ))}
        {Array.from({ length: start }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
          return (
            <span
              key={day}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs ${isToday ? 'bg-primary font-semibold text-white shadow-lg shadow-primary/30' : 'text-white/75 hover:bg-white/10'}`}
            >
              {day}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function CalculatorWidget() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [replace, setReplace] = useState(true)

  const calculate = (left: number, right: number, op: Operator) => {
    if (op === '+') return left + right
    if (op === '−') return left - right
    if (op === '×') return left * right
    return right === 0 ? 0 : left / right
  }

  const inputDigit = (digit: string) => {
    setDisplay((value) =>
      replace ? digit : value === '0' ? digit : `${value}${digit}`
    )
    setReplace(false)
  }

  const chooseOperator = (next: Operator) => {
    const current = Number(display)
    if (stored !== null && operator && !replace) {
      const result = calculate(stored, current, operator)
      setStored(result)
      setDisplay(String(Number(result.toFixed(10))))
    } else setStored(current)
    setOperator(next)
    setReplace(true)
  }

  const equals = () => {
    if (stored === null || !operator) return
    const result = calculate(stored, Number(display), operator)
    setDisplay(String(Number(result.toFixed(10))))
    setStored(null)
    setOperator(null)
    setReplace(true)
  }

  const keys = [
    'C',
    '±',
    '%',
    '÷',
    '7',
    '8',
    '9',
    '×',
    '4',
    '5',
    '6',
    '−',
    '1',
    '2',
    '3',
    '+',
    '0',
    '.',
    '=',
  ]
  const press = (key: string) => {
    if (/^\d$/.test(key)) return inputDigit(key)
    if (['+', '−', '×', '÷'].includes(key))
      return chooseOperator(key as Operator)
    if (key === '=') return equals()
    if (key === 'C') {
      setDisplay('0')
      setStored(null)
      setOperator(null)
      setReplace(true)
      return
    }
    if (key === '±') {
      setDisplay((value) => String(Number(value) * -1))
      return
    }
    if (key === '%') {
      setDisplay((value) => String(Number(value) / 100))
      return
    }
    if (key === '.' && !display.includes('.')) {
      setDisplay((value) => (replace ? '0.' : `${value}.`))
      setReplace(false)
    }
  }

  return (
    <div>
      <div className="mb-3 overflow-hidden rounded-xl bg-black/20 px-4 py-3 text-right">
        <p className="h-4 text-xs text-white/30">
          {stored !== null && operator ? `${stored} ${operator}` : ''}
        </p>
        <p className="truncate text-3xl font-light tabular-nums text-white">
          {display}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => press(key)}
            className={`h-10 rounded-xl text-sm transition active:scale-95 ${key === '0' ? 'col-span-2' : ''} ${['+', '−', '×', '÷', '='].includes(key) ? 'bg-primary/90 font-medium text-white hover:bg-primary' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

function CountdownWidget({ t }: { t: typeof copy.zh | typeof copy.en }) {
  const [initial, setInitial] = useState(5 * 60)
  const [seconds, setSeconds] = useState(initial)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(
      () =>
        setSeconds((value) => {
          if (value <= 1) {
            setRunning(false)
            return 0
          }
          return value - 1
        }),
      1000
    )
    return () => window.clearInterval(timer)
  }, [running])

  const choose = (minutes: number) => {
    const value = minutes * 60
    setInitial(value)
    setSeconds(value)
    setRunning(false)
  }
  const time = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
  const progress = initial ? ((initial - seconds) / initial) * 100 : 0

  return (
    <div className="text-center">
      <div className="mb-5 flex justify-center gap-2">
        {[5, 10, 30].map((value) => (
          <button
            key={value}
            onClick={() => choose(value)}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${initial === value * 60 ? 'bg-white/15 text-white' : 'text-white/40 hover:bg-white/10'}`}
          >
            {value} min
          </button>
        ))}
      </div>
      <div
        className="mx-auto flex h-36 w-36 items-center justify-center rounded-full p-1"
        style={{
          background: `conic-gradient(#F97D1C ${progress}%, rgba(255,255,255,.08) 0)`,
        }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900/95 text-4xl font-light tabular-nums text-white">
          {time}
        </div>
      </div>
      {seconds === 0 && <p className="mt-3 text-sm text-amber-300">{t.done}</p>}
      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={() =>
            seconds === 0
              ? (setSeconds(initial), setRunning(true))
              : setRunning((value) => !value)
          }
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
        >
          {running ? t.pause : seconds === initial ? t.start : t.resume}
        </button>
        {seconds !== initial && (
          <button
            onClick={() => {
              setSeconds(initial)
              setRunning(false)
            }}
            className="rounded-xl bg-white/10 px-4 text-sm text-white/60 hover:bg-white/15"
          >
            {t.reset}
          </button>
        )}
      </div>
    </div>
  )
}

function ProgressWidget({
  t,
  language,
}: {
  t: typeof copy.zh | typeof copy.en
  language: 'zh' | 'en'
}) {
  const now = new Date()
  const dayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime()
  const dayPercent = ((now.getTime() - dayStart) / 86400000) * 100
  const yearStart = new Date(now.getFullYear(), 0, 1).getTime()
  const nextYear = new Date(now.getFullYear() + 1, 0, 1).getTime()
  const yearPercent =
    ((now.getTime() - yearStart) / (nextYear - yearStart)) * 100
  const remainingMs = dayStart + 86400000 - now.getTime()
  const hours = Math.floor(remainingMs / 3600000)
  const minutes = Math.floor((remainingMs % 3600000) / 60000)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white/5 p-4 text-center">
        <p className="text-xs text-white/40">{t.today}</p>
        <p className="mt-1 text-lg font-medium text-white">
          {now.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-xs text-white/50">
          <span>{t.elapsed}</span>
          <span>{dayPercent.toFixed(1)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-amber-300"
            style={{ width: `${dayPercent}%` }}
          />
        </div>
      </div>
      <div>
        <div className="mb-2 flex justify-between text-xs text-white/50">
          <span>{t.year}</span>
          <span>{yearPercent.toFixed(1)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-300"
            style={{ width: `${yearPercent}%` }}
          />
        </div>
      </div>
      <p className="text-center text-sm text-white/50">
        {t.remaining}{' '}
        <span className="font-medium tabular-nums text-white/90">
          {hours}h {minutes}m
        </span>
      </p>
    </div>
  )
}

function MiniWidgets() {
  const { language } = useI18n()
  const t = copy[language]
  const [active, setActive] = useState<Widget | null>(null)
  const labels = useMemo<Record<Widget, string>>(
    () => ({
      calendar: t.calendar,
      calculator: t.calculator,
      countdown: t.countdown,
      progress: t.progress,
    }),
    [t]
  )

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <div className="fixed left-4 top-4 z-30 select-none">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/10 p-1.5 shadow-lg backdrop-blur-md">
        {(Object.keys(widgetMeta) as Widget[]).map((widget) => (
          <button
            key={widget}
            onClick={() =>
              setActive((value) => (value === widget ? null : widget))
            }
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${active === widget ? 'bg-white/20 text-white' : `${widgetMeta[widget].color} hover:bg-white/10`}`}
            title={labels[widget]}
          >
            <Icon icon={widgetMeta[widget].icon} width="19" height="19" />
          </button>
        ))}
      </div>
      {active && (
        <section className="mt-3 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-2xl">
          <header className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                icon={widgetMeta[active].icon}
                width="19"
                className={widgetMeta[active].color}
              />
              <h2 className="text-sm font-medium text-white">
                {labels[active]}
              </h2>
            </div>
            <button
              onClick={() => setActive(null)}
              className="widget-icon-button"
              aria-label={t.close}
            >
              <Icon icon="mdi:close" width="18" />
            </button>
          </header>
          {active === 'calendar' && <CalendarWidget language={language} />}
          {active === 'calculator' && <CalculatorWidget />}
          {active === 'countdown' && <CountdownWidget t={t} />}
          {active === 'progress' && (
            <ProgressWidget t={t} language={language} />
          )}
        </section>
      )}
    </div>
  )
}

export default MiniWidgets
