import { useState, useCallback, useEffect } from 'react'
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
  { id: '8', title: '京东', url: 'https://www.jd.com' },
]

export function useQuickLinks() {
  const [links, setLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStorage<QuickLink[]>(QUICK_LINKS_KEY).then((saved) => {
      if (saved && saved.length > 0) {
        setLinks(saved)
      } else {
        setLinks(defaultLinks)
        setStorage(QUICK_LINKS_KEY, defaultLinks)
      }
      setLoading(false)
    })
  }, [])

  const addLink = useCallback(
    async (link: Omit<QuickLink, 'id'>) => {
      const newLink: QuickLink = {
        ...link,
        id: Date.now().toString(),
      }
      const newLinks = [...links, newLink]
      setLinks(newLinks)
      await setStorage(QUICK_LINKS_KEY, newLinks)
    },
    [links]
  )

  const updateLink = useCallback(
    async (id: string, updates: Partial<QuickLink>) => {
      const newLinks = links.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      )
      setLinks(newLinks)
      await setStorage(QUICK_LINKS_KEY, newLinks)
    },
    [links]
  )

  const removeLink = useCallback(
    async (id: string) => {
      const newLinks = links.filter((link) => link.id !== id)
      setLinks(newLinks)
      await setStorage(QUICK_LINKS_KEY, newLinks)
    },
    [links]
  )

  const reorderLinks = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const newLinks = [...links]
      const [removed] = newLinks.splice(fromIndex, 1)
      newLinks.splice(toIndex, 0, removed)
      setLinks(newLinks)
      await setStorage(QUICK_LINKS_KEY, newLinks)
    },
    [links]
  )

  return { links, loading, addLink, updateLink, removeLink, reorderLinks }
}
