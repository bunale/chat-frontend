import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        viteMockServe({
            enable: true,
            mockPath: 'mock',
        }),
    ],
    base: '/',
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "./src/styles/variables.scss" as *;',
            },
        },
    },
    resolve: {
        alias: {
            // 设置别名 '@' 指向项目的 src 目录
            '@': path.resolve(__dirname, './src'),
        },
    },
    // 配置静态资源处理
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    build: {
        // 确保资源正确复制
        outDir: 'dist',
        assetsDir: 'assets',
        // rollupOptions: {
        //     output: {
        //         assetFileNames: 'assets/[name].[hash][extname]'
        //     }
        // },
    },
})
