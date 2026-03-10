import { useState, useCallback, useEffect } from 'react'
import { PicsumImage } from 'picsum-image'
import { getStorage, setStorage } from '../utils/storage'

const WALLPAPER_KEY = 'wallpaper_url'

function generatePicsumUrl(): string {
  const id = Math.floor(Math.random() * 1000)
  return PicsumImage.generateUrl({
    id,
    width: 1920,
    height: 1080,
    cache: false,
  })
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
