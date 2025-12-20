import { Card, Select, InputNumber, Radio, Checkbox, Space, Typography } from 'antd'
import { useImageCompressorStore } from './image-compressor.store'
import { ResizeMode, OutputFormat } from './types'

const { Text } = Typography

export default function SettingsPanel() {
  const { settings, updateSettings } = useImageCompressorStore()

  const resizeModeOptions = [
    { value: 'none', label: '不调整尺寸' },
    { value: 'percentage', label: '百分比缩放' },
    { value: 'width', label: '指定宽度' },
    { value: 'height', label: '指定高度' },
    { value: 'maxDimension', label: '最大边长' },
  ]

  const qualityOptions = [
    { value: 'high', label: '高质量 (90%)' },
    { value: 'medium', label: '中等 (75%)' },
    { value: 'low', label: '高压缩 (60%)' },
  ]

  const formatOptions = [
    { value: 'original', label: '保持原格式' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
  ]

  const getResizeValueLabel = () => {
    switch (settings.resizeMode) {
      case 'percentage':
        return '百分比'
      case 'width':
        return '宽度 (px)'
      case 'height':
        return '高度 (px)'
      case 'maxDimension':
        return '最大边 (px)'
      default:
        return ''
    }
  }

  return (
    <Card 
      title="压缩设置" 
      style={{ 
        borderRadius: 8,
        position: 'sticky',
        top: 80,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 尺寸调整模式 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            尺寸调整方式
          </Text>
          <Select
            value={settings.resizeMode}
            onChange={(value) => updateSettings({ resizeMode: value as ResizeMode })}
            options={resizeModeOptions}
            style={{ width: '100%' }}
          />
        </div>

        {/* 尺寸数值输入 */}
        {settings.resizeMode !== 'none' && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              {getResizeValueLabel()}
            </Text>
            <InputNumber
              min={1}
              max={settings.resizeMode === 'percentage' ? 100 : 10000}
              value={settings.resizeValue}
              onChange={(value) => updateSettings({ resizeValue: value || 0 })}
              style={{ width: '100%' }}
              placeholder={settings.resizeMode === 'percentage' ? '例如: 80' : '例如: 1920'}
            />
            {settings.resizeMode === 'percentage' && (
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                图片将缩放到原尺寸的 {settings.resizeValue}%
              </Text>
            )}
          </div>
        )}

        {/* 质量预设 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            压缩质量
          </Text>
          <Radio.Group
            value={settings.qualityPreset}
            onChange={(e) => updateSettings({ qualityPreset: e.target.value })}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {qualityOptions.map((option) => (
                <Radio key={option.value} value={option.value} style={{ width: '100%' }}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* 输出格式 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            输出格式
          </Text>
          <Select
            value={settings.outputFormat}
            onChange={(value) => updateSettings({ outputFormat: value as OutputFormat })}
            options={formatOptions}
            style={{ width: '100%' }}
          />
        </div>

        {/* EXIF移除选项 */}
        <div>
          <Checkbox
            checked={settings.removeExif}
            onChange={(e) => updateSettings({ removeExif: e.target.checked })}
          >
            <div>
              <Text strong style={{ display: 'block' }}>移除EXIF信息</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                移除图片的地理位置、拍摄设备等所有元数据，保护隐私
              </Text>
            </div>
          </Checkbox>
        </div>
      </Space>
    </Card>
  )
}
