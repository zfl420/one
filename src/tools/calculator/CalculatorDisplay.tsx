interface CalculatorDisplayProps {
  expression: string
  value: string
}

export default function CalculatorDisplay({ expression, value }: CalculatorDisplayProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        color: '#fff',
        padding: '40px 32px',
        borderRadius: '16px 16px 0 0',
      }}
    >
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: 16,
            height: 28,
            marginBottom: 16,
            overflow: 'auto',
            fontWeight: 500,
          }}
        >
          {expression || '\u00A0'}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 'bold',
            overflow: 'auto',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-1px',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
