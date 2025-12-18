import { create } from 'zustand'
import { CalculationHistory } from '../../types'
import { storage } from '../../utils/storage'

interface CalculatorState {
  // 显示值
  display: string
  // 当前表达式
  expression: string
  // 上一个值
  previousValue: string | null
  // 当前运算符
  operator: string | null
  // 是否应该重置显示值（在输入新数字前）
  shouldResetDisplay: boolean
  // 历史记录
  history: CalculationHistory[]
  // 是否显示历史面板
  showHistory: boolean

  // Actions
  inputDigit: (digit: string) => void
  inputDecimal: () => void
  inputOperator: (op: string) => void
  calculate: () => void
  clear: () => void
  clearEntry: () => void
  deleteDigit: () => void
  toggleSign: () => void
  inputPercent: () => void
  loadHistory: () => void
  clearHistory: () => void
  toggleHistory: () => void
  replayCalculation: (item: CalculationHistory) => void
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  display: '0',
  expression: '',
  previousValue: null,
  operator: null,
  shouldResetDisplay: false,
  history: [],
  showHistory: false,

  inputDigit: (digit: string) => {
    const { display, shouldResetDisplay } = get()

    if (shouldResetDisplay) {
      set({ display: digit, shouldResetDisplay: false })
      return
    }

    const newDisplay = display === '0' ? digit : display + digit
    set({ display: newDisplay })
  },

  inputDecimal: () => {
    const { display, shouldResetDisplay } = get()

    if (shouldResetDisplay) {
      set({ display: '0.', shouldResetDisplay: false })
      return
    }

    if (!display.includes('.')) {
      set({ display: display + '.' })
    }
  },

  inputOperator: (op: string) => {
    const { display, previousValue, operator } = get()

    if (previousValue !== null && operator !== null) {
      // 如果已经有待处理的运算，先计算结果
      get().calculate()
    }

    const value = parseFloat(display)
    set({
      previousValue: value.toString(),
      operator: op,
      expression: `${value} ${op}`,
      shouldResetDisplay: true,
    })
  },

  calculate: () => {
    const { display, previousValue, operator, expression } = get()

    if (previousValue === null || operator === null) return

    const prev = parseFloat(previousValue)
    const current = parseFloat(display)
    let result: number

    switch (operator) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '×':
        result = prev * current
        break
      case '÷':
        if (current === 0) {
          set({
            display: '错误',
            expression: '',
            previousValue: null,
            operator: null,
            shouldResetDisplay: true,
          })
          return
        }
        result = prev / current
        break
      default:
        return
    }

    const fullExpression = `${expression} ${current}`
    const resultStr = result.toString()

    // 保存到历史记录
    storage.addHistoryItem({
      expression: fullExpression,
      result: resultStr,
    })

    set({
      display: resultStr,
      expression: '',
      previousValue: null,
      operator: null,
      shouldResetDisplay: true,
      history: storage.getHistory(),
    })
  },

  clear: () => {
    set({
      display: '0',
      expression: '',
      previousValue: null,
      operator: null,
      shouldResetDisplay: false,
    })
  },

  clearEntry: () => {
    set({ display: '0' })
  },

  deleteDigit: () => {
    const { display } = get()
    if (display.length <= 1 || display === '0') {
      set({ display: '0' })
    } else {
      set({ display: display.slice(0, -1) })
    }
  },

  toggleSign: () => {
    const { display } = get()
    const value = parseFloat(display)
    if (value !== 0) {
      set({ display: (-value).toString() })
    }
  },

  inputPercent: () => {
    const { display } = get()
    const value = parseFloat(display)
    set({ display: (value / 100).toString() })
  },

  loadHistory: () => {
    set({ history: storage.getHistory() })
  },

  clearHistory: () => {
    storage.clearHistory()
    set({ history: [] })
  },

  toggleHistory: () => {
    const { showHistory } = get()
    set({ showHistory: !showHistory })
    if (!showHistory) {
      get().loadHistory()
    }
  },

  replayCalculation: (item: CalculationHistory) => {
    set({
      display: item.result,
      expression: '',
      previousValue: null,
      operator: null,
      shouldResetDisplay: true,
    })
  },
}))
