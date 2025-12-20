import { useRef, useState, DragEvent } from 'react'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const {
    uploadedImage,
    imagePreviewUrl,
    isLoading,
    setUploadedImage,
    recognizeByImage,
  } = useVehicleIdentifierStore()

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setUploadedImage(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileSelect(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const handleClearImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRecognize = () => {
    recognizeByImage()
  }

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          transition-colors cursor-pointer
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }
          ${uploadedImage ? 'bg-gray-50' : 'bg-white'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!uploadedImage ? handleClickUpload : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/bmp"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {!uploadedImage ? (
          <div className="space-y-3">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-gray-600">
              <p className="text-base font-medium">点击上传或拖拽图片到此处</p>
              <p className="text-sm text-gray-500 mt-1">
                支持 JPG、PNG、BMP 格式，大小不超过 4MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 图片预览 */}
            {imagePreviewUrl && (
              <div className="relative inline-block max-w-full">
                <img
                  src={imagePreviewUrl}
                  alt="预览"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
            {/* 文件信息 */}
            <div className="text-sm text-gray-600">
              <p className="font-medium">{uploadedImage.name}</p>
              <p className="text-gray-500">
                {(uploadedImage.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        {uploadedImage && (
          <>
            <button
              onClick={handleRecognize}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  识别中...
                </span>
              ) : (
                '开始识别'
              )}
            </button>
            <button
              onClick={handleClearImage}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
            >
              清除
            </button>
          </>
        )}
      </div>

      {/* 提示信息 */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>💡 提示：</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>请确保VIN码清晰可见</li>
          <li>建议使用高清图片以提高识别准确率</li>
          <li>VIN码通常位于车辆铭牌或挡风玻璃下方</li>
        </ul>
      </div>
    </div>
  )
}

