<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { message } from "ant-design-vue";
import {
  ChevronUp,
  ChevronDownIcon
} from "lucide-vue-next";

/**
 * 图例
 */
let legends = [


  {
    key: 0,
    title: "遥感种植分布图",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGB(112,131,194)",
    fillColor: "RGBA(112,131,194,0.7)",
    outlineWidth: 3,
    order: "遥感图层"
  },

  {
    key: 1,
    title: "合格",
    isShow: ref(true),
    type: "polygon",
    outlineColor: "yellow",
    fillColor: "RGB(144,204,120)",
    outlineWidth: 0,
    order: "状态"
  },
  {
    key: 2,
    title: "不合格",
    isShow: ref(true),
    type: "polygon",
    outlineColor: "orange",
    fillColor: "RGB(236,102,103)",
    outlineWidth: 0,
    order: "状态"
  },


  {
    key: 3,
    title: "国寿财",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGB(76,127,217)",
    fillColor: "RGBA(43,128,251,0.0)",
    outlineWidth: 5,
    order: "机构"
  },

  {
    key: 4,
    title: "太平",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGB(147,138,87)",
    fillColor: "RGBA(43,128,251,0.0)",
    outlineWidth: 5,
    order: "机构"
  },

  {
    key: 5,
    title: "人保",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "#000",
    fillColor: "RGBA(43,128,251,0.0)",
    outlineWidth: 5,
    order: "机构"
  },
  {
    key: 6,
    title: "太保",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGB(126,72,225)",
    fillColor: "RGBA(43,128,251,0.0)",
    outlineWidth: 5,
    order: "机构"
  },
  {
    key: 7,
    title: "中华",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGB(250,131,86)",
    fillColor: "RGBA(43,128,251,0.0)",
    outlineWidth: 5,
    order: "机构"
  },
  {
    key: 8,
    title: "安华",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGB(233,124,203)",
    fillColor: "RGBA(43,128,251,0.0)",
    outlineWidth: 5,
    order: "机构"
  },

];

const tuli = ref(true);


/**
 * 图例
 */
const state = reactive({
  checked0: false,
  checked1: true,
  checked2: true,
});

/**
 * 图例
 */
const state2 = reactive({

  radioValuev1: false,
  radioValuev2: false,
  radioValuev3: false,
  radioValuev4: false,
});




message.config({
  top: `200px`,
  //   duration: 2,
  maxCount: 2,
  rtl: true,
  prefixCls: "提示",
});

watch(state, () => {

  //保单地块
  let hgdks = [
    "rskm_pt_outline",
    "rskm_pt",
    "rskm_pt_name",
    "rskm_pt_name_1",
  ];


  if (!state.checked1 && !state.checked2) {
    let newFilter = [
      "all",
      ["==", "1", "2"],
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  } else if (state.checked1 && state.checked2) {
    hgdks.forEach((gd) => {
      map.setFilter(gd, null);
    });
  }
  else if (state.checked1 && !state.checked2) {
    let newFilter = [
      "all",
      ["==", ['get', "v9"], '1'],
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  } else if (!state.checked1 && state.checked2) {
    let newFilter = [
      "all",
      ["!=", ['get', "v9"], '1'],
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  }


  if (state.checked2) {
    radioOffState.value = false;
    state2.radioValuev1 = false;
    state2.radioValuev2 = false;
    state2.radioValuev3 = false;
    state2.radioValuev4 = false;
  } else {
    radioOffState.value = true;
  }

  message.success("图层已更新", 1);
});


watch(state2, () => {
  //保单地块
  let hgdks = [
    "rskm_pt_outline",
    "rskm_pt",
    "rskm_pt_name",
    "rskm_pt_name_1",
  ];
  // 多图层选择
  if (radioOffState.value) {
    if (!state2.radioValuev1 && !state2.radioValuev2 && !state2.radioValuev3 && !state2.radioValuev4) {
      hgdks.forEach((gd) => {
        map.setFilter(gd, [
          "all",
          ["==", "1", "2"],
        ]);
      });
    } else if (state2.radioValuev1 && state2.radioValuev2 && state2.radioValuev3 && state2.radioValuev4) {
      hgdks.forEach((gd) => map.setFilter(gd, null));
    } else {
      let sql = [];
      if (state2.radioValuev1) {
        sql.push(["==", ['get', "v3"], '0'])
      }
      if (state2.radioValuev2) {
        sql.push(["==", ['get', "v4"], '0'])
      }
      if (state2.radioValuev3) {
        sql.push(["==", ['get', "v7"], '0'])
      }
      if (state2.radioValuev4) {
        sql.push(["==", ['get', "v9"], '0'])
      }

      hgdks.forEach((gd) => {
        map.setFilter(gd, [
          "all",
          ...sql
        ]);
      });
    }
    // else if (state2.radioValuev1 && !state2.radioValuev2 && !state2.radioValuev3 && !state2.radioValuev4) {
    //   hgdks.forEach((gd) => {
    //     map.setFilter(gd, [
    //       "all",
    //       ["in", ['get', "v3"], '0'],
    //     ]);
    //   });
    // } else if (!state2.radioValuev1 && state2.radioValuev2 && !state2.radioValuev3 && !state2.radioValuev4) {
    //   hgdks.forEach((gd) => {
    //     map.setFilter(gd, [
    //       "all",
    //       ["in", ['get', "v4"], '0'],
    //     ]);
    //   });
    // } else if (!state2.radioValuev1 && !state2.radioValuev2 && state2.radioValuev3 && !state2.radioValuev4) {
    //   hgdks.forEach((gd) => {
    //     map.setFilter(gd, [
    //       "all",
    //       ["in", ['get', "v7"], '0'],
    //     ]);
    //   });
    // }
    // else if (!state2.radioValuev1 && !state2.radioValuev2 && !state2.radioValuev3 && state2.radioValuev4) {
    //   hgdks.forEach((gd) => {
    //     map.setFilter(gd, [
    //       "all",
    //       ["in", ['get', "v8"], '0'],
    //     ]);
    //   });
    // }
  }
})

// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {
  if (isVisible) {
    map.setLayoutProperty(layerId, "visibility", "visible");
  } else {
    map.setLayoutProperty(layerId, "visibility", "none");
  }
};

/**
 * 图层控制
 */
const radioValue = ref(false);

/**
 * 遥感图层
 */
watch(radioValue, (newr) => {
  if (newr) {
    map.setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'visible');
    map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'visible');
  } else {
    map.setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'none');
    map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'none');
  }
})



