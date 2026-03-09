import { useState, useEffect, useCallback } from 'react'
import { getStorage, setStorage } from '../utils/storage'
import type { Settings } from '../types/settings'
import { defaultSettings } from '../types/settings'

const SETTINGS_KEY = 'settings'

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStorage<Settings>(SETTINGS_KEY).then((saved) => {
      if (saved) {
        setSettingsState({ ...defaultSettings, ...saved })
      }
      setLoading(false)
    })
  }, [])

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettingsState((prev) => {
      const newSettings = { ...prev, ...updates }
      setStorage(SETTINGS_KEY, newSettings)
      return newSettings
    })
  }, [])

  return { settings, updateSettings, loading }
}
