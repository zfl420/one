import { useImageCompressorStore } from './image-compressor.store'
import SettingsPanel from './SettingsPanel'
import UploadZone from './UploadZone'
import ImageList from './ImageList'
import { downloadBlob, generateCompressedFilename } from './utils'

export default function ImageCompressor() {
  const { images, isCompressing, compressAllImages, clearImages, settings } =
    useImageCompressorStore()

  const handleCompressAll = async () => {
    await compressAllImages()
  }

  const handleDownloadAll = () => {
    const completedImages = images.filter((img) => img.status === 'done')
    
    if (completedImages.length === 0) {
      alert('没有可下载的图片')
      return
    }

    // 逐个下载（浏览器会处理多个下载）
    completedImages.forEach((img) => {
      if (img.compressedBlob) {
        const filename = generateCompressedFilename(img.file.name, settings.outputFormat)
        downloadBlob(img.compressedBlob, filename)
      }
    })
  }

  const pendingCount = images.filter((img) => img.status === 'pending').length
  const completedCount = images.filter((img) => img.status === 'done').length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">图片压缩工具</h1>
        <p className="text-gray-600">
          批量压缩图片，支持多种尺寸调整方式、质量预设、EXIF移除和格式转换
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：设置面板 */}
        <div className="lg:col-span-1">
          <SettingsPanel />
        </div>

        {/* 右侧：上传和图片列表 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 上传区域 */}
          <UploadZone />

          {/* 操作按钮区域 */}
          {images.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  {pendingCount > 0 && <span>待处理: {pendingCount} 张 · </span>}
                  {completedCount > 0 && <span>已完成: {completedCount} 张</span>}
                </div>

                <div className="flex flex-wrap gap-3">
                  {pendingCount > 0 && (
                    <button
                      onClick={handleCompressAll}
                      disabled={isCompressing}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        isCompressing
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isCompressing ? '压缩中...' : `开始压缩 (${pendingCount})`}
                    </button>
                  )}

                  {completedCount > 0 && (
                    <button
                      onClick={handleDownloadAll}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      下载全部 ({completedCount})
                    </button>
                  )}

                  <button
                    onClick={clearImages}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    清空列表
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 图片列表 */}
          <ImageList />

          {/* 使用说明 */}
          {images.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">使用说明</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>在左侧设置面板中配置压缩参数</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>拖拽图片或点击上传区域选择要压缩的图片（支持批量）</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>点击"开始压缩"按钮处理所有图片</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>压缩完成后可单独下载或批量下载所有图片</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>隐私提示：</strong> 所有图片处理均在浏览器本地完成，不会上传到服务器，确保您的隐私安全。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
