export interface Emoji {
  emoji: string
  name: string
  keywords?: string[]
  variants?: string[] // 肤色变体
}

export interface EmojiCategory {
  id: string
  name: string
  icon: string
  emojis: Emoji[]
}
