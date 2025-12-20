import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
