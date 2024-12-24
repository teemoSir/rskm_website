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
        fillColor: "RGBA(248,200,94,0.7)",
        outlineWidth: 3,
    },
    {
        key: 2,
        title: "玉米",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(158,224,132)",
        fillColor: "RGBA(158,224,132,0.7)",
        outlineWidth: 3,
    },


    //   {
    //     key: 1,
    //     title: "耕地地块",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGBA(255,255,251,1)",
    //     fillColor: "RGBA(43,128,251,0.5)",
    //     outlineWidth: 1,
    //   },
    //   {
    //     key: 3,
    //     title: "不合格地块",
    //     isShow: ref(true),
    //     type: "polygon",
    //     outlineColor: "RGBA(0,0,0,0.8",
    //     fillColor: "RGBA(237,28,36,0.8)",
    //     outlineWidth: 3,
    //   },
    //   {
    //     key: 4,
    //     title: "县级界线",
    //     isShow: ref(false),
    //     type: "line",
    //     fillColor: "yellow",
    //     outlineWidth: 4,
    //   },
    //   {
    //     key: 5,
    //     title: "镇级界线",
    //     isShow: ref(false),
    //     type: "line",
    //     fillColor: "#faad14",
    //     outlineWidth: 4,
    //   },
    //   {
    //     key: 6,
    //     title: "村级界线",
    //     isShow: ref(false),
    //     type: "line-dotted",
    //     fillColor: "#faad14",
    //     outlineWidth: 4,
    //   },
    //   {
    //     key: 7,
    //     title: "省级界线",
    //     isShow: ref(false),
    //     type: "line",
    //     fillColor: "#ccc",
    //     outlineWidth: 2,
    //   },
    //   {
    //     key: 8,
    //     title: "市级界线",
    //     isShow: ref(false),
    //     type: "line",
    //     fillColor: "#ccc",
    //     outlineWidth: 1,
    //   },
];

const tuli = ref(false);

const state = reactive({
    checked1: true,
    checked2: true,
    //   checked3: true,
    //   checked4: true,
    //   checked5: true,
    //   checked6: true,
    //   checked7: true,
    //   checked8: true,
});

const menu = ref(false);

message.config({
    top: `200px`,
    //   duration: 2,
    maxCount: 2,
    rtl: true,
    prefixCls: "提示",
});

watch(state, () => {
    //耕地 StateManager
    let hgdks = [
        "rskm_pt_outline",
        "rskm_pt",
        "rskm_pt_name",
        "rskm_pt_name_1",
    ];

    let ymFilter = [">", ["index-of", "玉米", ['get', "i_type_name"]], -1];
    let xmFilter = [">", ["index-of", "小麦", ['get', "i_type_name"]], -1];
    let noAllFilter = [">", ["index-of", "小麦", ['get', "i_type_name"]], 100];
    // gds.forEach((gd) => {
    //   if (!state.checked1) {
    //     map.setFilter(gd, ymFilter);
    //   } else {
    //     map.setFilter(gd, null);
    //   }
    //   if (!state.checked2) {
    //     map.setFilter(gd, xmFilter);
    //   } else {
    //     map.setFilter(gd, null);
    //   }

    //   if(!state.checked1 && state.checked2){
    //     map.setFilter(gd, ymFilter);
    //   }
    // });


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

    // //县级界线
    // let xjjx = ["admin_2024_county"];
    // xjjx.forEach((gd) => {
    //   toggleLayerVisibility(gd, state.checked4);
    // });

    // //镇级界线
    // let zjjx = ["admin_2024_town"];
    // zjjx.forEach((gd) => {
    //   toggleLayerVisibility(gd, state.checked5);
    // });

    // //村级界线
    // let cjjx = ["admin_2024_village"];
    // cjjx.forEach((gd) => {
    //   toggleLayerVisibility(gd, state.checked6);
    // });

    // //省级界线
    // let pjjx = ["admin_2022_province"];
    // pjjx.forEach((gd) => {
    //   toggleLayerVisibility(gd, state.checked7);
    // });

    // //市级界线
    // let cicyjjx = ["admin_2022_city"];
    // cicyjjx.forEach((gd) => {
    //   toggleLayerVisibility(gd, state.checked8);
    // });

    message.success("地图已更新", 1);
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
    <div class="tuli" :style="{
        background: tuli ? 'rgba(253, 250, 250, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        color: tuli ? 'rgba(0, 0, 0, 0.7)' : 'rgba(253, 250, 250, 0.8)',
    }">
        <div style="display: flex; align-items: center" @click="tuli = !tuli">
            <Logs />

            <label v-if="tuli" style="padding-left: 15px"> 图例</label>
        </div>

        <div v-if="tuli" style="padding: 5px 0px 10px 5px; width: 200px">
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
    padding: 10px;
    border-radius: 2px;
}
</style>
