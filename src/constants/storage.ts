/**
 * 存储相关的常量
 */

// 存储 key 前缀，避免不同工具之间的冲突
export const STORAGE_PREFIX = 'one-tools'

// 各工具的存储 key
export const STORAGE_KEYS = {
  CALCULATOR_HISTORY: `${STORAGE_PREFIX}:calculator:history`,
  RECENT_EMOJIS: `${STORAGE_PREFIX}:emoji:recent`,
  SCHOOL_DISTRICT_MAP: `${STORAGE_PREFIX}:school-district-map:districts`,
} as const

// 最大历史记录数量
export const MAX_HISTORY_ITEMS = {
  CALCULATOR: 100,
  EMOJI: 20,
  VEHICLE: 20,
} as const

