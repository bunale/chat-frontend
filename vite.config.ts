import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path';

export default defineConfig({
    plugins: [
        vue(),
        viteMockServe({
            enable: true,
            mockPath: 'mock',
        }),
],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "./src/style/variables.scss" as *;',
            },
        },
    },
    resolve: {
        alias: {
          // 设置别名 '@' 指向项目的 src 目录
           '@': path.resolve(__dirname, './src')
        }
      }
})
