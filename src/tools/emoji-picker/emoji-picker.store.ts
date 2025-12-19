import { create } from 'zustand'
import { loadRecentEmojis, saveRecentEmoji } from './utils'

interface EmojiPickerState {
  // 当前选中的分类ID
  selectedCategory: string | null
  // 搜索关键词
  searchQuery: string
  // 最近使用的emoji列表
  recentEmojis: string[]
  // 选中的肤色索引 (-1表示默认，0-4表示5种肤色)
  selectedSkinTone: number
  // 复制成功的提示信息
  copySuccess: string | null
  
  // Actions
  setSelectedCategory: (categoryId: string | null) => void
  setSearchQuery: (query: string) => void
  addRecentEmoji: (emoji: string) => void
  setSelectedSkinTone: (tone: number) => void
  showCopySuccess: (emoji: string) => void
  hideCopySuccess: () => void
  clearRecentEmojis: () => void
  loadRecentEmojis: () => void
}

export const useEmojiPickerStore = create<EmojiPickerState>((set) => ({
  selectedCategory: null,
  searchQuery: '',
  recentEmojis: [],
  selectedSkinTone: -1,
  copySuccess: null,

  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId, searchQuery: '' })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, selectedCategory: null })
  },

  addRecentEmoji: (emoji) => {
    const updated = saveRecentEmoji(emoji)
    set({ recentEmojis: updated })
  },

  setSelectedSkinTone: (tone) => {
    set({ selectedSkinTone: tone })
  },

  showCopySuccess: (emoji) => {
    set({ copySuccess: emoji })
    // 3秒后自动隐藏提示
    setTimeout(() => {
      set({ copySuccess: null })
    }, 3000)
  },

  hideCopySuccess: () => {
    set({ copySuccess: null })
  },

  clearRecentEmojis: () => {
    localStorage.removeItem('recent-emojis')
    set({ recentEmojis: [] })
  },

  loadRecentEmojis: () => {
    const recent = loadRecentEmojis()
    set({ recentEmojis: recent })
  },
}))
