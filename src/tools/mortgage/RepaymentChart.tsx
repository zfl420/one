import { Card, Tabs, Typography, Space, Statistic } from 'antd'
import { BarChartOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
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

const { Text } = Typography

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
    return schedule.length <= 120 ? true : index % 3 === 0
  })

  // 准备累计还款数据
  const cumulativeData = calculateCumulativeData(schedule).filter((_, index) => {
    return schedule.length <= 120 ? true : index % 3 === 0
  })

  // 准备饼图数据
  const pieData = [
    { name: '本金', value: principal, color: '#52c41a' },
    { name: '利息', value: totalInterest, color: '#fa8c16' },
  ]

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card size="small" style={{ minWidth: 150 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
            第 {payload[0].payload.period} 期
          </Text>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ color: entry.color, marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>
                {entry.name}: ¥ {formatCurrency(entry.value)}
              </Text>
            </div>
          ))}
        </Card>
      )
    }
    return null
  }

  // 饼图标签渲染
  const renderPieLabel = (entry: any) => {
    const percent = ((entry.value / (principal + totalInterest)) * 100).toFixed(1)
    return `${entry.name} ${percent}%`
  }

  const tabItems = [
    {
      key: 'trend',
      label: '本息构成趋势',
      children: (
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#52c41a" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fa8c16" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fa8c16" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                label={{ value: '还款期数', position: 'insideBottom', offset: -5 }}
                stroke="#666"
              />
              <YAxis
                label={{ value: '金额（元）', angle: -90, position: 'insideLeft' }}
                stroke="#666"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="principal"
                name="本金"
                stroke="#52c41a"
                fill="url(#colorPrincipal)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="interest"
                name="利息"
                stroke="#fa8c16"
                fill="url(#colorInterest)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
            图表展示每月还款中本金和利息的变化趋势
          </Text>
        </div>
      ),
    },
    {
      key: 'cumulative',
      label: '累计还款进度',
      children: (
        <div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                label={{ value: '还款期数', position: 'insideBottom', offset: -5 }}
                stroke="#666"
              />
              <YAxis
                label={{ value: '累计金额（元）', angle: -90, position: 'insideLeft' }}
                stroke="#666"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="cumulativePrincipal"
                name="累计本金"
                stackId="1"
                stroke="#52c41a"
                fill="#52c41a"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="cumulativeInterest"
                name="累计利息"
                stackId="1"
                stroke="#fa8c16"
                fill="#fa8c16"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: 16 }}>
            图表展示累计已还本金和利息的进度
          </Text>
        </div>
      ),
    },
    {
      key: 'pie',
      label: '本息占比',
      children: (
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
          <Space direction="horizontal" size="large" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
            <Statistic
              title="贷款本金"
              value={principal}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
            <Statistic
              title="支付利息"
              value={totalInterest}
              prefix="¥"
              precision={2}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Space>
        </div>
      ),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>可视化分析</span>
        </Space>
      }
      extra={
        <span onClick={toggleChart} style={{ cursor: 'pointer' }}>
          {showChart ? <UpOutlined /> : <DownOutlined />}
        </span>
      }
      style={{ borderRadius: 8 }}
    >
      {showChart && (
        <Tabs
          activeKey={activeChartTab}
          onChange={(key) => setActiveChartTab(key as 'trend' | 'cumulative' | 'pie')}
          items={tabItems}
        />
      )}
    </Card>
  )
}
