<script setup>

import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import SDMap from "@/views/map/index.vue";
import { message } from "ant-design-vue";
import Legend from "@/views/map/legend.vue";
import Insurance from "@/views/insurance/insurance.vue";
import Menu from "@/views/insurance/menu.vue";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/zh-cn";
import {
  Search,
  ShieldCheck,
  MapPinned,
  Grip,
  PanelBottomOpen,
  PanelTopOpen,
} from "lucide-vue-next";


// import StateManager from "@/utils/state_manager";
import * as turf from "@turf/turf";
import { storeToRefs } from "pinia";
import { treeStore } from "@/store/store.js";
import { filterRskm, addLayers, setPopup, popup, popupbig } from "@/views/map/map.js";

import { useRouter } from "vue-router";
import Header from "@/components/header/index.vue";

const router = useRouter();

const mapRef = ref(null);

const storeTree = treeStore();
let { searchTypeStore, searchNameStore } = storeToRefs(storeTree);



const value = ref("user1");
dayjs.extend(updateLocale);
dayjs.updateLocale("zh-cn", {
  weekStart: 0,
});

message.config({
  top: `200px`,
  //   duration: 2,
  maxCount: 2,
  rtl: true,
  prefixCls: "提示",
});

const inSerchRef = ref();
const insuranceRef = ref(null);



const searchListName = [
  { name: "单号", type: 1 },
  { name: "区域", type: 2 },
];

const searchType = ref(searchListName[0].name);
//搜索框
const searchValue = ref();
watch(searchValue, () => {
  //状态管理中加入查询条件
  searchTypeStore.value = searchType.value;
  searchNameStore.value = searchValue.value;

  !searchNameStore.value && filterRskm();

  // 如果搜索框为空，则自动调整地图到最佳视野
  !searchNameStore.value && mapRef.value.fitCenter();
});

// 检索类型
const setSearchListName = (d) => {
  searchType.value = d.name;
  inSerchRef.value.focus();
  // searchValue.value = "";
};

// 菜单
const activeKey = ref("1");

// 数据列表
const open = ref(false);

// watch(open, () => {
//   // if (open.value) {
//   //   insuranceRef.value.loadCount();
//   //   insuranceRef.value.loadTabel();
//   // }
// });
const onClose = () => {
  open.value = false;
};

// 增加数据延时
//const loadReady = ref(1);

const menu = ref(false);



// const goGeomUn = () => {
//   map.getLayer("lockGeom") && map.removeLayer("lockGeom");
//   map.getSource("lockGeom") && map.removeSource("lockGeom");
// };

/**
 * 查找地块
 * @param {} data
 */
