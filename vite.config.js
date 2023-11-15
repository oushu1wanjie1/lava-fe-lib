import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pugPlugin from "vite-plugin-pug"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9002
  },
  plugins: [
    vue(),
    pugPlugin()
  ]
})
