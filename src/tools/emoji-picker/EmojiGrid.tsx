import { Card, Empty, Typography, Tooltip } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import { EmojiCategory } from './types'
import { useEmojiPickerStore } from './emoji-picker.store'
import { copyToClipboard, getSkinToneVariant, supportsSkinTone } from './utils'
import { toast } from '../../utils/toast'

const { Title, Text } = Typography

interface EmojiGridProps {
  categories: EmojiCategory[]
}

export default function EmojiGrid({ categories }: EmojiGridProps) {
  const { selectedSkinTone, addRecentEmoji } = useEmojiPickerStore()

  const handleEmojiClick = async (emoji: string) => {
    // 应用肤色变体（如果支持且已选择）
    let finalEmoji = emoji
    if (selectedSkinTone >= 0 && supportsSkinTone(emoji)) {
      finalEmoji = getSkinToneVariant(emoji, selectedSkinTone)
    }

    const success = await copyToClipboard(finalEmoji)
    if (success) {
      addRecentEmoji(finalEmoji)
      toast.success(
        <span>
          <span style={{ fontSize: 24, marginRight: 8 }}>{finalEmoji}</span>
          已复制到剪贴板
        </span>,
        2
      )
    } else {
      toast.error('复制失败，请重试')
    }
  }

  if (categories.length === 0) {
    return (
      <Card style={{ borderRadius: 8 }}>
        <Empty
          image={<SmileOutlined style={{ fontSize: 64, color: '#ccc' }} />}
          description={
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                没有找到匹配的emoji
              </Text>
              <Text type="secondary">试试其他搜索词</Text>
            </div>
          }
          style={{ padding: '60px 0' }}
        />
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {categories.map((category) => (
        <Card
          key={category.id}
          style={{ borderRadius: 8 }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ marginBottom: 20 }}>
            <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{category.icon}</span>
              <span>{category.name}</span>
              <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                ({category.emojis.length})
              </Text>
            </Title>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
              gap: 8,
            }}
          >
            {category.emojis.map((emoji, index) => {
              // 应用肤色变体预览（如果支持且已选择）
              let displayEmoji = emoji.emoji
              if (selectedSkinTone >= 0 && supportsSkinTone(emoji.emoji)) {
                displayEmoji = getSkinToneVariant(emoji.emoji, selectedSkinTone)
              }

              return (
                <Tooltip key={`${emoji.emoji}-${index}`} title={emoji.name} placement="top">
                  <button
                    onClick={() => handleEmojiClick(emoji.emoji)}
                    style={{
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 36,
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f2f5'
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    {displayEmoji}
                  </button>
                </Tooltip>
              )
            })}
          </div>
        </Card>
      ))}
    </div>
  )
}
