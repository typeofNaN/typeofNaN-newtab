export interface Settings {
  defaultSearchEngine: 'baidu' | 'google' | 'bing'
  searchBarSize: 'sm' | 'md' | 'lg'
  linkIconSize: 'sm' | 'md' | 'lg'
  timeFormat: '12' | '24'
}

export const defaultSettings: Settings = {
  defaultSearchEngine: 'baidu',
  searchBarSize: 'md',
  linkIconSize: 'md',
  timeFormat: '24',
}

export const searchBarSizeClasses = {
  sm: 'max-w-sm p-1.5 gap-1.5',
  md: 'max-w-xl p-2 gap-2',
  lg: 'max-w-2xl p-3 gap-3',
}

export const searchBarInputSizeClasses = {
  sm: 'h-6 w-6 text-sm',
  md: 'h-8 w-8',
  lg: 'h-10 w-10 text-lg',
}

export const linkIconSizeClasses = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-xs',
  lg: 'h-14 w-14 text-base',
}
