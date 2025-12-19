import { useImageCompressorStore } from './image-compressor.store'
import ImageCard from './ImageCard'

export default function ImageList() {
  const { images } = useImageCompressorStore()

  if (images.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          图片列表 ({images.length})
        </h3>
      </div>

      <div className="space-y-3">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}
