type StorageArea = 'local' | 'sync'

function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.storage
}

export async function getStorage<T>(
  key: string,
  area: StorageArea = 'local'
): Promise<T | null> {
  if (isChromeStorageAvailable()) {
    const result = await chrome.storage[area].get(key)
    return result[key] ?? null
  }
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export async function setStorage<T>(
  key: string,
  value: T,
  area: StorageArea = 'local'
): Promise<void> {
  if (isChromeStorageAvailable()) {
    await chrome.storage[area].set({ [key]: value })
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export async function removeStorage(
  key: string,
  area: StorageArea = 'local'
): Promise<void> {
  if (isChromeStorageAvailable()) {
    await chrome.storage[area].remove(key)
  } else {
    localStorage.removeItem(key)
  }
}
