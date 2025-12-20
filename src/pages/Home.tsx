import { useState, useEffect } from 'react'
import { Card, Typography, Space, Divider } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import packageJson from '../../package.json'

const { Title, Text } = Typography

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatOptions = {
    timeZone: 'Asia/Shanghai',
    locale: 'zh-CN',
  } as const

  const date = currentTime.toLocaleDateString('zh-CN', {
    ...formatOptions,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const time = currentTime.toLocaleTimeString('zh-CN', {
    ...formatOptions,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const weekday = currentTime.toLocaleDateString('zh-CN', {
    ...formatOptions,
    weekday: 'long',
  })

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: 900, width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          {/* 欢迎信息 */}
          <Space direction="vertical" size="middle">
            <Title
              level={1}
              style={{
                fontSize: 72,
                margin: 0,
                color: '#ff0000',
              }}
            >
              one
            </Title>
            <Space>
              <Text type="secondary" style={{ fontSize: 20 }}>
                简洁、优雅、现代
              </Text>
              <Text type="secondary" style={{ fontSize: 16 }}>
                v{packageJson.version}
              </Text>
            </Space>
          </Space>

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
  )
}
