import Clock from './components/Clock'
import QuickLinks from './components/QuickLinks'
import SearchBar from './components/SearchBar'
import WallpaperButton from './components/WallpaperButton'
import { useBackground } from './hooks/useBackground'
import { useGreeting } from './hooks/useGreeting'
import { useWallpaper } from './hooks/useWallpaper'

function App() {
  const gradient = useBackground()
  const greeting = useGreeting()
  const { wallpaper, loading, changeWallpaper } = useWallpaper()

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-cover bg-center p-4 transition-all duration-700"
      style={{
        background: wallpaper ? `url(${wallpaper}) center/cover` : gradient,
      }}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 flex animate-fade-in flex-col items-center gap-8">
        <Clock />
        <p className="text-xl text-white/80 md:text-2xl">{greeting}</p>
        <SearchBar />
      </div>
      <QuickLinks />
      <WallpaperButton onClick={changeWallpaper} loading={loading} />
    </div>
  )
}

export default App
