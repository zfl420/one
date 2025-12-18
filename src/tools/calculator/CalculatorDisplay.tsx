interface CalculatorDisplayProps {
  expression: string
  value: string
}

export default function CalculatorDisplay({ expression, value }: CalculatorDisplayProps) {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-t-2xl">
      <div className="text-right">
        <div className="text-gray-400 text-sm h-6 mb-2 overflow-x-auto">
          {expression || '\u00A0'}
        </div>
        <div className="text-4xl font-light overflow-x-auto">
          {value}
        </div>
      </div>
    </div>
  )
}
