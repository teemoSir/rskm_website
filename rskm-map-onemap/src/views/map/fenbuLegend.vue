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

    {
        key: 0,
        title: "种植分布",
        isShow: ref(false),
        type: "polygon",
        outlineColor: "RGB(112,131,194)",
        fillColor: "RGBA(112,131,194,0.7)",
        outlineWidth: 3,
        order: "遥感图层"
    },


];

const tuli = ref(true);

const state = reactive({
    checked1: true,
    checked2: false,
    checked3: false,
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
    // let gds = ["procjet_2024_wxsd_name", "procjet_2024_wxsd", "procjet_2024_wxsd_outine","rskm_pt_name_1"];
    // gds.forEach((gd) => {
    //   toggleLayerVisibility(gd, state.checked1);
    // });

    //保单地块
    let hgdks = [
        "rskm_pt_outline",
        "rskm_pt",
        "rskm_pt_name",
        "rskm_pt_name_1",
    ];
    hgdks.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked2);
    });



    //县级界线
    let xjjx = ["admin_2024_county"];
    xjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked4);
    });

    //镇级界线
    let zjjx = ["admin_2024_town"];
    zjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked5);
    });

    //村级界线
    let cjjx = ["admin_2024_village"];
    cjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked6);
    });

    //省级界线
    let pjjx = ["admin_2022_province"];
    pjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked7);
    });

    //市级界线
    let cicyjjx = ["admin_2022_city"];
    cicyjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state.checked8);
    });

    message.success("地图已更新", 1);
});

// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {

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

    <a-card title="图例" :bordered="false" class="win">
        <template #extra>
            <div style="display: flex;align-items: center;">
                <ChevronDownIcon v-if="tuli" style="cursor: pointer;" @click="tuli = !tuli" color="#999">
                </ChevronDownIcon>
                <ChevronUp v-else style="cursor: pointer;" @click="tuli = !tuli" color="#999"></ChevronUp>
            </div>

        </template>
        <div v-if="tuli" style="width: 150px;">



            <!--遥感图层-->
            <a-row v-for="tar in legends.filter(le => le.order == '遥感图层')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="1"></a-col>
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

                <a-col :span="17" style="font-size: 12px;">
                    {{ tar.title }}

                    <!-- <div style="position: absolute; right: 10px; bottom: 0">
                        <a-switch v-if="tar.key == 0" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="radioValue" />
                    </div> -->
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
    padding: 5px 15px 5px 15px;
    width: 220px;
    border-top: 1px solid #ccc;
}

.legendTitle {
    font-size: 16px;

    padding: 10px 0 0 0;
    width: 100%;


}
</style>
