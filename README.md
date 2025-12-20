# One - 在线工具集合

一个简洁实用的在线工具网站，采用现代化技术栈构建，易于扩展。

## ✨ 特性

- 🚀 **快速启动** - 使用 Vite 构建，开发体验流畅
- 🔌 **插件式架构** - 工具注册系统，添加新工具只需简单配置
- 💾 **本地存储** - 使用 LocalStorage 保存历史记录
- ⌨️ **键盘支持** - 完整的键盘快捷键支持
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **现代 UI** - 简约美观的用户界面

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **样式方案**: Ant Design
- **路由**: React Router v6
- **图表库**: Recharts（用于数据可视化）
- **图标库**: @ant-design/icons

## 📦 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd One

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🔧 当前工具

### 🔢 计算器
一个基础四则运算计算器，支持完整的键盘操作和历史记录功能。

**核心功能**:
- 基础四则运算（加减乘除）
- 历史记录功能
- 键盘快捷键支持
- 本地存储历史记录

**键盘快捷键**:
- 数字键 `0-9`: 输入数字
- `+`, `-`, `*` (或 `x`), `/`: 运算符
- `.`: 小数点
- `Enter` 或 `=`: 计算结果
- `Escape`: 清空
- `Backspace`: 删除

### 🚗 车型识别
通过VIN码（车辆识别代码）识别车型信息的工具，支持图片OCR识别和手动输入两种方式。

**核心功能**:
- **双重输入方式**: 支持图片上传OCR识别和手动输入17位VIN码
- **详细信息展示**: 品牌、车型、年款、发动机型号、排量、变速箱等完整信息
- **历史记录**: 自动保存最近20条查询记录，支持快速重新查询
- **友好交互**: 实时输入验证、加载状态提示、错误信息提示
- **响应式设计**: 完美适配桌面端和移动端

### 🏠 房贷计算器
功能完整的房贷计算器，支持等额本息和等额本金两种还款方式，提供详细的还款计划和可视化分析。

**核心功能**:
- **灵活的输入参数**: 支持10-1000万元范围，5/10/15/20/25/30年快捷选项，预设常用利率
- **两种还款方式**: 等额本息（固定月供）和等额本金（递减月供）一键切换
- **详细的结果展示**: 月供金额、还款总额、支付利息、本息占比可视化
- **完整的还款计划表**: 按年分页展示，显示每期的期数、月供、本金、利息、剩余本金
- **多维度可视化图表**: 本息构成趋势图、累计还款进度图、本息占比饼图

### 🖼️ 图片压缩工具
功能完整的浏览器端图片压缩工具，支持批量处理、多种尺寸调整方式、质量预设、EXIF信息移除和格式转换。

**核心功能**:
- **批量处理**: 支持一次上传多张图片
- **灵活调整**: 百分比/宽度/高度/最大边长多种尺寸调整方式
- **质量控制**: 高/中/低三档质量预设（90%/75%/60%）
- **隐私保护**: 可选移除 EXIF 地理信息等元数据
- **格式转换**: 支持 JPEG、PNG、WebP 互转
- **本地处理**: 纯浏览器端处理，图片不上传服务器，确保隐私安全
- **实时反馈**: 显示压缩前后大小对比和压缩比例

### 😀 Emoji大全
完整的Emoji表情大全工具，支持搜索、分类浏览、肤色选择和一键复制功能。

**核心功能**:
- **完整的Emoji库**: 包含所有Unicode标准emoji，支持1000+个表情图标
- **9大分类浏览**: 笑脸与表情、人物与身体、动物与自然、食物与饮料、旅行与地点、活动、物品、符号、旗帜
- **智能搜索**: 实时搜索emoji名称，支持中英文关键词搜索
- **肤色选择**: 支持6种肤色选项（默认 + 5种肤色），自动应用到支持肤色的emoji
- **最近使用**: 自动记录最近复制的emoji，保存最多20个，本地持久化存储
- **一键复制**: 点击emoji即可复制到剪贴板，复制成功有Toast提示

## 📁 项目结构

```
One/
├── src/
│   ├── components/          # 公共组件
│   │   └── Layout/         # 布局组件
│   ├── tools/              # 工具模块
│   │   ├── calculator/     # 计算器工具
│   │   ├── vehicle-identifier/ # 车型识别工具
│   │   ├── mortgage/       # 房贷计算器
│   │   ├── image-compressor/ # 图片压缩工具
│   │   ├── emoji-picker/   # Emoji大全工具
│   │   ├── index.ts        # 工具注册中心 ⭐
│   │   └── types.ts        # 工具类型定义
│   ├── pages/              # 页面组件
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型
│   └── styles/             # 全局样式
├── api/                    # API 代理
│   └── 17vin.ts           # 车型识别API代理
├── index.html
├── package.json
└── vite.config.ts
```

## 🔌 添加新工具

添加新工具非常简单，只需 3 步：

### 1. 创建工具组件
在 `src/tools/` 下创建新工具目录，例如 `json-formatter/`:

```typescript
// src/tools/json-formatter/JsonFormatter.tsx
import { Card, Typography } from 'antd'

const { Title } = Typography

export default function JsonFormatter() {
  return (
    <Card style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={2}>JSON 格式化</Title>
      {/* 你的工具 UI */}
    </Card>
  )
}
```

### 2. 注册工具
在 `src/tools/index.ts` 中注册新工具：

```typescript
import JsonFormatter from './json-formatter/JsonFormatter'

export const tools: ToolConfig[] = [
  // 现有工具...
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    category: 'dev',
    icon: '📋',
    component: JsonFormatter,
    route: '/tools/json-formatter',
    description: '格式化和验证 JSON 数据',
  },
]
```

### 3. 完成！
新工具会自动出现在首页和侧边栏中 🎉

## 🎨 工具分类

- `text` - 📝 文本工具
- `convert` - 🔄 转换工具
- `image` - 🖼️ 图像工具
- `dev` - ⚙️ 开发工具
- `other` - 📦 其他工具

## 🚀 部署

### Vercel (推荐)
1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Netlify
```bash
npm run build
# 拖拽 dist 文件夹到 Netlify
```

### 传统服务器
```bash
npm run build
# 将 dist 目录部署到 Nginx/Apache
```

## 📋 待办事项

### 短期
- [ ] 添加更多计算器功能（科学计算）
- [ ] 添加主题切换（深色模式）
- [ ] 添加 2-3 个新工具

### 中期
- [ ] 添加后端支持
- [ ] 用户系统
- [ ] 云端同步

### 长期
- [ ] 10+ 工具
- [ ] PWA 支持
- [ ] 多语言支持

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

用 ❤️ 构建
