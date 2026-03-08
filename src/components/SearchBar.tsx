import { useState, useCallback } from 'react'

type SearchEngine = 'google' | 'bing' | 'baidu'

const searchEngines: Record<SearchEngine, { name: string; url: string }> = {
  baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=' },
  google: { name: 'Google', url: 'https://www.google.com/search?q=' },
  bing: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
}

const engineList: SearchEngine[] = ['baidu', 'google', 'bing']

function SearchBar() {
  const [query, setQuery] = useState('')
  const [engine, setEngine] = useState<SearchEngine>('baidu')

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
    setEngine(engineList[nextIndex])
  }

  return (
    <div className="glass flex w-full max-w-xl items-center gap-2 p-2 transition-transform duration-200 focus-within:scale-[1.02]">
      <button
        onClick={cycleEngine}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center"
        title={`当前: ${searchEngines[engine].name}，点击切换`}
      >
        {engine === 'baidu' && (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#2932E1">
            <path d="M5.927 12.497c2.063-.443 1.782-2.909 1.72-3.448-.101-.87-.784-2.453-2.418-2.243-1.927.249-1.881 2.671-1.881 2.671s-.302 3.463 2.579 3.02zm3.693-4.844c1.24-.054 1.76-1.32 1.875-2.095.168-1.112-.322-2.558-1.875-2.558-1.28 0-1.875 1.262-1.875 2.257 0 .936.407 2.447 1.875 2.396zm4.328-.117c1.397.117 2.027-1.26 2.105-2.013.118-1.136-.466-2.373-1.926-2.373-1.192 0-1.944 1.102-1.944 2.131 0 1.07.55 2.138 1.765 2.255zm4.123 4.96c1.67-.283 1.966-2.671 1.67-3.628-.244-.788-.898-2.147-2.418-2.058-1.568.092-2.105 1.565-2.105 2.558 0 .936.323 3.464 2.853 3.128zm-6.822 1.414c-1.025.637-2.105 1.416-2.105 2.973 0 1.556 1.27 2.475 2.105 2.826.836.352 2.105.587 3.42-.117 1.314-.704 1.697-2.118 1.697-3.087 0-1.556-1.025-2.354-2.105-3.087-.786-.534-1.912-.972-3.012-.508zm-2.34 6.39c-1.476.264-2.223 1.415-2.223 2.355 0 1.115.938 2.294 2.223 2.354 1.285.06 2.34-.733 2.34-2.354 0-1.267-1.083-2.618-2.34-2.355zm5.735 0c-1.257-.263-2.34 1.088-2.34 2.355 0 1.621 1.055 2.414 2.34 2.354 1.285-.06 2.223-1.239 2.223-2.354 0-.94-.747-2.091-2.223-2.355z" />
          </svg>
        )}
        {engine === 'google' && (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {engine === 'bing' && (
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              fill="#008373"
              d="M5 3v16.5l4.5 2.5 8-4.5v-5l-6.5-2.5-1.5 3.5V5.5L5 3z"
            />
            <path fill="#00A99D" d="M9.5 5.5V13l6.5 2.5v-5l-6.5-5z" />
          </svg>
        )}
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`${searchEngines[engine].name} 搜索...`}
        className="flex-1 bg-transparent text-white placeholder-white/60 outline-none"
      />
      <button
        onClick={handleSearch}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center text-white"
        title="搜索"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  )
}

export default SearchBar
