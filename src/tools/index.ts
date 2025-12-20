import { ToolConfig } from '../types'
import Calculator from './calculator/Calculator'
import VehicleIdentifier from './vehicle-identifier/VehicleIdentifier'
import Mortgage from './mortgage/Mortgage'
import ImageCompressor from './image-compressor/ImageCompressor'
import EmojiPicker from './emoji-picker/EmojiPicker'

export const tools: ToolConfig[] = [
  {
    id: 'calculator',
    name: '计算器',
    category: 'other',
    icon: '🔢',
    component: Calculator,
    route: '/tools/calculator',
    description: '基础四则运算计算器，支持键盘输入和历史记录',
  },
  {
    id: 'vehicle-identifier',
    name: '车型识别',
    category: 'other',
    icon: '🚗',
    component: VehicleIdentifier,
    route: '/tools/vehicle-identifier',
    description: '通过VIN码图片识别或手动输入查询车型信息，支持历史记录',
  },
  {
    id: 'mortgage',
    name: '房贷计算器',
    category: 'other',
    icon: '🏠',
    component: Mortgage,
    route: '/tools/mortgage',
    description: '房贷计算器，支持等额本息和等额本金，含还款计划表和图表分析',
  },
  {
    id: 'image-compressor',
    name: '图片压缩',
    category: 'image',
    icon: '🖼️',
    component: ImageCompressor,
    route: '/tools/image-compressor',
    description: '批量压缩图片，支持多种尺寸调整方式、质量预设、EXIF移除和格式转换',
  },
  {
    id: 'emoji-picker',
    name: 'Emoji大全',
    category: 'other',
    icon: '😀',
    component: EmojiPicker,
    route: '/tools/emoji-picker',
    description: '完整的Emoji表情大全，支持搜索、分类浏览、肤色选择和一键复制',
  },
  // 未来添加新工具只需在此注册
]

export { type ToolConfig } from '../types'
