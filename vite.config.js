import {fileURLToPath, URL} from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({
    transpileDependencies: true,
    //打包后不生成.map文件
    productionSourceMap: false,
    base: "/list",
    devServer: {
        proxy: {
            "/carpage": {
                target: "https://free-gpt.club",
                changeOrigin: true,
                ws: true,
                autoRewrite: true,
                cookieDomainRewrite: true,
            },
        },
    },
    plugins: [
        vue(),
        AutoImport({
            imports: [
                'vue',
                {
                    'naive-ui': [
                        'useDialog',
                        'useMessage',
                        'useNotification',
                        'useLoadingBar'
                    ]
                }
            ]
        }),
        Components({
            resolvers: [NaiveUiResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
