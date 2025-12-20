# Emoji 大全

一个功能完整的Emoji选择器工具，支持搜索、分类浏览、肤色选择和一键复制。

## 功能特性

### ✨ 核心功能

1. **完整的Emoji库**
   - 包含所有Unicode标准emoji
   - 按9大类别分组展示
   - 支持1000+个emoji图标

2. **智能搜索**
   - 实时搜索emoji名称
   - 支持关键词搜索
   - 搜索结果按分类展示

3. **分类浏览**
   - 笑脸与表情 😀
   - 人物与身体 👋
   - 动物与自然 🐶
   - 食物与饮料 🍎
   - 旅行与地点 ✈️
   - 活动 ⚽
   - 物品 💡
   - 符号 ❤️
   - 旗帜 🏁

4. **肤色选择**
   - 支持6种肤色选项（默认 + 5种肤色）
   - 自动应用到支持肤色的emoji
   - 实时预览肤色效果

5. **最近使用**
   - 自动记录最近复制的emoji
   - 保存最多20个
   - 本地持久化存储
   - 支持清空历史

6. **一键复制**
   - 点击emoji即可复制到剪贴板
   - 复制成功有Toast提示
   - 支持所有现代浏览器

### 🎨 UI设计

- 参考 getemoji.com 的简洁设计
- 响应式布局，适配移动端、平板和桌面
- 大尺寸emoji展示，易于查看
- 悬停显示emoji名称
- 渐变背景，现代化视觉效果

## 技术实现

### 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Zustand** - 状态管理
- **Ant Design** - 样式
- **unicode-emoji-json** - Emoji数据源

### 文件结构

```
emoji-picker/
├── types.ts              # 类型定义
├── data.ts               # Emoji数据处理和搜索
├── utils.ts              # 工具函数（复制、肤色、localStorage）
├── emoji-picker.store.ts # Zustand状态管理
├── EmojiPicker.tsx       # 主组件
├── CategoryNav.tsx       # 分类导航
├── SearchBar.tsx         # 搜索栏
├── SkinTonePicker.tsx    # 肤色选择器
├── RecentEmojis.tsx      # 最近使用
├── EmojiGrid.tsx         # Emoji网格展示
├── CopyToast.tsx         # 复制成功提示
└── README.md             # 说明文档
```

### 核心功能实现

#### 1. Emoji数据处理

```typescript
// 从unicode-emoji-json导入数据
// 过滤和分类处理
// 支持搜索过滤
export const emojiCategories = processEmojiData()
```

#### 2. 状态管理

使用Zustand管理全局状态：
- 选中的分类
- 搜索关键词
- 最近使用列表
- 选中的肤色
- 复制成功提示

#### 3. 剪贴板复制

```typescript
// 使用现代Clipboard API
await navigator.clipboard.writeText(emoji)

// 降级方案：document.execCommand
```

#### 4. 肤色变体

```typescript
// Unicode肤色修饰符
const skinTones = [
  '\u{1F3FB}', // Light
  '\u{1F3FC}', // Medium-Light
  '\u{1F3FD}', // Medium
  '\u{1F3FE}', // Medium-Dark
  '\u{1F3FF}', // Dark
]
```

#### 5. 本地存储

```typescript
// localStorage持久化最近使用
localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis))
```

## 使用方法

### 访问页面

访问 `/tools/emoji-picker` 即可使用Emoji大全功能。

### 基本操作

1. **浏览emoji**
   - 点击分类按钮切换不同类别
   - 或点击"全部"查看所有emoji

2. **搜索emoji**
   - 在搜索框输入关键词
   - 支持中英文搜索
   - 实时显示匹配结果

3. **选择肤色**
   - 在左侧肤色选择器中选择想要的肤色
   - 支持肤色的emoji会自动应用

4. **复制emoji**
   - 点击任意emoji即可复制
   - 页面底部会显示复制成功提示

5. **查看最近使用**
   - 左侧栏显示最近复制的emoji
   - 点击即可快速复制
   - 支持清空历史记录

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器（iOS Safari, Chrome Mobile）

## 性能优化

- 使用useMemo优化搜索和过滤性能
- 惰性加载emoji数据
- 响应式图片和布局
- 高效的状态更新

## 未来改进

可能的增强功能：
- [ ] 收藏emoji功能
- [ ] emoji使用频率统计
- [ ] 更多emoji变体支持
- [ ] 虚拟滚动优化大量emoji渲染
- [ ] 支持emoji复制为图片
- [ ] 自定义emoji分组

## 开发者

如需修改或扩展功能，请参考以上技术实现和文件结构。
