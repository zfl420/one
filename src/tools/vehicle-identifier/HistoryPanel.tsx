import { Card, List, Tag, Button, Empty, Typography, Space, Popconfirm } from 'antd'
import {
  HistoryOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CloseOutlined,
  ClearOutlined,
} from '@ant-design/icons'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import { VehicleRecord } from './types'
import { formatTimestamp } from './utils'

const { Text } = Typography

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
  }

  return (
    <Card
      title={
        <Space>
          <HistoryOutlined />
          <span>历史记录</span>
        </Space>
      }
      extra={
        <Space>
          {history.length > 0 && (
            <Popconfirm
              title="确定要清空所有历史记录吗？"
              onConfirm={clearHistory}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<ClearOutlined />}
                size="small"
            >
              清空全部
              </Button>
            </Popconfirm>
          )}
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={toggleHistory}
            size="small"
              />
        </Space>
      }
    >
        {history.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div>暂无历史记录</div>
              <Text type="secondary" style={{ fontSize: 14 }}>
              识别车型后会自动保存记录
              </Text>
          </div>
          }
        />
        ) : (
        <List
          dataSource={history}
          style={{ maxHeight: 500, overflow: 'auto' }}
          renderItem={(record) => (
            <List.Item
                key={record.id}
              actions={[
                record.inputMode === 'text' && (
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={() => handleLoadRecord(record)}
                    title="重新查询"
                    size="small"
                  />
                ),
                <Popconfirm
                  title="确定要删除这条记录吗？"
                  onConfirm={() => removeHistoryRecord(record.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    title="删除记录"
                    size="small"
                  />
                </Popconfirm>,
              ].filter(Boolean)}
            >
              <List.Item.Meta
                title={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* 时间和输入模式 */}
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
              {formatTimestamp(record.timestamp)}
                      </Text>
                      {' '}
                      <Tag
                        color={record.inputMode === 'image' ? 'blue' : 'green'}
                        style={{ marginLeft: 8 }}
            >
              {record.inputMode === 'image' ? '图片识别' : '手动输入'}
                      </Tag>
          </div>
          {/* VIN码 */}
                    <Text code style={{ fontSize: 13 }}>
            VIN: {record.vin}
                    </Text>
                  </Space>
                }
                description={
                  <div>
          {/* 车型信息 */}
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      <Text strong>
            {record.detail || `${record.brand || ''} ${record.model || ''}`}
                      </Text>
          </div>
          {/* 年款 */}
          {record.year && (
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {record.year}年款
                      </Text>
          )}
        </div>
                }
              />
            </List.Item>
          )}
        />
          )}
    </Card>
  )
}
