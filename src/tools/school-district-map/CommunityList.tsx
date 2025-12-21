import { List, Empty, Typography } from 'antd'
import { useSchoolDistrictMapStore } from './school-district-map.store'

const { Text } = Typography

interface CommunityListProps {
  onCommunitySelect?: (communityId: string) => void
}

export default function CommunityList({ onCommunitySelect }: CommunityListProps) {
  const { districts, selectedCommunityId, setSelectedCommunityId } = useSchoolDistrictMapStore()

  const handleCommunityClick = (communityId: string) => {
    setSelectedCommunityId(communityId)
    if (onCommunitySelect) {
      onCommunitySelect(communityId)
    }
  }

  // 获取所有学区中的所有小区
  const allCommunities: Array<{
    community: { id: string; name: string; location: [number, number] }
    district: { id: string; name: string; type: string }
  }> = []

  districts.forEach((district) => {
    if (district.communities) {
      district.communities.forEach((community) => {
        allCommunities.push({
          community,
          district: {
            id: district.id,
            name: district.name,
            type: district.type === 'primary' ? '小学' : '初中',
          },
        })
      })
    }
  })

  if (allCommunities.length === 0) {
    return (
      <div style={{ height: '100%', padding: '40px 20px' }}>
        <Empty description="暂无小区数据" />
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px' }}>
      <List
        dataSource={allCommunities}
        renderItem={({ community, district }) => {
          const isSelected = selectedCommunityId === community.id
          return (
            <List.Item
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: isSelected ? '#e6f7ff' : '#fafafa',
                borderRadius: '4px',
                border: isSelected ? '2px solid #1890ff' : '1px solid #f0f0f0',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleCommunityClick(community.id)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#fafafa'
                }
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '15px' }}>
                  {community.name}
                </div>
              <div style={{ color: '#666', fontSize: '12px' }}>
                所属学区: <Text type="secondary">{district.name}</Text>
                <span style={{ marginLeft: '12px', color: '#999' }}>
                  ({district.type})
                </span>
              </div>
              <div style={{ color: '#999', fontSize: '11px', marginTop: '4px' }}>
                坐标: {community.location[0].toFixed(4)}, {community.location[1].toFixed(4)}
              </div>
            </div>
          </List.Item>
          )
        }}
      />
    </div>
  )
}

