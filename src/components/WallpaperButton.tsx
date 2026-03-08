interface WallpaperButtonProps {
  onClick: () => void
  loading: boolean
}

function WallpaperButton({ onClick, loading }: WallpaperButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
      title="随机换壁纸"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${loading ? 'animate-spin' : 'group-hover:animate-spin'}`}
        style={{ animationDuration: '1s' }}
      >
        {/* 风车叶片 */}
        <path d="M12 12 L12 2 Q18 4 12 12" fill="rgba(255,255,255,0.3)" />
        <path d="M12 12 L22 12 Q20 18 12 12" fill="rgba(255,255,255,0.3)" />
        <path d="M12 12 L12 22 Q6 20 12 12" fill="rgba(255,255,255,0.3)" />
        <path d="M12 12 L2 12 Q4 6 12 12" fill="rgba(255,255,255,0.3)" />
        {/* 中心圆 */}
        <circle cx="12" cy="12" r="2" fill="white" />
        {/* 杆子 */}
        <line x1="12" y1="14" x2="12" y2="22" strokeWidth="1.5" />
      </svg>
      <span className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap rounded bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        随机换壁纸
      </span>
    </button>
  )
}

export default WallpaperButton
