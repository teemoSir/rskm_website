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
    ChevronDown,
    CalendarCheck,
    ListCheck,
    ScanEye

} from "lucide-vue-next";
import * as turf from "@turf/turf";
import { storeToRefs } from "pinia";
import { treeStore } from "@/store/store.js";
import { filterRskm, addLayers, setPopup, popup, popupbig } from "@/views/map/map.js";
import { useRouter } from "vue-router";
import Header from "@/components/header/index.vue";
import StateManager from "@/utils/state_manager";

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

    //定位
    loadCountyFit(searchValue.value);
};

/**
 * 加载数据
 * @param {string}
 * @returns {Promise<void>}
 */
const loadCountyFit = async (code) => {
    //console.log(String(code).substring(0, 4));
    let features = await api.get_table_by_filter(
        "rskm_pt",
        `and insurancenum in ('${code}')`,
        `ST_AsGeoJSON(geom) as json,gid`
    );

    map.fitBounds(turf.bbox(JSON.parse(features[0].json)), {
        padding: { top: 100, left: 600, right: 600, bottom: 100 },
        linear: true,
        // easing: (t) => {
        //   return t * (1 - t);
        // },
    });
}

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
            easing (t) {
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
        easing (t) {
            return t;
        },
    });
};

onMounted(() => {

    loadMap()

})

const loadMap = () => {
    map && map.on("load", () => {



        addLayers();

        loadEvent();

        setTimeout(() => {
            fitCenter()
        }, 1000)
    })
}

const clearMap = () => {
    // 清空地图

    //    (map.getSource() map.removeSource('rskm_pt');

    //     "rskm_pt_outline",
    //         "rskm_pt",
    //         "rskm_pt_name",
    //         "rskm_pt_name_1",

    // 清空缓存
    // StateManager.clearAll();

}



// 年份
//const pageDateYear = ref(dayjs(StateManager.get("rskm_pt_year") || new Date().toLocaleDateString()));

// 跳转年份数据
const panelChangeRL = (value) => {

    cursorYear.value = value;
    StateManager.clear("rskm_pt_year");
    StateManager.set("rskm_pt_year", value);





    setTimeout(() => {
        // clearMap();
        // addLayers()

        window.location.reload()
    }, 1000)

    message.success(`已进入 ${StateManager.get("rskm_pt_year", value)} 年度保险分布`);
};

const cursorYear = ref(StateManager.get("rskm_pt_year") || new Date().getFullYear())

/**
 * 年份选项
 */
const years = ref([
    2025,
    2024,
    2023,
])

/**年份值 */
const yearPopup = ref(false)


</script>

<template>

    <div class="header">
        <Header></Header>
    </div>

    <div class="page">
        <!--一张图平台-->
        <SDMap ref="mapRef" :MapToolPosition="{ top: '200px', right: ' 15px' }"></SDMap>



        <!--检索搜索-->
        <div class="searchTool" style="width: 500px">
            <a-row>
                <a-col :span="3">
                    <a-tooltip placement="bottom">
                        <template #title>高级筛查</template>
                        <a-button size="large" class="searchshadow" @click="menu = !menu">
                            <Grip :color="!menu ? '#fff' : 'RGB(36,172,242)'" />
                        </a-button>
                    </a-tooltip>
                </a-col>

                <a-col :span="20">
                    <a-input-group compact>
                        <a-dropdown>
                            <template #overlay>
                                <a-menu @click="handleMenuClick">
                                    <a-menu-item v-for="s in searchListName" :key="s.type"
                                        @click="setSearchListName(s)">
                                        {{ s.name }}
                                    </a-menu-item>
                                </a-menu>
                            </template>
                            <a-button class="searchshadow">
                                <div
                                    style="display: flex; align-items: center;font-family: 'FZZongYi-M05';font-size: 16px;">
                                    <ShieldCheck v-if="searchType == '单号'" :size="20" />
                                    <MapPinned v-else :size="20" />
                                    &nbsp; {{ searchType }}
                                </div>
                            </a-button>
                        </a-dropdown>
                        <a-input ref="inSerchRef" size="large" v-model:value="searchValue" style="width: 220px"
                            class="searchshadow" :placeholder="searchType == '区域' ? '请输入查询区域' : '请输入保险单号'"
                            :allowClear="true" @keyup.enter="searchByfilter" />
                        <a-tooltip placement="bottom">
                            <template #title>查询</template>
                            <a-button type="primary" size="large" class="searchshadow" @click="searchByfilter"
                                style="border-left: 0;">
                                <Search />
                            </a-button>
                        </a-tooltip>




                    </a-input-group>
                </a-col>

            </a-row>
        </div>

        <!--检索搜索-->
        <div class="yewuTool"> <!-- -->
            <a-row>

                <a-col :span="24">
                    <a-input-group compact>
                        <a-tooltip placement="left">
                            <template #title>年份</template>
                            <a-button size="large" class="searchshadow" @click="yearPopup = !yearPopup"
                                style="display: flex;align-items: center; font-family: 'FZZongYi-M05';font-size: 16px; width: 140px;float: left;">

                                <CalendarCheck />
                                <div style="margin-left: 10px;"> {{ cursorYear }}年
                                </div>
                                <ChevronDown style="margin-left: 10px;" />

                                <div v-if="yearPopup" class="year-popup">
                                    <div v-for="year in years" class="year" @click="panelChangeRL(year)">
                                        {{ year
                                        }}年</div>

                                </div>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="bottom">
                            <template #title>保单详情</template>
                            <a-button size="large" class="searchshadow" @click="open = !open"
                                style="display: flex;align-items: center; font-family: 'FZZongYi-M05';font-size: 16px;width: 130px;float: left;">
                                <ListCheck />
                                <div style="margin-left: 10px;"> 保单详情
                                </div>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="bottom">
                            <template #title>回到全局视野</template>
                            <a-button size="large" class="searchshadow" @click="fitCenter()"
                                style="display: flex;align-items: center; font-family: 'FZZongYi-M05';font-size: 16px;width: 130px;float: left;">
                                <ScanEye />
                                <div style="margin-left: 10px;"> 重置视野
                                </div>
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
        <a-drawer title="" placement="bottom" :open="open" @close="onClose" :mask="false" bodyStyle="padding:0">
            <Insurance ref="insuranceRef"></Insurance>
        </a-drawer>



    </div>
    <!--图例-->
    <div class="tuli">
        <Legend></Legend>
    </div>
</template>

<style scoped>
.year-popup {
    position: absolute;
    left: 0;
    top: 60px;
    width: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;

    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
}

.year {
    border: 1px solid #59595941;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.year:hover {
    /* background-color: #57575749; */
    color: #1677ff;
}

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

.searchTool {
    position: absolute;
    left: 15px;
    top: 110px;
    /* width: 650; */
}

.yewuTool {
    position: absolute;
    right: 15px;
    top: 110px;
    /* width: 650; */
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
