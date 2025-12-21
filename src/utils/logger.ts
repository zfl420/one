/**
 * 统一的日志工具
 * 根据环境变量控制日志输出
 */

const isDevelopment = import.meta.env.DEV

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * 日志工具类
 */
class Logger {
  private shouldLog(level: LogLevel): boolean {
    // 开发环境输出所有日志，生产环境只输出错误
    if (isDevelopment) {
      return true
    }
    return level === LogLevel.ERROR
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug('[DEBUG]', ...args)
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info('[INFO]', ...args)
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn('[WARN]', ...args)
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error('[ERROR]', ...args)
    }
  }
}

export const logger = new Logger()

