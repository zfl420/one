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
  
  // Actions
  setSelectedCategory: (categoryId: string | null) => void
  setSearchQuery: (query: string) => void
  addRecentEmoji: (emoji: string) => void
  setSelectedSkinTone: (tone: number) => void
  clearRecentEmojis: () => void
  loadRecentEmojis: () => void
}

export const useEmojiPickerStore = create<EmojiPickerState>((set) => ({
  selectedCategory: null,
  searchQuery: '',
  recentEmojis: [],
  selectedSkinTone: -1,

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

  clearRecentEmojis: () => {
    localStorage.removeItem('recent-emojis')
    set({ recentEmojis: [] })
  },

  loadRecentEmojis: () => {
    const recent = loadRecentEmojis()
    set({ recentEmojis: recent })
  },
}))
