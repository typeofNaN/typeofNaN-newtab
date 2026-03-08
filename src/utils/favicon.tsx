import { useState } from 'react'
import type { QuickLink } from '../types'

function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url)
    // 使用 Google favicon 服务，更可靠
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch {
    return ''
  }
}

function getInitial(title: string): string {
  return title.charAt(0).toUpperCase()
}

function generateColor(title: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]
  const index = title.charCodeAt(0) % colors.length
  return colors[index]
}

interface LinkIconProps {
  link: QuickLink
}

export function LinkIcon({ link }: LinkIconProps) {
  const faviconUrl = link.icon || getFaviconUrl(link.url)
  const initial = getInitial(link.title)
  const bgColor = generateColor(link.title)
  const [error, setError] = useState(false)

  return (
    <div className="flex aspect-square w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
      {faviconUrl && !error ? (
        <img
          src={faviconUrl}
          alt={link.title}
          className="h-8 w-8 rounded object-contain"
          onError={() => setError(true)}
        />
      ) : (
        <span
          className={`${bgColor} flex h-8 w-8 items-center justify-center rounded text-xl font-medium text-white`}
        >
          {initial}
        </span>
      )}
    </div>
  )
}
