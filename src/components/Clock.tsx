import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  return (
    <time
      className="font-light text-white drop-shadow-lg"
      style={{ fontSize: 'clamp(4rem, 15vw, 9rem)' }}
    >
      {hours}:{minutes}
    </time>
  )
}

export default Clock
