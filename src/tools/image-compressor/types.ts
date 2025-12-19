export type ResizeMode = 'percentage' | 'width' | 'height' | 'maxDimension' | 'none'
export type QualityPreset = 'high' | 'medium' | 'low'
export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'original'

export interface ImageFile {
  id: string
  file: File
  preview: string
  originalSize: number
  compressedSize?: number
  compressedBlob?: Blob
  status: 'pending' | 'processing' | 'done' | 'error'
  error?: string
}

export interface CompressionSettings {
  resizeMode: ResizeMode
  resizeValue: number
  qualityPreset: QualityPreset
  removeExif: boolean
  outputFormat: OutputFormat
}
