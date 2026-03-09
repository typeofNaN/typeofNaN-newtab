import { Icon } from '@iconify/react'
import { useI18n } from '../i18n/useI18n'

interface WallpaperButtonProps {
  onClick: () => void
  loading: boolean
}

function WallpaperButton({ onClick, loading }: WallpaperButtonProps) {
  const { t } = useI18n()

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
      title={t.wallpaper.change}
    >
      <Icon
        icon="icon-park-outline:windmill-two"
        width="22"
        height="22"
        className={`text-white ${loading ? 'animate-spin' : 'group-hover:animate-spin'}`}
        style={{ animationDuration: '0.8s' }}
      />
      <span className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap rounded bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {t.wallpaper.change}
      </span>
    </button>
  )
}

export default WallpaperButton
