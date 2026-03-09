import { Icon } from '@iconify/react'
import { useI18n } from '../i18n/useI18n'
import { useSettingsContext } from '../context/SettingsContext'
import type { Settings } from '../types/settings'

function SettingsDrawer() {
  const { t, language, setLanguage } = useI18n()
  const { settings, updateSettings } = useSettingsContext()

  const searchEngines: {
    value: Settings['defaultSearchEngine']
    label: string
    icon: string
  }[] = [
    {
      value: 'baidu',
      label: language === 'zh' ? '百度' : 'Baidu',
      icon: 'simple-icons:baidu',
    },
    { value: 'google', label: 'Google', icon: 'mdi:google' },
    { value: 'bing', label: 'Bing', icon: 'mdi:microsoft-bing' },
  ]

  const sizes: { value: Settings['searchBarSize']; label: string }[] = [
    { value: 'sm', label: t.settings.sizeSm },
    { value: 'md', label: t.settings.sizeMd },
    { value: 'lg', label: t.settings.sizeLg },
  ]

  const timeFormats: { value: Settings['timeFormat']; label: string }[] = [
    { value: '12', label: t.settings.time12 },
    { value: '24', label: t.settings.time24 },
  ]

  return (
    <>
      <button
        onClick={() => {
          const drawer = document.getElementById('settings-drawer')
          const overlay = document.getElementById('settings-overlay')
          if (drawer) drawer.classList.remove('translate-x-full')
          if (overlay) {
            overlay.classList.remove('pointer-events-none', 'opacity-0')
          }
        }}
        className="group absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
      >
        <Icon
          icon="mdi:cog"
          width="22"
          height="22"
          className="text-white transition-transform duration-500 group-hover:rotate-180"
        />
      </button>

      <div
        id="settings-drawer"
        className="from-slate-900/98 to-slate-800/98 fixed inset-y-0 right-0 z-50 w-[340px] max-w-full translate-x-full bg-gradient-to-br shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-600">
                <Icon
                  icon="mdi:cog"
                  width="18"
                  height="18"
                  className="text-white"
                />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {t.settings.title}
              </h2>
            </div>
            <button
              onClick={() => {
                const drawer = document.getElementById('settings-drawer')
                const overlay = document.getElementById('settings-overlay')
                if (drawer) drawer.classList.add('translate-x-full')
                if (overlay) {
                  overlay.classList.add('pointer-events-none', 'opacity-0')
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              <Icon icon="mdi:close" width="20" height="20" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:magnify"
                    width="18"
                    height="18"
                    className="text-blue-400"
                  />
                  <label className="text-sm font-medium text-white/80">
                    {t.settings.searchEngine}
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.value}
                      onClick={() =>
                        updateSettings({ defaultSearchEngine: engine.value })
                      }
                      className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 transition-all ${
                        settings.defaultSearchEngine === engine.value
                          ? 'bg-gradient-to-br from-primary to-primary-600 text-white shadow-lg shadow-primary/30'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon icon={engine.icon} width="20" height="20" />
                      <span className="text-xs font-medium">
                        {engine.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:text-box-search"
                    width="18"
                    height="18"
                    className="text-purple-400"
                  />
                  <label className="text-sm font-medium text-white/80">
                    {t.settings.searchBarSize}
                  </label>
                </div>
                <div className="flex gap-2 rounded-xl bg-white/5 p-1">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() =>
                        updateSettings({ searchBarSize: size.value })
                      }
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        settings.searchBarSize === size.value
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:image-size-select-large"
                    width="18"
                    height="18"
                    className="text-green-400"
                  />
                  <label className="text-sm font-medium text-white/80">
                    {t.settings.linkIconSize}
                  </label>
                </div>
                <div className="flex gap-2 rounded-xl bg-white/5 p-1">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() =>
                        updateSettings({ linkIconSize: size.value })
                      }
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        settings.linkIconSize === size.value
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:clock-outline"
                    width="18"
                    height="18"
                    className="text-orange-400"
                  />
                  <label className="text-sm font-medium text-white/80">
                    {t.settings.timeFormat}
                  </label>
                </div>
                <div className="flex gap-2 rounded-xl bg-white/5 p-1">
                  {timeFormats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() =>
                        updateSettings({ timeFormat: format.value })
                      }
                      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        settings.timeFormat === format.value
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:translate"
                    width="18"
                    height="18"
                    className="text-cyan-400"
                  />
                  <label className="text-sm font-medium text-white/80">
                    {t.settings.language}
                  </label>
                </div>
                <div className="flex gap-2 rounded-xl bg-white/5 p-1">
                  <button
                    onClick={() => setLanguage('zh')}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      language === 'zh'
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {t.settings.langZh}
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      language === 'en'
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    {t.settings.langEn}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-center text-xs text-white/30">
              {language === 'zh'
                ? '设置会自动保存'
                : 'Settings are saved automatically'}
            </p>
          </div>
        </div>
      </div>

      <div
        id="settings-overlay"
        className="pointer-events-none fixed inset-0 z-40 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => {
          const drawer = document.getElementById('settings-drawer')
          const overlay = document.getElementById('settings-overlay')
          if (drawer) drawer.classList.add('translate-x-full')
          if (overlay) {
            overlay.classList.add('pointer-events-none', 'opacity-0')
          }
        }}
      />
    </>
  )
}

export default SettingsDrawer
