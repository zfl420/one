import { useEmojiPickerStore } from './emoji-picker.store'
import { copyToClipboard } from './utils'

export default function RecentEmojis() {
  const { recentEmojis, addRecentEmoji, showCopySuccess, clearRecentEmojis } =
    useEmojiPickerStore()

  if (recentEmojis.length === 0) {
    return null
  }

  const handleEmojiClick = async (emoji: string) => {
    const success = await copyToClipboard(emoji)
    if (success) {
      addRecentEmoji(emoji)
      showCopySuccess(emoji)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          最近使用
        </h3>
        <button
          onClick={clearRecentEmojis}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          清空
        </button>
      </div>
      <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2">
        {recentEmojis.map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            onClick={() => handleEmojiClick(emoji)}
            className="aspect-square flex items-center justify-center text-2xl sm:text-3xl hover:bg-gray-100 rounded-lg transition-all hover:scale-110 active:scale-95"
            title="点击复制"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
