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
      <Header onToggleSidebar={toggleSidebar} />
      <Layout>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <Content
          style={{
            minHeight: 'calc(100vh - 64px)',
            background: '#f0f2f5',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
