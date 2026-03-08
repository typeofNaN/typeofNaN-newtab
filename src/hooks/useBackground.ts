import { useMemo } from 'react'

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // 紫蓝
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // 粉红
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // 蓝青
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // 绿青
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // 粉黄
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // 紫粉
]

export function useBackground(): string {
  return useMemo(() => {
    const dayOfMonth = new Date().getDate()
    const index = dayOfMonth % gradients.length
    return gradients[index]
  }, [])
}
