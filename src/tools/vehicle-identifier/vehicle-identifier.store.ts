import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  InputMode,
  VehicleResult,
  VehicleRecord,
} from './types'
import {
  recognizeVehicleByImage,
  recognizeVehicleByVin,
  generateId,
} from './utils'

interface VehicleIdentifierState {
  // 输入模式
  inputMode: InputMode
  // VIN码输入
  vinCode: string
  // 上传的图片
  uploadedImage: File | null
  // 图片预览URL
  imagePreviewUrl: string | null
  // 识别结果
  result: VehicleResult | null
  // 历史记录
  history: VehicleRecord[]
  // 加载状态
  isLoading: boolean
  // 错误信息
  error: string | null
  // 是否显示历史记录
  showHistory: boolean

  // Actions
  setInputMode: (mode: InputMode) => void
  setVinCode: (vin: string) => void
  setUploadedImage: (file: File | null) => void
  recognizeByImage: () => Promise<void>
  recognizeByVin: () => Promise<void>
  clearResult: () => void
  clearError: () => void
  toggleHistory: () => void
  clearHistory: () => void
  loadHistoryRecord: (record: VehicleRecord) => void
  removeHistoryRecord: (id: string) => void
}

export const useVehicleIdentifierStore = create<VehicleIdentifierState>()(
  persist(
    (set, get) => ({
      // 初始状态
      inputMode: 'image',
      vinCode: '',
      uploadedImage: null,
      imagePreviewUrl: null,
      result: null,
      history: [],
      isLoading: false,
      error: null,
      showHistory: false,

      // 设置输入模式
      setInputMode: (mode) => {
        set({ 
          inputMode: mode,
          error: null,
        })
      },

      // 设置VIN码
      setVinCode: (vin) => {
        set({ 
          vinCode: vin.toUpperCase().trim(),
          error: null,
        })
      },

      // 设置上传的图片
      setUploadedImage: (file) => {
        // 清除旧的预览URL
        const oldUrl = get().imagePreviewUrl
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl)
        }

        // 创建新的预览URL
        const previewUrl = file ? URL.createObjectURL(file) : null

        set({
          uploadedImage: file,
          imagePreviewUrl: previewUrl,
          error: null,
        })
      },

      // 通过图片识别
      recognizeByImage: async () => {
        const { uploadedImage, history } = get()

        if (!uploadedImage) {
          set({ error: '请先上传图片' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const result = await recognizeVehicleByImage(uploadedImage)
          
          // 调试：打印识别结果
          console.log('Store收到的识别结果:', result)
          console.log('Store收到的VIN码:', result.vin)
          
          // 添加到历史记录
          const record: VehicleRecord = {
            id: generateId(),
            vin: result.vin,
            brand: result.brand,
            model: result.model,
            year: result.year,
            detail: result.detail,
            timestamp: result.timestamp,
            inputMode: 'image',
          }

          set({
            result,
            history: [record, ...history].slice(0, 20), // 保留最近20条
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '识别失败',
            isLoading: false,
          })
        }
      },

      // 通过VIN码识别
      recognizeByVin: async () => {
        const { vinCode, history } = get()

        if (!vinCode || vinCode.length !== 17) {
          set({ error: 'VIN码必须是17位字符' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const result = await recognizeVehicleByVin(vinCode)

          // 添加到历史记录
          const record: VehicleRecord = {
            id: generateId(),
            vin: result.vin,
            brand: result.brand,
            model: result.model,
            year: result.year,
            detail: result.detail,
            timestamp: result.timestamp,
            inputMode: 'text',
          }

          set({
            result,
            history: [record, ...history].slice(0, 20), // 保留最近20条
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '查询失败',
            isLoading: false,
          })
        }
      },

      // 清除结果
      clearResult: () => {
        set({
          result: null,
          error: null,
        })
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      },

      // 切换历史记录显示
      toggleHistory: () => {
        set((state) => ({ showHistory: !state.showHistory }))
      },

      // 清除历史记录
      clearHistory: () => {
        set({ history: [] })
      },

      // 加载历史记录
      loadHistoryRecord: (record) => {
        if (record.inputMode === 'text') {
          set({
            inputMode: 'text',
            vinCode: record.vin,
          })
        }
        // 注意：图片模式的历史记录无法重新加载图片
      },

      // 删除单条历史记录
      removeHistoryRecord: (id) => {
        set((state) => ({
          history: state.history.filter((record) => record.id !== id),
        }))
      },
    }),
    {
      name: 'vehicle-identifier-storage',
      // 只持久化历史记录和偏好设置
      partialize: (state) => ({
        history: state.history,
        inputMode: state.inputMode,
      }),
    }
  )
)

