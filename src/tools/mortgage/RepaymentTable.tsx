import { useState } from 'react'
import { useMortgageStore } from './mortgage.store'
import { formatCurrency } from './utils'

export default function RepaymentTable() {
  const { schedule, showTable, toggleTable } = useMortgageStore()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 // 每页显示12个月（1年）

  const totalPages = Math.ceil(schedule.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = schedule.slice(startIndex, endIndex)

  // 计算当前页年度汇总
  const pageSummary = currentData.reduce(
    (acc, item) => ({
      monthlyPayment: acc.monthlyPayment + item.monthlyPayment,
      principal: acc.principal + item.principal,
      interest: acc.interest + item.interest,
    }),
    { monthlyPayment: 0, principal: 0, interest: 0 }
  )

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 标题栏 */}
      <div
        className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white cursor-pointer flex items-center justify-between"
        onClick={toggleTable}
      >
        <h3 className="text-lg font-semibold">还款计划明细</h3>
        <svg
          className={`w-6 h-6 transition-transform ${showTable ? 'rotate-180' : ''}`}
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

      {/* 表格内容 */}
      {showTable && (
        <div className="p-6">
          {/* 分页信息 */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              第 {currentPage} 年（第 {startIndex + 1}-{Math.min(endIndex, schedule.length)} 期）
            </p>
            <div className="text-sm text-gray-600">
              共 {schedule.length} 期
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    期数
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    月供（元）
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    本金（元）
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    利息（元）
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    剩余本金（元）
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((record, index) => (
                  <tr
                    key={record.period}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {record.period}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {formatCurrency(record.monthlyPayment)}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-600">
                      {formatCurrency(record.principal)}
                    </td>
                    <td className="px-4 py-3 text-right text-orange-600">
                      {formatCurrency(record.interest)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatCurrency(record.remainingPrincipal)}
                    </td>
                  </tr>
                ))}
                {/* 年度汇总行 */}
                <tr className="bg-primary-50 border-t-2 border-primary-200 font-semibold">
                  <td className="px-4 py-3 text-gray-700">年度小计</td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    {formatCurrency(pageSummary.monthlyPayment)}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-600">
                    {formatCurrency(pageSummary.principal)}
                  </td>
                  <td className="px-4 py-3 text-right text-orange-600">
                    {formatCurrency(pageSummary.interest)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一年
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一年
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
