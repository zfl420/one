import { Button, Space } from 'antd'

interface CalculatorKeypadProps {
  onDigit: (digit: string) => void
  onOperator: (operator: string) => void
  onDecimal: () => void
  onEquals: () => void
  onClear: () => void
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
  onDelete,
  onToggleSign,
  onPercent,
}: CalculatorKeypadProps) {
  const buttonRows = [
    [
      { label: 'AC', onClick: onClear, type: 'dashed' as const },
      { label: '%', onClick: onPercent, type: 'dashed' as const },
      { label: '⌫', onClick: onDelete, type: 'dashed' as const },
      { label: '÷', onClick: () => onOperator('÷'), type: 'primary' as const },
    ],
    [
      { label: '7', onClick: () => onDigit('7') },
      { label: '8', onClick: () => onDigit('8') },
      { label: '9', onClick: () => onDigit('9') },
      { label: '×', onClick: () => onOperator('×'), type: 'primary' as const },
    ],
    [
      { label: '4', onClick: () => onDigit('4') },
      { label: '5', onClick: () => onDigit('5') },
      { label: '6', onClick: () => onDigit('6') },
      { label: '−', onClick: () => onOperator('-'), type: 'primary' as const },
    ],
    [
      { label: '1', onClick: () => onDigit('1') },
      { label: '2', onClick: () => onDigit('2') },
      { label: '3', onClick: () => onDigit('3') },
      { label: '+', onClick: () => onOperator('+'), type: 'primary' as const },
    ],
    [
      { label: '±', onClick: onToggleSign, type: 'dashed' as const },
      { label: '0', onClick: () => onDigit('0') },
      { label: '.', onClick: onDecimal },
      { label: '=', onClick: onEquals, type: 'primary' as const, style: { background: '#096dd9' } },
    ],
  ]

  return (
    <div style={{ padding: 24, background: '#e6f7ff', borderRadius: '0 0 16px 16px' }}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        {buttonRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}
          >
            {row.map((button, btnIndex) => (
              <Button
                key={btnIndex}
                onClick={button.onClick}
                type={button.type}
                size="large"
                block
                style={{
                  height: 64,
                  fontSize: 20,
                  fontWeight: 'bold',
                  borderRadius: 8,
                  ...('style' in button ? button.style : {}),
                }}
              >
                {button.label}
              </Button>
            ))}
          </div>
        ))}
      </Space>
    </div>
  )
}
