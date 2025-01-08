<script setup>
import { useRouter } from "vue-router";
import page from "../../../package.json";
import StateManager from "@/utils/state_manager";

import { FileDigit, Home, Settings, TextSearch } from "lucide-vue-next";
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import dayjs from "dayjs";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { hedaerStore } from "@/store/store.js";

const router = useRouter();
import {
    Shield,
    Sprout
} from "lucide-vue-next";


const switchLayer = () => {
    rightLayer.value = !rightLayer.value;
    //console.log(rightLayer.value);
};

// 追加地形
const loadTerrain = () => {
    let bool = map.getSource("mapbox-dem");
    !bool &&
        map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.terrain-rgb",
            tileSize: 512,
            maxzoom: 16,
        });
};

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
/**
 * 设置视野到box
 * @param {*} geom
 */
const fitBox = (f) => {
    let polygon = turf.polygon(f.geometry.coordinates, { name: "" });
    map.fitBounds(turf.bbox(polygon), {
        padding: { top: 400, bottom: 400, left: 400, right: 400 },
    });
};

// 基础图层
const loadBaseSource = () => {
    map.on("load", () => {
        // addTiles();

        //addLayers();

        // fitCenter();

        addIcon();

        //loadDraw();
        // 最后
        loadTerrain();
    });
};

/**
 * 添加图层
 */
const addTiles = () => {
    //  历史缓存 重置底图  StateManager.get("MAP_LAYERS") || "{}"
    //console.log(StateManager.get("MAP_LAYERS"));
    let ts = StateManager.get("MAP_LAYERS") || layers.value[17];
    //console.log(ts.param, ts.key);
    addRasterTileLayer(ts.param, ts.key);
};

let loadLayer = [];
let rightLayer = ref(false);
/**
 * 自定义底图
 * @param {*} layerList
 * @param {*} key
 */
const addRasterTileLayer = (layerList, key) => {
    loadLayer.forEach((layerId) => {
        map.getLayer(layerId) && map.removeLayer(layerId);
        map.getSource(layerId) && map.removeSource(layerId);
    });
    loadLayer = [];
    layerList &&
        layerList.forEach((layer) => {
            loadLayer.push(layer[0]);
            //调用接口，添加图层
            var param = key ? { key: key } : null;
            !map.getLayer(layer[0]) && map.addLayer(rasterTileLayer(layer[0], layer[1], param));
        });


    /**
     * 定位一致
     */
    let style = map.getStyle()
    map.moveLayer(style.layers[style.layers.length - 1].id, 'level');
};

// 地图类型
let machine = ref("globe");
watch(machine, () => {
    spin.value = true;
});

let terrainSP = ref(false);
/**
 * 地形开启关闭
 */
const onTerrain = () => {
    terrainSP.value = !terrainSP.value;
    terrainSP.value && map.setTerrain({ source: "mapbox-dem", exaggeration: 1.0 });
    !terrainSP.value && map.setTerrain(undefined);
};

/**
 * 模式切换
 */
const three3D = () => {
    if (map.getProjection().name == "globe") {
        map.setProjection("mercator");

        message.success("二维地图切换完成", 1);
    } else {
        map.setProjection("globe");

        message.success("三维地图切换完成", 1);
    }

    machine.value = map.getProjection().name;
};

const zoomIn = () => {
    map && map.zoomIn({ duration: 1000 });
};
const zoomOut = () => {
    map && map.zoomOut({ duration: 1000 });
};
const Zero = () => {
    map.resetNorthPitch({ duration: 2000 });
};

// 图层切换
const switchTile = (layer) => {
    layers.value.forEach((ll) => {
        ll.isShow = false;
    });
    layer.isShow = true;

    message.success("已更新为" + layer.name, 1);

    // 图层叠加
    addRasterTileLayer(layer.param, layer.key);

    // 历史缓存
    StateManager.set("MAP_LAYERS", layer);

};

const goGlobal = () => {
    map.flyTo({
        center: [100.223855, 36.315451],
        zoom: 3,
        speed: 1,
        curve: 2,
        easing (t) {
            return t;
        },
    });
};

