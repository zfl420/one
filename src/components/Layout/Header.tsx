import { Link } from 'react-router-dom'
import { Layout, Button, Space, Typography } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import packageJson from '../../../package.json'

const { Header: AntHeader } = Layout
const { Text } = Typography

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
        justifyContent: 'space-between',
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Space size="middle">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggleSidebar}
          style={{
            fontSize: '20px',
            width: 40,
            height: 40,
          }}
          className="mobile-menu-btn"
        />
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Space>
            <div
              style={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              O
            </div>
            <Text
              strong
              style={{
                fontSize: 24,
                color: '#000',
              }}
            >
              one
            </Text>
          </Space>
        </Link>
      </Space>

      <Text type="secondary" style={{ fontSize: 14 }}>
        v{packageJson.version}
      </Text>

      <style>{`
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 993px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </AntHeader>
  )
}
