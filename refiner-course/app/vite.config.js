import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/refind/app/', // 部署到 /app/ 子路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