/**
 * 控制是否显示
 */
const dkRadioDisabled = ref(false);



/**
 * 是否显示
 */
const radioOffState = ref(false);



</script>

<template>

  <a-card title="图例" :bordered="false">
    <template #extra>
      <ChevronDownIcon v-if="tuli" style="cursor: pointer;" @click="tuli = !tuli"></ChevronDownIcon>
      <ChevronUp v-else style="cursor: pointer;" @click="tuli = !tuli"></ChevronUp>
    </template>

    <div v-if="tuli" style="width: 250px;">

      <label style="line-height: 40px;font-size: 16px; ">遥感图层</label>
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

        <a-col :span="17" style="font-size: 15px;">
          {{ tar.title }}

          <div style="position: absolute; right: 10px; bottom: 0">
            <a-switch v-if="tar.key == 0" checked-children="显示" un-checked-children="隐藏" v-model:checked="radioValue" />
          </div>


        </a-col>

        <a-col :span="24" style="font-size: 15px;">

        </a-col>

      </a-row>

      <label style="line-height: 40px;font-size: 16px; ">核验</label>
      <a-row v-for="tar in legends.filter(le => le.order == '状态')" :key="tar.key"
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

        <a-col :span="17" style="font-size: 15px;">
          {{ tar.title }}

          <div style="position: absolute; right: 10px; bottom: 0">
            <a-switch v-if="tar.key == 1" checked-children="显示" un-checked-children="隐藏"
              v-model:checked="state.checked1" />
            <a-switch v-if="tar.key == 2" checked-children="显示" un-checked-children="隐藏"
              v-model:checked="state.checked2" />

          </div>


        </a-col>

        <a-col :span="1"></a-col>
        <a-col :span="23" style="font-size: 15px;" v-if="tar.key == 2">
          <table style="width: 100%;" v-if="radioOffState">
            <tr>
              <td>地块与承保面积不一致</td>
              <td> <a-switch v-model:checked="state2.radioValuev1" checked-children="显示" :disabled="dkRadioDisabled"
                  un-checked-children="关闭" />
              </td>

            </tr>
            <tr>
              <td>地块重叠</td>
              <td><a-switch v-model:checked="state2.radioValuev2" checked-children="显示" :disabled="dkRadioDisabled"
                  un-checked-children="关闭" />
              </td>

            </tr>
            <tr>
              <td>标的面积差异率不达标</td>
              <td><a-switch v-model:checked="state2.radioValuev3" checked-children="显示" :disabled="dkRadioDisabled"
                  un-checked-children="关闭" />
              </td>

            </tr>
            <tr>
              <td>地块不合格</td>
              <td><a-switch v-model:checked="state2.radioValuev4" checked-children="显示" :disabled="dkRadioDisabled"
                  un-checked-children="关闭" />
              </td>

            </tr>
          </table>

        </a-col>

      </a-row>


      <label style="line-height: 40px;font-size: 16px; ">机构</label>
      <a-row v-for="tar in legends.filter(le => le.order == '机构')" :key="tar.key"
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

        <a-col :span="17" style="font-size: 15px;">
          {{ tar.title }}

          <!-- <div style="position: absolute; right: 5px; bottom: 0">
            <a-switch v-if="tar.key == 1" checked-children="显示" un-checked-children="隐藏"
              v-model:checked="state.checked1" />
            <a-switch v-if="tar.key == 2" checked-children="显示" un-checked-children="隐藏"
              v-model:checked="state.checked2" />
            <a-switch v-if="tar.key == 3" checked-children="显示" un-checked-children="隐藏"
              v-model:checked="state.checked3" />

          </div> -->
        </a-col>
      </a-row>

    </div>
  </a-card>
</template>
