import { create } from 'zustand'
import {
  RepaymentRecord,
  calculateEqualPayment,
  calculateEqualPrincipal,
} from './utils'

export type RepaymentType = 'equal-payment' | 'equal-principal'

interface MortgageState {
  // 输入参数
  loanAmount: number // 贷款总额（万元）
  loanYears: number // 贷款期限（年）
  annualRate: number // 年利率（%）
  repaymentType: RepaymentType // 还款方式

  // 计算结果
  monthlyPayment: number // 月供（等额本息为固定值，等额本金为首月值）
  totalPayment: number // 还款总额
  totalInterest: number // 总利息
  schedule: RepaymentRecord[] // 还款计划

  // UI 状态
  showTable: boolean // 是否显示还款计划表
  showChart: boolean // 是否显示图表
  activeChartTab: 'trend' | 'cumulative' | 'pie' // 当前激活的图表tab

  // Actions
  setLoanAmount: (amount: number) => void
  setLoanYears: (years: number) => void
  setAnnualRate: (rate: number) => void
  setRepaymentType: (type: RepaymentType) => void
  toggleTable: () => void
  toggleChart: () => void
  setActiveChartTab: (tab: 'trend' | 'cumulative' | 'pie') => void
  calculate: () => void
}

export const useMortgageStore = create<MortgageState>((set, get) => ({
  // 默认值
  loanAmount: 100, // 100万
  loanYears: 30,
  annualRate: 4.2, // 4.2%
  repaymentType: 'equal-payment',

  // 初始结果（使用默认值计算）
  monthlyPayment: 0,
  totalPayment: 0,
  totalInterest: 0,
  schedule: [],

  // UI 状态
  showTable: false,
  showChart: false,
  activeChartTab: 'trend',

  setLoanAmount: (amount) => {
    set({ loanAmount: amount })
    get().calculate()
  },

  setLoanYears: (years) => {
    set({ loanYears: years })
    get().calculate()
  },

  setAnnualRate: (rate) => {
    set({ annualRate: rate })
    get().calculate()
  },

  setRepaymentType: (type) => {
    set({ repaymentType: type })
    get().calculate()
  },

  toggleTable: () => set((state) => ({ showTable: !state.showTable })),

  toggleChart: () => set((state) => ({ showChart: !state.showChart })),

  setActiveChartTab: (tab) => set({ activeChartTab: tab }),

  calculate: () => {
    const { loanAmount, loanYears, annualRate, repaymentType } = get()

    // 参数验证
    if (loanAmount <= 0 || loanYears <= 0 || annualRate <= 0) {
      return
    }

    const result =
      repaymentType === 'equal-payment'
        ? calculateEqualPayment(loanAmount, annualRate, loanYears)
        : calculateEqualPrincipal(loanAmount, annualRate, loanYears)

    set({
      monthlyPayment: result.monthlyPayment,
      totalPayment: result.totalPayment,
      totalInterest: result.totalInterest,
      schedule: result.schedule,
    })
  },
}))

// 初始计算
useMortgageStore.getState().calculate()
