export type Language = 'zh' | 'en'

export const translations = {
  zh: {
    greeting: {
      morning: '早上好，新的一天开始了',
      noon: '中午好，记得休息一下',
      afternoon: '下午好，继续保持',
      evening: '晚上好，放松一下吧',
      night: '夜深了，注意休息',
    },
    search: {
      placeholder: '{engine} 搜索...',
      currentEngine: '当前: {name}，点击切换',
      search: '搜索',
    },
    quickLinks: {
      add: '添加',
      edit: '编辑',
      done: '完成',
      delete: '删除',
      addTitle: '添加快捷链接',
      editTitle: '编辑快捷链接',
      name: '名称',
      url: '网址',
      cancel: '取消',
      save: '保存',
      namePlaceholder: '例如：Google',
      urlPlaceholder: '例如：google.com',
    },
    wallpaper: {
      change: '随机换壁纸',
    },
    language: {
      switch: '切换语言',
    },
    settings: {
      title: '设置',
      searchEngine: '默认搜索引擎',
      searchBarSize: '搜索框大小',
      linkIconSize: '图标大小',
      timeFormat: '时间格式',
      language: '语言',
      sizeSm: '小',
      sizeMd: '中',
      sizeLg: '大',
      time12: '12小时制',
      time24: '24小时制',
      langZh: '中文',
      langEn: 'English',
    },
  },
  en: {
    greeting: {
      morning: 'Good morning, a new day begins',
      noon: 'Good noon, take a break',
      afternoon: 'Good afternoon, keep going',
      evening: 'Good evening, time to relax',
      night: 'Late night, get some rest',
    },
    search: {
      placeholder: 'Search with {engine}...',
      currentEngine: 'Current: {name}, click to switch',
      search: 'Search',
    },
    quickLinks: {
      add: 'Add',
      edit: 'Edit',
      done: 'Done',
      delete: 'Delete',
      addTitle: 'Add Quick Link',
      editTitle: 'Edit Quick Link',
      name: 'Name',
      url: 'URL',
      cancel: 'Cancel',
      save: 'Save',
      namePlaceholder: 'e.g., Google',
      urlPlaceholder: 'e.g., google.com',
    },
    wallpaper: {
      change: 'Random Wallpaper',
    },
    language: {
      switch: 'Switch Language',
    },
    settings: {
      title: 'Settings',
      searchEngine: 'Default Search Engine',
      searchBarSize: 'Search Bar Size',
      linkIconSize: 'Icon Size',
      timeFormat: 'Time Format',
      language: 'Language',
      sizeSm: 'Small',
      sizeMd: 'Medium',
      sizeLg: 'Large',
      time12: '12-hour',
      time24: '24-hour',
      langZh: '中文',
      langEn: 'English',
    },
  },
} as const

export type TranslationKey = keyof typeof translations.zh
