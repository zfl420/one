import { EmojiCategory } from './types'
import { useEmojiPickerStore } from './emoji-picker.store'

interface CategoryNavProps {
  categories: EmojiCategory[]
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const { selectedCategory, setSelectedCategory } = useEmojiPickerStore()

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          selectedCategory === null
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedCategory === category.id
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          <span className="text-xl">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  )
}
