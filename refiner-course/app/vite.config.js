import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: '/refind/', // GitHub Pages 仓库名
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
