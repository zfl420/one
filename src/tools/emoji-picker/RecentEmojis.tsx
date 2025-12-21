import { Card, Button } from 'antd'
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEmojiPickerStore } from './emoji-picker.store'
import { copyToClipboard } from './utils'
import { toast } from '../../utils/toast'

export default function RecentEmojis() {
  const { recentEmojis, addRecentEmoji, clearRecentEmojis } = useEmojiPickerStore()

  if (recentEmojis.length === 0) {
    return null
  }

  const handleEmojiClick = async (emoji: string) => {
    const success = await copyToClipboard(emoji)
    if (success) {
      addRecentEmoji(emoji)
      toast.success(
        <span>
          <span style={{ fontSize: 24, marginRight: 8 }}>{emoji}</span>
          已复制到剪贴板
        </span>,
        2
      )
    } else {
      toast.error('复制失败，请重试')
    }
  }

  return (
    <Card
      title={
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          最近使用
        </span>
      }
      size="small"
      extra={
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={clearRecentEmojis}
        />
      }
      style={{ borderRadius: 8 }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
          gap: 8,
        }}
      >
        {recentEmojis.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            onClick={() => handleEmojiClick(emoji)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
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
            title="点击复制"
          >
            {emoji}
          </button>
        ))}
      </div>
    </Card>
  )
}
