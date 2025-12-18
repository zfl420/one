import { useCalculatorStore } from './calculator.store'
import { useKeyboard } from './useKeyboard'
import CalculatorDisplay from './CalculatorDisplay'
import CalculatorKeypad from './CalculatorKeypad'
import HistoryPanel from './HistoryPanel'

export default function Calculator() {
  // 启用键盘支持
  useKeyboard()

  const {
    display,
    expression,
    showHistory,
    history,
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    deleteDigit,
    toggleSign,
    inputPercent,
    toggleHistory,
    clearHistory,
    replayCalculation,
  } = useCalculatorStore()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">计算器</h1>
        <button
          onClick={toggleHistory}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {showHistory ? '隐藏历史' : '显示历史'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 计算器主体 */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <CalculatorDisplay expression={expression} value={display} />
            <CalculatorKeypad
              onDigit={inputDigit}
              onOperator={inputOperator}
              onDecimal={inputDecimal}
              onEquals={calculate}
              onClear={clear}
              onDelete={deleteDigit}
              onToggleSign={toggleSign}
              onPercent={inputPercent}
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>键盘快捷键:</strong> 数字键 0-9, 运算符 +−×÷,
              Enter 键计算, Escape 清空, Backspace 删除
            </p>
          </div>
        </div>

        {/* 历史记录面板 */}
        {showHistory && (
          <div className="w-full">
            <HistoryPanel
              history={history}
              onReplay={replayCalculation}
              onClear={clearHistory}
              onClose={toggleHistory}
            />
          </div>
        )}
      </div>
    </div>
  )
}
