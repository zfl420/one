import { Layout, Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
      className="mobile-header"
    >
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={onToggleSidebar}
        style={{
          fontSize: '20px',
          width: 40,
          height: 40,
        }}
      />

      <style>{`
        @media (min-width: 993px) {
          .mobile-header {
            display: none !important;
          }
        }
      `}</style>
    </AntHeader>
  )
}
