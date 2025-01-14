
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    //哈希模式
    history: createWebHistory(),
    routes: [
        // 通过数组对象的形式，配置路径对应展示的组件。
        {
            path: "/",
            name: "",
            component: () => import("@/views/index.vue"),
        },
        {
            path: "/home",
            name: "home",
            component: () => import("@/views/index.vue"),
        },
        {
            path: "/map",
            name: "map",
            component: () => import("@/views/map/index.vue"),
        },
        {
            path: "/verification_n1",
            name: "verification_n1",
            component: () => import("@/views/verification_n1/index.vue"),
        },
        {
            path: "/verification_n2",
            name: "verification_n2",
            component: () => import("@/views/verification_n2/index.vue"),
        },
        {
            path: "/echars",
            name: "echars",
            component: () => import("@/views/echars/index.vue"),
        },
        {
            path: "/renwu",
            name: "renwu",
            component: () => import("@/views/renwu/index.vue"),
        },
        {
            path: "/chengxiao",
            name: "chengxiao",
            component: () => import("@/views/chengxiao/index.vue"),
        },
        {
            path: "/jiance",
            name: "jiance",
            component: () => import("@/views/jiance/index.vue"),
        }
    ],
});
// 将 router 暴露出去  （export default 抛出方式）
export default router;