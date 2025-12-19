import { useMortgageStore } from './mortgage.store'

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
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">贷款参数</h2>

      {/* 贷款总额 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          贷款总额（万元）
        </label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          min="1"
          max="10000"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">建议范围：10-1000万元</p>
      </div>

      {/* 贷款期限 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          贷款期限（年）
        </label>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {yearOptions.map((year) => (
            <button
              key={year}
              onClick={() => setLoanYears(year)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                loanYears === year
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {year}年
            </button>
          ))}
        </div>
        <input
          type="number"
          value={loanYears}
          onChange={(e) => setLoanYears(Number(e.target.value))}
          min="1"
          max="30"
          step="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* 年利率 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          年利率（%）
        </label>
        <div className="space-y-2 mb-2">
          {rateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setAnnualRate(option.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                annualRate === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={annualRate}
          onChange={(e) => setAnnualRate(Number(e.target.value))}
          min="0.1"
          max="20"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">可自定义输入利率</p>
      </div>

      {/* 还款方式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          还款方式
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setRepaymentType('equal-payment')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              repaymentType === 'equal-payment'
                ? 'bg-primary-500 text-white ring-2 ring-primary-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="font-bold">等额本息</div>
            <div className="text-xs mt-1 opacity-90">每月还款额相同</div>
          </button>
          <button
            onClick={() => setRepaymentType('equal-principal')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              repaymentType === 'equal-principal'
                ? 'bg-primary-500 text-white ring-2 ring-primary-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="font-bold">等额本金</div>
            <div className="text-xs mt-1 opacity-90">每月还款额递减</div>
          </button>
        </div>
      </div>

      {/* 说明信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>提示：</strong>等额本息每月还款额固定，适合收入稳定的人群；等额本金前期还款压力大，但总利息较少。
        </p>
      </div>
    </div>
  )
}