const goGeom = (data) => {
  // console.log(data);

  goGeomUn();

  map.addSource("lockGeom", {
    type: "geojson",
    data: JSON.parse(data),
  });
  map.addLayer({
    id: "lockGeom",
    type: "line",
    source: "lockGeom",
    paint: {
      "line-color": "red",
      "line-opacity": 0.6,
      "line-width": 5,
    },
  });

  map.fitBounds(turf.bbox(JSON.parse(data)), {
    padding: { top: 200, bottom: 600 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
};

// 查询单个保单号
const searchByfilter = async () => {
  if (!searchValue.value) {
    searchTypeStore.value = searchType.value;
    searchNameStore.value = searchValue.value;

  }
  filterRskm();
};

const loadEvent = (() => {

  let layerDK = "rskm_pt";

  /**
   * 鼠标移入监听地块
   */
  map.on("mousemove", layerDK, (e) => {
    if (map.getZoom() < 8) return;

    map.getCanvas().style.cursor = "pointer";
    let feature = e.features[0];

    let area_mu = feature.properties.area_mu ? feature.properties.area_mu : "";
    let i_com_name = feature.properties.i_com_name ? feature.properties.i_com_name : "";
    let i_type_name = feature.properties.i_type_name
      ? feature.properties.i_type_name
      : "";


    map.setFilter("Highlight_DK_Line", ["all", ["in", "gid", feature.properties.gid]]);
    map.setLayoutProperty("Highlight_DK_Line", "visibility", "visible");

    let text = `
      <table style="line-height:1.0;width:100%;letter-spacing: -1px; font-size: 14px;" >
      <tr><th style="vertical-align: top;width:50px">机构:</th><td style="">${i_com_name} </td></tr>
      <tr><th style="vertical-align: top;width:50px">险种:</th><td style="">${i_type_name} </td></tr>
      <tr><th style="vertical-align: top;">面积:</th><td style="" >${area_mu} 亩</td><tr>
    
      </table>
  `;
    popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
  });

  map.on("mouseleave", layerDK, () => {
    map.getCanvas().style.cursor = "";
    popup.setLngLat([0, 0]);
    popup.setHTML("");

    // map.setLayoutProperty("Highlight_DK", "visibility", "none");
    map.setLayoutProperty("Highlight_DK_Line", "visibility", "none");
  });

  //清空绘制
  const goGeomUn = () => {
    map.getLayer("lockGeom") && map.removeLayer("lockGeom");
    map.getSource("lockGeom") && map.removeSource("lockGeom");
  };

  map.on("click", () => {
    // map.setLayoutProperty("Highlight_DK_Click", "visibility", "none");
    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "none");
    goGeomUn();
  });

  map.on("click", layerDK, async (e) => {
    if (map.getZoom() < 10) return;
    popup && popup.setHTML("");
    popup && popup.setLngLat([0, 0]);

    map.getCanvas().style.cursor = "pointer";
    const feature = e.features[0];

    let text = await setPopup(feature);

    map.setFilter("Highlight_DK_Line_Click", [
      "all",
      ["in", "gid", feature.properties.gid],
    ]);
    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");

    // fitBox(feature);
    map.flyTo({
      center: e.lngLat,
      // zoom: 7.5,
      speed: 1,
      curve: 1,
      easing(t) {
        return t;
      },
    });
    popupbig.setLngLat(e.lngLat).setHTML(text).addTo(map);
    window.tgid = feature.properties.gid;
  });
})


// 初始化视野
const fitCenter = () => {
  map.flyTo({
    center: [118.223855, 36.315451],
    zoom: 7,
    speed: 1,
    curve: 2,
    easing(t) {
      return t;
    },
  });
};

onMounted(() => {
  map && map.on("load", () => {
    addLayers();

    loadEvent();

    setTimeout(()=>{
      fitCenter()
    },500)
  })
})




</script>

<template>
  <!-- <a-page-header class="header" :title="page.name" :sub-title="page.cnname + ' V' + page.version"
    :avatar="{ src: logo }" style="color: #ccc">
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" @click="handleMenuClick"
      style="position: absolute; left: 600px; top: 0px; line-height: 92px" />


    <template #extra>
      <a-space direction="vertical" :size="5">
        <a-date-picker v-model:value="pageDateYear" picker="year" format="YYYY 年" :popupStyle="{ top: '150px' }"
          @panelChange="panelChangeRL" />
      </a-space>
      <a-button key="2" type="info" style="color: #ccc">{{ defaultAdmin() }}</a-button>
    </template>
</a-page-header> -->

  <div class="header">

    <Header></Header>
  </div>

  <div class="page">
    <!--一张图平台-->
    <SDMap ref="mapRef" :MapToolPosition="{ top: '140px', right: ' 15px' }"></SDMap>
    <div v-if="activeKey == '1'">
      <!--检索搜索-->
      <div class="search" style="width: 600px">
        <a-row>
          <a-col :span="3">
            <a-tooltip placement="bottom">
              <template #title>高级筛查</template>
              <a-button size="large" class="searchshadow" @click="menu = !menu">
                <Grip :color="!menu ? '#fff' : 'RGB(36,172,242)'" />
              </a-button>
            </a-tooltip>
          </a-col>

          <a-col :span="21">
            <a-input-group compact>
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item v-for="s in searchListName" :key="s.type" @click="setSearchListName(s)">
                      {{ s.name }}
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button class="searchshadow">
                  <!-- <ChevronDown  />
                  <ChevronUp  /> -->

                  <div style="display: flex; align-items: center">
                    <ShieldCheck v-if="searchType == '单号'" :size="20" />
                    <MapPinned v-else :size="20" />
                    &nbsp; {{ searchType }}
                  </div>
                </a-button>
              </a-dropdown>
              <a-input ref="inSerchRef" size="large" v-model:value="searchValue" style="width: 300px"
                class="searchshadow" :placeholder="searchType == '区域' ? '请输入查询区域' : '请输入保险单号'" :allowClear="true"
                @keyup.enter="searchByfilter" />
              <a-tooltip placement="bottom">
                <template #title>查询</template>
                <a-button type="primary" size="large" class="searchshadow" @click="searchByfilter">
                  <Search />
                </a-button>
              </a-tooltip>

              <a-tooltip placement="bottom">
                <template #title>保单详情</template>
                <a-button size="large" class="searchshadow" @click="open = !open">
                  <PanelBottomOpen v-if="!open" />
                  <PanelTopOpen v-else />
                </a-button>
              </a-tooltip>
            </a-input-group>
          </a-col>
        </a-row>
      </div>
      <!--类型控制单元-->
      <div class="leftMenu" v-show="menu">
        <Menu></Menu>
      </div>

      <!--保单信息-->
      <a-drawer title="" placement="bottom" :open="open" @close="onClose" :mask="true" bodyStyle="padding:0"
        :height="500">
        <Insurance ref="insuranceRef"></Insurance>
      </a-drawer>
    </div>

    <div v-if="activeKey == '2'"></div>
  </div>
  <!--图例-->
  <div class="tuli">
    <Legend></Legend>
  </div>
</template>

<style scoped>
.searchshadow {
  cursor: pointer;

  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
  border-radius: 2px;
  font-size: 14px;

  color: #f7f1f1;
  border: 1px solid #99999948;

  height: 60px;
}

.boxshadow {
  cursor: pointer;

  border-radius: 3px;

  height: 55px;

  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boxshadow:hover {
  background-color: rgba(0, 0, 0, 1);
}

.page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(53, 51, 51);
}

.leftMenu {
  position: absolute;
  left: 15px;
  top: 190px;
  /* width: 570px; */
  /* height: calc(80%); */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
  /* padding: 15px 15px 0 0; */
  /* height: calc(50%); */
  border-radius: 4px;
}



::v-deep .ant-input {
  background-color: transparent;
  color: #fff;
}

::v-deep .ant-input-clear-icon {
  color: #fff;
}

::v-deep .ant-menu-item svg {
  width: 15px;
  height: 15px;
}

::v-deep .ant-menu-submenu-horizontal svg {
  width: 15px;
  height: 15px;
}

::v-deep .ant-menu-light {
  background-color: transparent;
  color: #ccc;
}

::v-deep .ant-drawer .ant-drawer-body {
  padding: 0;
}

::v-deep .ant-drawer-body {
  padding: 0;
}

::v-deep .ant-drawer {
  padding: 0;
}

::v-deep .ant-page-header-heading-title {
  color: aliceblue;
}

::v-deep .ant-page-header-heading-sub-title {
  color: #ccc;
}

::v-deep .ant-tabs-tab-btn {
  font-size: 16px;

  color: #fff;
}

::v-deep .ant-tabs-tab-active {
  background-color: #ffffff18;
  color: #fff;
}

::v-deep .ant-tree {
  background-color: transparent;
  color: #ccc;
}

::v-deep .ant-select-selection-item {
  background-color: rgba(50, 119, 252, 1);
  color: #fff;
}

::v-deep .ant-select-selection-placeholder {
  color: #807d7dc0;

  font-size: 14px;
}

::v-deep .ant-select-clear {
  color: #ccc;
  background-color: transparent;
}

::v-deep .ant-select-clear:hover {
  color: rgba(50, 119, 252, 1);
}

::v-deep .ant-statistic-content {
  color: #fff;
}

::v-deep .ant-statistic-title {
  color: #fff;
}

::v-deep .ant-picker {
  background: transparent;
  border: 0;
  padding: 0;
}

::v-deep .ant-picker input {
  color: #ccc;
}

.search {
  position: absolute;
  left: 15px;
  top: 110px;
  width: 650;
}

.header-menu {
  padding: 0 20px 20px 20px;
  font-size: 20px;
  font-weight: 2000;
  background-color: transparent;
  color: #fff;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-content: center;
}

.tuli {
  position: absolute;
  left: 5px;
  bottom: 20px;
}

.table-btn {
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 20px;
  bottom: 50px;
  padding: 0 15px;
  color: #ccc;
  border-radius: 2px;
}

.insurance {
  position: absolute;
  bottom: 15px;

  width: calc(100% - 300px);
}

.searchshadow::placeholder {
  color: #cccccc63;
}

.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.4));
  z-index: 100000;
}




