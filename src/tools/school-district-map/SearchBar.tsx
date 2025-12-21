import { useState, useEffect } from 'react'
import { Input, Button, List, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useSchoolDistrictMapStore } from './school-district-map.store'
import { SearchResult } from './types'
import { useDebounce } from '../../hooks/useDebounce'

interface SearchBarProps {
  onSearchResultSelect?: (result: SearchResult) => void
  onManualMark?: () => void
}

export default function SearchBar({ onSearchResultSelect, onManualMark }: SearchBarProps) {
  const { searchKeyword, searchResults, search, clearSearch, setSearchKeyword } =
    useSchoolDistrictMapStore()

  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const debouncedKeyword = useDebounce(searchKeyword, 300)

  // 执行搜索
  useEffect(() => {
    if (debouncedKeyword.trim()) {
      setIsSearching(true)
      search(debouncedKeyword).finally(() => {
        setIsSearching(false)
        setShowResults(true)
      })
    } else {
      clearSearch()
      setShowResults(false)
    }
  }, [debouncedKeyword, search, clearSearch])

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      setIsSearching(true)
      search(searchKeyword).finally(() => {
        setIsSearching(false)
        setShowResults(true)
      })
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (onSearchResultSelect) {
      onSearchResultSelect(result)
    }
    setShowResults(false)
  }

  const handleManualMark = () => {
    if (onManualMark) {
      onManualMark()
    }
    setShowResults(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Input
        placeholder="搜索学区名称或小区名称..."
        prefix={<SearchOutlined />}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onPressEnter={handleSearch}
        onFocus={() => {
          if (searchResults.length > 0) {
            setShowResults(true)
          }
        }}
        onBlur={() => {
          // 延迟隐藏，以便点击结果
          setTimeout(() => setShowResults(false), 200)
        }}
        suffix={isSearching ? <span>搜索中...</span> : null}
        allowClear
      />

      {/* 搜索结果下拉列表 */}
      {showResults && searchResults.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
            marginTop: '4px',
          }}
        >
          <List
            size="small"
            dataSource={searchResults}
            renderItem={(result) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  padding: '8px 16px',
                }}
                onClick={() => handleResultClick(result)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                {result.type === 'district' && result.district ? (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      📍 学区: {result.district.name}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      {result.district.type === 'primary' ? '小学' : '初中'} ·{' '}
                      {result.district.schools.length} 所学校
                    </div>
                  </div>
                ) : result.type === 'community' && result.community ? (
                  <div>
                    <div style={{ fontWeight: 'bold' }}>
                      🏠 小区: {result.community.name}
                    </div>
                    {result.communityDistrict ? (
                      <div style={{ color: '#666', fontSize: '12px' }}>
                        所属学区: {result.communityDistrict.name}
                      </div>
                    ) : (
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        暂未归属任何学区
                      </div>
                    )}
                  </div>
                ) : null}
              </List.Item>
            )}
          />
        </div>
      )}

      {/* 未找到结果时的提示 */}
      {showResults &&
        !isSearching &&
        searchKeyword.trim() &&
        searchResults.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: '16px',
              zIndex: 1000,
              marginTop: '4px',
            }}
          >
            <Empty description="未找到结果" />
            {onManualMark && (
              <Button
                type="link"
                size="small"
                onClick={handleManualMark}
                style={{ marginTop: '8px' }}
              >
                手动标记位置
              </Button>
            )}
          </div>
        )}
    </div>
  )
}

