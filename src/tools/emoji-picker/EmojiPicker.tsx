import { useEffect, useMemo } from 'react'
import { Row, Col, Card, Typography } from 'antd'
import { useEmojiPickerStore } from './emoji-picker.store'
import { emojiCategories, searchEmojis } from './data'
import SearchBar from './SearchBar'
import CategoryNav from './CategoryNav'
import SkinTonePicker from './SkinTonePicker'
import RecentEmojis from './RecentEmojis'
import EmojiGrid from './EmojiGrid'
import CopyToast from './CopyToast'

const { Text } = Typography

export default function EmojiPicker() {
  const { selectedCategory, searchQuery, loadRecentEmojis } = useEmojiPickerStore()

  // 加载最近使用的emoji
  useEffect(() => {
    loadRecentEmojis()
  }, [loadRecentEmojis])

  // 根据选中的分类和搜索词过滤emoji
  const displayedCategories = useMemo(() => {
    let filtered = emojiCategories

    // 如果有搜索词，进行搜索过滤
    if (searchQuery.trim()) {
      filtered = searchEmojis(filtered, searchQuery)
    }
    // 如果选中了分类，只显示该分类
    else if (selectedCategory) {
      filtered = filtered.filter((cat) => cat.id === selectedCategory)
    }

    return filtered
  }, [selectedCategory, searchQuery])

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '24px 16px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <Row gutter={[16, 16]}>
          {/* 搜索栏 */}
          <Col span={24}>
            <Card style={{ borderRadius: 8 }} bodyStyle={{ padding: '20px 24px' }}>
              <SearchBar />
            </Card>
          </Col>

          {/* 分类导航 */}
          {!searchQuery && (
            <Col span={24}>
              <CategoryNav categories={emojiCategories} />
            </Col>
          )}

          {/* 侧边栏：肤色选择器 + 最近使用 */}
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <SkinTonePicker />
              </Col>
              <Col span={24}>
                <RecentEmojis />
              </Col>
            </Row>
          </Col>

          {/* 主内容区 */}
          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            {searchQuery && (
              <Card style={{ marginBottom: 16, borderRadius: 8 }} bodyStyle={{ padding: '12px 24px' }}>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  搜索 "<Text strong style={{ color: '#1890ff' }}>{searchQuery}</Text>" 的结果
                </Text>
              </Card>
            )}
            <EmojiGrid categories={displayedCategories} />
          </Col>
        </Row>
      </div>

      {/* 复制成功提示 */}
      <CopyToast />
    </div>
  )
}
