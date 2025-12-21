import { useState } from 'react'
import { Modal, List, AutoComplete, Input, Button, message, Empty, Popconfirm } from 'antd'
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useSchoolDistrictMapStore } from './school-district-map.store'
import { Community } from './types'
import { searchWithNominatim, fuzzyMatch } from './utils'

interface CommunityEditModalProps {
  visible: boolean
  districtId: string
  onCancel: () => void
}

interface SearchOption {
  value: string
  label: string
  location?: [number, number]
  isExisting?: boolean
}

export default function CommunityEditModal({
  visible,
  districtId,
  onCancel,
}: CommunityEditModalProps) {
  const { districts, addCommunityToDistrict, removeCommunityFromDistrict } =
    useSchoolDistrictMapStore()

  const [searchValue, setSearchValue] = useState('')
  const [searchOptions, setSearchOptions] = useState<SearchOption[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 获取当前学区
  const currentDistrict = districts.find((d) => d.id === districtId)
  const communities = currentDistrict?.communities || []

  // 执行搜索
  const performSearch = async () => {
    if (!searchValue.trim()) {
      setSearchOptions([])
      return
    }

    setIsSearching(true)
    try {
      const options: SearchOption[] = []

      // 1. 先搜索当前学区已存在的小区
      const existingCommunities = communities.filter((community) =>
        fuzzyMatch(community.name, searchValue)
      )
      
      existingCommunities.forEach((community) => {
        options.push({
          value: community.name,
          label: `[已添加] ${community.name}`,
          location: community.location,
          isExisting: true,
        })
      })

      // 2. 使用Nominatim API搜索新小区
      const nominatimResults = await searchWithNominatim(searchValue)
      
      nominatimResults.forEach((result) => {
        // 检查是否已存在于当前学区
        const alreadyExists = communities.some((c) => c.name === result.name)
        if (!alreadyExists) {
          options.push({
            value: result.name,
            label: result.display_name || result.name,
            location: result.location,
            isExisting: false,
          })
        }
      })

      setSearchOptions(options)
      
      if (options.length === 0) {
        message.info('未找到匹配的小区')
      }
    } catch (error) {
      console.error('Search error:', error)
      message.error('搜索失败，请稍后重试')
      setSearchOptions([])
    } finally {
      setIsSearching(false)
    }
  }

  // 处理搜索按钮点击
  const handleSearchClick = () => {
    performSearch()
  }

  // 处理回车键
  const handlePressEnter = () => {
    performSearch()
  }

  // 处理选择小区
  const handleSelect = (value: string, option: SearchOption) => {
    if (!option.location) return

    // 如果选择的是已存在的小区，只提示，不重复添加
    if (option.isExisting) {
      message.info('该小区已存在于当前学区')
      return
    }

    // 再次检查小区是否已存在（防止重复添加）
    const existingCommunity = communities.find((c) => c.name === value)
    if (existingCommunity) {
      message.warning('该小区已存在')
      return
    }

    // 添加新小区到学区
    addCommunityToDistrict(districtId, {
      name: value,
      location: option.location,
    })

    message.success('小区添加成功')
    setSearchValue('')
    setSearchOptions([])
  }

  // 处理删除小区
  const handleDelete = (communityId: string) => {
    removeCommunityFromDistrict(districtId, communityId)
    message.success('小区已删除')
  }

  // 关闭时清空搜索
  const handleCancel = () => {
    setSearchValue('')
    setSearchOptions([])
    onCancel()
  }

  if (!currentDistrict) {
    return null
  }

  return (
    <Modal
      title={`编辑小区 - ${currentDistrict.name}`}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          关闭
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      {/* 搜索添加区域 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <AutoComplete
            style={{ flex: 1 }}
            value={searchValue}
            options={searchOptions}
            onSelect={(value, option) => handleSelect(value, option as SearchOption)}
            placeholder="搜索小区名称（如：XX小区、XX社区）"
            notFoundContent={isSearching ? '搜索中...' : searchOptions.length === 0 && searchValue ? '未找到结果' : null}
            filterOption={false}
          >
            <Input
              prefix={<PlusOutlined />}
              allowClear
              disabled={isSearching}
              onPressEnter={handlePressEnter}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </AutoComplete>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearchClick}
            loading={isSearching}
          >
            搜索
          </Button>
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
          提示：输入小区名称后按回车或点击搜索按钮，选择后自动添加到学区
        </div>
      </div>

      {/* 小区列表 */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {communities.length === 0 ? (
          <Empty description="暂无小区，请通过上方搜索添加" />
        ) : (
          <List
            dataSource={communities}
            renderItem={(community: Community) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key="delete"
                    title="确定要删除这个小区吗？"
                    onConfirm={() => handleDelete(community.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={community.name}
                  description={`坐标: ${community.location[0].toFixed(6)}, ${community.location[1].toFixed(6)}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
  )
}

