import { useEffect } from 'react'
import { useCalculatorStore } from './calculator.store'

export function useKeyboard() {
  const {
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    deleteDigit,
  } = useCalculatorStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止在输入框中触发
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // 数字键
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault()
        inputDigit(e.key)
        return
      }

      // 运算符
      switch (e.key) {
        case '+':
          e.preventDefault()
          inputOperator('+')
          break
        case '-':
          e.preventDefault()
          inputOperator('-')
          break
        case '*':
        case 'x':
        case 'X':
          e.preventDefault()
          inputOperator('×')
          break
        case '/':
          e.preventDefault()
          inputOperator('÷')
          break
        case '.':
        case ',':
          e.preventDefault()
          inputDecimal()
          break
        case 'Enter':
        case '=':
          e.preventDefault()
          calculate()
          break
        case 'Escape':
          e.preventDefault()
          clear()
          break
        case 'Backspace':
          e.preventDefault()
          deleteDigit()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputDigit, inputDecimal, inputOperator, calculate, clear, deleteDigit])
}
