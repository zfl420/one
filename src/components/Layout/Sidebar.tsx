import { Link, useLocation } from 'react-router-dom'
import { tools } from '../../tools'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, typeof tools>)

  const categoryNames: Record<string, string> = {
    math: '',
    text: '文本工具',
    convert: '转换工具',
    image: '图像工具',
    dev: '开发工具',
    other: '其他工具',
  }

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto
        `}
      >
        <nav className="p-4">
          <div className="space-y-6">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category}>
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {categoryNames[category] || category}
                </h3>
                <div className="space-y-1">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                        ${location.pathname === tool.route
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      <span className="text-xl">{tool.icon}</span>
                      <span className="font-medium">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  )
}
