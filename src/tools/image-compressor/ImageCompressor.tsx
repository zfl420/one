import { Row, Col, Typography, Button, Card, Space, Alert } from 'antd'
import { useImageCompressorStore } from './image-compressor.store'
import SettingsPanel from './SettingsPanel'
import UploadZone from './UploadZone'
import ImageList from './ImageList'
import { downloadBlob, generateCompressedFilename } from './utils'

const { Title, Text } = Typography

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
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 16px' }}>
      {/* 标题 */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: 8, color: '#faad14' }}>
          图片压缩工具
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          批量压缩图片，支持多种尺寸调整方式、质量预设、EXIF移除和格式转换
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧：设置面板 */}
        <Col xs={24} lg={8}>
          <SettingsPanel />
        </Col>

        {/* 右侧：上传和图片列表 */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 上传区域 */}
            <UploadZone />

            {/* 操作按钮区域 */}
            {images.length > 0 && (
              <Card style={{ borderRadius: 8 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <Text type="secondary">
                      {pendingCount > 0 && <span>待处理: {pendingCount} 张 · </span>}
                      {completedCount > 0 && <span>已完成: {completedCount} 张</span>}
                    </Text>

                    <Space wrap>
                      {pendingCount > 0 && (
                        <Button
                          type="primary"
                          onClick={handleCompressAll}
                          disabled={isCompressing}
                          loading={isCompressing}
                          style={{ background: '#faad14', borderColor: '#faad14' }}
                        >
                          {isCompressing ? '压缩中...' : `开始压缩 (${pendingCount})`}
                        </Button>
                      )}

                      {completedCount > 0 && (
                        <Button
                          type="primary"
                          onClick={handleDownloadAll}
                          style={{ background: '#52c41a', borderColor: '#52c41a' }}
                        >
                          下载全部 ({completedCount})
                        </Button>
                      )}

                      <Button onClick={clearImages}>
                        清空列表
                      </Button>
                    </Space>
                  </div>
                </Space>
              </Card>
            )}

            {/* 图片列表 */}
            <ImageList />

            {/* 使用说明 */}
            {images.length === 0 && (
              <Card style={{ borderRadius: 8, borderLeft: '4px solid #faad14' }}>
                <Title level={4} style={{ marginBottom: 16 }}>使用说明</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Text strong style={{ color: '#faad14', fontSize: 16 }}>1.</Text>
                    <Text type="secondary">在左侧设置面板中配置压缩参数</Text>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Text strong style={{ color: '#faad14', fontSize: 16 }}>2.</Text>
                    <Text type="secondary">拖拽图片或点击上传区域选择要压缩的图片（支持批量）</Text>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Text strong style={{ color: '#faad14', fontSize: 16 }}>3.</Text>
                    <Text type="secondary">点击"开始压缩"按钮处理所有图片</Text>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Text strong style={{ color: '#faad14', fontSize: 16 }}>4.</Text>
                    <Text type="secondary">压缩完成后可单独下载或批量下载所有图片</Text>
                  </div>
                  <Alert
                    message="隐私提示"
                    description="所有图片处理均在浏览器本地完成，不会上传到服务器，确保您的隐私安全。"
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </Space>
              </Card>
            )}
          </Space>
        </Col>
      </Row>
    </div>
  )
}
