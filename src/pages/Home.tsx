import { Link } from 'react-router-dom'
import { tools } from '../tools'

export default function Home() {
  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, typeof tools>)

  const categoryNames: Record<string, string> = {
    math: '数学工具',
    text: '文本工具',
    convert: '转换工具',
    image: '图像工具',
    dev: '开发工具',
    other: '其他工具',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎使用 One
        </h1>
        <p className="text-lg text-gray-600">
          简单实用的在线工具集合
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {categoryNames[category] || category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.route}
                  className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{tool.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tool.name}
                    </h3>
                  </div>
                  {tool.description && (
                    <p className="text-gray-600 text-sm">{tool.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
