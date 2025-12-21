import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// 读取 package.json 获取版本号
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, 'package.json'), 'utf-8')
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild', // 使用 esbuild，更快且无需额外依赖
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd', '@ant-design/icons'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
  server: {
    open: true, // 自动打开浏览器
    proxy: {
      // 代理17VIN API请求以解决CORS问题
      '/api/17vin': {
        target: 'http://api.17vin.com:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/17vin/, ''),
      },
    },
  },
})
