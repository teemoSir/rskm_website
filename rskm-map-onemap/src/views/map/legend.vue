<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { message } from "ant-design-vue";
import {
    Logs,
} from "lucide-vue-next";

/**
 * 图例
 */
let legends = [

    {
        key: 1,
        title: "小麦",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(248,200,94)",
        fillColor: "RGBA(248,200,94,1)",
        outlineWidth: 3,
    },
    {
        key: 2,
        title: "玉米",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(158,224,132)",
        fillColor: "RGBA(158,224,132,1)",
        outlineWidth: 3,
    },

];

const tuli = ref(false);

const state = reactive({
    checked1: true,
    checked2: true,
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
        "rskm_pt_outline",
        "rskm_pt",
        "rskm_pt_name",
        "rskm_pt_name_1",
    ];

    let ymFilter = [">", ["index-of", "玉米", ['get', "i_type_name"]], -1];
    let xmFilter = [">", ["index-of", "小麦", ['get', "i_type_name"]], -1];
    let noAllFilter = [">", ["index-of", "小麦", ['get', "i_type_name"]], 100];


    if (!state.checked1 && state.checked2) {

        hgdks.forEach((gd) => {
            map.setFilter(gd, ymFilter);
        });
    }
    //合格地块不显示 不合格地块显示
    else if (state.checked1 && !state.checked2) {

        hgdks.forEach((gd) => {
            map.setFilter(gd, xmFilter);
        });
    }
    //合格地块he不合格地块同时显示
    else if (state.checked1 && state.checked2) {

        hgdks.forEach((gd) => {
            map.setFilter(gd, null);
        });
    } //合格地块he不合格地块同时显示
    else if (!state.checked1 && !state.checked2) {
        hgdks.forEach((gd) => {
            map.setFilter(gd, noAllFilter);
        });
    }

    message.success("要素已更新", 1);
});

// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {
    if (isVisible) {
        map.setLayoutProperty(layerId, "visibility", "visible");
    } else {
        map.setLayoutProperty(layerId, "visibility", "none");
    }
};
</script>

<template>
    <div class="tuli">
        <div style="display: flex; align-items: center;padding: 16px;" @click="tuli = !tuli">
            <Logs />

            <label v-if="tuli" style="padding-left: 15px"> 图例</label>
        </div>

        <div v-if="tuli" style=" width: 200px;padding: 15px; border-top: 1px solid rgba(255, 255, 255, 0.3);">
            <a-row v-for="tar in legends" :key="tar.key" style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="6">
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
                <a-col :span="1"></a-col>
                <a-col :span="17">
                    {{ tar.title }}

                    <div style="position: absolute; right: 5px; bottom: 0">
                        <a-switch v-if="tar.key == 1" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state.checked1" />
                        <a-switch v-if="tar.key == 2" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state.checked2" />
                        <a-switch v-if="tar.key == 3" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state.checked3" />

                    </div>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<style scoped>
.tuli {
    position: absolute;
    left: 0;
    bottom: 0;

    border-radius: 5px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    color: aliceblue;
}
</style>
