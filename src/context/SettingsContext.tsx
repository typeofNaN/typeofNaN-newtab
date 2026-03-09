import { createContext, useContext, ReactNode } from 'react'
import { useSettings } from '../hooks/useSettings'
import type { Settings } from '../types/settings'

interface SettingsContextValue {
  settings: Settings
  updateSettings: (updates: Partial<Settings>) => void
  loading: boolean
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { settings, updateSettings, loading } = useSettings()

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within SettingsProvider')
  }
  return context
}
