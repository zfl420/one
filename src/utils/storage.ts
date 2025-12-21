import { CalculationHistory } from '../types'
import { logger } from './logger'
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '../constants/storage'

/**
 * 通用的存储工具类
 * 支持泛型，可以存储任意类型的数据
 */
class StorageManager {
  /**
   * 获取存储的数据
   */
  get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key)
      if (!data) return defaultValue
      return JSON.parse(data) as T
    } catch (error) {
      logger.error(`Failed to load storage key "${key}":`, error)
      return defaultValue
    }
  }

  /**
   * 设置存储的数据
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      logger.error(`Failed to save storage key "${key}":`, error)
      // 如果存储空间不足，尝试清理旧数据
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        logger.warn('Storage quota exceeded, attempting to clear old data')
        this.clearOldData()
      }
    }
  }

  /**
   * 删除存储的数据
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      logger.error(`Failed to remove storage key "${key}":`, error)
    }
  }

  /**
   * 清空所有以 STORAGE_PREFIX 开头的数据
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith('one-tools:')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      logger.error('Failed to clear all storage:', error)
    }
  }

  /**
   * 清理旧数据（当存储空间不足时）
   */
  private clearOldData(): void {
    // 可以在这里实现清理策略，比如删除最旧的历史记录
    logger.info('Clearing old storage data...')
  }
}

// 创建存储管理器实例
const storageManager = new StorageManager()

/**
 * 计算器历史记录存储
 */
export const calculatorStorage = {
  // 获取历史记录
  getHistory(): CalculationHistory[] {
    return storageManager.get(STORAGE_KEYS.CALCULATOR_HISTORY, [])
  },

  // 保存历史记录
  saveHistory(history: CalculationHistory[]): void {
    // 限制历史记录数量
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS.CALCULATOR)
    storageManager.set(STORAGE_KEYS.CALCULATOR_HISTORY, limitedHistory)
  },

  // 添加一条历史记录
  addHistoryItem(item: Omit<CalculationHistory, 'id' | 'timestamp'>): void {
    const history = this.getHistory()
    const newItem: CalculationHistory = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    }
    history.unshift(newItem) // 添加到开头
    this.saveHistory(history)
  },

  // 清空历史记录
  clearHistory(): void {
    storageManager.remove(STORAGE_KEYS.CALCULATOR_HISTORY)
  },
}

// 为了向后兼容，保留旧的 storage 导出
export const storage = calculatorStorage

// 导出通用的存储管理器
export { storageManager }