const state = reactive({
    ZJiSHow: true,
    DMZJiSHow: true,
});

onMounted(() => {

})

</script>


<template>
    <div>

        <a-tooltip placement="leftTop">
            <template #title>
                <span>最佳视野</span>
            </template>
            <a-button @click="fitCenter()" size="large" class="boxshadow">
                <ScanSearch />
            </a-button>
        </a-tooltip>
        <a-tooltip title="重置视角 " placement="left">
            <div @click="Zero()" class="pst">
                <img id="Zero" :src="c2" @click="Zero()" />
            </div>
        </a-tooltip>
        <div>

            <a-tooltip title="底图切换" placement="left">
                <a-button @click="rightLayer = !rightLayer" size="large" class="boxshadow">
                    <Layers v-if="!rightLayer" />
                    <X color="#3277fc" v-else />
                    <span class="arrow">◣</span>
                </a-button>
            </a-tooltip>
            <!--图层列表 -->
            <div class="switch-layer" v-if="rightLayer">
                <a-card title="" v-show="machine != 'mercator'">
                    <a-card-grid v-for="item in layers" class="" :key="item.id" :style="{
                        width: '25%',
                        textAlign: 'center',
                        display: item.projection ? 'block' : 'none',
                    }">
                        <img :src="item.url" style="width: 100%; height: 100px; border-radius: 2px"
                            @click="switchTile(item)" />
                        <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
                            {{ item.name }}
                        </div>
                    </a-card-grid>
                </a-card>
                <a-card title="" v-show="machine == 'mercator'">
                    <a-card-grid v-for="item in layers" :key="item.id" :style="{
                        width: '25%',
                        textAlign: 'center',
                    }" @click="switchTile(item)">
                        <img :src="item.url" style="width: 100%; height: 100px; border-radius: 2px" />
                        <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
                            {{ item.name }}
                        </div>
                    </a-card-grid>
                </a-card>
                <br />

                <!--地名注记-->
                <a-card>
                    <!--行政边界-->
                    <!--地名注记-->
                    <a-card-grid :style="{
                        width: '25%',
                        textAlign: 'center',
                    }">
                        <div style="font-size: 12px; color: #fff">
                            地名
                            <a-switch checked-children="显示" un-checked-children="隐藏" v-model:checked="state.DMZJiSHow"
                                size="small" />
                        </div>
                    </a-card-grid>

                    <a-card-grid :style="{
                        width: '25%',
                        textAlign: 'center',
                    }">
                        <div style="font-size: 12px; color: #fff">
                            省界
                            <a-switch checked-children="显示" un-checked-children="隐藏" size="small"
                                v-model:checked="state_layer.checked7" />
                        </div>
                    </a-card-grid>

                    <a-card-grid :style="{
                        width: '25%',
                        textAlign: 'center',
                    }">
                        <div style="font-size: 12px; color: #fff">
                            市界
                            <a-switch checked-children="显示" un-checked-children="隐藏" size="small"
                                v-model:checked="state_layer.checked8" />
                        </div>
                    </a-card-grid>

                    <a-card-grid :style="{
                        width: '25%',
                        textAlign: 'center',
                    }">
                        <div style="font-size: 12px; color: #fff">
                            县界
                            <a-switch checked-children="显示" un-checked-children="隐藏"
                                v-model:checked="state_layer.checked4" size="small" />
                        </div>
                    </a-card-grid>

                    <a-card-grid :style="{
                        width: '25%',
                        textAlign: 'center',
                    }">
                        <div style="font-size: 12px; color: #fff">
                            镇界
                            <a-switch checked-children="显示" un-checked-children="隐藏"
                                v-model:checked="state_layer.checked5" size="small" />
                        </div>
                    </a-card-grid>

                    <a-card-grid :style="{
                        width: '25%',
                        textAlign: 'center',
                    }">
                        <div style="font-size: 12px; color: #fff">
                            村界
                            <a-switch checked-children="显示" un-checked-children="隐藏"
                                v-model:checked="state_layer.checked6" size="small" />
                        </div>
                    </a-card-grid>
                </a-card>
            </div>
        </div>
        <a-tooltip placement="leftTop">
            <template #title>
                <span>二三维切换</span>
            </template>
            <a-button @click="three3D()" size="large" class="boxshadow">
                <Map v-if="machine != 'mercator'" />
                <Globe v-else />
            </a-button>
        </a-tooltip>
        <a-tooltip placement="top">
            <template #title>
                <span>{{ !ruler ? "开始量测" : "关闭量测" }}</span>
            </template>

            <div>
                <!-- {{ ruler }} -->
                <a-button @click="onPencilRuler()" size="large" class="boxshadow">
                    <!-- <PencilRuler /> -->
                    <Ruler v-if="!ruler" />
                    <X color="#3277fc" v-else="ruler" />
                    <span class="arrow">◣</span>
                </a-button>

                <!--量测列表 -->
                <div class="right-ruler" v-if="ruler">
                    <a-tooltip placement="left">
                        <template #title>
                            <span>测量坐标<br />点击左键标记位置</span>
                        </template>
                        <a-button size="large" class="boxshadow" @click="celiang_point">
                            <!-- <MapPinned /> -->
                            <Scale3D />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="left">
                        <template #title>
                            <span>距离测量<br />点击左键绘制节点<br />双击左键完成测量</span>
                        </template>
                        <a-button size="large" class="boxshadow" @click="celiang_line_string">
                            <Ruler />
                            <div>
                                <Minus :size="30" style="position: absolute; left: 12px; top: 26px" />
                            </div>
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="left">
                        <template #title>
                            <span>面积测量<br />点击左键绘制节点<br />双击左键完成测量</span>
                        </template>
                        <a-button size="large" class="boxshadow" @click="celiang_polygon">
                            <LandPlot />
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
        </a-tooltip>
        <a-tooltip placement="leftTop">
            <template #title>
                <span>{{ terrainSP ? "关闭地形" : "开启地形" }}</span>
            </template>
            <a-button @click="onTerrain()" size="large" class="boxshadow">
                <MountainSnow :color="!terrainSP ? '#fff' : '#3277fc'" />
            </a-button>
        </a-tooltip>
        <a-tooltip placement="leftTop" v-if="1 == 2">
            <template #title>
                <span>绘制</span>
            </template>
            <div>
                <!-- {{ draw }} -->
                <a-button @click="onDraw()" size="large" class="boxshadow">
                    <Pencil />

                    <!-- <div style="position:absolute;left:8px;top:10px">
            <Pentagon :size="40" />
           </div> -->

                    <span class="arrow">◣</span>
                </a-button>
                <!--绘制列表 -->
                <div class="right-draw" v-if="draw">
                    <a-tooltip placement="leftTop">
                        <template #title>
                            <span>绘制点</span>
                        </template>
                        <a-button size="large" class="boxshadow">
                            <Dot />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="leftTop">
                        <template #title>
                            <span>绘制线条</span>
                        </template>
                        <a-button size="large" class="boxshadow">
                            <!-- <Route /> -->
                            <Slash />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="leftTop">
                        <template #title>
                            <span>绘制矩形</span>
                        </template>
                        <a-button size="large" class="boxshadow">
                            <RectangleHorizontal />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="leftTop">
                        <template #title>
                            <span>绘制多边形</span>
                        </template>
                        <a-button size="large" class="boxshadow">
                            <Pentagon />
                        </a-button>
                    </a-tooltip>
                    <a-tooltip placement="leftTop">
                        <template #title>
                            <span>绘制圆形</span>
                        </template>
                        <a-button size="large" class="boxshadow">
                            <Circle />
                        </a-button>
                    </a-tooltip>
                </div>
            </div>
        </a-tooltip>
        <a-tooltip placement="leftTop">
            <template #title>
                <span>放大</span>
            </template>
            <a-button @click="zoomIn()" size="large" class="boxshadow">
                <Plus />
            </a-button>
        </a-tooltip>
        <a-tooltip placement="leftTop">
            <template #title>
                <span>缩小</span>
            </template>
            <a-button @click="zoomOut()" size="large" class="boxshadow">
                <Minus />
            </a-button>
        </a-tooltip>
    </div>
</template>

<style scoped></style>