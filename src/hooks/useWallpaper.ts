import { useState, useCallback, useEffect } from 'react'
import { getStorage, setStorage } from '../utils/storage'

const WALLPAPER_KEY = 'wallpaper_url'

function generatePicsumUrl(): string {
  const id = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/id/${id}/1920/1080`
}

export function useWallpaper() {
  const [wallpaper, setWallpaper] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStorage<string>(WALLPAPER_KEY).then((saved) => {
      if (saved) {
        setWallpaper(saved)
      } else {
        const url = generatePicsumUrl()
        setWallpaper(url)
        setStorage(WALLPAPER_KEY, url)
      }
      setLoading(false)
    })
  }, [])

  const changeWallpaper = useCallback(async () => {
    setLoading(true)
    const newUrl = generatePicsumUrl()
    setWallpaper(newUrl)
    await setStorage(WALLPAPER_KEY, newUrl)
    setLoading(false)
  }, [])

  return { wallpaper, loading, changeWallpaper }
}
