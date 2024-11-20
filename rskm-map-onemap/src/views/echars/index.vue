<script setup>
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.css";
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl";
import "../../../public/mapboxgl/pulgins/rasterTileLayer";
import { onMounted, ref, nextTick, watch, reactive, h, onUnmounted, defineExpose } from "vue";


import { message, notification, Button } from "ant-design-vue";
import * as turf from "@turf/turf";
// import MapboxDraw from "@mapbox/mapbox-gl-draw";
// import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import StateManager from "@/utils/state_manager";
import Shandong from "@/views/standard/shandong.vue";
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
// import getCeliang from "@/utils/celiang";
import {
    eventRotate,
    eventRender,
    popupbig,
    popup,
    addIcon,
    setPopup,
} from "@/views/map/map.js";
import { config, mapbox } from "@/config/tileserver-echars.js";
import { api } from "@/config/api.js";
import { specEchars } from "@/config/spec-echars";

/**
 * 初始化地图
 * @function
 */
const initMap = () => {
    mapboxgl.workerCount = navigator.hardwareConcurrency + 2;
    mapboxgl.maxParallelImageRequests = 12;
    mapboxgl.accessToken = mapbox.key;
    mapboxgl.prewarm();

    window.map = new mapboxgl.Map({
        container: "map",
        center: [100, 36],
        zoom: 2,
        maxZoom: 20,
        minZoom: 6,
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
        //  projection: machine.value,
    });
    map.addControl(
        new mapboxgl.AttributionControl({
            customAttribution: "<div id='xyz'></div>",
        })
    );

    const cc = new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: "metric",
    });
    !map.hasControl(cc) && map.addControl(cc);

    // map.on("load", () => {
    //   addTiles();
    // });
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
        // curve: 2,
        // easing (t) {
        //     return t;
        // },
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


/**
 * 添加图层
 */
const addTiles = () => {
    //  历史缓存 重置底图  StateManager.get("MAP_LAYERS") || "{}"
    //console.log(StateManager.get("MAP_LAYERS"));
    // let ts = StateManager.get("MAP_LAYERS_ECHARS") || layers.value[17];
    //console.log(ts.param, ts.key);
    //addRasterTileLayer(ts.param, ts.key);
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






message.config({
    top: `200px`,
    //   duration: 2,
    maxCount: 2,
    rtl: true,
    prefixCls: "提示",
});


// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {
    if (isVisible) {
        map.setLayoutProperty(layerId, "visibility", "visible");
    } else {
        map.setLayoutProperty(layerId, "visibility", "none");
    }
};


const addMapStyle = () => {


    specEchars.forEach((layer) => {
        map.getLayer(layer.id) && map.removeLayer(layer.id);
    });

    const sources = config;

    for (const source in sources) {
        map.getSource(sources[source].name) && map.removeSource(sources[source].name);
    }

    for (const source in sources) {
        !map.getSource(sources[source].name) &&
            map.addSource(sources[source].name, sources[source].tile);
    }

    specEchars.forEach((spec) => {
        !map.getLayer(spec.id) && map.addLayer(spec);
    });

}


// 获取市区
const getCityGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "admin_2022_city",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(geom) as json,name,gid`
    );
}

// 获取县
const getCountyGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "admin_2022_county",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(geom) as json,name,gid`
    );
}

// 获取乡镇
const getTownGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "china_wgs84_town",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(geom) as json,town_name,county_name,gid`
    );
}


// 获取cun
const getCunGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "china_wgs84_all",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(geom) as json,town_name,county_name,name,gid`
    );
}


