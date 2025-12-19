import { useEmojiPickerStore } from './emoji-picker.store'

const skinTones = [
  { index: -1, emoji: '👋', label: '默认' },
  { index: 0, emoji: '👋🏻', label: '浅肤色' },
  { index: 1, emoji: '👋🏼', label: '中浅肤色' },
  { index: 2, emoji: '👋🏽', label: '中等肤色' },
  { index: 3, emoji: '👋🏾', label: '中深肤色' },
  { index: 4, emoji: '👋🏿', label: '深肤色' },
]

export default function SkinTonePicker() {
  const { selectedSkinTone, setSelectedSkinTone } = useEmojiPickerStore()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">肤色选择</h3>
      <div className="flex flex-wrap gap-2">
        {skinTones.map((tone) => (
          <button
            key={tone.index}
            onClick={() => setSelectedSkinTone(tone.index)}
            title={tone.label}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
              selectedSkinTone === tone.index
                ? 'bg-blue-500 ring-2 ring-blue-500 ring-offset-2'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {tone.emoji}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        选择肤色后，支持的emoji将自动应用该肤色
      </p>
    </div>
  )
}
