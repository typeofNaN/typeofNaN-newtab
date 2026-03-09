import { useState, useCallback, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useI18n } from '../i18n/useI18n'
import { useSettingsContext } from '../context/SettingsContext'
import {
  searchBarSizeClasses,
  searchBarInputSizeClasses,
} from '../types/settings'

type SearchEngine = 'google' | 'bing' | 'baidu'

const searchEngines: Record<
  SearchEngine,
  { name: string; nameEn: string; url: string }
> = {
  baidu: { name: '百度', nameEn: 'Baidu', url: 'https://www.baidu.com/s?wd=' },
  google: {
    name: 'Google',
    nameEn: 'Google',
    url: 'https://www.google.com/search?q=',
  },
  bing: { name: 'Bing', nameEn: 'Bing', url: 'https://www.bing.com/search?q=' },
}

const engineList: SearchEngine[] = ['baidu', 'google', 'bing']

function SearchBar() {
  const [query, setQuery] = useState('')
  const [engine, setEngine] = useState<SearchEngine>('baidu')
  const { t, language } = useI18n()
  const { settings, updateSettings } = useSettingsContext()

  useEffect(() => {
    setEngine(settings.defaultSearchEngine)
  }, [settings.defaultSearchEngine])

  const engineName =
    language === 'zh'
      ? searchEngines[engine].name
      : searchEngines[engine].nameEn

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      const url = searchEngines[engine].url + encodeURIComponent(query.trim())
      window.open(url, '_self')
    }
  }, [query, engine])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const cycleEngine = () => {
    const currentIndex = engineList.indexOf(engine)
    const nextIndex = (currentIndex + 1) % engineList.length
    const nextEngine = engineList[nextIndex]
    setEngine(nextEngine)
    updateSettings({ defaultSearchEngine: nextEngine })
  }

  return (
    <div
      className={`glass flex w-full items-center gap-2 border border-white/30 transition-transform duration-200 focus-within:scale-[1.02] focus-within:border-primary ${searchBarSizeClasses[settings.searchBarSize]}`}
    >
      <button
        onClick={cycleEngine}
        className={`flex flex-shrink-0 items-center justify-center ${searchBarInputSizeClasses[settings.searchBarSize]}`}
        title={t.search.currentEngine.replace('{name}', engineName)}
      >
        {engine === 'baidu' && (
          <Icon
            icon="simple-icons:baidu"
            width="18"
            height="18"
            className="text-white"
          />
        )}
        {engine === 'google' && (
          <Icon
            icon="mdi:google"
            width="18"
            height="18"
            className="text-white"
          />
        )}
        {engine === 'bing' && (
          <Icon
            icon="mdi:microsoft-bing"
            width="18"
            height="18"
            className="text-white"
          />
        )}
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.search.placeholder.replace('{engine}', engineName)}
        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
      />
      <button
        onClick={handleSearch}
        className={`flex flex-shrink-0 items-center justify-center text-white ${searchBarInputSizeClasses[settings.searchBarSize]}`}
        title={t.search.search}
      >
        <Icon icon="mingcute:search-3-line" width="18" height="18" />
      </button>
    </div>
  )
}

export default SearchBar
