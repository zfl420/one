import { useState, useEffect, useMemo } from 'react'
import { Card, Typography, Space, Divider, Button } from 'antd'
import { ClockCircleOutlined, MailOutlined } from '@ant-design/icons'

const { Text } = Typography

const formatOptions = {
  timeZone: 'Asia/Shanghai',
  locale: 'zh-CN',
} as const

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 使用 useMemo 缓存格式化结果，避免每次渲染都重新计算
  const { date, time, weekday } = useMemo(() => {
    return {
      date: currentTime.toLocaleDateString('zh-CN', {
        ...formatOptions,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: currentTime.toLocaleTimeString('zh-CN', {
        ...formatOptions,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      weekday: currentTime.toLocaleDateString('zh-CN', {
        ...formatOptions,
        weekday: 'long',
      }),
    }
  }, [currentTime])

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
      }}
    >
      {/* 中间内容区域 - 时间卡片居中显示 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: 900, width: '100%' }}>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            {/* 北京时间显示 */}
            <Card
              style={{
                padding: '48px 24px',
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Space>
                  <ClockCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                    北京时间
                  </Text>
                </Space>

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {/* 时间 */}
                  <div
                    style={{
                      fontSize: 72,
                      fontWeight: 'bold',
                      color: '#000',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-2px',
                    }}
                  >
                    {time}
                  </div>

                  {/* 日期和星期 */}
                  <Space split={<Divider type="vertical" />}>
                    <Text style={{ fontSize: 24, color: '#666' }}>{date}</Text>
                    <Text style={{ fontSize: 24, color: '#666' }}>{weekday}</Text>
                  </Space>
                </Space>
              </Space>
            </Card>
          </Space>
        </div>
      </div>

      {/* 底部联系按钮 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '24px',
        }}
      >
        <Button
          type="primary"
          icon={<MailOutlined />}
          size="large"
          href="mailto:zfl420@outlook.com"
        >
          联系我
        </Button>
      </div>
    </div>
  )
}
