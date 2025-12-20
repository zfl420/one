import { Row, Col, Card, Statistic, Progress, Typography } from 'antd'
import { useMortgageStore } from './mortgage.store'
import { formatCurrency } from './utils'

const { Text } = Typography

export default function ResultSummary() {
  const {
    monthlyPayment,
    totalPayment,
    totalInterest,
    loanAmount,
    repaymentType,
    schedule,
  } = useMortgageStore()

  const principal = loanAmount * 10000

  // 计算本息占比
  const principalPercent = (principal / totalPayment) * 100
  const interestPercent = (totalInterest / totalPayment) * 100

  // 等额本金显示首末月供范围
  const firstMonthPayment = schedule[0]?.monthlyPayment || 0
  const lastMonthPayment = schedule[schedule.length - 1]?.monthlyPayment || 0

  return (
    <Row gutter={[16, 16]}>
      {/* 月供 */}
      <Col xs={24} sm={12}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
            color: '#fff',
            borderRadius: 8,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>月供金额</span>}
            value={repaymentType === 'equal-payment' ? monthlyPayment : firstMonthPayment}
            prefix="¥"
            precision={2}
            valueStyle={{ color: '#fff' }}
          />
          {repaymentType === 'equal-principal' && (
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
              递减至 ¥ {formatCurrency(lastMonthPayment)}
            </Text>
          )}
        </Card>
      </Col>

      {/* 还款总额 */}
      <Col xs={24} sm={12}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
            color: '#fff',
            borderRadius: 8,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>还款总额</span>}
            value={totalPayment}
            prefix="¥"
            precision={2}
            valueStyle={{ color: '#fff' }}
            suffix={<span style={{ fontSize: 14 }}>本金 + 利息</span>}
          />
        </Card>
      </Col>

      {/* 支付利息 */}
      <Col xs={24} sm={12}>
        <Card
          style={{
            background: 'linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)',
            color: '#fff',
            borderRadius: 8,
          }}
        >
          <Statistic
            title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>支付利息</span>}
            value={totalInterest}
            prefix="¥"
            precision={2}
            valueStyle={{ color: '#fff' }}
          />
        </Card>
      </Col>

      {/* 本息占比 */}
      <Col xs={24} sm={12}>
        <Card style={{ borderRadius: 8, height: '100%' }}>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>
            本息构成
          </Text>
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                本金 {principalPercent.toFixed(1)}%
              </Text>
            </div>
            <Progress
              percent={principalPercent}
              strokeColor="#52c41a"
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ¥ {formatCurrency(principal)}
            </Text>
          </div>
          <div>
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                利息 {interestPercent.toFixed(1)}%
              </Text>
            </div>
            <Progress
              percent={interestPercent}
              strokeColor="#fa8c16"
              showInfo={false}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ¥ {formatCurrency(totalInterest)}
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
