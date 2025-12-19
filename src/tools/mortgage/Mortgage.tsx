import MortgageForm from './MortgageForm'
import ResultSummary from './ResultSummary'
import RepaymentTable from './RepaymentTable'
import RepaymentChart from './RepaymentChart'

export default function Mortgage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">房贷计算器</h1>
        <p className="text-gray-600">
          精确计算房贷月供、总利息，支持等额本息和等额本金两种还款方式
        </p>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(350px,400px),1fr] gap-6 mb-6">
        {/* 左侧：输入表单 */}
        <div className="order-1">
          <MortgageForm />
        </div>

        {/* 右侧：结果摘要 */}
        <div className="order-2">
          <ResultSummary />
        </div>
      </div>

      {/* 还款计划表 */}
      <div className="mb-6">
        <RepaymentTable />
      </div>

      {/* 可视化图表 */}
      <div className="mb-6">
        <RepaymentChart />
      </div>

      {/* 使用说明 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium text-indigo-700 mb-2">等额本息</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 每月还款额固定</li>
              <li>• 前期利息占比大，后期本金占比大</li>
              <li>• 适合收入稳定的人群</li>
              <li>• 还款压力平均分配</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-2">等额本金</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 每月还款额递减</li>
              <li>• 前期还款压力大，后期压力小</li>
              <li>• 总利息少于等额本息</li>
              <li>• 适合前期收入较高的人群</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-indigo-200">
          <p className="text-xs text-gray-600">
            <strong>提示：</strong>
            本计算器仅供参考，实际还款金额以银行或贷款机构最终审批为准。利率可能随政策调整而变化，建议咨询相关金融机构获取最新信息。
          </p>
        </div>
      </div>
    </div>
  )
}
