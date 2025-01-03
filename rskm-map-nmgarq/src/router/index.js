
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
      path: "/verification",
      name: "verification",
      component: () => import("@/views/verification/index.vue"),
    },
  
    //   {
    //     path: "/room/:id", // 动态传递参数
    //     name: "room",
    //     component: () => import("/src/views/room.vue"),
    //   },
    //   {
    //     path: "/:pathMatch(.*)*",  // 匹配所有的404页面访问
    //     name: "noPage", 
    //     component: () => import("../page/404.vue"),
    //   },
  ],
});
// 将 router 暴露出去  （export default 抛出方式）
export default router;