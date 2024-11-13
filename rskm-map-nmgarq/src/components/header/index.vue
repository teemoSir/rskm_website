<script setup>
import { useRouter } from "vue-router";
import page from "../../../package.json";
import StateManager from "@/utils/state_manager";
import { logo } from "@/views/index.js";
import { FileDigit, Home, Settings, TextSearch } from "lucide-vue-next";
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { hedaerStore } from "@/store/store.js";

const router = useRouter();

// Tab 栏选中菜单项
//const selectedKeys = ref(["/"]);


const hctive = hedaerStore();
let { headerActive } = storeToRefs(hctive);


//  初始化区域
const defaultAdmin = () => {
    if (!StateManager.get("nmgAdmin")) {
        StateManager.set("nmgAdmin", "内蒙古自治区");
    }
    return StateManager.get("nmgAdmin");
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
    // {
    //     key: "home",
    //     icon: () => h(Home),
    //     label: "首页",
    //     title: "首页",
    //     onClick: () => {
    //         // headerActive.value = 'home';
    //         router.push("/");
    //         // router.replace({ path: '/home' })
    //     },
    // },
    {
        key: "verification",
        icon: () => h(TextSearch),
        label: "遥感核验",
        onClick: () => {
            // headerActive.value = 'verification';
            // console.log( headerActive.value )
            router.push("/verification");
        },

    },
    {
        key: "sub1",
        icon: () => h(FileDigit),
        label: "统计分析",
        title: "统计分析",
        children: [
            {
                type: "group",
                label: "数据分析",
                children: [
                    // {
                    //     label: "农险大数据一张图",
                    //     key: "sub5:1",

                    // },
                    // {
                    //     label: "保单统计",
                    //     key: "sub4:1",
                    // },
                    // {
                    //     label: "结构分析",
                    //     key: "sub1:2",
                    //     children: [
                    //         {
                    //             label: "区域",
                    //             key: "sub2:3",
                    //         },
                    //         {
                    //             label: "机构",
                    //             key: "sub2:4",
                    //         },
                    //     ],
                    // },
                    {
                        label: "成效分析",
                        key: "sub3:2",
                    },
                ],
            },
        ],
    },
    {
        key: "cloud",
        icon: () => h(Settings),
        label: "遥感监测",
        title: "遥感监测",
        children: [
            {
                type: "group",
                label: "基础监测",
                children: [
                    {
                        label: "灾损遥感监测",
                        key: "cloud4:1",
                    },
                    {
                        label: "长势遥感监测",
                        key: "cloud3:1",
                    },
                ],
            },
        ],
    },
    {
        key: "alipay",
        label: h(
            "a",
            {
                href: "",
                target: "_blank",
            },
            ""
        ),
        title: "Navigation Four - Link",
    },
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

    <a-page-header class="header" :title="page.name" :sub-title="page.cnname + ' V' + page.version" :style="pageStyle"
        :avatar="{ src: logo }">
        <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items"
            style="position: absolute; left: 600px; top: 0px; line-height: 92px" />

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
    font-size: 16px;
}


::v-deep .ant-picker {
    background: transparent;
    border: 0;
    padding: 0;
}

::v-deep .ant-picker input {
    color: #ccc;
}
</style>