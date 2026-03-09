import { useState } from 'react'
import type { QuickLink } from '../types'

function getFaviconUrl(url: string): string {
  try {
    const { hostname } = new URL(url)
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
  size?: 'sm' | 'md' | 'lg'
}

export function LinkIcon({ link, size = 'md' }: LinkIconProps) {
  const faviconUrl = link.icon || getFaviconUrl(link.url)
  const initial = getInitial(link.title)
  const bgColor = generateColor(link.title)
  const [error, setError] = useState(false)

  const sizeClasses: Record<
    'sm' | 'md' | 'lg',
    { wrapper: string; inner: string }
  > = {
    sm: { wrapper: 'h-9 w-9', inner: 'h-6 w-6 text-lg' },
    md: { wrapper: 'h-12 w-12', inner: 'h-8 w-8 text-xl' },
    lg: { wrapper: 'h-14 w-14', inner: 'h-10 w-10 text-2xl' },
  }

  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ${sizeClasses[size].wrapper}`}
    >
      {faviconUrl && !error ? (
        <img
          src={faviconUrl}
          alt={link.title}
          className={`${sizeClasses[size].inner} rounded object-contain`}
          onError={() => setError(true)}
        />
      ) : (
        <span
          className={`${bgColor} flex ${sizeClasses[size].inner} items-center justify-center rounded font-medium text-white`}
        >
          {initial}
        </span>
      )}
    </div>
  )
}
