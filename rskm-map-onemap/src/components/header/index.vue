<script setup>
import { useRouter } from "vue-router";
import page from "../../../package.json";
import StateManager from "@/utils/state_manager";
import { ref, onMounted, h } from "vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { hedaerStore } from "@/store/store.js";
import { House, Satellite, Vegan, SquareActivity, Settings, Map, LandPlot } from "lucide-vue-next";
import dayjs from "dayjs";

const router = useRouter();
const hctive = hedaerStore();
let { headerActive } = storeToRefs(hctive);

// 初始化区域
// const defaultAdmin = () => {
//     if (!StateManager.get("defaultAdmin")) {
//         StateManager.set("defaultAdmin", "山东省");
//     }
//     return StateManager.get("defaultAdmin");
// };

// // 年份
// const pageDateYear = ref(dayjs(StateManager.get("rskm_pt_year") || new Date().toLocaleDateString()));

// // 跳转年份数据
// const panelChangeRL = (value) => {
//     StateManager.clear("rskm_pt_year");
//     StateManager.set("rskm_pt_year", dayjs(value).format("YYYY"));

//     message.loading(`进入 ${StateManager.get("rskm_pt_year", dayjs(value).format("YYYY"))} 年度`, 1000);

//     let ts = setTimeout(() => {
//         location.reload();
//         clearTimeout(ts);
//     }, 1000);
// };

// 菜单
const current = ref(["home"]);

const items = ref([
    {
        key: "home",
        icon: () => h(LandPlot),
        label: "保险分布",
        title: "保险分布",
        onClick: () => {
            router.push("/");
        },
    },
    {
        key: "verification",
        icon: () => h(Satellite),
        label: "遥感核验",
        title: "遥感核验",
        onClick: () => {
            router.push("/verification_n1");
        }, children: [
            {
                label: "遥感成果",
                key: "verification:1",
                onClick: () => {
                    router.push("/verification_n1");
                },
            },
            // {
            //     label: "遥感核验（第二次）",
            //     key: "verification:2",
            //     onClick: () => {
            //         router.push("/verification_n2");
            //     },
            // },
            {
                label: "核验任务(开发中)",
                key: "renwu",
            },

        ],
        // children: [
        //     {
        //         type: "group",
        //         label: "核验管理",

        //     },
        //     {
        //         type: "group",
        //         label: "任务管理",
        //         children: [
        //             {
        //                 label: "核验任务(开发中)",
        //                 key: "renwu",
        //             },
        //         ],
        //     },
        // ],
    },
    {
        key: "chengxiao",
        icon: () => h(SquareActivity),
        label: "成效分析",
        title: "成效分析",
        onClick: () => {
            router.push("/chengxiao");
        },
    },
    {
        key: "jiance",
        icon: () => h(Map),
        label: "遥感监测",
        title: "遥感监测",
        onClick: () => {
            router.push("/fenbu");
        },
        children: [
            {
                label: "种植遥感监测",
                key: "fenbu",
                onClick: () => {
                    router.push("/fenbu");
                },
            },
            {
                label: "长势遥感监测",
                key: "jiance",
                onClick: () => {
                    router.push("/jiance");
                },
            },
            {
                label: "灾损遥感监测",
                key: "zaisun",
                onClick: () => {
                    router.push("/zaisun");
                },
            },
        ],
    },
]);

defineProps({
    pageStyle: {
        type: Object,
        default: () => ({}),
    },
});

onMounted(() => {
    const path = window.location.pathname;
    const keyword = path.split('/').pop();
    current.value = keyword ? [keyword] : ['home'];
});
</script>

<template>
    <a-page-header class="header" :title="page.cnname" :sub-title="'Version ' + page.version" :style="pageStyle">
        <div style="position: absolute; left: 17px; top: 20px;">
            <Vegan :size="55" color="green" />

        </div>
        <div style="position: absolute; left: 90px; top: 55px; color: green;">
            {{ String(page.name) }}
        </div>


        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items"
            style="position: absolute; left: 400px; top: 0px; line-height: 80px" />
    </a-page-header>
</template>

<style scoped>
::v-deep .ant-menu {
    font-size: 1.1rem;
}

::v-deep .ant-picker {
    background: transparent;
    border: 0;
    padding: 0;
}

::v-deep .ant-picker input {
    color: #ccc;
}

::v-deep .ant-page-header-heading-title {
    font-size: 2rem;
    font-weight: normal;
}

:deep(.ant-menu-light) {
    font-family: 'FZZongYi-M05';
}

:deep(.ant-menu-title-content) {
    font-size: 22px;
    font-weight: normal;
}

:deep(.ant-menu-item-icon) {
    scale: 2;
    position: relative;
    top: -2px;
}

:deep(.ant-picker-dropdown) {
    z-index: 200000;
}
</style>

<style>
.header {
    font-family: 'FZZongYi-M05';
    letter-spacing: 1.5px;
    padding-left: 90px;
    z-index: 200000;
}
</style>