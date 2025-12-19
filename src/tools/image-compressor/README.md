# 图片压缩工具

一个功能完整的浏览器端图片压缩工具，支持批量处理、多种尺寸调整方式、质量预设、EXIF信息移除和格式转换。

## 功能特性

### 1. 批量上传
- 支持拖拽上传或点击选择
- 可同时处理多张图片
- 支持 JPEG、PNG、WebP 格式

### 2. 尺寸调整
- **不调整尺寸**：仅压缩质量，保持原始尺寸
- **百分比缩放**：按百分比等比例缩放（例如：80% 表示缩放到原尺寸的80%）
- **指定宽度**：设置目标宽度，高度自动等比例调整
- **指定高度**：设置目标高度，宽度自动等比例调整
- **最大边长**：限制图片最大边长，超出则等比例缩小

### 3. 质量预设
- **高质量**（90%）：适合需要高清晰度的场景
- **中等**（75%）：平衡文件大小和质量
- **高压缩**（60%）：最大化压缩比，适合网络传输

### 4. EXIF 信息移除
- 可选移除图片的所有元数据
- 包括地理位置、拍摄设备信息等
- 保护隐私安全

### 5. 格式转换
- 支持保持原格式
- 支持转换为 JPEG、PNG、WebP
- 自动处理格式兼容性

### 6. 实时反馈
- 显示原始文件大小
- 显示压缩后文件大小
- 显示压缩比例
- 处理状态实时更新

## 技术实现

### 核心技术
- **Canvas API**：浏览器原生 API，用于图片处理
- **FileReader API**：读取本地文件
- **Blob API**：生成压缩后的文件
- **Zustand**：状态管理
- **React + TypeScript**：UI 框架

### 关键优势
- **纯前端处理**：所有操作在浏览器本地完成
- **无需上传**：图片不会发送到服务器
- **隐私安全**：数据不会离开用户设备
- **无需依赖**：使用浏览器原生 API，无需额外库

### 压缩原理
1. 使用 FileReader 读取图片文件
2. 创建 Image 对象加载图片
3. 根据设置计算新的尺寸
4. 使用 Canvas 绘制调整后的图片（自动移除 EXIF）
5. 通过 Canvas.toBlob() 导出指定格式和质量的图片
6. 生成可下载的 Blob 对象

## 使用说明

1. **配置压缩参数**
   - 在左侧设置面板选择尺寸调整方式
   - 选择压缩质量（高/中/低）
   - 选择是否移除 EXIF 信息
   - 选择输出格式

2. **上传图片**
   - 拖拽图片到上传区域
   - 或点击上传区域选择文件
   - 支持一次选择多张图片

3. **开始压缩**
   - 点击"开始压缩"按钮
   - 等待处理完成
   - 查看压缩结果

4. **下载图片**
   - 单独下载：点击每张图片的"下载"按钮
   - 批量下载：点击"下载全部"按钮

## 文件结构

```
image-compressor/
├── ImageCompressor.tsx          # 主组件
├── image-compressor.store.ts    # Zustand 状态管理
├── UploadZone.tsx               # 上传区域组件
├── ImageList.tsx                # 图片列表组件
├── ImageCard.tsx                # 单个图片卡片组件
├── SettingsPanel.tsx            # 设置面板组件
├── types.ts                     # TypeScript 类型定义
├── utils.ts                     # 工具函数
└── README.md                    # 本文档
```

## 类型定义

```typescript
// 尺寸调整模式
type ResizeMode = 'percentage' | 'width' | 'height' | 'maxDimension' | 'none'

// 质量预设
type QualityPreset = 'high' | 'medium' | 'low'

// 输出格式
type OutputFormat = 'jpeg' | 'png' | 'webp' | 'original'

// 图片文件信息
interface ImageFile {
  id: string
  file: File
  preview: string
  originalSize: number
  compressedSize?: number
  compressedBlob?: Blob
  status: 'pending' | 'processing' | 'done' | 'error'
  error?: string
}

// 压缩设置
interface CompressionSettings {
  resizeMode: ResizeMode
  resizeValue: number
  qualityPreset: QualityPreset
  removeExif: boolean
  outputFormat: OutputFormat
}
```

## 浏览器兼容性

- Chrome 51+
- Firefox 50+
- Safari 10+
- Edge 79+

主要依赖的 API：
- Canvas API（广泛支持）
- FileReader API（广泛支持）
- Canvas.toBlob()（需要现代浏览器）

## 性能考虑

- 使用 Canvas 进行图片处理，性能优秀
- 支持批量处理，但不会阻塞 UI
- 大图片处理可能需要几秒钟
- 建议单次处理图片数量不超过 50 张

## 未来优化方向

- [ ] 添加图片对比预览（原图 vs 压缩后）
- [ ] 支持导出为 ZIP 文件
- [ ] 添加图片裁剪功能
- [ ] 支持更多格式（GIF、BMP 等）
- [ ] 添加压缩历史记录
- [ ] 支持 Web Worker 处理大批量图片
- [ ] 添加预览模式（查看压缩效果）

## 常见问题

**Q: 图片压缩后质量会变差吗？**
A: 这取决于你选择的质量预设。高质量模式（90%）几乎不会有可见的质量损失。

**Q: 支持哪些图片格式？**
A: 目前支持 JPEG、PNG、WebP 格式的输入和输出。

**Q: EXIF 信息真的会被移除吗？**
A: 是的，通过 Canvas 重绘的方式会自动移除所有 EXIF 元数据。

**Q: 图片会上传到服务器吗？**
A: 不会，所有处理都在浏览器本地完成，确保隐私安全。

**Q: 可以处理多大的图片？**
A: 理论上没有限制，但非常大的图片（如超过 20MB）可能会导致浏览器变慢。

## 开发与维护

### 添加新功能
1. 在 `types.ts` 中添加新的类型定义
2. 在 `utils.ts` 中实现核心逻辑
3. 在 `image-compressor.store.ts` 中更新状态管理
4. 在相应的 UI 组件中添加交互

### 调试技巧
- 使用浏览器的开发者工具查看 Canvas 内容
- 检查 Blob 对象的 size 和 type 属性
- 使用 console.log 跟踪状态变化

## 许可证

与项目主体保持一致
