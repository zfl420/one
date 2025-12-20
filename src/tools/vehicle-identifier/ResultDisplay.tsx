import { Card, Descriptions, Tag, Empty, Button, Collapse, Typography } from 'antd'
import { CloseOutlined, TagOutlined } from '@ant-design/icons'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import { VehicleModel } from './types'

const { Panel } = Collapse
const { Text } = Typography

export default function ResultDisplay() {
  const { result, clearResult } = useVehicleIdentifierStore()

  if (!result) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <div>暂无识别结果</div>
              <Text type="secondary" style={{ fontSize: 14 }}>
          请上传VIN码图片或输入VIN码进行查询
              </Text>
      </div>
          }
        />
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 基本信息卡片 */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TagOutlined />
            <span>识别结果</span>
          </div>
        }
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={clearResult}
            danger
          />
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="VIN码" span={2}>
            <Text code style={{ fontSize: 16 }}>
                {result.vin || '未识别到VIN码'}
            </Text>
              {!result.vin && (
              <div style={{ marginTop: 8 }}>
                <Text type="danger" style={{ fontSize: 12 }}>
                  未从API响应中提取到VIN码，请检查Console日志
                </Text>
            </div>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="品牌">
            {result.brand || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="车型">
            {result.model || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="年款">
            {result.year || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="厂商">
            {result.factory || '-'}
          </Descriptions.Item>
          {result.detail && (
            <Descriptions.Item label="完整描述" span={2}>
              <Text strong>{result.detail}</Text>
            </Descriptions.Item>
          )}
          {result.matchingMode && (
            <Descriptions.Item label="匹配模式" span={2}>
              <Tag color={result.matchingMode === 'exact_match' ? 'success' : 'warning'}>
                {result.matchingMode === 'exact_match' ? '精确匹配' : '模糊匹配'}
              </Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 详细车型列表 */}
      {result.modelList && result.modelList.length > 0 && (
        <Card title={`匹配车型列表 (${result.modelList.length})`}>
          <Collapse accordion>
            {result.modelList.map((model, index) => (
              <Panel
                header={
    <div>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>
                      {model.Model_detail}
    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {model.Model_year && (
                        <Tag color="blue">{model.Model_year}年</Tag>
            )}
            {model.Factory && (
                        <Tag color="purple">{model.Factory}</Tag>
            )}
          </div>
        </div>
                }
                key={model.Id || index}
          >
                <ModelDetails model={model} />
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}
    </div>
  )
}

// 车型详细信息组件
function ModelDetails({ model }: { model: VehicleModel }) {
  const items = [
    { label: '发动机', value: model.Engine_model },
    { label: '排量', value: model.Displacement },
    { label: '变速箱', value: model.Gearbox_desc },
    { label: '驱动方式', value: model.Drivetrain },
    { label: '燃料类型', value: model.Fuel_type },
    { label: '车身结构', value: model.Body_structure },
    { label: '座位数', value: model.Seats ? `${model.Seats}座` : undefined },
    { label: '版本', value: model.Sales_version },
  ].filter((item) => item.value)

  return (
    <Descriptions column={2} size="small" bordered>
      {items.map((item) => (
        <Descriptions.Item label={item.label} key={item.label}>
          {item.value}
        </Descriptions.Item>
      ))}
    </Descriptions>
  )
}
