<script setup>
import { useRouter } from "vue-router";
import page from "../../../package.json";
import StateManager from "@/utils/state_manager";
import { logo } from "@/views/index.js";
import { FileDigit, Home, Settings, TextSearch } from "lucide-vue-next";
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";

const router = useRouter();



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
        2000
    );

    let ts = setTimeout((e) => {
        location.reload();
        clearTimeout(ts);
    }, 1000);
};


//菜单
const current = ref(["home"]);
const items = ref([
    {
        key: "home",
        icon: () => h(Home),
        label: "首页",
        title: "首页",
        onClick: () => {
            router.push("/");
            // router.replace({ path: '/home' })
        },
    },
    {
        key: "app",
        icon: () => h(TextSearch),
        label: "遥感核验",
        title: "遥感核验",
        children: [
            {
                label: "区域核验",
                key: "app:area",
                onClick: () => {
                    router.push("/verification/index");
                },
            },
            {
                label: "地块核验",
                key: "app:land",
                onClick: () => {
                    router.push("/verification/land");
                },
            },
            // {
            //     type: "group",
            //     label: "区域核验",
            //     children: [
            //         {
            //             label: "区县级核验",
            //             key: "app:county",
            //             onClick: () => {
            //                 router.push("/verification/county");
            //             },
            //         },
            //         {
            //             label: "乡镇级核验",
            //             key: "app:town",
            //             onClick: () => {
            //                 router.push("/verification/town");
            //             },
            //         },
            //         {
            //             label: "村级核验",
            //             key: "app:village",
            //             onClick: () => {
            //                 router.push("/verification/village");
            //             },
            //         },
            //     ],
            // },
            // {
            //     type: "group",
            //     label: "地块核验",
            //     children: [
            //         {
            //             label: "乡镇级核验",
            //             key: "app:11",
            //         },
            //     ],
            // },
        ],
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