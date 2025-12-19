import emojiData from 'unicode-emoji-json'
import { EmojiCategory, Emoji } from './types'

// 分类映射（中文名称和图标）
const categoryMap: Record<string, { name: string; icon: string }> = {
  'Smileys & Emotion': { name: '笑脸与表情', icon: '😀' },
  'People & Body': { name: '人物与身体', icon: '👋' },
  'Animals & Nature': { name: '动物与自然', icon: '🐶' },
  'Food & Drink': { name: '食物与饮料', icon: '🍎' },
  'Travel & Places': { name: '旅行与地点', icon: '✈️' },
  'Activities': { name: '活动', icon: '⚽' },
  'Objects': { name: '物品', icon: '💡' },
  'Symbols': { name: '符号', icon: '❤️' },
  'Flags': { name: '旗帜', icon: '🏁' },
}

// 支持肤色变体的emoji列表（手势、人物等）
const skinToneEmojis = new Set([
  '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
  '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁',
  '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩',
  '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️',
  '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶',
  '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🧍', '🧎', '🏃',
  '💃', '🕺', '🕴️', '👯', '🧖', '🧗', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏄', '🚣', '🏊', '⛹️',
  '🏋️', '🚴', '🚵', '🤸', '🤼', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌', '👫', '👬', '👭', '💏',
  '💑', '👪', '🗣️', '👤', '👥', '🫂'
])

// 处理emoji数据
export function processEmojiData(): EmojiCategory[] {
  const categoriesMap = new Map<string, Emoji[]>()

  // 遍历所有emoji数据
  Object.entries(emojiData).forEach(([emoji, data]: [string, any]) => {
    // 跳过肤色变体emoji（它们会单独处理）
    if (data.skin_tone_support === true || /[\u{1F3FB}-\u{1F3FF}]/u.test(emoji)) {
      return
    }

    const group = data.group || 'Symbols'
    
    if (!categoriesMap.has(group)) {
      categoriesMap.set(group, [])
    }

    categoriesMap.get(group)!.push({
      emoji,
      name: data.name || data.slug || emoji,
      keywords: data.keywords || [],
      variants: skinToneEmojis.has(emoji) ? getSkinToneVariants(emoji) : undefined,
    })
  })

  // 转换为分类数组
  const categories: EmojiCategory[] = []
  
  // 按照预定义的顺序添加分类
  Object.keys(categoryMap).forEach((key) => {
    const emojis = categoriesMap.get(key)
    if (emojis && emojis.length > 0) {
      categories.push({
        id: key.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-'),
        name: categoryMap[key].name,
        icon: categoryMap[key].icon,
        emojis,
      })
    }
  })

  return categories
}

// 获取肤色变体
function getSkinToneVariants(emoji: string): string[] {
  const skinTones = [
    '\u{1F3FB}', // 浅肤色
    '\u{1F3FC}', // 中浅肤色
    '\u{1F3FD}', // 中等肤色
    '\u{1F3FE}', // 中深肤色
    '\u{1F3FF}', // 深肤色
  ]

  return skinTones.map(tone => emoji + tone)
}

// 搜索emoji
export function searchEmojis(
  categories: EmojiCategory[],
  query: string
): EmojiCategory[] {
  if (!query.trim()) {
    return categories
  }

  const lowerQuery = query.toLowerCase()
  const results: EmojiCategory[] = []

  categories.forEach((category) => {
    const matchedEmojis = category.emojis.filter((emoji) => {
      // 搜索名称
      if (emoji.name.toLowerCase().includes(lowerQuery)) {
        return true
      }
      // 搜索关键词
      if (emoji.keywords?.some((kw) => kw.toLowerCase().includes(lowerQuery))) {
        return true
      }
      // 搜索emoji本身
      if (emoji.emoji.includes(query)) {
        return true
      }
      return false
    })

    if (matchedEmojis.length > 0) {
      results.push({
        ...category,
        emojis: matchedEmojis,
      })
    }
  })

  return results
}

// 导出处理后的数据
export const emojiCategories = processEmojiData()
