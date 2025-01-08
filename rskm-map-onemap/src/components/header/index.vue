<script setup>
import { useRouter } from "vue-router";
import page from "../../../package.json";
import StateManager from "@/utils/state_manager";

import { FileDigit, Home, Settings, TextSearch } from "lucide-vue-next";
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { hedaerStore } from "@/store/store.js";

const router = useRouter();
import {
    Shield,
    Sprout
} from "lucide-vue-next";




const hctive = hedaerStore();
let { headerActive } = storeToRefs(hctive);


//  初始化区域
const defaultAdmin = () => {
    if (!StateManager.get("defaultAdmin")) {
        StateManager.set("defaultAdmin", "山东省");
    }
    return StateManager.get("defaultAdmin");
};

// 年份
const pageDateYear = ref(
    dayjs(StateManager.get("rskm_pt_year") || new Date().toLocaleDateString())
);

//跳转年份数据
const panelChangeRL = (value, mode) => {
    StateManager.clear("rskm_pt_year");
    StateManager.set("rskm_pt_year", dayjs(value).format("YYYY"));

    message.loading(
        `进入 ${StateManager.get("rskm_pt_year", dayjs(value).format("YYYY"))} 年度`,
        1000
    );

    let ts = setTimeout((e) => {
        location.reload();
        clearTimeout(ts);
    }, 1000);
};


//菜单
//const current = ref([headerActive.value || "home"]);
const current = ref(["home"]);



const items = ref([
    {
        key: "home",
        icon: () => h(Home),
        label: "首页",
        title: "首页",
        onClick: () => {
            // headerActive.value = 'home';
            router.push("/");
            // router.replace({ path: '/home' })
        },
    },
    {
        key: "verification",
        icon: () => h(TextSearch),
        label: "遥感核验",
        title: "遥感核验",
        children: [
            {
                type: "group",
                label: "核验管理",
                children: [
                    {
                        label: "遥感核验",
                        key: "verification:1",
                        onClick: () => {
                            router.push("/verification"); router.push("/verification");
                        },
                    },
                    // {
                    //     label: "遥感核验（第二次）",
                    //     key: "verification:2",
                    //     onClick: () => {
                    //         router.push("/yaogan");
                    //     },
                    // },
                ],
            },
            // {
            //     type: "group",
            //     label: "任务管理",
            //     children: [
            //         {
            //             label: "核验任务",
            //             key: "verification:3",
            //             onClick: () => {
            //                 router.push("/renwu");
            //             },
            //         },
            //     ],
            // },
        ],

    },
    {
        key: "chengxiao",
        icon: () => h(FileDigit),
        label: "统计分析",
        title: "统计分析",
        children: [
            {
                type: "group",
                label: "数据分析",
                children: [
                    {
                        label: "成效分析",
                        key: "chengxiao:1",
                        onClick: () => {
                            router.push("/chengxiao");
                        },
                    },
                ],
            },
        ],
    },
    {
        key: "jiance",
        icon: () => h(Settings),
        label: "遥感监测",
        title: "遥感监测",
        children: [
            {
                type: "group",
                label: "基础监测",
                children: [
                    {
                        label: "长势遥感监测",
                        key: "jiance:1",
                        onClick: () => {
                            router.push("/jiance");
                        },
                    },
                    // {
                    //     label: "灾损遥感监测",
                    //     key: "jiance:1",
                    //     onClick: () => {
                    //         router.push("/jiance");
                    //     },

                    // },

                ],
            },
        ],
    }
]);
defineProps({
    pageStyle: {
        type: Object,
        default: () => ({})
    }
})

onMounted(() => {
    const path = window.location.pathname;
    const keyword = path.split('/').pop();
    current.value = keyword ? [keyword] : ['home'];

})

</script>


<template>

    <a-page-header class="header" :title="page.cnname" :sub-title="page.name + ' V' + page.version" :style="pageStyle">
        <div style="position: absolute;left: 20px; top: 15px;">
            <Sprout :size="45" color="green" />
        </div>
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items"
            style="position: absolute; left: 600px; top: 0px; line-height: 80px" />

        <!--年份-->
        <template #extra>
            <a-space direction="vertical" :size="5">
                <a-date-picker v-model:value="pageDateYear" picker="year" format="YYYY 年" :popupStyle="{ top: '150px' }"
                    @panelChange="panelChangeRL" />
            </a-space>
            <a-button key="2" type="info" style="color: #ccc">{{ defaultAdmin() }}</a-button>
        </template>
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
}
</style>

<style>
.header {
    font-family: 'FZZongYi-M05';
    letter-spacing: 1.5px;
    padding-left: 80px;
    z-index: 200000;
}
</style>