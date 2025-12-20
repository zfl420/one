import { Card, InputNumber, Space, Button, Radio, Alert, Typography } from 'antd'
import { useMortgageStore } from './mortgage.store'

const { Text } = Typography

export default function MortgageForm() {
  const {
    loanAmount,
    loanYears,
    annualRate,
    repaymentType,
    setLoanAmount,
    setLoanYears,
    setAnnualRate,
    setRepaymentType,
  } = useMortgageStore()

  // 常用贷款期限选项
  const yearOptions = [5, 10, 15, 20, 25, 30]

  // 常用利率选项（LPR基准利率及上浮）
  const rateOptions = [
    { label: '3.7% (公积金5年以下)', value: 3.7 },
    { label: '4.2% (公积金5年以上)', value: 4.2 },
    { label: '3.95% (商贷LPR)', value: 3.95 },
    { label: '4.3% (商贷LPR+35BP)', value: 4.3 },
    { label: '4.65% (商贷LPR+70BP)', value: 4.65 },
  ]

  return (
    <Card 
      title="贷款参数" 
      style={{ 
        borderRadius: 8,
        position: 'sticky',
        top: 80,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 贷款总额 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            贷款总额（万元）
          </Text>
          <InputNumber
            value={loanAmount}
            onChange={(value) => setLoanAmount(value || 0)}
            min={1}
            max={10000}
            step={1}
            style={{ width: '100%' }}
            size="large"
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
            建议范围：10-1000万元
          </Text>
        </div>

        {/* 贷款期限 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            贷款期限（年）
          </Text>
          <Space wrap>
            {yearOptions.map((year) => (
              <Button
                key={year}
                type={loanYears === year ? 'primary' : 'default'}
                onClick={() => setLoanYears(year)}
              >
                {year}年
              </Button>
            ))}
          </Space>
          <InputNumber
            value={loanYears}
            onChange={(value) => setLoanYears(value || 0)}
            min={1}
            max={30}
            step={1}
            style={{ width: '100%', marginTop: 12 }}
            size="large"
          />
        </div>

        {/* 年利率 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            年利率（%）
          </Text>
          <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 12 }}>
            {rateOptions.map((option) => (
              <Button
                key={option.value}
                type={annualRate === option.value ? 'primary' : 'default'}
                onClick={() => setAnnualRate(option.value)}
                block
              >
                {option.label}
              </Button>
            ))}
          </Space>
          <InputNumber
            value={annualRate}
            onChange={(value) => setAnnualRate(value || 0)}
            min={0.1}
            max={20}
            step={0.01}
            style={{ width: '100%' }}
            size="large"
            precision={2}
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
            可自定义输入利率
          </Text>
        </div>

        {/* 还款方式 */}
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            还款方式
          </Text>
          <Radio.Group
            value={repaymentType}
            onChange={(e) => setRepaymentType(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio value="equal-payment" style={{ width: '100%', padding: '12px', border: repaymentType === 'equal-payment' ? '2px solid #52c41a' : '2px solid #d9d9d9', borderRadius: 8, marginBottom: 8 }}>
                <div>
                  <Text strong>等额本息</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    每月还款额相同
                  </Text>
                </div>
              </Radio>
              <Radio value="equal-principal" style={{ width: '100%', padding: '12px', border: repaymentType === 'equal-principal' ? '2px solid #52c41a' : '2px solid #d9d9d9', borderRadius: 8 }}>
                <div>
                  <Text strong>等额本金</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    每月还款额递减
                  </Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        {/* 说明信息 */}
        <Alert
          message="提示"
          description="等额本息每月还款额固定，适合收入稳定的人群；等额本金前期还款压力大，但总利息较少。"
          type="info"
          showIcon
        />
      </Space>
    </Card>
  )
}
