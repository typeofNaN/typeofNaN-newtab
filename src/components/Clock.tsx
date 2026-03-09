import { useState, useEffect } from 'react'
import { useSettingsContext } from '../context/SettingsContext'

function Clock() {
  const [time, setTime] = useState(() => new Date())
  const { settings } = useSettingsContext()

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

  return (
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
  )
}

export default Clock
