import { useState } from 'react'
import { Input, Button, Space, Alert, Form, Typography } from 'antd'
import { LoadingOutlined, CloseCircleFilled } from '@ant-design/icons'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import { validateVin } from './utils'

const { Text } = Typography

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleRecognize()
    }
  }

  const handleClear = () => {
    setVinCode('')
    setLocalError('')
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* VIN码输入框 */}
      <Form.Item
        label="VIN码 (17位)"
        validateStatus={localError ? 'error' : ''}
        help={localError}
        style={{ marginBottom: 0 }}
      >
        <Input
            value={vinCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="请输入17位VIN码"
            maxLength={17}
          size="large"
            disabled={isLoading}
          suffix={
            vinCode ? (
              <CloseCircleFilled
              onClick={handleClear}
                style={{ color: 'rgba(0,0,0,.25)', cursor: 'pointer' }}
              />
            ) : null
          }
          style={{ fontFamily: 'monospace', fontSize: 16 }}
        />
        <div style={{ textAlign: 'right', marginTop: 8 }}>
          <Text
            type={vinCode.length === 17 ? 'success' : 'secondary'}
            style={{ fontSize: 14 }}
          >
            {vinCode.length} / 17
          </Text>
        </div>
      </Form.Item>

      {/* 查询按钮 */}
      <Button
        type="primary"
        onClick={handleRecognize}
        disabled={isLoading || vinCode.length !== 17}
        icon={isLoading ? <LoadingOutlined /> : undefined}
        block
        size="large"
      >
        {isLoading ? '查询中...' : '查询车型'}
      </Button>

      {/* VIN码说明 */}
      <Alert
        message="VIN码查找位置"
        description={
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>行驶证上的车架号</li>
            <li>挡风玻璃左下角（从车外看）</li>
            <li>发动机舱铭牌</li>
            <li>车门B柱或门框上的标签</li>
        </ul>
        }
        type="info"
        showIcon
      />

      {/* 注意事项 */}
      <Alert
        message="注意"
        description={
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>VIN码必须是17位字符</li>
            <li>不包含字母 I、O、Q（容易与数字混淆）</li>
            <li>区分大小写，建议使用大写字母</li>
        </ul>
        }
        type="warning"
        showIcon
      />
    </Space>
  )
}