.mapboxgl-popup {
  display: flex;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  will-change: transform;
}

.mapboxgl-popup-anchor-top,
.mapboxgl-popup-anchor-top-left,
.mapboxgl-popup-anchor-top-right {
  flex-direction: column;
}

.mapboxgl-popup-anchor-bottom,
.mapboxgl-popup-anchor-bottom-left,
.mapboxgl-popup-anchor-bottom-right {
  flex-direction: column-reverse;
}

.mapboxgl-popup-anchor-left {
  flex-direction: row;
}

.mapboxgl-popup-anchor-right {
  flex-direction: row-reverse;
}

.mapboxgl-popup-tip {
  border: 10px solid transparent;
  height: 0;
  width: 0;
  z-index: 1;
}

::v-deep .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
  align-self: center;
  border-bottom-color: #161616c9;
  border-top: none;
}

::v-deep .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  align-self: flex-start;
  border-bottom-color: #161616c9;
  border-left: none;
  border-top: none;
}

::v-deep .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
  align-self: flex-end;
  border-bottom-color: #161616c9;
  border-right: none;
  border-top: none;
}

::v-deep .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  align-self: center;
  border-bottom: none;
  border-top-color: #161616c9;
}

::v-deep .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
  align-self: flex-start;
  border-bottom: none;
  border-left: none;
  border-top-color: #161616c9;
}

::v-deep .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  align-self: flex-end;
  border-bottom: none;
  border-right: none;
  border-top-color: #161616c9;
}

::v-deep .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  align-self: center;
  border-left: none;
  border-right-color: #161616c9;
}

::v-deep .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  align-self: center;
  border-left-color: #161616c9;
  border-right: none;
}

.mapboxgl-popup-close-button {
  background-color: transparent;
  border: 0;
  border-radius: 0 3px 0 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
}

.mapboxgl-popup-close-button:hover {
  background-color: #161616c9;
}

::v-deep .mapboxgl-popup-content {
  background: #161616c9;
  border-radius: 3px;
  box-shadow: 0 10px 2px rgba(0, 0, 0, 0.1);
  /* padding: 10px 10px 15px; */
  padding: 20px 10px 10px 10px;
  pointer-events: auto;
  position: relative;
  color: #eee9e9e7;
  font-size: 18px;
}
</style>
