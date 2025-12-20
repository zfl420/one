import { Row, Col, Typography, Card, Alert } from 'antd'
import MortgageForm from './MortgageForm'
import ResultSummary from './ResultSummary'
import RepaymentTable from './RepaymentTable'
import RepaymentChart from './RepaymentChart'

const { Title, Text } = Typography

export default function Mortgage() {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: 8, color: '#52c41a' }}>
          房贷计算器
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          精确计算房贷月供、总利息，支持等额本息和等额本金两种还款方式
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧：输入表单 */}
        <Col xs={24} lg={8}>
          <MortgageForm />
        </Col>

        {/* 右侧：结果摘要 */}
        <Col xs={24} lg={16}>
          <ResultSummary />
        </Col>

        {/* 还款计划表 */}
        <Col span={24}>
          <RepaymentTable />
        </Col>

        {/* 可视化图表 */}
        <Col span={24}>
          <RepaymentChart />
        </Col>

        {/* 使用说明 */}
        <Col span={24}>
          <Card style={{ borderRadius: 8, borderLeft: '4px solid #52c41a' }}>
            <Title level={4} style={{ marginBottom: 16 }}>使用说明</Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <Title level={5} style={{ color: '#52c41a', marginBottom: 12 }}>
                  等额本息
                </Title>
                <ul style={{ paddingLeft: 20, color: '#666', lineHeight: 2 }}>
                  <li>每月还款额固定</li>
                  <li>前期利息占比大，后期本金占比大</li>
                  <li>适合收入稳定的人群</li>
                  <li>还款压力平均分配</li>
                </ul>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5} style={{ color: '#1890ff', marginBottom: 12 }}>
                  等额本金
                </Title>
                <ul style={{ paddingLeft: 20, color: '#666', lineHeight: 2 }}>
                  <li>每月还款额递减</li>
                  <li>前期还款压力大，后期压力小</li>
                  <li>总利息少于等额本息</li>
                  <li>适合前期收入较高的人群</li>
                </ul>
              </Col>
            </Row>
            <Alert
              message="提示"
              description="本计算器仅供参考，实际还款金额以银行或贷款机构最终审批为准。利率可能随政策调整而变化，建议咨询相关金融机构获取最新信息。"
              type="info"
              showIcon
              style={{ marginTop: 24 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
