import { ImageFile } from './types'
import { formatFileSize, downloadBlob, generateCompressedFilename } from './utils'
import { useImageCompressorStore } from './image-compressor.store'

interface ImageCardProps {
  image: ImageFile
}

export default function ImageCard({ image }: ImageCardProps) {
  const { removeImage, settings } = useImageCompressorStore()

  const handleDownload = () => {
    if (image.compressedBlob) {
      const filename = generateCompressedFilename(image.file.name, settings.outputFormat)
      downloadBlob(image.compressedBlob, filename)
    }
  }

  const getCompressionRatio = () => {
    if (!image.compressedSize) return null
    const ratio = ((image.originalSize - image.compressedSize) / image.originalSize) * 100
    return ratio.toFixed(1)
  }

  const getStatusBadge = () => {
    switch (image.status) {
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
            待处理
          </span>
        )
      case 'processing':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            处理中
          </span>
        )
      case 'done':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
            ✓ 完成
          </span>
        )
      case 'error':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
            ✗ 失败
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex gap-4 p-4">
        {/* 缩略图 */}
        <div className="flex-shrink-0">
          <img
            src={image.preview}
            alt={image.file.name}
            className="w-24 h-24 object-cover rounded"
          />
        </div>

        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          {/* 文件名和状态 */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
              {image.file.name}
            </h3>
            {getStatusBadge()}
          </div>

          {/* 尺寸信息 */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>原始大小: {formatFileSize(image.originalSize)}</div>
            {image.compressedSize && (
              <div className="flex items-center gap-2">
                <span>压缩后: {formatFileSize(image.compressedSize)}</span>
                <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium">
                  减少 {getCompressionRatio()}%
                </span>
              </div>
            )}
          </div>

          {/* 错误信息 */}
          {image.error && (
            <div className="mt-2 text-xs text-red-600">
              {image.error}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 mt-3">
            {image.status === 'done' && (
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                下载
              </button>
            )}
            <button
              onClick={() => removeImage(image.id)}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
