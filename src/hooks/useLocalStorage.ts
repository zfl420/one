import { useState, useEffect, useCallback } from 'react'
import { logger } from '../utils/logger'

/**
 * 统一管理 localStorage 的 Hook
 * @param key - 存储的 key
 * @param initialValue - 初始值
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 设置值
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // 支持函数式更新
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        logger.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // 删除值
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      logger.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // 监听 localStorage 变化（跨标签页同步）
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          logger.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

