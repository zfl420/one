import { useState } from 'react'
import { Upload, Button, Space, Alert, Image, Typography } from 'antd'
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { useVehicleIdentifierStore } from './vehicle-identifier.store'

const { Dragger } = Upload
const { Text } = Typography

export default function ImageUpload() {
  const {
    uploadedImage,
    imagePreviewUrl,
    isLoading,
    setUploadedImage,
    recognizeByImage,
  } = useVehicleIdentifierStore()

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleBeforeUpload = (file: File) => {
    // 检查文件类型
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      return Upload.LIST_IGNORE
    }

    // 检查文件大小（4MB）
    const isLt4M = file.size / 1024 / 1024 < 4
    if (!isLt4M) {
      return Upload.LIST_IGNORE
    }

    setUploadedImage(file)
    setFileList([
      {
        uid: '-1',
        name: file.name,
        status: 'done',
        url: URL.createObjectURL(file),
      },
    ])

    return false // 阻止自动上传
  }

  const handleRemove = () => {
    setUploadedImage(null)
    setFileList([])
  }

  const handleRecognize = () => {
    recognizeByImage()
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* 上传区域 */}
      {!uploadedImage ? (
        <Dragger
          name="file"
          multiple={false}
          accept="image/jpeg,image/jpg,image/png,image/bmp"
          beforeUpload={handleBeforeUpload}
          fileList={fileList}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text" style={{ fontSize: 16 }}>
            点击或拖拽图片到此区域上传
          </p>
          <p className="ant-upload-hint" style={{ color: '#999' }}>
                支持 JPG、PNG、BMP 格式，大小不超过 4MB
              </p>
        </Dragger>
        ) : (
        <div style={{ textAlign: 'center' }}>
            {/* 图片预览 */}
            {imagePreviewUrl && (
            <div style={{ marginBottom: 16 }}>
              <Image
                  src={imagePreviewUrl}
                  alt="预览"
                style={{ maxHeight: 300, borderRadius: 8 }}
                />
              </div>
            )}
            {/* 文件信息 */}
          <div style={{ marginBottom: 16 }}>
            <Text strong>{uploadedImage.name}</Text>
            <br />
            <Text type="secondary">
                {(uploadedImage.size / 1024).toFixed(2)} KB
            </Text>
            </div>
          </div>
        )}

      {/* 操作按钮 */}
        {uploadedImage && (
        <Space style={{ width: '100%' }} size="middle">
          <Button
            type="primary"
              onClick={handleRecognize}
              disabled={isLoading}
            icon={isLoading ? <LoadingOutlined /> : undefined}
            block
            size="large"
          >
            {isLoading ? '识别中...' : '开始识别'}
          </Button>
          <Button onClick={handleRemove} disabled={isLoading} size="large">
              清除
          </Button>
        </Space>
        )}

      {/* 提示信息 */}
      <Alert
        message="提示"
        description={
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>请确保VIN码清晰可见</li>
            <li>建议使用高清图片以提高识别准确率</li>
            <li>VIN码通常位于车辆铭牌或挡风玻璃下方</li>
        </ul>
        }
        type="warning"
        showIcon
      />
    </Space>
  )
}
