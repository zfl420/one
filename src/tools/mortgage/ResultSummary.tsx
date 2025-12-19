import { useMortgageStore } from './mortgage.store'
import { formatCurrency } from './utils'

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* 月供 */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">月供金额</span>
          <svg
            className="w-5 h-5 opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold mb-1">
          {repaymentType === 'equal-payment' ? (
            <>¥ {formatCurrency(monthlyPayment)}</>
          ) : (
            <>
              <div className="text-2xl">
                ¥ {formatCurrency(firstMonthPayment)}
              </div>
              <div className="text-sm font-normal opacity-90 mt-1">
                递减至 ¥ {formatCurrency(lastMonthPayment)}
              </div>
            </>
          )}
        </div>
        <p className="text-xs opacity-80">
          {repaymentType === 'equal-payment' ? '每月固定' : '首月金额'}
        </p>
      </div>

      {/* 还款总额 */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">还款总额</span>
          <svg
            className="w-5 h-5 opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold mb-1">
          ¥ {formatCurrency(totalPayment)}
        </div>
        <p className="text-xs opacity-80">本金 + 利息</p>
      </div>

      {/* 支付利息 */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">支付利息</span>
          <svg
            className="w-5 h-5 opacity-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div className="text-3xl font-bold mb-1">
          ¥ {formatCurrency(totalInterest)}
        </div>
        <p className="text-xs opacity-80">总利息支出</p>
      </div>

      {/* 本息占比 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">本息构成</h3>
        <div className="space-y-3">
          {/* 本金 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">本金</span>
              <span className="text-sm font-medium text-gray-800">
                {principalPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${principalPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ¥ {formatCurrency(principal)}
            </p>
          </div>

          {/* 利息 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">利息</span>
              <span className="text-sm font-medium text-gray-800">
                {interestPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${interestPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ¥ {formatCurrency(totalInterest)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
