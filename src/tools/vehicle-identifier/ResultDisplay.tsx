import { useVehicleIdentifierStore } from './vehicle-identifier.store'
import { VehicleModel } from './types'
import { useState } from 'react'

export default function ResultDisplay() {
  const { result, clearResult } = useVehicleIdentifierStore()
  const [expandedModel, setExpandedModel] = useState<number | null>(null)

  if (!result) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <svg
          className="mx-auto h-16 w-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <p className="text-gray-500">暂无识别结果</p>
        <p className="text-sm text-gray-400 mt-2">
          请上传VIN码图片或输入VIN码进行查询
        </p>
      </div>
    )
  }

  const toggleModelDetails = (modelId: number) => {
    setExpandedModel(expandedModel === modelId ? null : modelId)
  }

  return (
    <div className="space-y-4">
      {/* 基本信息卡片 */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">识别结果</h3>
            <button
              onClick={clearResult}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          {/* VIN码 */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">VIN码</p>
              <p className="text-lg font-mono font-semibold text-gray-900">
                {result.vin || '未识别到VIN码'}
              </p>
              {!result.vin && (
                <p className="text-xs text-red-500 mt-1">
                  未从API响应中提取到VIN码，请检查Console日志
                </p>
              )}
            </div>
          </div>

          {/* 车辆信息 */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="品牌" value={result.brand} />
            <InfoItem label="车型" value={result.model} />
            <InfoItem label="年款" value={result.year} />
            <InfoItem label="厂商" value={result.factory} />
          </div>

          {/* 完整描述 */}
          {result.detail && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-1">完整描述</p>
              <p className="text-base text-gray-900 font-medium">
                {result.detail}
              </p>
            </div>
          )}

          {/* 匹配模式 */}
          {result.matchingMode && (
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.matchingMode === 'exact_match'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {result.matchingMode === 'exact_match'
                  ? '精确匹配'
                  : '模糊匹配'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 详细车型列表 */}
      {result.modelList && result.modelList.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900">
              匹配车型列表 ({result.modelList.length})
            </h4>
          </div>
          <div className="divide-y divide-gray-200">
            {result.modelList.map((model, index) => (
              <ModelCard
                key={model.Id || index}
                model={model}
                isExpanded={expandedModel === model.Id}
                onToggle={() => toggleModelDetails(model.Id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 信息项组件
function InfoItem({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-900">
        {value || '-'}
      </p>
    </div>
  )
}

// 车型卡片组件
function ModelCard({
  model,
  isExpanded,
  onToggle,
}: {
  model: VehicleModel
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <h5 className="font-medium text-gray-900">{model.Model_detail}</h5>
          <div className="flex flex-wrap gap-2 mt-2">
            {model.Model_year && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                {model.Model_year}年
              </span>
            )}
            {model.Factory && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {model.Factory}
              </span>
            )}
          </div>
        </div>
        <button className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600">
          <svg
            className={`w-5 h-5 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* 展开的详细信息 */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3 text-sm">
          {model.Engine_model && (
            <DetailItem label="发动机" value={model.Engine_model} />
          )}
          {model.Displacement && (
            <DetailItem label="排量" value={model.Displacement} />
          )}
          {model.Gearbox_desc && (
            <DetailItem label="变速箱" value={model.Gearbox_desc} />
          )}
          {model.Drivetrain && (
            <DetailItem label="驱动方式" value={model.Drivetrain} />
          )}
          {model.Fuel_type && (
            <DetailItem label="燃料类型" value={model.Fuel_type} />
          )}
          {model.Body_structure && (
            <DetailItem label="车身结构" value={model.Body_structure} />
          )}
          {model.Seats && (
            <DetailItem label="座位数" value={`${model.Seats}座`} />
          )}
          {model.Sales_version && (
            <DetailItem label="版本" value={model.Sales_version} />
          )}
        </div>
      )}
    </div>
  )
}

// 详细信息项
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}: </span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  )
}

