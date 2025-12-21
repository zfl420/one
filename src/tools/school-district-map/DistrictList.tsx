import { useState } from 'react'
import { Card, List, Typography, Button, Popconfirm, Empty } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useSchoolDistrictMapStore } from './school-district-map.store'
import { SchoolDistrict } from './types'
import CommunityEditModal from './CommunityEditModal'

const { Text } = Typography

interface DistrictListProps {
  onDistrictSelect?: (district: SchoolDistrict) => void
}

export default function DistrictList({ onDistrictSelect }: DistrictListProps) {
  const {
    districts,
    currentType,
    selectedDistrictId,
    setSelectedDistrictId,
    deleteDistrict,
  } = useSchoolDistrictMapStore()

  const [editingDistrictId, setEditingDistrictId] = useState<string | null>(null)

  // 根据当前类型过滤学区
  const filteredDistricts = districts.filter((d) => d.type === currentType)

  const handleDistrictClick = (district: SchoolDistrict) => {
    setSelectedDistrictId(district.id)
    if (onDistrictSelect) {
      onDistrictSelect(district)
    }
  }

  const handleDelete = (districtId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteDistrict(districtId)
  }

  const handleEditCommunities = (districtId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingDistrictId(districtId)
  }

  if (filteredDistricts.length === 0) {
    return (
      <Card style={{ height: '100%', borderRadius: 0 }}>
        <Empty
          description={`暂无${currentType === 'primary' ? '小学' : '初中'}学区数据`}
          style={{ marginTop: '40px' }}
        />
      </Card>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <List
        dataSource={filteredDistricts}
        renderItem={(district) => (
          <List.Item
            style={{
              cursor: 'pointer',
              backgroundColor:
                selectedDistrictId === district.id ? '#e6f7ff' : 'transparent',
              borderLeft:
                selectedDistrictId === district.id
                  ? '3px solid #1890ff'
                  : '3px solid transparent',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '4px',
              transition: 'all 0.2s',
            }}
            onClick={() => handleDistrictClick(district)}
            onMouseEnter={(e) => {
              if (selectedDistrictId !== district.id) {
                e.currentTarget.style.backgroundColor = '#f5f5f5'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedDistrictId !== district.id) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={{ flex: 1, width: 0 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {district.name}
              </div>
              <div style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>
                学校数量: {district.schools.length}
                {district.communities && district.communities.length > 0 && (
                  <span style={{ marginLeft: '12px' }}>
                    小区数量: {district.communities.length}
                  </span>
                )}
              </div>
              {district.schools.length > 0 && (
                <div style={{ fontSize: '12px', color: '#999' }}>
                  <Text type="secondary">
                    {district.schools.slice(0, 3).join('、')}
                    {district.schools.length > 3 && '...'}
                  </Text>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={(e) => handleEditCommunities(district.id, e)}
                title="编辑小区"
              />
              <Popconfirm
                title="确定要删除这个学区吗？"
                description="删除后将无法恢复"
                onConfirm={(e) => {
                  e?.stopPropagation()
                  handleDelete(district.id, e as React.MouseEvent)
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                />
              </Popconfirm>
            </div>
          </List.Item>
        )}
      />

      {/* 小区编辑弹窗 */}
      {editingDistrictId && (
        <CommunityEditModal
          visible={!!editingDistrictId}
          districtId={editingDistrictId}
          onCancel={() => setEditingDistrictId(null)}
        />
      )}
    </div>
  )
}

