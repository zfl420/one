import { ResizeMode, QualityPreset, OutputFormat, CompressionSettings } from './types'

/**
 * 根据质量预设获取质量数值
 */
export function getQualityValue(preset: QualityPreset): number {
  switch (preset) {
    case 'high':
      return 0.9
    case 'medium':
      return 0.75
    case 'low':
      return 0.6
    default:
      return 0.75
  }
}

/**
 * 计算新的图片尺寸
 */
export function calculateNewDimensions(
  originalWidth: number,
  originalHeight: number,
  mode: ResizeMode,
  value: number
): { width: number; height: number } {
  switch (mode) {
    case 'percentage':
      return {
        width: Math.round(originalWidth * (value / 100)),
        height: Math.round(originalHeight * (value / 100)),
      }
    case 'width':
      const heightByWidth = Math.round(originalHeight * (value / originalWidth))
      return {
        width: value,
        height: heightByWidth,
      }
    case 'height':
      const widthByHeight = Math.round(originalWidth * (value / originalHeight))
      return {
        width: widthByHeight,
        height: value,
      }
    case 'maxDimension':
      const maxDimension = Math.max(originalWidth, originalHeight)
      if (maxDimension <= value) {
        // 如果图片尺寸小于最大边长，不缩放
        return { width: originalWidth, height: originalHeight }
      }
      const scale = value / maxDimension
      return {
        width: Math.round(originalWidth * scale),
        height: Math.round(originalHeight * scale),
      }
    case 'none':
    default:
      return { width: originalWidth, height: originalHeight }
  }
}

/**
 * 获取输出MIME类型
 */
export function getOutputMimeType(format: OutputFormat, originalType: string): string {
  if (format === 'original') {
    return originalType
  }
  return `image/${format}`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 主压缩函数
 */
export async function compressImage(
  file: File,
  settings: CompressionSettings
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        try {
          // 计算新尺寸
          const { width, height } = calculateNewDimensions(
            img.width,
            img.height,
            settings.resizeMode,
            settings.resizeValue
          )

          // 创建Canvas
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('无法创建Canvas上下文'))
            return
          }

          // 绘制图片到Canvas（这会自动移除EXIF信息）
          ctx.drawImage(img, 0, 0, width, height)

          // 确定输出格式
          const outputMimeType = getOutputMimeType(settings.outputFormat, file.type)
          const quality = getQualityValue(settings.qualityPreset)

          // 转换为Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('图片压缩失败'))
              }
            },
            outputMimeType,
            quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * 下载文件
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 生成压缩后的文件名
 */
export function generateCompressedFilename(
  originalName: string,
  outputFormat: OutputFormat
): string {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
  
  if (outputFormat === 'original') {
    return `${nameWithoutExt}_compressed${originalName.substring(originalName.lastIndexOf('.'))}`
  }
  
  return `${nameWithoutExt}_compressed.${outputFormat}`
}
