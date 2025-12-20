import { useState, KeyboardEvent } from 'react'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import { validateVin } from './utils'

export default function VinInput() {
  const {
    vinCode,
    isLoading,
    setVinCode,
    recognizeByVin,
  } = useVehicleIdentifierStore()

  const [localError, setLocalError] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().trim()
    setVinCode(value)
    setLocalError('')
  }

  const handleRecognize = () => {
    // 验证VIN码
    const validation = validateVin(vinCode)
    if (!validation.valid) {
      setLocalError(validation.error || '请输入有效的VIN码')
      return
    }

    setLocalError('')
    recognizeByVin()
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRecognize()
    }
  }

  const handleClear = () => {
    setVinCode('')
    setLocalError('')
  }

  return (
    <div className="space-y-4">
      {/* VIN码输入框 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          VIN码 (17位)
        </label>
        <div className="relative">
          <input
            type="text"
            value={vinCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="请输入17位VIN码"
            maxLength={17}
            className={`
              w-full px-4 py-3 pr-12 border rounded-lg text-lg font-mono
              focus:outline-none focus:ring-2 focus:ring-primary-500
              ${localError ? 'border-red-500' : 'border-gray-300'}
            `}
            disabled={isLoading}
          />
          {vinCode && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        {/* 字符计数 */}
        <div className="flex justify-between items-center mt-2">
          <div>
            {localError && (
              <p className="text-sm text-red-500">{localError}</p>
            )}
          </div>
          <p className={`text-sm ${vinCode.length === 17 ? 'text-green-600' : 'text-gray-500'}`}>
            {vinCode.length} / 17
          </p>
        </div>
      </div>

      {/* 查询按钮 */}
      <button
        onClick={handleRecognize}
        disabled={isLoading || vinCode.length !== 17}
        className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            查询中...
          </span>
        ) : (
          '查询车型'
        )}
      </button>

      {/* VIN码说明 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-2">
          📌 VIN码查找位置：
        </p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>行驶证上的车架号</li>
          <li>挡风玻璃左下角（从车外看）</li>
          <li>发动机舱铭牌</li>
          <li>车门B柱或门框上的标签</li>
        </ul>
      </div>

      {/* 注意事项 */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>💡 注意：</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>VIN码必须是17位字符</li>
          <li>不包含字母 I、O、Q（容易与数字混淆）</li>
          <li>区分大小写，建议使用大写字母</li>
        </ul>
      </div>
    </div>
  )
}

