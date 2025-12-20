import { Card, Button, Space, Tag, Image, Typography } from 'antd'
import { DownloadOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { ImageFile } from './types'
import { formatFileSize, downloadBlob, generateCompressedFilename } from './utils'
import { useImageCompressorStore } from './image-compressor.store'

const { Text } = Typography

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

  const getStatusTag = () => {
    switch (image.status) {
      case 'pending':
        return <Tag>待处理</Tag>
      case 'processing':
        return (
          <Tag icon={<LoadingOutlined />} color="processing">
            处理中
          </Tag>
        )
      case 'done':
        return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            完成
          </Tag>
        )
      case 'error':
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            失败
          </Tag>
        )
    }
  }

  return (
    <Card 
      style={{ borderRadius: 8 }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', gap: 20 }}>
        {/* 缩略图 */}
        <div style={{ flexShrink: 0 }}>
          <Image
            src={image.preview}
            alt={image.file.name}
            width={112}
            height={112}
            style={{ 
              objectFit: 'cover', 
              borderRadius: 8,
            }}
            preview={image.status === 'done' && image.compressedBlob ? {
              src: URL.createObjectURL(image.compressedBlob),
            } : false}
          />
        </div>

        {/* 信息区域 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* 文件名和状态 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <Text strong ellipsis style={{ flex: 1, marginRight: 8 }}>
              {image.file.name}
            </Text>
            {getStatusTag()}
          </div>

          {/* 尺寸信息 */}
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">原始大小: {formatFileSize(image.originalSize)}</Text>
            {image.compressedSize && (
              <div>
                <Text type="secondary">压缩后: {formatFileSize(image.compressedSize)}</Text>
                <Tag color="success" style={{ marginLeft: 8 }}>
                  减少 {getCompressionRatio()}%
                </Tag>
              </div>
            )}
          </Space>

          {/* 错误信息 */}
          {image.error && (
            <Text type="danger" style={{ display: 'block', marginTop: 8 }}>
              {image.error}
            </Text>
          )}

          {/* 操作按钮 */}
          <Space style={{ marginTop: 16 }}>
            {image.status === 'done' && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                style={{ background: '#faad14', borderColor: '#faad14' }}
              >
                下载
              </Button>
            )}
            <Button
              icon={<DeleteOutlined />}
              onClick={() => removeImage(image.id)}
            >
              删除
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  )
}