onMounted(() => {
    initMap();
    // loadBaseSource();
    eventLoad();

    // loadDraw();



    nextTick(() => {

        map.on("load", () => {
            addMapStyle()

            // addTiles();

            fitCenter();
        })

        map.on("click", "admin_2022_city_fill", async (e) => {
            console.log(e)
            map.getCanvas().style.cursor = "pointer";
            let feature = await getCityGeometry(e.features[0].properties.gid);


            // console.log(feature)

            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 100, left: 200, right: 200, bottom: 100 },
                // linear: true,
                // easing: (t) => {
                //     return t * (1 - t);
                // },
            });
        });

        map.on("click", "admin_2024_county_fill", async (e) => {
            console.log(e)
            map.getCanvas().style.cursor = "pointer";
            let feature = await getCountyGeometry(e.features[0].properties.gid);
            // console.log(feature)

            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 100, left: 200, right: 200, bottom: 100 },
                // linear: true,
                // easing: (t) => {
                //     return t * (1 - t);
                // },
            });
        });

        map.on("click", "china_wgs84_town_fill", async (e) => {
            console.log(e)
            map.getCanvas().style.cursor = "pointer";
            let feature = await getTownGeometry(e.features[0].properties.gid);
            // console.log(feature)

            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 100, left: 200, right: 200, bottom: 100 },
                // linear: true,
                // easing: (t) => {
                //     return t * (1 - t);
                // },
            });
        });



        /**
         * 市级别
         */
        map.on("mousemove", "admin_2022_city_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];


            let area_mu = feature.properties.area_mu ? feature.properties.area_mu : "31231";
            let name = feature.properties.name ? feature.properties.name : "";



            map.setFilter("Highlight_DK_Line", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line", "visibility", "visible");

            let text = `
                <table style="line-height:1.0;width:100%;letter-spacing: -1px; " >
                <tr><td style="text-align: left;width:60px">行政区域</td><td style="text-align: right;width:60px">${name} </td></tr>
                <tr><td style="text-align: left;width:60px">数据总量</td><td style="text-align: right;width:60px">123123</td></tr>
                </table>
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        map.on("mouseleave", "admin_2022_city_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line", "visibility", "none");
        });

        /**
         * 县级别
         */
        map.on("mousemove", "admin_2024_county_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];

            let area_mu = feature.properties.area_mu ? feature.properties.area_mu : "31231";
            let name = feature.properties.name ? feature.properties.name : "";

            map.setFilter("Highlight_DK_Line_County", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line_County", "visibility", "visible");

            let text = `
                <table style="line-height:1.0;width:100%;letter-spacing: -1px; " >
                <tr><td style="text-align: left;width:60px">行政区域</td><td style="text-align: right;width:60px">${name} </td></tr>
                <tr><td style="text-align: left;width:60px">数据总量</td><td style="text-align: right;width:60px">123123</td></tr>
                </table>
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        map.on("mouseleave", "admin_2024_county_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");


            map.setLayoutProperty("Highlight_DK_Line_County", "visibility", "none");
        });

        /**
        * 镇级别
        */
        map.on("mousemove", "china_wgs84_town_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];

            let area_mu = feature.properties.area_mu ? feature.properties.area_mu : "31231";
            let town_name = feature.properties.town_name ? feature.properties.town_name : "";

            map.setFilter("Highlight_DK_Line_Town", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line_Town", "visibility", "visible");

            let text = `
                <table style="line-height:1.0;width:100%;letter-spacing: -1px; " >
                <tr><td style="text-align: left;width:60px">行政区域</td><td style="text-align: right;width:60px">${town_name} </td></tr>
                <tr><td style="text-align: left;width:60px">数据总量</td><td style="text-align: right;width:60px">123123</td></tr>
                </table>
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        map.on("mouseleave", "china_wgs84_town_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line_Town", "visibility", "none");
        });


        /**
       * 村级别
       */
        map.on("mousemove", "china_wgs84_cun_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];

            let area_mu = feature.properties.area_mu ? feature.properties.area_mu : "31231";
            let name = feature.properties.name ? feature.properties.name : "";

            map.setFilter("Highlight_DK_Line_Cun", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line_Cun", "visibility", "visible");

            let text = `
                <table style="line-height:1.0;width:100%;letter-spacing: -1px; " >
                <tr><td style="text-align: left;width:60px">行政区域</td><td style="text-align: right;width:60px">${name} </td></tr>
                <tr><td style="text-align: left;width:60px">数据总量</td><td style="text-align: right;width:60px">123123</td></tr>
                </table>
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        map.on("mouseleave", "china_wgs84_cun_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line_Cun", "visibility", "none");
        });
    })
});



// 获取所有坐标并计算边界框
const getCoordinatesAndBbox = (features) => {
    let lng = [];
    let lat = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // 遍历 GeoJSON 的 features
    [features].forEach(feature => {
        if (feature) {
            console.log(feature)
            // 获取当前几何体的坐标
            const coords = [];
            if (feature.type === 'Polygon') {
                feature.coordinates[0].map(coord => {
                    coords.push(coord)
                });
            } else if (feature.type === 'MultiPolygon') {
                feature.coordinates.forEach(polygon => {
                    polygon[0].map(coord => {
                        coords.push(coord)
                    });
                });
            }

            coords.forEach(coord => {
                lng.push(coord[0]);
                lat.push(coord[1]);
            });
            // 更新边界框
            minX = Math.min(...lng);
            minY = Math.min(...lat);
            maxX = Math.max(...lng);
            maxY = Math.max(...lat);
        }
    });

    return [minX, minY, maxX, maxY]
}


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


        <!--tree工具栏-->
        <div class="left-tool">
            <Shandong></Shandong>
        </div>
        <!--地图工具栏-->
        <div class="right-tool" :style="MapToolPosition">
            <!-- <a-tooltip placement="leftTop">
        <template #title>
          <span>全球视角</span>
        </template>
<a-button @click="goGlobal()" size="large" class="boxshadow">
    <ScanSearch />
