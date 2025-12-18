import { ToolConfig } from './types'
import Calculator from './calculator/Calculator'

export const tools: ToolConfig[] = [
  {
    id: 'calculator',
    name: '计算器',
    category: 'math',
    icon: '🔢',
    component: Calculator,
    route: '/tools/calculator',
    description: '基础四则运算计算器，支持键盘输入和历史记录',
  },
  // 未来添加新工具只需在此注册
]

export { type ToolConfig } from './types'
