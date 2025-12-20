import { Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useImageCompressorStore } from './image-compressor.store'

const { Dragger } = Upload

export default function UploadZone() {
  const { addImages } = useImageCompressorStore()

  const handleUpload = (file: File) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (acceptedTypes.includes(file.type)) {
      addImages([file])
    }
    return false // 阻止自动上传
  }

  return (
    <Dragger
      multiple
      accept="image/jpeg,image/png,image/webp,image/jpg"
      beforeUpload={handleUpload}
      showUploadList={false}
      style={{
        borderRadius: 16,
        background: '#fff',
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined style={{ color: '#faad14', fontSize: 64 }} />
      </p>
      <p className="ant-upload-text" style={{ fontSize: 18, fontWeight: 600 }}>
        拖拽图片到此处，或点击选择文件
      </p>
      <p className="ant-upload-hint" style={{ fontSize: 14 }}>
        支持 JPEG、PNG、WebP 格式，可批量上传
      </p>
    </Dragger>
  )
}
