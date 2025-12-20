import { Card, Button, Flex } from 'antd'
import { EmojiCategory } from './types'
import { useEmojiPickerStore } from './emoji-picker.store'

interface CategoryNavProps {
  categories: EmojiCategory[]
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const { selectedCategory, setSelectedCategory } = useEmojiPickerStore()

  return (
    <Card style={{ borderRadius: 8 }} bodyStyle={{ padding: '16px 24px' }}>
      <Flex wrap="wrap" gap="small" justify="center">
        <Button
          type={selectedCategory === null ? 'primary' : 'default'}
          size="large"
          onClick={() => setSelectedCategory(null)}
          style={{ borderRadius: 8 }}
        >
          全部
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            type={selectedCategory === category.id ? 'primary' : 'default'}
            size="large"
            onClick={() => setSelectedCategory(category.id)}
            style={{ borderRadius: 8 }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </Flex>
    </Card>
  )
}
