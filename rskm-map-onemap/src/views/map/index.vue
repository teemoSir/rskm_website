<script setup>
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.css";
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl";
import "../../../public/mapboxgl/pulgins/rasterTileLayer";
import { onMounted, ref, nextTick, watch, reactive, h, onUnmounted, defineExpose } from "vue";
import { config, mapbox } from "@/config/tileserver.js";
import { api } from "@/config/api.js";
import { layers, spec } from "@/config/spec";
import { message, notification, Button } from "ant-design-vue";
import * as turf from "@turf/turf";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import StateManager from "@/utils/state_manager";
import {
    Ruler,
    MountainSnow,
    Layers,
    Plus,
    Minus,
    ScanEye,
    Map,
    Globe,
    //   MapPinned,
    LandPlot,
    PencilRuler,
    Pencil,
    Dot,
    //   Waypoints,
    Pentagon,
    //   Square,
    RectangleHorizontal,
    //   Route,
    //   Brush,
    Circle,
    Slash,
    //   MoveHorizontal,
    ScanSearch,
    Scale3D,
    House,
    X,
} from "lucide-vue-next";
import c2 from "@/assets/images/map/c2.svg";
import getCeliang from "@/utils/celiang";
import {
    eventRotate,
    eventRender,
    popupbig,
    popup,
    addIcon,
    setPopup,
} from "@/views/map/map.js";

/**
 * 初始化地图
 * @function
 */
const initMap = () => {
    mapboxgl.workerCount = navigator.hardwareConcurrency + 2;
    mapboxgl.maxParallelImageRequests = 12;
    // mapboxgl.accessToken = mapbox.key;
    mapboxgl.prewarm();

    window.map = new mapboxgl.Map({
        container: "map",
        center: [100, 36],
        zoom: 2,
        maxZoom: 20,
        minZoom: 2,
        style: {
            version: 8,
            sprite: `http://${window.location.host}/mapboxgl/sprites/sprite`,
            glyphs: `http://${window.location.host}/mapboxgl/fonts/{fontstack}/{range}.pbf`,
            light: {
                anchor: "map",
                color: "#F5F5F5",
                intensity: 0.6,
            },
            fog: {
                color: "rgba(186, 210, 235,0.3)", //低层大气 rgb(186, 210, 235)
                "high-color": "rgba(36, 92, 223,0.3)", // 高层大气
                "horizon-blend": 0.02, // 大气厚度（低缩放时默认为0.2）
                "space-color": "rgb(11, 11, 25)", //背景颜色 rgb(11, 11, 25)
                "star-intensity": 0.4, // 背景恒星亮度（低zoom时默认为0.35）
            },
            sources: {},
            layers: [
                {
                    id: "background",
                    type: "background",
                    layout: {},
                    paint: {
                        "background-color": "#f0f3fa",
                    },
                    interactive: true,
                },
                {
                    id: "level",
                    type: "background",
                    layout: {},
                    paint: {
                        "background-color": "rgba(0,0,0,0)",
                    },
                    interactive: true,
                },
            ],
            _ssl: true,
        },
        projection: machine.value,
    });
    // map.addControl(
    //     new mapboxgl.AttributionControl({
    //         customAttribution: "<div id='attribution'></div>",
    //     })
    // );

    const cc = new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: "metric",
    });
    !map.hasControl(cc) && map.addControl(cc);

    map.on("load", () => {
        addTiles();
    });
};

/**
 * 量测
 */
const ruler = ref(false);
const onPencilRuler = () => {
    ruler.value && celiang_clear();
    ruler.value = !ruler.value;
};

/**
 * 绘制
 */
const draw = ref(false);
const onDraw = () => {
    draw.value = !draw.value;
};

// 监听事件
const eventLoad = () => {
    map.on("rotate", (e) => {
        eventRotate();
    });

    map.on("mousemove", (e) => {
        window.lnglatrender = {
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
        };
        eventRender();
    });

    /**
     * 渲染运行时
     */
    map.on("move", (e) => {
        eventRender();
    });



    map.on("draw.create", function (e) {
        updateGeom(e);
    });

    map.on("draw.update", function (e) {
        updateGeom(e);
    });
};

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
        // loadTerrain();
    });
};

/**
 * 添加图层
 */
