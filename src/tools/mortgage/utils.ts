// 房贷计算工具函数

export interface RepaymentRecord {
  period: number // 期数
  monthlyPayment: number // 月供
  principal: number // 本金
  interest: number // 利息
  remainingPrincipal: number // 剩余本金
}

/**
 * 格式化金额，添加千分位分隔符
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * 计算等额本息还款
 * @param loanAmount 贷款总额（万元）
 * @param annualRate 年利率（%）
 * @param loanYears 贷款期限（年）
 */
export function calculateEqualPayment(
  loanAmount: number,
  annualRate: number,
  loanYears: number
): {
  monthlyPayment: number
  totalPayment: number
  totalInterest: number
  schedule: RepaymentRecord[]
} {
  const principal = loanAmount * 10000 // 转换为元
  const monthlyRate = annualRate / 100 / 12 // 月利率
  const months = loanYears * 12 // 还款月数

  // 月供 = [贷款本金 × 月利率 × (1+月利率)^还款月数] / [(1+月利率)^还款月数 - 1]
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)

  const schedule: RepaymentRecord[] = []
  let remainingPrincipal = principal

  for (let i = 1; i <= months; i++) {
    // 每月利息 = 剩余本金 × 月利率
    const interest = remainingPrincipal * monthlyRate
    // 每月本金 = 月供 - 每月利息
    const principalPayment = monthlyPayment - interest
    remainingPrincipal -= principalPayment

    schedule.push({
      period: i,
      monthlyPayment,
      principal: principalPayment,
      interest,
      remainingPrincipal: Math.max(0, remainingPrincipal), // 避免负数
    })
  }

  const totalPayment = monthlyPayment * months
  const totalInterest = totalPayment - principal

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  }
}

/**
 * 计算等额本金还款
 * @param loanAmount 贷款总额（万元）
 * @param annualRate 年利率（%）
 * @param loanYears 贷款期限（年）
 */
export function calculateEqualPrincipal(
  loanAmount: number,
  annualRate: number,
  loanYears: number
): {
  monthlyPayment: number // 首月月供
  totalPayment: number
  totalInterest: number
  schedule: RepaymentRecord[]
} {
  const principal = loanAmount * 10000 // 转换为元
  const monthlyRate = annualRate / 100 / 12 // 月利率
  const months = loanYears * 12 // 还款月数

  // 每月本金 = 贷款本金 / 还款月数
  const monthlyPrincipal = principal / months

  const schedule: RepaymentRecord[] = []
  let remainingPrincipal = principal
  let totalPayment = 0

  for (let i = 1; i <= months; i++) {
    // 每月利息 = 剩余本金 × 月利率
    const interest = remainingPrincipal * monthlyRate
    // 月供 = 每月本金 + 每月利息
    const monthlyPayment = monthlyPrincipal + interest
    remainingPrincipal -= monthlyPrincipal
    totalPayment += monthlyPayment

    schedule.push({
      period: i,
      monthlyPayment,
      principal: monthlyPrincipal,
      interest,
      remainingPrincipal: Math.max(0, remainingPrincipal), // 避免负数
    })
  }

  const totalInterest = totalPayment - principal

  return {
    monthlyPayment: schedule[0].monthlyPayment, // 首月月供
    totalPayment,
    totalInterest,
    schedule,
  }
}

/**
 * 计算累计数据（用于图表）
 */
export function calculateCumulativeData(schedule: RepaymentRecord[]): {
  period: number
  cumulativePrincipal: number
  cumulativeInterest: number
}[] {
  let cumulativePrincipal = 0
  let cumulativeInterest = 0

  return schedule.map((record) => {
    cumulativePrincipal += record.principal
    cumulativeInterest += record.interest
    return {
      period: record.period,
      cumulativePrincipal,
      cumulativeInterest,
    }
  })
}
