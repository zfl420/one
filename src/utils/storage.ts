import { CalculationHistory } from '../types'

const STORAGE_KEY = 'calculator_history'
const MAX_HISTORY_ITEMS = 100

export const storage = {
  // 获取历史记录
  getHistory(): CalculationHistory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) return []
      return JSON.parse(data)
    } catch (error) {
      console.error('Failed to load history:', error)
      return []
    }
  },

  // 保存历史记录
  saveHistory(history: CalculationHistory[]): void {
    try {
      // 限制历史记录数量
      const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory))
    } catch (error) {
      console.error('Failed to save history:', error)
    }
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
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear history:', error)
    }
  },
}
