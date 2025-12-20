import { useState } from 'react'
import { Layout } from 'antd'
import Header from './Header'
import Sidebar from './Sidebar'

const { Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 移动端 Header */}
      <Header onToggleSidebar={toggleSidebar} />
      
      {/* Sidebar（桌面端固定显示，移动端使用 Drawer） */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* 内容区域 */}
      <Content
        style={{
          marginLeft: 0, // 移动端无 margin
          minHeight: '100vh',
          background: '#f0f2f5',
        }}
        className="main-content"
      >
        {children}
      </Content>

      <style>{`
        :root {
          --sidebar-width: 200px;
        }
        @media (min-width: 993px) {
          .main-content {
            margin-left: var(--sidebar-width) !important;
          }
        }
      `}</style>
    </Layout>
  )
}
