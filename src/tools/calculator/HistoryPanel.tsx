import { CalculationHistory } from '../../types'

interface HistoryPanelProps {
  history: CalculationHistory[]
  onReplay: (item: CalculationHistory) => void
  onClear: () => void
  onClose: () => void
}

export default function HistoryPanel({ history, onReplay, onClear, onClose }: HistoryPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg">历史记录</h3>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              清空
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-3 text-gray-300"
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
            <p>暂无历史记录</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onReplay(item)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="text-sm text-gray-500 mb-1">
                  {new Date(item.timestamp).toLocaleString('zh-CN')}
                </div>
                <div className="text-gray-700 mb-1">{item.expression}</div>
                <div className="text-lg font-semibold text-gray-900">
                  = {item.result}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
