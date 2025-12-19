import { useEffect, useMemo } from 'react'
import { useEmojiPickerStore } from './emoji-picker.store'
import { emojiCategories, searchEmojis } from './data'
import SearchBar from './SearchBar'
import CategoryNav from './CategoryNav'
import SkinTonePicker from './SkinTonePicker'
import RecentEmojis from './RecentEmojis'
import EmojiGrid from './EmojiGrid'
import CopyToast from './CopyToast'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Emoji 大全
          </h1>
          <p className="text-gray-600">
            点击emoji即可复制到剪贴板 · 支持搜索、分类浏览和肤色选择
          </p>
        </div>

        {/* 搜索栏 */}
        <SearchBar />

        {/* 分类导航 */}
        {!searchQuery && <CategoryNav categories={emojiCategories} />}

        {/* 侧边栏：肤色选择器 + 最近使用 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧栏 */}
          <div className="lg:col-span-1 space-y-4">
            <SkinTonePicker />
            <RecentEmojis />
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {searchQuery && (
              <div className="mb-4 text-sm text-gray-600">
                搜索 "<span className="font-semibold">{searchQuery}</span>" 的结果
              </div>
            )}
            <EmojiGrid categories={displayedCategories} />
          </div>
        </div>
      </div>

      {/* 复制成功提示 */}
      <CopyToast />
    </div>
  )
}
