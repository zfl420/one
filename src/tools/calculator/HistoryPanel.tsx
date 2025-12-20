import { Card, List, Button, Empty, Typography, Space } from 'antd'
import { DeleteOutlined, CloseOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { CalculationHistory } from '../../types'

const { Text } = Typography

interface HistoryPanelProps {
  history: CalculationHistory[]
  onReplay: (item: CalculationHistory) => void
  onClear: () => void
  onClose: () => void
}

export default function HistoryPanel({ history, onReplay, onClear, onClose }: HistoryPanelProps) {
  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined />
          <span>历史记录</span>
        </Space>
      }
      extra={
        <Space>
          {history.length > 0 && (
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={onClear}
            >
              清空
            </Button>
          )}
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </Space>
      }
      style={{ borderRadius: 8 }}
    >
      {history.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无历史记录"
          style={{ padding: '40px 0' }}
        />
      ) : (
        <List
          dataSource={history}
          style={{ maxHeight: 400, overflow: 'auto' }}
          renderItem={(item) => (
            <List.Item
              onClick={() => onReplay(item)}
              style={{
                cursor: 'pointer',
                padding: '16px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0f2f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <div style={{ width: '100%' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                  {new Date(item.timestamp).toLocaleString('zh-CN')}
                </Text>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  {item.expression}
                </Text>
                <Text
                  strong
                  style={{
                    fontSize: 18,
                    display: 'block',
                    color: '#1890ff',
                  }}
                >
                  = {item.result}
                </Text>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  )
}
