import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import { VehicleRecord } from './types'
import { formatTimestamp } from './utils'

export default function HistoryPanel() {
  const {
    history,
    clearHistory,
    loadHistoryRecord,
    removeHistoryRecord,
    toggleHistory,
  } = useVehicleIdentifierStore()

  const handleLoadRecord = (record: VehicleRecord) => {
    loadHistoryRecord(record)
    // 如果是文本输入模式，可以自动触发查询
    // 如果是图片模式，只能显示VIN码，无法重新上传图片
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
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
          历史记录
        </h3>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              清空全部
            </button>
          )}
          <button
            onClick={toggleHistory}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
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

      {/* 内容 */}
      <div className="max-h-[500px] overflow-y-auto">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="font-medium">暂无历史记录</p>
            <p className="text-sm text-gray-400 mt-1">
              识别车型后会自动保存记录
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {history.map((record) => (
              <HistoryCard
                key={record.id}
                record={record}
                onLoad={() => handleLoadRecord(record)}
                onDelete={() => removeHistoryRecord(record.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 历史记录卡片
function HistoryCard({
  record,
  onLoad,
  onDelete,
}: {
  record: VehicleRecord
  onLoad: () => void
  onDelete: () => void
}) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        {/* 主要内容 */}
        <div className="flex-1 min-w-0" onClick={onLoad} role="button">
          {/* 时间和输入模式 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">
              {formatTimestamp(record.timestamp)}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                record.inputMode === 'image'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {record.inputMode === 'image' ? '图片识别' : '手动输入'}
            </span>
          </div>

          {/* VIN码 */}
          <div className="font-mono text-sm text-gray-600 mb-2">
            VIN: {record.vin}
          </div>

          {/* 车型信息 */}
          <div className="text-base font-medium text-gray-900">
            {record.detail || `${record.brand || ''} ${record.model || ''}`}
          </div>

          {/* 年款 */}
          {record.year && (
            <div className="text-sm text-gray-500 mt-1">{record.year}年款</div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {record.inputMode === 'text' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onLoad()
              }}
              className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
              title="重新查询"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="删除记录"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

