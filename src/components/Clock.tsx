import { useState, useEffect } from 'react'
import { useSettingsContext } from '../context/SettingsContext'
import { useI18n } from '../i18n/useI18n'

function Clock() {
  const [time, setTime] = useState(() => new Date())
  const { settings } = useSettingsContext()
  const { language } = useI18n()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  let hours = time.getHours()
  const minutes = time.getMinutes().toString().padStart(2, '0')
  let suffix = ''

  if (settings.timeFormat === '12') {
    suffix = hours >= 12 ? ' PM' : ' AM'
    hours = hours % 12 || 12
  }

  const hoursStr = hours.toString().padStart(2, '0')

  const dateStr = time.toLocaleDateString(
    language === 'zh' ? 'zh-CN' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  return (
    <div className="flex flex-col items-center">
      <time
        className="font-light tabular-nums text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
        style={{
          fontSize: 'clamp(4rem, 15vw, 9rem)',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        {hoursStr}:{minutes}
        {suffix && <span className="text-3xl">{suffix}</span>}
      </time>
      <p
        className="mt-2 font-light text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
        style={{
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        }}
      >
        {dateStr}
      </p>
    </div>
  )
}

export default Clock
