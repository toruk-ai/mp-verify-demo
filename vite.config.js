import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 静态资源直接输出到根目录，public下txt可直接域名访问
  publicDir: 'public'
})