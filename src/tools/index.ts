import { ToolConfig } from './types'
import Calculator from './calculator/Calculator'
import Mortgage from './mortgage/Mortgage'

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
    id: 'mortgage',
    name: '房贷计算器',
    category: 'other',
    icon: '🏠',
    component: Mortgage,
    route: '/tools/mortgage',
    description: '房贷计算器，支持等额本息和等额本金，含还款计划表和图表分析',
  },
  // 未来添加新工具只需在此注册
]

export { type ToolConfig } from './types'
