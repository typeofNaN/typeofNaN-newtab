import { useState, useEffect } from 'react'
import { useI18n } from '../i18n/useI18n'

export function useGreeting(): string {
  const [greeting, setGreeting] = useState('')
  const { t } = useI18n()

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) {
        setGreeting(t.greeting.morning)
      } else if (hour >= 12 && hour < 14) {
        setGreeting(t.greeting.noon)
      } else if (hour >= 14 && hour < 18) {
        setGreeting(t.greeting.afternoon)
      } else if (hour >= 18 && hour < 22) {
        setGreeting(t.greeting.evening)
      } else {
        setGreeting(t.greeting.night)
      }
    }

    updateGreeting()
    const timer = setInterval(updateGreeting, 60000)
    return () => clearInterval(timer)
  }, [t])

  return greeting
}
