import { Card, Segmented, Typography } from 'antd'
import { useEmojiPickerStore } from './emoji-picker.store'

const { Text } = Typography

const skinTones = [
  { value: -1, emoji: '👋', label: '默认' },
  { value: 0, emoji: '👋🏻', label: '浅肤色' },
  { value: 1, emoji: '👋🏼', label: '中浅肤色' },
  { value: 2, emoji: '👋🏽', label: '中等肤色' },
  { value: 3, emoji: '👋🏾', label: '中深肤色' },
  { value: 4, emoji: '👋🏿', label: '深肤色' },
]

export default function SkinTonePicker() {
  const { selectedSkinTone, setSelectedSkinTone } = useEmojiPickerStore()

  return (
    <Card
      title="肤色选择"
      size="small"
      style={{ borderRadius: 8 }}
    >
      <Segmented
        options={skinTones.map(tone => ({
          value: tone.value,
          label: (
            <div style={{ padding: '4px 0', fontSize: 24 }} title={tone.label}>
              {tone.emoji}
            </div>
          ),
        }))}
        value={selectedSkinTone}
        onChange={(value) => setSelectedSkinTone(value as number)}
        block
        style={{ marginBottom: 12 }}
      />
      <Text type="secondary" style={{ fontSize: 12 }}>
        选择肤色后，支持的emoji将自动应用该肤色
      </Text>
    </Card>
  )
}
