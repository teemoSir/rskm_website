<script setup>
import { ref } from "vue";
import { ChevronDownIcon, ChevronUp } from "lucide-vue-next";

// 图例数据配置
const legends = [
    // 绝产
    {
        key: 1,
        title: "绝产",
        type: "polygon",
        fillColor: "#FF0000", // 红色
        outlineWidth: 0
    },
    // 中度受灾
    {
        key: 2,
        title: "中度受灾",
        type: "polygon",
        fillColor: "#FFA500", // 橙色
        outlineWidth: 0
    },
    // 重度受灾
    {
        key: 3,
        title: "重度受灾",
        type: "polygon",
        fillColor: "#90EE90", // 浅绿色
        outlineWidth: 0
    },
    // 轻度受灾
    {
        key: 4,
        title: "轻度受灾",
        type: "polygon",
        fillColor: "#008000", // 绿色
        outlineWidth: 0
    },
    // 正常
    {
        key: 5,
        title: "正常",
        type: "polygon",
        fillColor: "#006400", // 深绿色
        outlineWidth: 0
    }
];

const tuli = ref(true);

</script>

<template>
    <a-card title="图例" :bordered="false" class="win">
        <template #extra>
            <div style="display: flex;align-items: center;">
                <ChevronDownIcon v-if="tuli" style="cursor: pointer;" @click="tuli = !tuli" color="#999" />
                <ChevronUp v-else style="cursor: pointer;" @click="tuli = !tuli" color="#999" />
            </div>
        </template>

        <div v-if="tuli">
            <a-row v-for="tar in legends" :key="tar.key" style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="10">
                    <div :style="{
                        background: tar.fillColor,
                        width: '35px',
                        height: '20px',
                    }"></div>
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
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));



}
</style>
