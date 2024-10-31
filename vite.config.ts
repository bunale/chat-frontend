import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'


export default defineConfig({
    plugins: [
        vue(),
        viteMockServe({
            enable: true,
            mockPath: 'mock'
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@use "./src/style/variables.scss" as *;',
            },
        },
    },
})
