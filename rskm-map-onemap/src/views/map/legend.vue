<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { message } from "ant-design-vue";
import {
  Headset,
  Info,
  Search,
  RotateCw,
  X,
  Sprout,
  LocateFixed,
  Grip,
  ChevronDown,
  Component,
  Logs,
  CalendarHeart,
  NotepadText,
} from "lucide-vue-next";

/**
 * 图例
 */
let legends = [
  
  {
    key: 2,
    title: "承保地块",
    isShow: ref(true),
    type: "polygon",
    outlineColor: "RGBA(0,0,0,0.8)",
    fillColor: "RGBA(34,177,76,0.8)",
    outlineWidth: 3,
  },
  {
    key: 1,
    title: "耕地地块",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGBA(255,255,251,1)",
    fillColor: "RGBA(43,128,251,0.5)",
    outlineWidth: 1,
  },
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
//   checked1: false,
//   checked2: true,
//   checked3: true,
  checked4: true,
  checked5: true,
  checked6: true,
  checked7: true,
  checked8: true,
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
  let gds = ["procjet_2024_wxsd_name", "procjet_2024_wxsd", "procjet_2024_wxsd_outine"];
  gds.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked1);
  });

  //保单地块
  let hgdks = [
    "rskm_pt_outline",
    "rskm_pt",
    "rskm_pt_name",
  ];
  hgdks.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked2);
  });

  //合格地块不显示 不合格地块显示
//   if (!state.checked2 && state.checked3) {
//     let newFilter = [
//       "all", // 使用 "all" 表示必须同时满足以下条件
//       ["<", ["get", "bili"], 80], // bili 大于等于 80
//       [">", ["get", "bili"], 0], // bili 小于等于 100
//     ];
//     hgdks.forEach((gd) => {
//       map.setFilter(gd, newFilter);
//     });
//   }
//   //合格地块不显示 不合格地块显示
//   else if (state.checked2 && !state.checked3) {
//     let newFilter = [
//       "all", // 使用 "all" 表示必须同时满足以下条件
//       [">=", ["get", "bili"], 80], // bili 大于等于 80
//     ];
//     hgdks.forEach((gd) => {
//       map.setFilter(gd, newFilter);
//     });
//   }
//   //合格地块he不合格地块同时显示
//   else if (state.checked2 && state.checked3) {
//     let newFilter = [
//       "all", // 使用 "all" 表示必须同时满足以下条件
//       [">", ["get", "bili"], 0], // bili 大于等于 80
//     ];
//     hgdks.forEach((gd) => {
//       map.setFilter(gd, newFilter);
//     });
//   } //合格地块he不合格地块同时显示
//   else if (!state.checked2 && !state.checked3) {
//     let newFilter = [
//       "all", // 使用 "all" 表示必须同时满足以下条件
//       ["<", ["get", "bili"], 0], // bili 大于等于 80
//     ];
//     hgdks.forEach((gd) => {
//       map.setFilter(gd, newFilter);
//     });
//   }

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
    map.setLayoutProperty(layerId, "visibility", "visible");
  } else {
    map.setLayoutProperty(layerId, "visibility", "none");
  }
};
</script>

<template>
  <div
    class="tuli"
    :style="{
      background: tuli ? 'rgba(253, 250, 250, 0.9)' : 'rgba(0, 0, 0, 0.7)',
      color: tuli ? 'rgba(0, 0, 0, 0.7)' : 'rgba(253, 250, 250, 0.8)',
    }"
  >
    <div style="display: flex; align-items: center" @click="tuli = !tuli">
      <Logs />

      <label v-if="tuli" style="padding-left: 15px"> 图例</label>
    </div>

    <div v-if="tuli" style="padding: 5px 0px 10px 5px; width: 200px">
      <a-row
        v-for="tar in legends"
        :key="tar.key"
        style="display: flex; align-items: center; line-height: 30px"
      >
        <a-col :span="6">
          <div
            v-if="tar.type == 'polygon'"
            :style="{
              background: tar.fillColor,
              border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
              width: '35px',
              height: '20px',
            }"
          ></div>
          <div
            v-if="tar.type == 'line-dotted'"
            :style="{
              borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
              width: '35px',
              height: '0px',
              paddingTop: '3.5px',
            }"
          ></div>

          <div
            v-if="tar.type == 'line'"
            :style="{
              borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
              width: '35px',
              height: '0px',
              paddingTop: '3.5px',
            }"
          ></div>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="17">
          {{ tar.title }}

          <div style="position: absolute; right: 5px; bottom: 0">
            <a-switch
              v-if="tar.key == 1"
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state.checked1"
            />
            <a-switch
              v-if="tar.key == 2"
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state.checked2"
            />
            <a-switch
              v-if="tar.key == 3"
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state.checked3"
            />
          
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
