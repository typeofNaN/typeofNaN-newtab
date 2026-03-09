import { Icon } from '@iconify/react'
import { useI18n } from '../i18n/useI18n'

function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n()

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="group absolute right-16 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
      title={t.language.switch}
    >
      <Icon
        icon="mdi:translate"
        width="20"
        height="20"
        className="text-white"
      />
      <span className="pointer-events-none absolute -bottom-8 right-0 whitespace-nowrap rounded bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {language === 'zh' ? 'English' : '中文'}
      </span>
    </button>
  )
}

export default LanguageSwitcher
