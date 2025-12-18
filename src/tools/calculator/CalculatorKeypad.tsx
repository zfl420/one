interface CalculatorKeypadProps {
  onDigit: (digit: string) => void
  onOperator: (operator: string) => void
  onDecimal: () => void
  onEquals: () => void
  onClear: () => void
  onClearEntry: () => void
  onDelete: () => void
  onToggleSign: () => void
  onPercent: () => void
}

export default function CalculatorKeypad({
  onDigit,
  onOperator,
  onDecimal,
  onEquals,
  onClear,
  onClearEntry,
  onDelete,
  onToggleSign,
  onPercent,
}: CalculatorKeypadProps) {
  const Button = ({
    children,
    onClick,
    className = '',
    variant = 'default',
  }: {
    children: React.ReactNode
    onClick: () => void
    className?: string
    variant?: 'default' | 'operator' | 'function' | 'equals'
  }) => {
    const baseClasses = 'h-16 rounded-xl font-semibold text-lg transition-all duration-150 active:scale-95'
    const variantClasses = {
      default: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      operator: 'bg-primary-500 hover:bg-primary-600 text-white',
      function: 'bg-gray-300 hover:bg-gray-400 text-gray-700',
      equals: 'bg-green-500 hover:bg-green-600 text-white',
    }

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="p-6 bg-gray-100 rounded-b-2xl">
      <div className="grid grid-cols-4 gap-3">
        {/* 第一行 */}
        <Button onClick={onClear} variant="function">AC</Button>
        <Button onClick={onClearEntry} variant="function">CE</Button>
        <Button onClick={onDelete} variant="function">⌫</Button>
        <Button onClick={() => onOperator('÷')} variant="operator">÷</Button>

        {/* 第二行 */}
        <Button onClick={() => onDigit('7')}>7</Button>
        <Button onClick={() => onDigit('8')}>8</Button>
        <Button onClick={() => onDigit('9')}>9</Button>
        <Button onClick={() => onOperator('×')} variant="operator">×</Button>

        {/* 第三行 */}
        <Button onClick={() => onDigit('4')}>4</Button>
        <Button onClick={() => onDigit('5')}>5</Button>
        <Button onClick={() => onDigit('6')}>6</Button>
        <Button onClick={() => onOperator('-')} variant="operator">−</Button>

        {/* 第四行 */}
        <Button onClick={() => onDigit('1')}>1</Button>
        <Button onClick={() => onDigit('2')}>2</Button>
        <Button onClick={() => onDigit('3')}>3</Button>
        <Button onClick={() => onOperator('+')} variant="operator">+</Button>

        {/* 第五行 */}
        <Button onClick={onToggleSign} variant="function">±</Button>
        <Button onClick={() => onDigit('0')}>0</Button>
        <Button onClick={onDecimal}>.</Button>
        <Button onClick={onEquals} variant="equals">=</Button>
      </div>
    </div>
  )
}