const addTiles = () => {

    let type;

    if (StateManager.get("MAP_LAYERS")) {
        type = StateManager.get("MAP_LAYERS");
    } else {
        type = layers.value[layers.value.length - 1];
        StateManager.set("MAP_LAYERS", type);
    }
    addRasterTileLayer(type.param, type.key);
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
    // 历史缓存
    StateManager.set("MAP_LAYERS", layer);

    layers.value.forEach((ll) => {
        ll.isShow = false;
    });
    layer.isShow = true;

    // 图层叠加
    addRasterTileLayer(layer.param, layer.key);

    message.success("已更新为" + layer.name, 1);

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

const spin = ref(false);
const spintext = " Loading ...";

watch(spin, () => {
    if (spin.value) {
        setTimeout(() => {
            spin.value = false;
        }, 800);
    }
});



/**
 * 地名注记
 */
watch(state, () => {
    [
        "admin_2024_village_name",
        "POI_WORLD_1",
        "POI_WORLD_2",
        "POI_WORLD_3",
        "POI_WORLD_4",
        "POI_WORLD_5",
        "POI_WORLD_6",
    ].forEach((v) => {
        map && map.setLayoutProperty(v, "visibility", state.DMZJiSHow ? "visible" : "none");
    });
});

// 量测 图形缓存
let celiang_list = [];
// 初始化绘制
const loadDraw = () => {
    window.gl_draw && (window.gl_draw = undefined);
    window.gl_draw = new MapboxDraw({
        userProperties: true,
        displayControlsDefault: false,
        styles: [
            {
                id: "highlight-active-points",
                type: "circle",
                filter: [
                    "all",
                    ["==", "$type", "Point"],
                    ["==", "meta", "feature"],
                    ["==", "active", "true"],
                ],
                paint: {
                    "circle-radius": 10,
                    "circle-color": "#fff",
                },
            },
            {
                id: "highlight-active-points-outline",
                type: "circle",
                filter: [
                    "all",
                    ["==", "$type", "Point"],
                    ["==", "meta", "feature"],
                    ["==", "active", "true"],
                ],
                paint: {
                    "circle-radius": 7,
                    "circle-color": "red",
                },
            },

            {
                id: "points-are-blue-outline",
                type: "circle",
                filter: [
                    "all",
                    ["==", "$type", "Point"],
                    ["==", "meta", "feature"],
                    ["==", "active", "false"],
                ],
                paint: {
                    "circle-radius": 8,
                    "circle-color": "#fff",
                },
            },
            {
                id: "points-are-blue",
                type: "circle",
                filter: [
                    "all",
                    ["==", "$type", "Point"],
                    ["==", "meta", "feature"],
                    ["==", "active", "false"],
                ],
                paint: {
                    "circle-radius": 5,
                    "circle-color": "red",
                },
            },

            // ACTIVE (being drawn)
            // line stroke
            {
                id: "gl-draw-line",
                type: "line",
                filter: ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "yellow",
                    "line-dasharray": [0.2, 2],
                    "line-width": 4,
                },
            },
            // polygon fill
            {
                id: "gl-draw-polygon-fill",
                type: "fill",
                filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                paint: {
                    "fill-color": "#D20C0C",
                    "fill-outline-color": "#D20C0C",
                    "fill-opacity": 0.2,
                },
            },
            // polygon mid points
            {
                id: "gl-draw-polygon-midpoint",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
                paint: {
                    "circle-radius": 6,
                    "circle-color": "#fbb03b",
                },
            },
            // polygon outline stroke
            // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
            {
                id: "gl-draw-polygon-stroke-active",
                type: "line",
                filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "yellow",
                    "line-dasharray": [0.2, 2],
                    "line-width": 4,
                },
            },
            // vertex point halos
            {
                id: "gl-draw-polygon-and-line-vertex-halo-active",
                type: "circle",
                filter: [
                    "all",
                    ["==", "meta", "vertex"],
                    ["==", "$type", "Point"],
                    ["!=", "mode", "static"],
                ],
                paint: {
                    "circle-radius": 8,
                    "circle-color": "#FFF",
                },
            },
            // vertex points
            {
                id: "gl-draw-polygon-and-line-vertex-active",
                type: "circle",
                filter: [
                    "all",
                    ["==", "meta", "vertex"],
                    ["==", "$type", "Point"],
                    ["!=", "mode", "static"],
                ],
                paint: {
                    "circle-radius": 6,
                    "circle-color": "#D20C0C",
                },
            },

            // INACTIVE (static, already drawn)
            // line stroke
            {
                id: "gl-draw-line-static",
                type: "line",
                filter: ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "yellow",
                    "line-width": 6,
                },
            },
            // polygon fill
            {
                id: "gl-draw-polygon-fill-static",
                type: "fill",
                filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                paint: {
                    "fill-color": "yellow",
                    "fill-outline-color": "#000",
                    "fill-opacity": 0.23,
                },
            },
            // polygon outline
            {
                id: "gl-draw-polygon-stroke-static",
                type: "line",
                filter: ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
                paint: {
                    "line-color": "yellow",
                    "line-width": 6,
                },
            },
        ],
    });
    map.hasControl(window.gl_draw) && map.removeControl(window.gl_draw);
    map.addControl(window.gl_draw);
};

