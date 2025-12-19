// 复制emoji到剪贴板
export async function copyToClipboard(emoji: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(emoji)
      return true
    } else {
      // 降级方案：使用传统的document.execCommand
      const textArea = document.createElement('textarea')
      textArea.value = emoji
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

// 获取肤色变体
export function getSkinToneVariant(baseEmoji: string, toneIndex: number): string {
  // 肤色修饰符 Unicode
  const skinTones = [
    '\u{1F3FB}', // Light Skin Tone
    '\u{1F3FC}', // Medium-Light Skin Tone
    '\u{1F3FD}', // Medium Skin Tone
    '\u{1F3FE}', // Medium-Dark Skin Tone
    '\u{1F3FF}', // Dark Skin Tone
  ]

  if (toneIndex < 0 || toneIndex >= skinTones.length) {
    return baseEmoji
  }

  // 移除现有的肤色修饰符
  const cleanEmoji = baseEmoji.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
  
  return cleanEmoji + skinTones[toneIndex]
}

// 从localStorage加载最近使用的emoji
export function loadRecentEmojis(): string[] {
  try {
    const stored = localStorage.getItem('recent-emojis')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载最近使用的emoji失败:', error)
  }
  return []
}

// 保存emoji到最近使用列表
export function saveRecentEmoji(emoji: string): string[] {
  try {
    let recentEmojis = loadRecentEmojis()
    
    // 移除重复的emoji
    recentEmojis = recentEmojis.filter((e) => e !== emoji)
    
    // 添加到开头
    recentEmojis.unshift(emoji)
    
    // 只保留最近20个
    if (recentEmojis.length > 20) {
      recentEmojis = recentEmojis.slice(0, 20)
    }
    
    // 保存到localStorage
    localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis))
    
    return recentEmojis
  } catch (error) {
    console.error('保存最近使用的emoji失败:', error)
    return []
  }
}

// 清空最近使用的emoji
export function clearRecentEmojis(): void {
  try {
    localStorage.removeItem('recent-emojis')
  } catch (error) {
    console.error('清空最近使用的emoji失败:', error)
  }
}

// 检查emoji是否支持肤色变体
export function supportsSkinTone(emoji: string): boolean {
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
  
  // 移除可能存在的肤色修饰符
  const cleanEmoji = emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, '')
  
  return skinToneEmojis.has(cleanEmoji)
}
