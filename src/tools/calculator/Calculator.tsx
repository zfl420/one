import { Row, Col, Card, Button, Alert } from 'antd'
import { HistoryOutlined } from '@ant-design/icons'
import { useCalculatorStore } from './calculator.store'
import { useKeyboard } from './useKeyboard'
import CalculatorDisplay from './CalculatorDisplay'
import CalculatorKeypad from './CalculatorKeypad'
import HistoryPanel from './HistoryPanel'

export default function Calculator() {
  // 启用键盘支持
  useKeyboard()

  const {
    display,
    expression,
    showHistory,
    history,
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    deleteDigit,
    toggleSign,
    inputPercent,
    toggleHistory,
    clearHistory,
    replayCalculation,
  } = useCalculatorStore()

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px' }}>
      <Row gutter={[24, 24]}>
        {/* 计算器主体 */}
        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            bodyStyle={{ padding: 0 }}
          >
            <CalculatorDisplay expression={expression} value={display} />
            <CalculatorKeypad
              onDigit={inputDigit}
              onOperator={inputOperator}
              onDecimal={inputDecimal}
              onEquals={calculate}
              onClear={clear}
              onDelete={deleteDigit}
              onToggleSign={toggleSign}
              onPercent={inputPercent}
            />
          </Card>
        </Col>

        {/* 右侧信息面板 */}
        <Col xs={24} lg={14}>
          <Row gutter={[16, 16]}>
            {/* 使用说明 */}
            <Col span={24}>
              <Alert
                message={
                  <>
                    <strong>键盘快捷键：</strong> 数字键 0-9, 运算符 +−×÷,
                    Enter 键计算, Escape 清空, Backspace 删除
                  </>
                }
                type="info"
                showIcon
                style={{ borderRadius: 8 }}
              />
            </Col>

            {/* 历史记录切换按钮 */}
            <Col span={24}>
              <Button
                type="primary"
                size="large"
                icon={<HistoryOutlined />}
                onClick={toggleHistory}
                block
              >
                {showHistory ? '隐藏历史' : '显示历史'}
              </Button>
            </Col>

            {/* 历史记录面板 */}
            {showHistory && (
              <Col span={24}>
                <HistoryPanel
                  history={history}
                  onReplay={replayCalculation}
                  onClear={clearHistory}
                  onClose={toggleHistory}
                />
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  )
}
