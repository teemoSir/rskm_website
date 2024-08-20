import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import viteImagemin from 'vite-plugin-imagemin';
import { visualizer } from 'rollup-plugin-visualizer';
 import viteCompression from 'vite-plugin-compression'
import WindiCSS from 'vite-plugin-windicss';

// const pathResolve = (dir) => resolve(__dirname, dir);
const resolve = (dir) => path.resolve(__dirname, dir);
// https://vitejs.dev/config/

// export default defineConfig({
//     plugins: [vue()],
//     server: {
//         open: false, //项目启东时是否打开页面
//         host: "127.0.0.1",
//         port: 9000,
//     },
//     resolve: {
//         alias: {
//             "@": resolve("./src"), // 新增
//         },
//     },
// })


export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        base: '/',
        plugins: [
            vue(),

            WindiCSS(),
            viteImagemin({
                gifsicle: {
                    optimizationLevel: 7,
                    interlaced: false
                },
                optipng: {
                    optimizationLevel: 7
                },
                mozjpeg: {
                    quality: 20
                },
                pngquant: {
                    quality: [0.8, 0.9],
                    speed: 4
                },
                svgo: {
                    plugins: [
                        {
                            name: 'removeViewBox'
                        },
                        {
                            name: 'removeEmptyAttrs',
                            active: false
                        }
                    ]
                }
            }),
            visualizer({
                filename: './dist/stats.html',
                title: 'Bundle Visualizer'
            }),
            viteCompression({
                // gzip静态资源压缩配置
                verbose: true,
                disable: false,
                threshold: 10240,
                algorithm: 'gzip',
                ext: '.gz'
            })

        ],
        server: {
            host: "0.0.0.0",
            hmr: true,
            watch: { usePolling: true },
            port: env.VITE_PORT,
        },
        resolve: {
            alias: {
                "@": resolve("./src"), // 新增
            },
        },
        build: {
            outDir: 'dist',
            minify: 'terser',
            cssCodeSplit: true,
            chunkSizeWarningLimit: 1500,
            rollupOptions: {
                input: 'index.html',
                output: {
                    // 静态资源打包做处理
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                    manualChunks (id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            },
            terserOptions: {
                // 清除console和debugger
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            }
        }
    };
});