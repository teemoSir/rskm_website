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
        title: "灾损图层",
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
    let hgdks = [
        "procjet_2024_yghy_zaihai_esysj", "procjet_2024_yghy_zaihai_chy", "procjet_2024_yghy_zaihai_htxd"
    ];
    hgdks.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked1);
    });

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
    //  console.log(layerId, isVisible)
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
                </a-col>
            </a-row>

        </div>
    </a-card>
</template>

<style scoped>
.win {
    /* background-color: transparent; */
    background: linear-gradient(to bottom, rgba(251, 250, 250, 0.93), rgba(204, 204, 204, 0.898));
}





:deep(.ant-card-head) {
    border-bottom: 0;
    font-family: FZZongYi-M05;
    font-weight: normal;
}

:deep(.ant-card-body) {
    padding: 1rem;
    width: 160px;
    border-top: 1px solid #ccc;
}

.legendTitle {
    font-size: 1rem;

    padding: 10px 0 0 0;
    width: 100%;


}
</style>
