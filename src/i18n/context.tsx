import {
  createContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { translations, Language } from './translations'
import { getStorage, setStorage } from '../utils/storage'

type Translation = typeof translations.zh

interface I18nContextType {
  language: Language
  t: Translation
  setLanguage: (lang: Language) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const I18nContext = createContext<I18nContextType | null>(null)

const LANGUAGE_KEY = 'language'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh')

  useEffect(() => {
    getStorage<Language>(LANGUAGE_KEY).then((saved) => {
      if (saved && (saved === 'zh' || saved === 'en')) {
        setLanguageState(saved)
      }
    })
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    setStorage(LANGUAGE_KEY, lang)
  }, [])

  const value: I18nContextType = {
    language,
    t: translations[language] as Translation,
    setLanguage,
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