</a-button>
</a-tooltip> -->

            <a-tooltip placement="leftTop">
                <template #title>
                    <span>最佳视野</span>
                </template>
                <a-button @click="fitCenter()" size="large" class="boxshadow">
                    <ScanSearch />

                </a-button>
            </a-tooltip>
            <br />
            <a-tooltip title="重置视角 " placement="left">
                <div @click="Zero()" class="pst">
                    <img id="Zero" :src="c2" @click="Zero()" />
                </div>
            </a-tooltip>

            <!-- <br />
            <div>

                <a-tooltip title="底图切换" placement="left">
                    <a-button @click="switchLayer()" size="large" class="boxshadow">
                        <Layers v-if="!rightLayer" />
                        <X color="#3277fc" v-else />
                        <span class="arrow">◣</span>
                    </a-button>
                </a-tooltip>
             
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

                 
                    <a-card>
                   
                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                        }">
                            <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
                                地名
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state.DMZJiSHow" size="small" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                        }">
                            <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
                                省界
                                <a-switch checked-children="显示" un-checked-children="隐藏" size="small"
                                    v-model:checked="state_layer.checked7" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                        }">
                            <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
                                市界
                                <a-switch checked-children="显示" un-checked-children="隐藏" size="small"
                                    v-model:checked="state_layer.checked8" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                        }">
                            <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
                                县界
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state_layer.checked4" size="small" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                        }">
                            <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
                                镇界
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state_layer.checked5" size="small" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                        }">
                            <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
                                村界
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state_layer.checked6" size="small" />
                            </div>
                        </a-card-grid>
                    </a-card>
                </div>
            </div> -->


            <a-tooltip placement="leftTop">
                <template #title>
                    <span>二三维切换</span>
                </template>
                <a-button @click="three3D()" size="large" class="boxshadow">
                    <Map v-if="machine != 'mercator'" />
                    <Globe v-else />
                </a-button>
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
</template>

<style scoped>
.deeff {
    color: #fc8452;
    color: #9a60b4;
    color: #ea7ccc;
    color: #91cc75;
    color: #fac858;
    color: #ee6666;
    color: #73c0de;
    color: #3ba272;
    color: #5470c6;
}

.map {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

/deep/.mapboxgl-ctrl-scale {
    color: #fff;

    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.5);

    text-align: center;
    border: 0;
}

::v-deep .ant-btn {
    margin-top: 4px;
}

::v-deep .ant-card {
    border-radius: 2px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 0;
}

::v-deep .ant-card-grid {
    padding: 5px 5px;
    box-shadow: none;
}

::v-deep .mapboxgl-ctrl-top-right {
    display: none;
}

.left-tool {
    position: absolute;
    left: 15px;
    top: 20px;
    /* width: 2rem; */
    z-index: 1000;
}

.right-tool {
    position: absolute;
    right: 15px;
    top: 20px;
    /* width: 2rem; */
    z-index: 1000;
}

.switch-layer {
    position: absolute;
    right: 81px;
    top: 140px;
    width: 600px;
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

    /* background-color: rgba(0, 0, 0, 0.6); */
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    border-radius: 3px;
    width: 55px;
    height: 55px;
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

::v-deep .mapboxgl-ctrl-attrib {
    background-color: rgba(0, 0, 0, 0.5);
    color: #eee9e9e7;
    padding: 3px;
}

.pst {}

.pst>img {
    height: 64px;
    width: 54px;
    cursor: pointer;
}

.pst:hover {
    background-color: rgba(0, 0, 0, 0.5);
}


.arrow {
    position: absolute;
    left: 1px;
    bottom: -6px;
}

::v-deep .mapboxgl-ctrl-bottom-left .mapboxgl-ctrl {
    margin: 0;
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
    border-bottom-color: #fdfbfbb4;
    border-top: none;
}

::v-deep .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
    align-self: flex-start;
    border-bottom-color: #fdfbfbb4;
    border-left: none;
    border-top: none;
}

::v-deep .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
    align-self: flex-end;
    border-bottom-color: #fdfbfbb4;
    border-right: none;
    border-top: none;
}

::v-deep .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
    align-self: center;
    border-bottom: none;
    border-top-color: #fdfbfbb4;
}

::v-deep .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
    align-self: flex-start;
    border-bottom: none;
    border-left: none;
    border-top-color: #fdfbfbb4;
}

::v-deep .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
    align-self: flex-end;
    border-bottom: none;
    border-right: none;
    border-top-color: #fdfbfbb4;
}

::v-deep .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
    align-self: center;
    border-left: none;
    border-right-color: #fdfbfbb4;
}

::v-deep .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
    align-self: center;
    border-left-color: #fdfbfbb4;
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
    background-color: #fdfbfbb4;
}

::v-deep .mapboxgl-popup-content {
    background: #fdfbfbdb;
    border-radius: 2px;
    box-shadow: 0 10px 2px rgba(0, 0, 0, 0.1);

    padding: 10px 5px;
    pointer-events: auto;
    position: relative;
    color: #444242e7;
    font-size: 14px;
}
</style>
