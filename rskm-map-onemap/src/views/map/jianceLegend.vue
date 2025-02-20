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
        key: 1,
        title: "极差",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(158,224,132)",
        fillColor: "#FF0000",
        outlineWidth: 0,
        order: "长势分布"
    },
    {
        key: 2,
        title: "较差",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(253,220,103)",
        fillColor: "#FFA500",
        outlineWidth: 0,
        order: "长势分布"
    },
    {
        key: 3,
        title: "正常",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(236,102,103)",
        fillColor: "#90EE90",
        outlineWidth: 0,
        order: "长势分布"
    },
    {
        key: 4,
        title: "较好",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(236,102,103)",
        fillColor: "#008000",
        outlineWidth: 0,
        order: "长势分布"
    },
    {
        key: 5,
        title: "极好",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGB(236,102,103)",
        fillColor: "#006400",
        outlineWidth: 0,
        order: "长势分布"
    },



];

const tuli = ref(true);


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
        <div v-if="tuli">



            <a-row v-for="tar in legends.filter(le => le.order == '长势分布')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '长势分布')[0].key">
                    <!-- <div class="legendTitle">{{
                        tar.order }}</div> -->
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

                <a-col :span="1" style="font-size: 0.8rem;">
                </a-col>
                <a-col :span="13" style="font-size: 0.8rem;">
                    {{ tar.title }}


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
    width: 120px;
    border-top: 1px solid #ccc;
}

.legendTitle {


    padding: 10px 0 0 0;
    width: 100%;


}
</style>