// 添加统一图形操作
const updateGeom = (e) => {
    let m = undefined;
    let cc = undefined;
    if (ruler.value) {
        celiang_list.push(e.features[0].id);
        cc = getCeliang(e.features[0]);
        // console.log(e.features);
        m = e.features[0];
        m.properties = cc.compute;
        addText(m);
    }

    if (draw.value) {
    }

    openNotification("测量完成", cc);
};
// 添加描述
const addText = (json) => {
    let id = (Math.random() * 100000).toFixed(0);
    map.addSource("source_" + id, {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: [json],
        },
    });
    map.addLayer({
        id: "layer_" + id,
        type: "symbol",
        source: "source_" + id,
        // "source-layer": "source_" + id,
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            //   "text-padding": 200,
            "text-field": "{a}\n{b}\n{c}",
            "text-size": 16,
            "text-anchor": "top", // 设置文字的锚点位置
            "text-offset": [0, -3.0], // 设置文字相对于图标的偏移量
        },
        paint: {
            "text-color": "RGBA(50,42, 42, 1)",
            "text-halo-color": "RGBA(255,255,255,0.8)",
            "text-halo-width": 2.0,
        },
    });

    celiang_list.push("layer_" + id);
};
//清空
const celiang_clear = () => {
    for (let i in celiang_list) {
        map && map.removeLayer(celiang_list[i]);
    }
    celiang_list = [];
    window.gl_draw && window.gl_draw.deleteAll();
};

//面积测量
const celiang_polygon = () => {
    window.gl_draw && window.gl_draw.changeMode("draw_polygon");
};

//面积测量
const celiang_line_string = () => {
    window.gl_draw && window.gl_draw.changeMode("draw_line_string");
};

//面积测量
const celiang_point = () => {
    window.gl_draw && window.gl_draw.changeMode("draw_point");
};

const closeNotification = () => { };
// 复制
const copyToClipboard = (text) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            message.info("已复制到剪贴板");
        })
        .catch((error) => {
            message.error("复制到剪贴板时发生错误:", error);
        });
};

// 复制测量结果
const openNotification = (title, container) => {
    const key = `open${Date.now()}`;
    let con = `量测结果：\n`;
    for (let i in container.compute) {
        con += container.compute[i] + "\n";
    }

    con += "量测坐标：\n";
    con += JSON.stringify(container.coordinates);

    notification.success({
        message: title,
        description: con,
        placement: "bottomRight",
        btn: () =>
            h(
                Button,
                {
                    type: "primary",
                    size: "small",
                    onClick: () => {
                        copyToClipboard(con);
                        notification.close(key);
                    },
                },
                {
                    default: () => "复制",
                }
            ),
        key,
        onClose: closeNotification,
    });
};

// 图层控制
const state_layer = reactive({
    checked4: true,
    checked5: true,
    checked6: true,
    checked7: true,
    checked8: true,
});

message.config({
    top: `200px`,
    //   duration: 2,
    maxCount: 2,
    rtl: true,
    prefixCls: "提示",
});

