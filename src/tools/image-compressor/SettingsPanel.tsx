import { useImageCompressorStore } from './image-compressor.store'
import { ResizeMode, QualityPreset, OutputFormat } from './types'

export default function SettingsPanel() {
  const { settings, updateSettings } = useImageCompressorStore()

  const resizeModeOptions: { value: ResizeMode; label: string }[] = [
    { value: 'none', label: '不调整尺寸' },
    { value: 'percentage', label: '百分比缩放' },
    { value: 'width', label: '指定宽度' },
    { value: 'height', label: '指定高度' },
    { value: 'maxDimension', label: '最大边长' },
  ]

  const qualityOptions: { value: QualityPreset; label: string; desc: string }[] = [
    { value: 'high', label: '高质量', desc: '90%' },
    { value: 'medium', label: '中等', desc: '75%' },
    { value: 'low', label: '高压缩', desc: '60%' },
  ]

  const formatOptions: { value: OutputFormat; label: string }[] = [
    { value: 'original', label: '保持原格式' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
  ]

  const getResizeValueLabel = () => {
    switch (settings.resizeMode) {
      case 'percentage':
        return '%'
      case 'width':
        return 'px (宽度)'
      case 'height':
        return 'px (高度)'
      case 'maxDimension':
        return 'px (最大边)'
      default:
        return ''
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">压缩设置</h2>

      {/* 尺寸调整模式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          尺寸调整方式
        </label>
        <select
          value={settings.resizeMode}
          onChange={(e) => updateSettings({ resizeMode: e.target.value as ResizeMode })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {resizeModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 尺寸数值输入 */}
      {settings.resizeMode !== 'none' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            目标尺寸 {getResizeValueLabel()}
          </label>
          <input
            type="number"
            min="1"
            max={settings.resizeMode === 'percentage' ? '100' : '10000'}
            value={settings.resizeValue}
            onChange={(e) => updateSettings({ resizeValue: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              settings.resizeMode === 'percentage'
                ? '例如: 80'
                : '例如: 1920'
            }
          />
          {settings.resizeMode === 'percentage' && (
            <p className="mt-1 text-xs text-gray-500">
              图片将缩放到原尺寸的 {settings.resizeValue}%
            </p>
          )}
        </div>
      )}

      {/* 质量预设 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          压缩质量
        </label>
        <div className="grid grid-cols-3 gap-3">
          {qualityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateSettings({ qualityPreset: option.value })}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                settings.qualityPreset === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs mt-1 opacity-75">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 输出格式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          输出格式
        </label>
        <select
          value={settings.outputFormat}
          onChange={(e) => updateSettings({ outputFormat: e.target.value as OutputFormat })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {formatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* EXIF移除选项 */}
      <div className="flex items-start space-x-3 pt-2">
        <input
          type="checkbox"
          id="removeExif"
          checked={settings.removeExif}
          onChange={(e) => updateSettings({ removeExif: e.target.checked })}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <div className="flex-1">
          <label
            htmlFor="removeExif"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            移除EXIF信息
          </label>
          <p className="text-xs text-gray-500 mt-1">
            移除图片的地理位置、拍摄设备等所有元数据，保护隐私
          </p>
        </div>
      </div>
    </div>
  )
}
