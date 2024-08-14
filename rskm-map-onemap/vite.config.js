import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";


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
        plugins: [vue()],
        server: {
            host: "0.0.0.0",
            port: env.VITE_PORT,
        },
        resolve: {
            alias: {
                "@": resolve("./src"), // 新增
            },
        },
    };
});