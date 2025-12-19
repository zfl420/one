import { useState } from 'react'
import { EmojiCategory } from './types'
import { useEmojiPickerStore } from './emoji-picker.store'
import { copyToClipboard, getSkinToneVariant, supportsSkinTone } from './utils'

interface EmojiGridProps {
  categories: EmojiCategory[]
}

export default function EmojiGrid({ categories }: EmojiGridProps) {
  const { selectedSkinTone, addRecentEmoji, showCopySuccess } = useEmojiPickerStore()
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null)

  const handleEmojiClick = async (emoji: string, name: string) => {
    // 应用肤色变体（如果支持且已选择）
    let finalEmoji = emoji
    if (selectedSkinTone >= 0 && supportsSkinTone(emoji)) {
      finalEmoji = getSkinToneVariant(emoji, selectedSkinTone)
    }

    const success = await copyToClipboard(finalEmoji)
    if (success) {
      addRecentEmoji(finalEmoji)
      showCopySuccess(finalEmoji)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg">没有找到匹配的emoji</p>
        <p className="text-sm text-gray-400 mt-2">试试其他搜索词</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <span>{category.name}</span>
            <span className="text-sm text-gray-400 font-normal">
              ({category.emojis.length})
            </span>
          </h2>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
            {category.emojis.map((emoji, index) => {
              const emojiKey = `${emoji.emoji}-${index}`
              const isHovered = hoveredEmoji === emojiKey
              
              // 应用肤色变体预览（如果支持且已选择）
              let displayEmoji = emoji.emoji
              if (selectedSkinTone >= 0 && supportsSkinTone(emoji.emoji)) {
                displayEmoji = getSkinToneVariant(emoji.emoji, selectedSkinTone)
              }

              return (
                <div key={emojiKey} className="relative">
                  <button
                    onClick={() => handleEmojiClick(emoji.emoji, emoji.name)}
                    onMouseEnter={() => setHoveredEmoji(emojiKey)}
                    onMouseLeave={() => setHoveredEmoji(null)}
                    className="w-full aspect-square flex items-center justify-center text-3xl sm:text-4xl hover:bg-gray-100 rounded-lg transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    title={emoji.name}
                  >
                    {displayEmoji}
                  </button>
                  {isHovered && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10 pointer-events-none">
                      {emoji.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
