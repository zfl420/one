import { useMortgageStore } from './mortgage.store'
import { calculateCumulativeData, formatCurrency } from './utils'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function RepaymentChart() {
  const {
    schedule,
    loanAmount,
    totalInterest,
    showChart,
    toggleChart,
    activeChartTab,
    setActiveChartTab,
  } = useMortgageStore()

  const principal = loanAmount * 10000

  // 准备本息构成趋势数据（取样，避免数据点过多）
  const trendData = schedule.filter((_, index) => {
    // 如果总期数小于120期，每期都显示；否则每3期取1个点
    return schedule.length <= 120 ? true : index % 3 === 0
  })

  // 准备累计还款数据
  const cumulativeData = calculateCumulativeData(schedule).filter((_, index) => {
    return schedule.length <= 120 ? true : index % 3 === 0
  })

  // 准备饼图数据
  const pieData = [
    { name: '本金', value: principal, color: '#3b82f6' },
    { name: '利息', value: totalInterest, color: '#f97316' },
  ]

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-1">
            第 {payload[0].payload.period} 期
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ¥ {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // 饼图标签渲染
  const renderPieLabel = (entry: any) => {
    const percent = ((entry.value / (principal + totalInterest)) * 100).toFixed(1)
    return `${entry.name} ${percent}%`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 标题栏 */}
      <div
        className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white cursor-pointer flex items-center justify-between"
        onClick={toggleChart}
      >
        <h3 className="text-lg font-semibold">可视化分析</h3>
        <svg
          className={`w-6 h-6 transition-transform ${showChart ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* 图表内容 */}
      {showChart && (
        <div className="p-6">
          {/* Tab切换 */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveChartTab('trend')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeChartTab === 'trend'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              本息构成趋势
            </button>
            <button
              onClick={() => setActiveChartTab('cumulative')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeChartTab === 'cumulative'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              累计还款进度
            </button>
            <button
              onClick={() => setActiveChartTab('pie')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeChartTab === 'pie'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              本息占比
            </button>
          </div>

          {/* 图表1：本息构成趋势 */}
          {activeChartTab === 'trend' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    label={{ value: '还款期数', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    label={{ value: '金额（元）', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    name="本金"
                    stroke="#3b82f6"
                    fill="url(#colorPrincipal)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    name="利息"
                    stroke="#f97316"
                    fill="url(#colorInterest)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                图表展示每月还款中本金和利息的变化趋势
              </p>
            </div>
          )}

          {/* 图表2：累计还款进度 */}
          {activeChartTab === 'cumulative' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    label={{ value: '还款期数', position: 'insideBottom', offset: -5 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    label={{ value: '累计金额（元）', angle: -90, position: 'insideLeft' }}
                    stroke="#6b7280"
                    tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cumulativePrincipal"
                    name="累计本金"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeInterest"
                    name="累计利息"
                    stackId="1"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4 text-center">
                图表展示累计已还本金和利息的进度
              </p>
            </div>
          )}

          {/* 图表3：本息占比饼图 */}
          {activeChartTab === 'pie' && (
            <div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderPieLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) => 
                      value !== undefined ? `¥ ${formatCurrency(value)}` : ''
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">贷款本金</p>
                  <p className="text-xl font-bold text-blue-600">
                    ¥ {formatCurrency(principal)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((principal / (principal + totalInterest)) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">支付利息</p>
                  <p className="text-xl font-bold text-orange-600">
                    ¥ {formatCurrency(totalInterest)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((totalInterest / (principal + totalInterest)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
