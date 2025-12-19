import { useRef, useState } from 'react'
import { useImageCompressorStore } from './image-compressor.store'

export default function UploadZone() {
  const { addImages } = useImageCompressorStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    // 过滤出有效的图片文件
    const validFiles: File[] = []
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (acceptedTypes.includes(file.type)) {
        validFiles.push(file)
      }
    }

    if (validFiles.length > 0) {
      addImages(validFiles)
    }

    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-colors duration-200
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="space-y-4">
        {/* 图标 */}
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* 文字提示 */}
        <div>
          <p className="text-lg font-medium text-gray-700">
            拖拽图片到此处，或点击选择文件
          </p>
          <p className="text-sm text-gray-500 mt-2">
            支持 JPEG、PNG、WebP 格式，可批量上传
          </p>
        </div>

        {/* 上传按钮 */}
        <div>
          <button
            type="button"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            选择图片
          </button>
        </div>
      </div>
    </div>
  )
}
