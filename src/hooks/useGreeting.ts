import { useState, useEffect } from 'react'

export function useGreeting(): string {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      if (hour >= 5 && hour < 12) {
        setGreeting('早上好，新的一天开始了')
      } else if (hour >= 12 && hour < 14) {
        setGreeting('中午好，记得休息一下')
      } else if (hour >= 14 && hour < 18) {
        setGreeting('下午好，继续保持')
      } else if (hour >= 18 && hour < 22) {
        setGreeting('晚上好，放松一下吧')
      } else {
        setGreeting('夜深了，注意休息')
      }
    }

    updateGreeting()
    const timer = setInterval(updateGreeting, 60000)
    return () => clearInterval(timer)
  }, [])

  return greeting
}
