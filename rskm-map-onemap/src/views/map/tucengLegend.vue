<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive, defineProps } from "vue";
import { message } from "ant-design-vue";
import {
    ChevronDownIcon,
    ChevronUp,
    Logs,
    X
} from "lucide-vue-next";

/**
 * 图例
 */
let legends = [

    // {
    //     key: 1,
    //     title: "极差",
    //     isShow: ref(true),
    //     type: "polygon",
    //     outlineColor: "RGB(158,224,132)",
    //     fillColor: "#FF0000",
    //     outlineWidth: 0,
    //     order: "长势分布"
    // },
    // {
    //     key: 2,
    //     title: "较差",
    //     isShow: ref(true),
    //     type: "polygon",
    //     outlineColor: "RGB(253,220,103)",
    //     fillColor: "#FFA500",
    //     outlineWidth: 0,
    //     order: "长势分布"
    // },
    // {
    //     key: 3,
    //     title: "正常",
    //     isShow: ref(true),
    //     type: "polygon",
    //     outlineColor: "RGB(236,102,103)",
    //     fillColor: "#008000",
    //     outlineWidth: 0,
    //     order: "长势分布"
    // },
    // {
    //     key: 4,
    //     title: "较好",
    //     isShow: ref(true),
    //     type: "polygon",
    //     outlineColor: "RGB(236,102,103)",
    //     fillColor: "#90EE90",
    //     outlineWidth: 0,
    //     order: "长势分布"
    // },
    // {
    //     key: 5,
    //     title: "极好",
    //     isShow: ref(true),
    //     type: "polygon",
    //     outlineColor: "RGB(236,102,103)",
    //     fillColor: "#006400",
    //     outlineWidth: 0,
    //     order: "长势分布"
    // },

    {
        key: 6,
        title: "长势图层",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(236,102,103)",
        fillColor: "#006400",
        outlineWidth: 0,
        order: "图层"
    },
    {
        key: 7,
        title: "大户地块",
        isShow: ref(false),
        type: "polygon",
        outlineColor: "RGB(236,102,103)",
        fillColor: "#006400",
        outlineWidth: 0,
        order: "图层"
    },
    // {
    //     key: 8,
    //     title: "遥感地块",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGB(236,102,103)",
    //     fillColor: "#006400",
    //     outlineWidth: 0,
    //     order: "图层"
    // },

];

const tuli = ref(true);

const state = reactive({
    checked1: true,
    checked2: false,
    //checked3: false,
    //   checked4: true,
    //   checked5: true,
    //   checked6: true,
    //   checked7: true,
    //   checked8: true,
});

const menu = ref(false);

message.config({
    top: `200px`,
    maxCount: 2,
    rtl: true,
    prefixCls: "提示",
});

watch(state, () => {
    //保单地块

    // { time: "6月", tile: ["procjet_2024_yghy_yumi_zhangshi_esysj_1", "procjet_2024_yghy_yumi_zhangshi_htxd"] },
    // { time: "7月", tile: ["procjet_2024_yghy_yumi_zhangshi_esysj_2", "procjet_2024_yghy_yumi_zhangshi_htxd"] },
    // { time: "8月", tile: ["procjet_2024_yghy_yumi_zhangshi_esysj_3"] },
    // { time: "9月", tile: ["procjet_2024_yghy_yumi_zhangshi_chy"] },
    // { time: "10月", tile: ["procjet_2024_yghy_yumi_zhangshi_chy"] },
    let hgdks = [
        "procjet_2024_yghy_yumi_zhangshi_esysj_1",
        "procjet_2024_yghy_yumi_zhangshi_htxd",
        "procjet_2024_yghy_yumi_zhangshi_esysj_2",
        "procjet_2024_yghy_yumi_zhangshi_esysj_3",
        "procjet_2024_yghy_yumi_zhangshi_chy"
    ];
    hgdks.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked1);
    });



    // mapp.setLayoutProperty('rskm_pt', 'visibility', 'visible');
    // mapp.setLayoutProperty('rskm_pt_outline', 'visibility', 'visible');
    // mapp.setLayoutProperty('rskm_pt_name', 'visibility', 'visible');
    // mapp.setLayoutProperty('rskm_pt_name_1', 'visibility', 'visible');


    let hgdka = [
        "rskm_pt", "rskm_pt_outline", "rskm_pt_name", "rskm_pt_name_1",
    ];
    hgdka.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked2);
    });

    message.success("地图已更新", 1);
});

// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {
    console.log(layerId, isVisible)
    if (isVisible) {
        window[props.core || 'map'].setLayoutProperty(layerId, "visibility", "visible");
    } else {
        window[props.core || 'map'].setLayoutProperty(layerId, "visibility", "none");
    }
};


const props = defineProps({
    core: String,
})

</script>

<template>

    <a-card title="图层控制" :bordered="false" class="win">
        <template #extra>
            <div style="display: flex;align-items: center;">
                <ChevronDownIcon v-if="tuli" style="cursor: pointer;" @click="tuli = !tuli" color="#999">
                </ChevronDownIcon>
                <ChevronUp v-else style="cursor: pointer;" @click="tuli = !tuli" color="#999"></ChevronUp>
            </div>

        </template>
        <div v-if="tuli" style="width: 100px;">


            <!--图层-->
            <a-row v-for="tar in legends.filter(le => le.order == '图层')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '图层')[0].key">
                    <!-- <div class="legendTitle">{{
                        tar.order }}</div> -->
                </a-col>

                <a-col :span="14"> {{ tar.title }}
                </a-col>
                <a-col :span="4">
                </a-col>
                <a-col :span="6" style="font-size: 1rem;">
                    <a-switch v-if="tar.key == 6" checked-children="显示" un-checked-children="隐藏"
                        v-model:checked="state.checked1" />
                    <a-switch v-if="tar.key == 7" checked-children="显示" un-checked-children="隐藏"
                        v-model:checked="state.checked2" />
                    <a-switch v-if="tar.key == 8" checked-children="显示" un-checked-children="隐藏"
                        v-model:checked="state.checked3" />
                </a-col>
            </a-row>

            <!-- <a-row v-for="tar in legends.filter(le => le.order == '长势分布')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '长势分布')[0].key">
                    <div class="legendTitle">{{
                        tar.order }}</div>
                </a-col>
                <a-col :span="10">
                    <div v-if="tar.type == 'polygon'" :style="{
                        background: tar.fillColor,
                        border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
                        width: '35px',
                        height: '20px',
                    }"></div>
                    <div v-if="tar.type == 'line-dotted'" :style="{
                        borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
                        width: '35px',
                        height: '0px',
                        paddingTop: '3.5px',
                    }"></div>

                    <div v-if="tar.type == 'line'" :style="{
                        borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
                        width: '35px',
                        height: '0px',
                        paddingTop: '3.5px',
                    }"></div>
                </a-col>

                <a-col :span="4" style="font-size: 15px;">
                </a-col>
                <a-col :span="10" style="font-size: 15px;">
                    {{ tar.title }}


                </a-col>
            </a-row> -->
        </div>
    </a-card>
</template>

<style scoped>
.win {
    /* background: linear-gradient(to bottom,
            rgba(251, 250, 250, 0.93),
            rgba(204, 204, 204, 0.898)); */
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.5));
}





:deep(.ant-card-head-title) {
    color: #fff;
}

:deep(.ant-card-head) {
    border-bottom: 0;
    font-family: FZZongYi-M05;
    font-weight: normal;
}

:deep(.ant-card-body) {
    padding: 5px 15px 5px 15px;
    /* border-top: 1px solid #ccc; */
    width: 160px;
    border-top: 1px solid #cccccc3d;
    color: #fff;
}

/* .legendTitle {
    padding: 10px;
} */

:deep(.ant-card) {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.5));
    border: 0;
}
</style>
