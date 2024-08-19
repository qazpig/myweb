import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,  // 開發環境啟用 mock
      prodEnabled: false,  // 生產環境禁用 mock
      supportTs: false,    // 如果使用 TypeScript，將此設置為 true
      watchFiles: true,    // 監視文件變化
    }),
  ],
  base: process.env.NODE_ENV === 'production' ? 'myweb' : '/',
  build:{
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  assetsInclude: ['**/*.md']
})