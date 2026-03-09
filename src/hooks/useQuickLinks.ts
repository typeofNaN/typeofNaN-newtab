import { useState, useCallback, useEffect, useRef } from 'react'
import { getStorage, setStorage } from '../utils/storage'
import type { QuickLink } from '../types'

const QUICK_LINKS_KEY = 'quick_links'

const defaultLinks: QuickLink[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com' },
  { id: '2', title: 'GitHub', url: 'https://github.com' },
  { id: '3', title: '知乎', url: 'https://www.zhihu.com' },
  { id: '4', title: 'B站', url: 'https://www.bilibili.com' },
  { id: '5', title: '微博', url: 'https://weibo.com' },
  { id: '6', title: '豆瓣', url: 'https://www.douban.com' },
  { id: '7', title: '淘宝', url: 'https://www.taobao.com' },
]

export function useQuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false)

  useEffect(() => {
    getStorage<QuickLink[]>(QUICK_LINKS_KEY).then((saved) => {
      if (saved && saved.length > 0) {
        setLinks(saved)
      } else {
        setLinks(defaultLinks)
        setStorage(QUICK_LINKS_KEY, defaultLinks)
      }
      setLoading(false)
      initializedRef.current = true
    })
  }, [])

  useEffect(() => {
    if (initializedRef.current && links.length > 0) {
      setStorage(QUICK_LINKS_KEY, links)
    }
  }, [links])

  const addLink = useCallback((link: Omit<QuickLink, 'id'>) => {
    const newLink: QuickLink = {
      ...link,
      id: Date.now().toString(),
    }
    setLinks((prev) => [...prev, newLink])
  }, [])

  const updateLink = useCallback((id: string, updates: Partial<QuickLink>) => {
    setLinks((prev) =>
      prev.map((link) => (link.id === id ? { ...link, ...updates } : link))
    )
  }, [])

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id))
  }, [])

  const reorderLinks = useCallback((fromIndex: number, toIndex: number) => {
    setLinks((prev) => {
      const newLinks = [...prev]
      const [removed] = newLinks.splice(fromIndex, 1)
      newLinks.splice(toIndex, 0, removed)
      return newLinks
    })
  }, [])

  return {
    links,
    loading,
    addLink,
    updateLink,
    removeLink,
    reorderLinks,
    setLinks,
  }
}
