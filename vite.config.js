import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  // assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // 确保 Vite 能够处理 JSON 文件
  assetsInclude: ['**/*.json','**/*.md']
})