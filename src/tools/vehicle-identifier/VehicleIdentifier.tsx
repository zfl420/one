import { Card, Tabs, Alert, Button, Space, Typography } from 'antd'
import { HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import ImageUpload from './ImageUpload'
import VinInput from './VinInput'
import ResultDisplay from './ResultDisplay'
import HistoryPanel from './HistoryPanel'

const { Title, Paragraph } = Typography

export default function VehicleIdentifier() {
  const { inputMode, setInputMode, error, clearError, showHistory, toggleHistory } =
    useVehicleIdentifierStore()

  const tabItems = [
    {
      key: 'image',
      label: (
        <Space>
          <span>📷</span>
          <span>图片识别</span>
        </Space>
      ),
      children: <ImageUpload />,
    },
    {
      key: 'text',
      label: (
        <Space>
          <span>✏️</span>
          <span>手动输入</span>
        </Space>
      ),
      children: <VinInput />,
    },
  ]

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          车型识别
        </Title>
        <Paragraph type="secondary">
          通过VIN码图片识别或手动输入查询车型信息
        </Paragraph>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={clearError}
          style={{ marginBottom: 24 }}
          showIcon
        />
      )}

      {/* 主要内容区域 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24 }}>
        {/* 左侧：输入区域 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 输入模式切换 */}
          <Card>
            <Tabs
              activeKey={inputMode}
              onChange={(key) => setInputMode(key as 'image' | 'text')}
              items={tabItems}
                />
          </Card>

          {/* 功能说明 */}
          <Card
            title={
              <Space>
                <InfoCircleOutlined />
                <span>功能说明</span>
              </Space>
            }
            size="small"
          >
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>支持上传VIN码图片进行OCR识别</li>
              <li>支持手动输入17位VIN码查询</li>
              <li>自动保存查询历史，方便回顾</li>
              <li>提供详细的车型配置信息</li>
            </ul>
          </Card>
        </div>

        {/* 右侧：结果和历史 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 历史记录切换按钮 */}
          <Button
            type="default"
            icon={<HistoryOutlined />}
            onClick={toggleHistory}
            block
            size="large"
            >
            {showHistory ? '隐藏历史记录' : '查看历史记录'}
          </Button>

          {/* 历史记录面板或识别结果 */}
          {showHistory ? <HistoryPanel /> : <ResultDisplay />}
        </div>
      </div>
    </div>
  )
}
