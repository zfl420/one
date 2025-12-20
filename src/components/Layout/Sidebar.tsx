import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Menu, Drawer, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useEffect, useRef } from 'react'
import { tools } from '../../tools'
import packageJson from '../../../package.json'
import Logo from '../Logo'

const { Text } = Typography

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const siderRef = useRef<HTMLDivElement>(null)

  // 动态设置 Sidebar 宽度到 CSS 变量
  useEffect(() => {
    const updateWidth = () => {
      if (siderRef.current) {
        const width = siderRef.current.offsetWidth
        if (width > 0) {
          document.documentElement.style.setProperty('--sidebar-width', `${width}px`)
        }
      }
    }

    // 使用 setTimeout 确保 DOM 渲染完成
    const timer = setTimeout(updateWidth, 0)
    window.addEventListener('resize', updateWidth)
    
    // 使用 MutationObserver 监听内容变化
    const observer = new MutationObserver(updateWidth)
    if (siderRef.current) {
      observer.observe(siderRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateWidth)
      observer.disconnect()
    }
  }, [tools, location.pathname]) // 当工具列表或路径变化时重新计算

  // 将工具列表转换为 Menu items
  const menuItems: MenuProps['items'] = tools.map((tool) => ({
    key: tool.route,
    icon: <span style={{ fontSize: 20 }}>{tool.icon}</span>,
    label: tool.name,
    onClick: () => {
      navigate(tool.route)
      onClose()
    },
  }))

  // Logo 组件
  const LogoSection = () => (
    <Link 
      to="/" 
      style={{ 
        textDecoration: 'none',
        display: 'flex',
        padding: '16px 16px',
        borderBottom: '1px solid #f0f0f0',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <Logo size={40} />
    </Link>
  )

  // 版本号组件
  const VersionSection = () => (
    <div
      style={{
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
      }}
    >
      <Text type="secondary" style={{ fontSize: 12 }}>
        v{packageJson.version}
      </Text>
    </div>
  )

  // 侧边栏内容
  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#fff',
        width: '100%',
      }}
    >
      {/* Logo 区域（固定顶部） */}
      <LogoSection />
      
      {/* 工具列表区域（可滚动） */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            borderRight: 0,
            height: '100%',
          }}
          inlineIndent={16}
        />
      </div>
      
      {/* 版本号区域（固定底部） */}
      <VersionSection />
    </div>
  )

  return (
    <>
      {/* 桌面端侧边栏 */}
      <div
        ref={siderRef}
        className="desktop-sider"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: 'fit-content',
          minWidth: '160px',
        }}
      >
        {sidebarContent}
      </div>

      {/* 移动端抽屉 */}
      <Drawer
        placement="left"
        onClose={onClose}
        open={isOpen}
        width={256}
        className="mobile-drawer"
        styles={{
          body: { padding: 0 },
        }}
      >
        {sidebarContent}
      </Drawer>

      <style>{`
        @media (max-width: 992px) {
          .desktop-sider {
            display: none !important;
          }
        }
        @media (min-width: 993px) {
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
