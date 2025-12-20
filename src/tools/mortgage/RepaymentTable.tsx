import { useState } from 'react'
import { Card, Table, Space, Pagination, Typography } from 'antd'
import { TableOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useMortgageStore } from './mortgage.store'
import { formatCurrency } from './utils'

const { Text } = Typography

interface RepaymentRecord {
  period: number
  monthlyPayment: number
  principal: number
  interest: number
  remainingPrincipal: number
}

export default function RepaymentTable() {
  const { schedule, showTable, toggleTable } = useMortgageStore()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12 // 每页显示12个月（1年）

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
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

  const columns: ColumnsType<RepaymentRecord> = [
    {
      title: '期数',
      dataIndex: 'period',
      key: 'period',
      width: 80,
      align: 'center',
    },
    {
      title: '月供（元）',
      dataIndex: 'monthlyPayment',
      key: 'monthlyPayment',
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: '本金（元）',
      dataIndex: 'principal',
      key: 'principal',
      align: 'right',
      render: (value: number) => (
        <Text style={{ color: '#52c41a', fontWeight: 600 }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: '利息（元）',
      dataIndex: 'interest',
      key: 'interest',
      align: 'right',
      render: (value: number) => (
        <Text style={{ color: '#fa8c16', fontWeight: 600 }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
    {
      title: '剩余本金（元）',
      dataIndex: 'remainingPrincipal',
      key: 'remainingPrincipal',
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <TableOutlined />
          <span>还款计划明细</span>
        </Space>
      }
      extra={
        <span onClick={toggleTable} style={{ cursor: 'pointer' }}>
          {showTable ? <UpOutlined /> : <DownOutlined />}
        </span>
      }
      style={{ borderRadius: 8 }}
    >
      {showTable && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary">
              第 {currentPage} 年（第 {startIndex + 1}-{Math.min(endIndex, schedule.length)} 期）
            </Text>
            <Text type="secondary">共 {schedule.length} 期</Text>
          </div>

          <Table
            columns={columns}
            dataSource={currentData}
            pagination={false}
            rowKey="period"
            size="middle"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: '#f0f9ff', fontWeight: 'bold' }}>
                  <Table.Summary.Cell index={0} align="center">
                    年度小计
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    {formatCurrency(pageSummary.monthlyPayment)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} align="right">
                    <Text style={{ color: '#52c41a', fontWeight: 600 }}>
                      {formatCurrency(pageSummary.principal)}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <Text style={{ color: '#fa8c16', fontWeight: 600 }}>
                      {formatCurrency(pageSummary.interest)}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    -
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={schedule.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </div>
      )}
    </Card>
  )
}
