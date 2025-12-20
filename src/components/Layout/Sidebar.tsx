import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Drawer } from 'antd'
import type { MenuProps } from 'antd'
import { tools } from '../../tools'

const { Sider } = Layout

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

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

  const menuContent = (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      style={{ 
        height: '100%', 
        borderRight: 0,
      }}
    />
  )

  return (
    <>
      {/* 桌面端侧边栏 */}
      <Sider
        width={256}
        style={{
          background: '#fff',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: 64,
          left: 0,
          overflow: 'auto',
        }}
        className="desktop-sider"
      >
        {menuContent}
      </Sider>

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
        {menuContent}
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
