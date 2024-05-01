import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { fileURLToPath, URL } from 'url';

export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return defineConfig({
        base: env.VITE_BASE_URL || '/list',
        server: {
            proxy: {
                '/carpage': {
                    target: 'http://127.0.0.1:8300',
                    changeOrigin: true,
                    ws: true,
                    rewrite: path => path.replace(/^\/carpage/, '/api/list')
                },
                '/carpages': {
                    target: 'http://127.0.0.1:8300',
                    changeOrigin: true,
                    ws: true,
                    rewrite: path => path.replace(/^\/carpages/, '/carpages')
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
                            'useLoadingBar',
                        ],
                    },
                ],
            }),
            Components({
                resolvers: [NaiveUiResolver()],
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },

        build: {
            sourcemap: false, // 生产环境不生成 source map
            rollupOptions: {
                // 这里可以添加更多的 Rollup 打包配置
            },
            // 更多的构建相关配置...
        },
    });
};
