import { create } from 'zustand'
import { ImageFile, CompressionSettings } from './types'
import { compressImage } from './utils'

interface ImageCompressorState {
  images: ImageFile[]
  settings: CompressionSettings
  isCompressing: boolean

  // 设置相关
  updateSettings: (settings: Partial<CompressionSettings>) => void

  // 图片管理
  addImages: (files: File[]) => void
  removeImage: (id: string) => void
  clearImages: () => void

  // 压缩操作
  compressImage: (id: string) => Promise<void>
  compressAllImages: () => Promise<void>
}

export const useImageCompressorStore = create<ImageCompressorState>((set, get) => ({
  images: [],
  settings: {
    resizeMode: 'percentage',
    resizeValue: 80,
    qualityPreset: 'medium',
    removeExif: true,
    outputFormat: 'original',
  },
  isCompressing: false,

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }))
  },

  addImages: (files) => {
    const newImages: ImageFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
      status: 'pending',
    }))

    set((state) => ({
      images: [...state.images, ...newImages],
    }))
  },

  removeImage: (id) => {
    const state = get()
    const image = state.images.find((img) => img.id === id)
    
    // 清理预览URL
    if (image) {
      URL.revokeObjectURL(image.preview)
    }

    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }))
  },

  clearImages: () => {
    const state = get()
    
    // 清理所有预览URL
    state.images.forEach((img) => {
      URL.revokeObjectURL(img.preview)
    })

    set({ images: [] })
  },

  compressImage: async (id) => {
    const state = get()
    const image = state.images.find((img) => img.id === id)

    if (!image) return

    // 更新状态为处理中
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, status: 'processing' as const } : img
      ),
    }))

    try {
      const compressedBlob = await compressImage(image.file, state.settings)

      // 更新状态为完成
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                status: 'done' as const,
                compressedBlob,
                compressedSize: compressedBlob.size,
              }
            : img
        ),
      }))
    } catch (error) {
      // 更新状态为错误
      set((state) => ({
        images: state.images.map((img) =>
          img.id === id
            ? {
                ...img,
                status: 'error' as const,
                error: error instanceof Error ? error.message : '压缩失败',
              }
            : img
        ),
      }))
    }
  },

  compressAllImages: async () => {
    const state = get()
    set({ isCompressing: true })

    // 只压缩状态为pending的图片
    const pendingImages = state.images.filter((img) => img.status === 'pending')

    for (const image of pendingImages) {
      await get().compressImage(image.id)
    }

    set({ isCompressing: false })
  },
}))
