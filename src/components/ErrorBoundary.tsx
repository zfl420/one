import { Component, ErrorInfo, ReactNode } from 'react'
import { Result, Button } from 'antd'
import { logger } from '../utils/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息
    logger.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <Result
            status="error"
            title="页面出现错误"
            subTitle="抱歉，页面遇到了一个错误。请尝试刷新页面或返回首页。"
            extra={[
              <Button type="primary" key="home" onClick={() => (window.location.href = '/')}>
                返回首页
              </Button>,
              <Button key="retry" onClick={this.handleReset}>
                重试
              </Button>,
            ]}
          >
            {import.meta.env.DEV && this.state.error && (
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: '#f5f5f5',
                  borderRadius: 4,
                  textAlign: 'left',
                }}
              >
                <details>
                  <summary style={{ cursor: 'pointer', marginBottom: 8 }}>
                    <strong>错误详情（仅开发环境显示）</strong>
                  </summary>
                  <pre
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      overflow: 'auto',
                      maxHeight: 300,
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </Result>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

