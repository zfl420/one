import { Space, Typography } from 'antd'
import { useImageCompressorStore } from './image-compressor.store'
import ImageCard from './ImageCard'

const { Title } = Typography

export default function ImageList() {
  const { images } = useImageCompressorStore()

  if (images.length === 0) {
    return null
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        图片列表 ({images.length})
      </Title>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </Space>
    </div>
  )
}
