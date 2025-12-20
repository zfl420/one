# 车型识别API调试说明

## 已修复的问题

### 1. API URL配置
- **问题**: API URL末尾有多余的斜杠
- **修复**: 从 `http://api.17vin.com:8080/` 改为 `http://api.17vin.com:8080`

### 2. Action参数错误
- **问题**: 图片识别使用了错误的action名称 `vin_ocr_and_vin_decode`
- **修复**: 改为正确的 `vin_ocr_vin_decode`

### 3. CORS跨域问题
- **问题**: 浏览器直接访问HTTP API会遇到CORS限制
- **修复**: 在 `vite.config.ts` 中添加代理配置
  ```typescript
  proxy: {
    '/api/17vin': {
      target: 'http://api.17vin.com:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/17vin/, ''),
    },
  }
  ```
- **说明**: 开发环境使用 `/api/17vin` 代理路径，生产环境使用直接URL

### 4. TypeScript类型错误
- **问题**: `import.meta.env` 缺少类型定义
- **修复**: 创建 `src/vite-env.d.ts` 文件定义环境变量类型

### 5. 环境变量配置
- **文件**: `.env.local`
- **内容**:
  ```env
  VITE_17VIN_USERNAME=kzcf
  VITE_17VIN_PASSWORD=kz06cf
  VITE_17VIN_API_URL=http://api.17vin.com:8080
  ```

## 测试VIN码

可以使用以下VIN码进行测试：

1. `LVGBF51K4CG036710` - 大众车型
2. `LZWADAGA5JF493439` - 其他车型

## API调用流程

### Token生成算法（重要！）

根据17VIN API文档，token生成算法为：

```
token = MD5(MD5(username) + MD5(password) + url_parameters)
```

其中：
- `MD5(username)`: 对用户名进行MD5加密
- `MD5(password)`: 对密码进行MD5加密  
- `url_parameters`: **仅包含业务参数**（不包含user和token），按key排序后拼接，格式为 `key1=value1&key2=value2`

**⚠️ 关键点**：
- `url_parameters` 只包含业务参数（如 `action`、`vin`、`base64_urlencode_imagestring`）
- **不包含** `user` 和 `token` 参数
- `user` 和 `token` 是在生成token之后再添加到请求中的

**示例**：
```javascript
// 假设要查询VIN码 ABC123...
// 1. 业务参数（用于生成token）
const businessParams = {action: 'vin_decode', vin: 'ABC123...'}
const urlParams = 'action=vin_decode&vin=ABC123...'

// 2. 生成token
const md5Username = MD5('kzcf')
const md5Password = MD5('kz06cf')
const token = MD5(md5Username + md5Password + urlParams)

// 3. 完整请求参数
const requestParams = {
  action: 'vin_decode',
  vin: 'ABC123...',
  user: 'kzcf',  // 添加user
  token: token    // 添加生成的token
}
```

### 手动输入VIN码查询

1. **Action**: `vin_decode`
2. **业务参数**（用于生成token）:
   ```
   action=vin_decode
   vin=17位VIN码
   ```
3. **Token生成**: 
   ```
   url_parameters = 'action=vin_decode&vin=LZWADAGA5JF493439'
   token = MD5(MD5('kzcf') + MD5('kz06cf') + url_parameters)
   ```
4. **实际请求参数**:
   ```
   action=vin_decode
   vin=LZWADAGA5JF493439
   user=kzcf
   token=生成的token
   ```

### 图片OCR识别

1. **Action**: `vin_ocr_and_vin_decode` （注意是 and）
2. **业务参数**（用于生成token）:
   ```
   action=vin_ocr_and_vin_decode
   base64_urlencode_imagestring=Base64编码并URL编码的图片
   ```
3. **Token生成**:
   ```
   url_parameters = 'action=vin_ocr_and_vin_decode&base64_urlencode_imagestring=...'
   token = MD5(MD5('kzcf') + MD5('kz06cf') + url_parameters)
   ```
4. **实际请求参数**:
   ```
   action=vin_ocr_and_vin_decode
   base64_urlencode_imagestring=...
   user=kzcf
   token=生成的token
   ```

## 错误处理

### Failed to fetch
- **原因**: 网络连接失败或API服务不可用
- **解决**: 
  1. 检查网络连接
  2. 确认API服务是否正常
  3. 检查代理配置是否正确

### HTTP错误
- **原因**: API返回非200状态码
- **解决**: 检查请求参数是否正确

### 识别/查询失败
- **原因**: API返回code !== 1
- **解决**: 
  1. 检查VIN码格式（必须17位）
  2. 检查图片质量和大小
  3. 检查token生成是否正确

## 开发环境 vs 生产环境

### 开发环境（npm run dev）
- 使用Vite代理: `/api/17vin`
- 自动处理CORS问题
- 支持热更新

### 生产环境（npm run build）
- 直接使用API URL: `http://api.17vin.com:8080`
- 可能需要服务器端代理或CORS配置
- 建议使用HTTPS和后端代理

## 注意事项

1. **环境变量**: 修改 `.env.local` 后需要重启开发服务器
2. **代理配置**: 修改 `vite.config.ts` 后Vite会自动重启
3. **Token生成**: 
   - 必须严格按照 `MD5(MD5(username) + MD5(password) + url_parameters)` 的算法
   - url_parameters必须按key的字母顺序排序
   - 参数值必须与实际发送的请求完全一致
4. **图片大小**: Base64编码后不超过4MB
5. **VIN码格式**: 必须17位，不包含I、O、Q字母
6. **参数顺序**: 生成token时参数必须按字母顺序排列

## 调试建议

1. 打开浏览器开发者工具（F12）
2. 切换到Network标签
3. 查看API请求和响应
4. 检查请求参数是否正确
5. 查看Console标签的错误信息

