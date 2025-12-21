import { message } from 'antd'
import type { ReactNode } from 'react'

/**
 * 统一的 Toast 通知系统
 * 使用 Ant Design 的 message API
 */
export const toast = {
  /**
   * 成功提示
   */
  success: (content: ReactNode, duration = 3) => {
    message.success(content, duration)
  },

  /**
   * 错误提示
   */
  error: (content: ReactNode, duration = 3) => {
    message.error(content, duration)
  },

  /**
   * 警告提示
   */
  warning: (content: ReactNode, duration = 3) => {
    message.warning(content, duration)
  },

  /**
   * 信息提示
   */
  info: (content: ReactNode, duration = 3) => {
    message.info(content, duration)
  },

  /**
   * 加载提示
   */
  loading: (content: ReactNode, duration = 0) => {
    return message.loading(content, duration)
  },
}

