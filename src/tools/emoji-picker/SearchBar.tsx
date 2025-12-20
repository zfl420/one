import { Input, Flex } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useEmojiPickerStore } from './emoji-picker.store'

const { Search } = Input

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useEmojiPickerStore()

  return (
    <Flex justify="center">
      <Search
        placeholder="搜索emoji..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={(value) => setSearchQuery(value)}
        size="large"
        allowClear
        prefix={<SearchOutlined />}
        style={{
          maxWidth: 600,
          width: '100%',
        }}
      />
    </Flex>
  )
}
