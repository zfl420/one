import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import ImageUpload from './ImageUpload'
import VinInput from './VinInput'
import ResultDisplay from './ResultDisplay'
import HistoryPanel from './HistoryPanel'

export default function VehicleIdentifier() {
  const { inputMode, setInputMode, error, clearError, showHistory, toggleHistory } =
    useVehicleIdentifierStore()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">车型识别</h1>
        <p className="text-gray-600">
          通过VIN码图片识别或手动输入查询车型信息
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入区域 */}
        <div className="space-y-6">
          {/* 输入模式切换 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
            <button
              onClick={() => setInputMode('image')}
              className={`
                flex-1 px-4 py-3 rounded-md font-medium transition-all
                flex items-center justify-center gap-2
                ${
                  inputMode === 'image'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              图片识别
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`
                flex-1 px-4 py-3 rounded-md font-medium transition-all
                flex items-center justify-center gap-2
                ${
                  inputMode === 'text'
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              手动输入
            </button>
          </div>

          {/* 输入组件 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {inputMode === 'image' ? <ImageUpload /> : <VinInput />}
          </div>

          {/* 功能说明 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              功能说明
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>支持上传VIN码图片进行OCR识别</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>支持手动输入17位VIN码查询</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>自动保存查询历史，方便回顾</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>提供详细的车型配置信息</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 右侧：结果和历史 */}
        <div className="space-y-6">
          {/* 历史记录切换按钮 */}
          <button
            onClick={toggleHistory}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors shadow-sm"
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
            {showHistory ? '隐藏历史记录' : '查看历史记录'}
          </button>

          {/* 历史记录面板 */}
          {showHistory && <HistoryPanel />}

          {/* 识别结果 */}
          {!showHistory && <ResultDisplay />}
        </div>
      </div>
    </div>
  )
}