watch(state_layer, () => {
    //县级界线
    let xjjx = ["admin_2024_county"];
    xjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state_layer.checked4);
    });

    //镇级界线
    let zjjx = ["admin_2024_town"];
    zjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state_layer.checked5);
    });

    //村级界线
    let cjjx = ["admin_2024_village"];
    cjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state_layer.checked6);
    });

    //省级界线
    let pjjx = ["admin_2022_province"];
    pjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state_layer.checked7);
    });

    //市级界线
    let cicyjjx = ["admin_2022_city"];
    cicyjjx.forEach((gd) => {
        toggleLayerVisibility(gd, state_layer.checked8);
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

onMounted(() => {
    initMap();
    loadBaseSource();
    eventLoad();

    loadDraw();

});

onUnmounted(() => {
    delete window.map;
    delete window.gl_draw;
});


defineExpose({
    fitCenter

});

defineProps({
    MapToolPosition: Object
})
</script>

<template>
    <div>
        <div class="map" id="map"></div>
        <a-spin class="spin" v-if="spin" :tip="spintext" size="large"></a-spin>
        <!--地图工具栏-->
        <div class="right-tool" :style="MapToolPosition">

            <!-- <a-tooltip placement="leftTop">
                <template #title>
                    <span>最佳视野</span>
                </template>
<a-button @click="fitCenter()" size="large" class="boxshadow">
    <ScanSearch />
</a-button>
</a-tooltip> -->

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

                    <a-card title="">

                        <a-card-grid v-for="item in layers" class="" :key="item.id" :style="{
                            width: '25%',
                            textAlign: 'center',

                        }">
                            <img :src="item.url" style="width: 99%; height: 60px; border-radius: 2px"
                                @click="switchTile(item)" />
                            <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
                                {{ item.name }}
                            </div>
                        </a-card-grid></a-card>
                    <!-- <a-card title="" v-show="machine != 'mercator'">
                        <a-card-grid v-for="item in layers" class="" :key="item.id" :style="{
                            width: '25%',
                            textAlign: 'center',
                            display: item.projection ? 'block' : 'none',
                        }">
                            <img :src="item.url" style="width: 100%; height: 60px; border-radius: 2px"
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
                            <img :src="item.url" style="width: 100%; height: 60px; border-radius: 2px" />
                            <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
                                {{ item.name }}
                            </div>
                        </a-card-grid>
                    </a-card> -->
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
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state.DMZJiSHow" size="small" />
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
            <a-tooltip title="重置视角 " placement="left">
                <div @click="Zero()" class="pst">
                    <img id="Zero" :src="c2" @click="Zero()" />
                </div>
            </a-tooltip>
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
            <!-- <a-tooltip placement="leftTop">
                <template #title>
                    <span>{{ terrainSP ? "关闭地形" : "开启地形" }}</span>
                </template>
                <a-button @click="onTerrain()" size="large" class="boxshadow">
                    <MountainSnow :color="!terrainSP ? '#fff' : '#3277fc'" />
                </a-button>
            </a-tooltip> -->
            <a-tooltip placement="leftTop" v-if="1 == 2">
                <template #title>
                    <span>绘制</span>
                </template>
                <div>
                    <a-button @click="onDraw()" size="large" class="boxshadow">
                        <Pencil />
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


    </div>

    <div id='attribution-bottom-right' class="attribution-bottom-right"></div>



    <table>
        <tr>
            <td>

            </td>
            <td>

            </td>
        </tr>
    </table>
</template>

<style scoped>
.map {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}


.attribution-bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    background-color: #0000008e;
    font-family: Arial, sans-serif;
    color: #fdfdfdb3;
    font-size: 0.8rem;
    text-align: right;
    padding: 7px 3px 3px 0;
    cursor: default;
}

:deep(.mapboxgl-ctrl-scale) {
    color: #fdfdfdb3;
    font-size: 0.7rem;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
    border-right: 1px solid #fff;
    position: absolute;
    left: 10px;
    bottom: 3px;
    background-color: transparent;
    text-align: center;
    height: 18px;



}

:deep(.ant-btn) {
    margin-top: 4px;
}

:deep(.ant-card) {
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 0;
}

:deep(.ant-card-grid) {
    padding: 5px 5px;
    box-shadow: none;
}

:deep(.mapboxgl-ctrl-top-right) {
    display: none;
}

.right-tool {
    position: absolute;
    right: 20px;
    bottom: 100px;
    /* width: 2rem; */
    z-index: 1000;
}

.switch-layer {
    position: absolute;
    right: 70px;
    top: 0px;
    width: 400px;
    z-index: 1000;
    border: 0;
}

.right-ruler,
.right-draw {
    position: absolute;
    right: 60px;
    z-index: 1000;
    border: 0;
    margin-top: -58px;
}

.boxshadow {
    cursor: pointer;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    border-radius: 3px;
    width: 50px;
    height: 50px;
    color: #ccc;
    border: 1px double #99999986;
    display: flex;
    justify-content: center;
    align-items: center;
}

.boxshadow:hover {
    background-color: #3277fc;
    color: #fff;
}

.spin {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #00000063;

    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.mmapcs {
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    position: relative;
    margin-top: -22px;

    color: #faf9f9c0;
    font-size: 14px;
    font-weight: 3000;
}

.mmapcs-av {
    /* background-color: #2b8ee7; */
    background: linear-gradient(to bottom, #2b8fe79c, #2b8fe7f8);
    z-index: 1000;
    position: relative;
    margin-top: -22px;
    color: #f2f2f8ec;
    font-size: 14px;
}

:deep(.mapboxgl-ctrl-attrib) {
    background-color: rgba(0, 0, 0, 0.5);
    color: #eee9e9e7;
    padding: 2px 5px;
    width: 100%;
}


.pst {}

.pst>img {
    height: 50px;
    width: 50px;
    cursor: pointer;
}



.arrow {
    position: absolute;
    left: 1px;
    bottom: -6px;
}

::v-deep .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
    margin: 0;
}
</style>
