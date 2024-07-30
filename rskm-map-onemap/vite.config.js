import { defineConfig,loadEnv  } from 'vite'
import vue from '@vitejs/plugin-vue'
import path  from "path";


// const pathResolve = (dir) => resolve(__dirname, dir);
const resolve = (dir) => path.resolve(__dirname, dir);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        open: false, //项目启东时是否打开页面
        host: "127.0.0.1",
        port: 9000,
        // proxy: {
        //     "^/api/": {
        //         target: "http://localhost:3000/", // 后台服务器地址"http://localhost:3000/"
        //         changeOrigin: true /* 允许跨域 */,
        //         rewrite: (path) => path.replace(/^\/api/, ""),
        //     },
        // },
    },
    resolve: {
        alias: {
            "@": resolve("./src"), // 新增
        },
    },
})


// https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, process.cwd(), "");
//     //console.log(env.VITE_APP_BASE_API);
//     const resolve = (dir) => path.resolve(__dirname, dir);
//     return {
//     //   base: "./",
//     //   publicPath: resolve("./public"),
//     //   assetsPublicPath: "./",
//       plugins: [vue()],
//     //   extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
//       resolve: {
//         alias: {
//           "@": resolve("src"),
//         },
//       },
//       // 本地运行配置，及反向代理配置
//       server: {
//         host: "127.0.0.1",
//         port: 9000,
//         open: false,
//         // strictPort: false,
//         // https: false,
//         // cors: true,
//         proxy: {
//           // 代理规则直接放在 server 对象下，而非嵌套的 server 对象中
//           "/api": {
//             target: env.VITE_APP_BASE_API,
//             changeOrigin: true,
//             rewrite: (path) => path.replace(/^\/api/, ""),
//           },
//         },
//       },
    
//     };
//   });
