# 环境变量配置说明

## 车型识别功能需要配置API凭证

请在项目根目录创建 `.env.local` 文件，并添加以下配置：

```env
# 17VIN API 配置
VITE_17VIN_USERNAME=kzcf
VITE_17VIN_PASSWORD=kz06cf
VITE_17VIN_API_URL=http://api.17vin.com:8080/
```

## 快速创建命令

在项目根目录执行：

```bash
cat > .env.local << 'EOF'
# 17VIN API 配置
VITE_17VIN_USERNAME=kzcf
VITE_17VIN_PASSWORD=kz06cf
VITE_17VIN_API_URL=http://api.17vin.com:8080/
EOF
```

## 注意事项

1. `.env.local` 文件已被添加到 `.gitignore`，不会提交到版本控制
2. 如果使用自己的API账号，请修改对应的用户名和密码
3. 修改环境变量后需要重启开发服务器（`npm run dev`）

## 验证配置

配置完成后，车型识别功能将可以正常使用：
- 图片OCR识别
- VIN码查询

如果API调用失败，请检查：
1. 环境变量是否正确配置
2. API账号是否有效
3. 网络连接是否正常

