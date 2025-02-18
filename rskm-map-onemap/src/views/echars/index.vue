<script setup>
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.css";
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl";
import "../../../public/mapboxgl/pulgins/rasterTileLayer";
import { onMounted, ref, nextTick, watch, reactive, h, onUnmounted, defineExpose } from "vue";


import { message, notification, Button } from "ant-design-vue";
import * as turf from "@turf/turf";
import StateManager from "@/utils/state_manager";
import {
    Ruler,
    Layers,
    Plus,
    Minus,
    ScanEye,
    Map,
    Globe,
    LandPlot,
    PencilRuler,
    Pencil,
    Dot,
    Pentagon,
    RectangleHorizontal,
    Circle,
    Slash,
    ScanSearch,
    Scale3D,
    House,
    X,
    RotateCcw
} from "lucide-vue-next";
import c2 from "@/assets/images/map/c2.svg";
import {
    eventRotate,
    eventRender,
    addIcon,
} from "@/views/map/map";
import { config, mapbox } from "@/config/tileserver-echars";
import { api } from "@/config/api";
import { layers, specEchars } from "@/config/spec-echars";
import { province_data } from "../../../public/data/message";
import { useRoute } from 'vue-router';


/**
 * 初始化地图
 * @function
 */
const initMap = () => {
    mapboxgl.workerCount = navigator.hardwareConcurrency + 2;
    mapboxgl.maxParallelImageRequests = 12;
    //   mapboxgl.accessToken = mapbox.key;
    mapboxgl.prewarm();

    window.map = new mapboxgl.Map({
        container: "map",
        center: [106, 36],
        zoom: 4.6,
        maxZoom: 20,
        minZoom: 3,
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

    /**
 * Mapbox 小型弹出窗口实例
 * @type {mapboxgl.Popup}
 */
    popup = new mapboxgl.Popup({
        closeOnClick: false,
        closeButton: false,
    });

    popup.setOffset(5);

    map.on("load", () => {
        addTiles();
    });
};

let popup;

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



// 初始化视野
const fitCenter = () => {
    map.flyTo({
        center: [118.223855, 36.315451],
        zoom: 7,
        speed: 1,
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
    let type;

    if (StateManager.get("MAP_LAYERS")) {
        type = StateManager.get("MAP_LAYERS");
    } else {
        type = layers[0];
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


// 获取省
const getProvinceGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "admin_2022_province",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(ST_Simplify(geom, 0.01)) as json,name,gid,province_code`
    );
}


// 获取市区
const getCityGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "admin_2022_city",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(ST_Simplify(geom, 0.01)) as json,name,gid,province_code,province,code`
    );
}

// 获取县
const getCountyGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "admin_2022_county",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(ST_Simplify(geom, 0.001)) as json,name,gid,code,province_code`
    );
}

// 获取乡镇
const getTownGeometry = async (gid) => {
    return await api.get_table_by_filter(
        "china_wgs84_town",
        `and  gid in (${gid}) `,
        `ST_AsGeoJSON(ST_Simplify(geom, 0.0001)) as json,town_name,county_name,gid,province_code,town_code`
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

// 获取code name
const getAreaInfo = async (me) => {
    let data;
    switch (me.type) {
        case "province":
            data = await api.get_table_by_filter(
                "admin_2022_province",
                `and  province_code in (${Number(me.code)}) `,
                `province_code as code,name,ST_AsGeoJSON(ST_Simplify(geom, 0.01)) as json`
            );
            break;
        case "city":
            data = await api.get_table_by_filter(
                "admin_2022_city",
                `and  code in (${Number(me.code)}) `,
                `name,code,ST_AsGeoJSON(ST_Simplify(geom, 0.01)) as json`
            );
            break;
        case "county":
            data = await api.get_table_by_filter(
                "admin_2022_county",
                `and  code in (${Number(me.code)}) `,
                `name,code,ST_AsGeoJSON(ST_Simplify(geom, 0.0001)) as json`
            );
            break;
        case "town":
            data = await api.get_table_by_filter(
                "china_wgs84_town",
                `and  town_code in ('${me.code}') `,
                `town_name as name,town_code as code,ST_AsGeoJSON(ST_Simplify(geom, 0.0001)) as json`
            );
            break;
        case "cun":
            data = await api.get_table_by_filter(
                "china_wgs84_all",
                `and  code in ('${me.code}') `,
                `name,code`
            );
            break;
    }



    return data;
}

const loadDefaultView = async () => {
    // 实现方法  province_code

    const data = await api.get_table_by_filter(
        "admin_2022_province",
        `and  province_code ='${province_code}' `,
        `ST_AsGeoJSON(ST_Simplify(geom, 0.1)) as json,name,gid,province_code`
    );
    // 处理数据
    //console.log(data);

    let bbox = getCoordinatesAndBbox(JSON.parse(data[0].json));

    map.fitBounds(bbox, {
        padding: { top: 10, bottom: 10 },
    });

}

const loadDefaultData = async () => {

    let list = [];
    province_data.data.forEach((p) => {
        list.push(`${p.name}`)
        list.push(`${p.name} \n ${p.value}`)
    })
    let dds = [
        'match',
        ['get', 'name'], ...list, ["get", "name"]
    ];
    //console.log(dds)
    map.getLayer('admin_2022_city_text') && map.setLayoutProperty('admin_2022_city_text', 'text-field', dds);
}




/**
 * 清除地图上的 GeoJSON 数据
 * 该函数会移除地图上的 GeojsonBuffLayer 图层和 GeojsonBuffSource 数据源
 */
const clearCoordinatesJSON = () => {
    // 如果 GeojsonBuffLayer 图层存在，则将其移除
    map.getLayer("GeojsonBuffLayerFill") && map.removeLayer("GeojsonBuffLayerFill")
    // 如果 GeojsonBuffLayer 图层存在，则将其移除
    map.getLayer("GeojsonBuffLayer") && map.removeLayer("GeojsonBuffLayer")
    // 如果 GeojsonBuffSource 数据源存在，则将其移除
    map.getSource("GeojsonBuffSource") && map.removeSource("GeojsonBuffSource")


}

/**
 * 在地图上绘制 GeoJSON 数据
 * @param {Object} geojson - 要绘制的 GeoJSON 数据
 */
const drawCoordinatesJSON = (geojson) => {
    // 添加 GeoJSON 数据源
    map.addSource('GeojsonBuffSource', {
        'type': 'geojson',
        'data': geojson
    });

    // 添加图层以显示 GeoJSON 数据
    map.addLayer({
        'id': 'GeojsonBuffLayer',
        'type': 'line',
        'source': 'GeojsonBuffSource',
        'layout': {
            "line-join": "round",
            "line-cap": "round",
        },
        'paint': {
            "line-color": "RGB(50,119,252)",
            "line-width": 12,
            "line-opacity": 0.6,
        }
    });

    map.addLayer({
        'id': 'GeojsonBuffLayerFill',
        'type': 'fill',
        'source': 'GeojsonBuffSource',
        'layout': {
            // "line-join": "round",
            // "line-cap": "round",
        },
        'paint': {
            'fill-color': 'RGB(50,119,252)', // 填充颜色
            'fill-opacity': 0.2 // 填充透明度
        }
    });
}

// 获取所有坐标并计算边界框
const getCoordinatesAndBbox = (features) => {
    let lng = [];
    let lat = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // 遍历 GeoJSON 的 features
    [features].forEach(feature => {
        if (feature) {
            //  console.log(feature) // 调试输出当前 feature

            // 初始化坐标数组
            const coords = [];
            if (feature.type === 'Polygon') {
                // 如果是多边形，提取第一个坐标数组
                feature.coordinates[0].map(coord => {
                    coords.push(coord)
                });
            } else if (feature.type === 'MultiPolygon') {
                // 如果是多重多边形，遍历每个多边形并提取坐标
                feature.coordinates.forEach(polygon => {
                    polygon[0].map(coord => {
                        coords.push(coord)
                    });
                });
            }

            // 将坐标分解为经度和纬度，并更新边界框
            coords.forEach(coord => {
                lng.push(coord[0]);
                lat.push(coord[1]);
            });

            // 计算最小和最大经纬度以确定边界框
            minX = Math.min(...lng);
            minY = Math.min(...lat);
            maxX = Math.max(...lng);
            maxY = Math.max(...lat);
        }
    });

    // 返回边界框的四个角点
    return [minX, minY, maxX, maxY]
}


// 图层切换
const switchTile = (layer) => {
    // 历史缓存
    StateManager.set("MAP_LAYERS", layer);

    layers.forEach((ll) => {
        ll.isShow = false;
    });
    layer.isShow = true;

    // 图层叠加
    addRasterTileLayer(layer.param, layer.key);

    message.success("已更新为" + layer.name, 1);

};

const rectMap = () => {
    clearCoordinatesJSON()

    map.fitBounds([
        [73.66, 18.17], // 西南角坐标
        [135.05, 53.55] // 东北角坐标
    ], {
        padding: { top: 10, bottom: 10, left: 10, right: 10 }
    });
};

onUnmounted(() => {
    delete window.map;
    delete window.gl_draw;
});


defineExpose({
    fitCenter

});

const props = defineProps({
    MapToolPosition: Object
})

let province_list = [];
let city_list = [];
let county_list = [];
let town_list = [];
let cun_list = [];

window.addEventListener('message', (event) => {
    // if (event.origin !== 'http://sd-nh.weisys.net/') {
    //     console.info("域名不符 http://sd-nh.weisys.net/")
    //     return;
    // }
    let data = event.data;

    // !data.data && (data = province_data);

    // 处理接收到的数据
    console.log('接收到的数据:', data);

    if (!data.data || !data.data.length) {
        console.log('暂无数据');
        return;
    }

    let list = [];

    for (let i in data.data) {
        list.push(`${data.data[i].name}`)
        if (data.data[i].value) {
            list.push(`${data.data[i].name} \n ${data.data[i].value}`)
        } else {
            list.push(`${data.data[i].name}`)
        }
    }

    switch (data.type) {
        case "province":
            let province = [
                'match',
                ['get', 'name'], ...list, ["get", "name"]
            ];
            console.info(province)
            map.getLayer('admin_2022_city_text') && map.setLayoutProperty('admin_2022_city_text', 'text-field', province);

            city_list = data.data;
            break;

        case "city":
            let city = [
                'match',
                ['get', 'name'], ...list, ["get", "name"]
            ];
            console.info(city)
            map.getLayer('admin_2022_county_text') && map.setLayoutProperty('admin_2022_county_text', 'text-field', city);
            county_list = data.data;
            break;

        case "county":
            let county = [
                'match',
                ['get', 'town_name'], ...list, ["get", "town_name"]
            ];
            console.info(county)
            map.getLayer('china_wgs84_town_text') && map.setLayoutProperty('china_wgs84_town_text', 'text-field', county);
            town_list = data.data;
            break;
        case "town":
            let town = [
                'match',
                ['get', 'name'], ...list, ["get", "name"]
            ];
            map.getLayer('china_wgs84_cun_text') && map.setLayoutProperty('china_wgs84_cun_text', 'text-field', town);
            cun_list = data.data;
            break;

        default:
            break;
    }

    // 定位
    if (data.data.length == 0) {
        console.log("无数据")
        return
    }
    let code = data.data[0].code;
    let res = getAreaInfo({ type: data.type, code: code });
    res.then((data) => {
        console.log(data);
        if (data.length > 0) {
            clearCoordinatesJSON()
            map.getCanvas().style.cursor = "pointer";

            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 0, bottom: 0 },
            });

            drawCoordinatesJSON(JSON.parse(data[0].json));
        }
    })
});

const sendMessageToIframe = (message) => {
    window.parent.postMessage(message, '*');
}

const route = useRoute(); // 获取当前路由对象
const province_code = route.params.id || ''; // 获取路由参数，若未获得则设为空字符串


onMounted(() => {



    // 延迟自适应视野
    setTimeout(() => {
        loadDefaultView()
    }, 1500)

    // 初始化地图
    initMap();

    // 加载事件
    eventLoad();

    nextTick(() => {
        // 地图加载完成后执行
        map.on("load", () => {
            addMapStyle()

            //loadDefaultData()

            let res = getAreaInfo({ type: "province", code: province_code });
            res.then((data) => {
                //console.log(data);
                sendMessageToIframe({ type: 'province', code: data[0].code + `000000`, name: data[0].name });
            })

        })

        // 地图点击事件
        map.on("click", (e) => {
            clearCoordinatesJSON()
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
        });

        // 点击省级填充图层事件
        map.on("click", "admin_2022_province_fill", async (e) => {
            clearCoordinatesJSON()
            map.getCanvas().style.cursor = "pointer";
            let feature = await getProvinceGeometry(e.features[0].properties.gid);
            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 0, bottom: 0 },
                // duration: 500
            });

            setTimeout(() => {
                //   map.setZoom(6.5)
            }, 1000)

            // 高亮
            //  drawCoordinatesJSON(JSON.parse(feature[0].json));


            //console.log(feature[0])
            let res = getAreaInfo({ type: "province", code: feature[0].province_code });
            res.then((data) => {
                // console.log(data);
                sendMessageToIframe({ type: 'province', code: feature[0].province_code + `000000`, name: feature[0].name });
            })

        });

        // 点击市级填充图层事件
        map.on("click", "admin_2022_city_fill", async (e) => {
            clearCoordinatesJSON()
            map.getCanvas().style.cursor = "pointer";
            let feature = await getCityGeometry(e.features[0].properties.gid);
            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 0, bottom: 0 },
                //  duration: 500,

            });
            setTimeout(() => {
                //map.setZoom(8.5)
            }, 1000)

            drawCoordinatesJSON(JSON.parse(feature[0].json));

            console.log(feature[0])
            let res = getAreaInfo({ type: "city", code: feature[0].code });
            res.then((data) => {
                console.log(data);
                sendMessageToIframe({ type: 'city', code: feature[0].code + `000000`, name: feature[0].name });
            })

        });

        // 点击县级填充图层事件
        map.on("click", "admin_2024_county_fill", async (e) => {
            clearCoordinatesJSON()
            map.getCanvas().style.cursor = "pointer";
            let feature = await getCountyGeometry(e.features[0].properties.gid);
            let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
            map.fitBounds(bbox, {
                padding: { top: 0, bottom: 0 },
            });
            drawCoordinatesJSON(JSON.parse(feature[0].json));

            //  console.log(feature[0])
            let res = getAreaInfo({ type: "county", code: feature[0].code });
            res.then((data) => {
                //  console.log(data);
                sendMessageToIframe({ type: 'county', code: feature[0].code + `000000`, name: feature[0].name });
            })
        });

        // 点击镇级填充图层事件
        // map.on("click", "china_wgs84_town_fill", async (e) => {
        //     clearCoordinatesJSON()
        //     map.getCanvas().style.cursor = "pointer";
        //     let feature = await getTownGeometry(e.features[0].properties.gid);
        //     // let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
        //     // map.fitBounds(bbox, {
        //     //     padding: { top: 0, bottom: 0 },
        //     // });
        //     drawCoordinatesJSON(JSON.parse(feature[0].json));

        //     // console.log(feature[0])
        //     let res = getAreaInfo({ type: "town", code: feature[0].town_code });
        //     res.then((data) => {
        //         //    console.log(data);
        //         sendMessageToIframe({ type: 'town', code: data[0].code, name: data[0].name });
        //     })
        // });

        // 点击村级填充图层事件
        // map.on("click", "china_wgs84_cun_fill", async (e) => {
        //     clearCoordinatesJSON()
        //     map.getCanvas().style.cursor = "pointer";
        //     let feature = await getCunGeometry(e.features[0].properties.gid);
        //     let bbox = getCoordinatesAndBbox(JSON.parse(feature[0].json));
        //     map.fitBounds(bbox, {
        //         padding: { top: 10, bottom: 10 },
        //     });
        //     drawCoordinatesJSON(JSON.parse(feature[0].json));
        // });

        /**
         * 省级别鼠标移动事件
         */
        map.on("mousemove", "admin_2022_province_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];
            let name = feature.properties.name ? feature.properties.name : "";
            map.setFilter("Highlight_DK_Line_Province", ["all", ["in", "province_code", feature.properties.province_code]]);
            map.setLayoutProperty("Highlight_DK_Line_Province", "visibility", "visible");
            let text = `
                <table style="line-height:1.0;font-size:18px;width:100px " >
                <tr><td style="text-align: center;">${name} </td></tr>
                </table> 
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        // 省级别鼠标离开事件
        map.on("mouseleave", "admin_2022_province_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line_Province", "visibility", "none");
        });

        /**
         * 市级别鼠标移动事件
         */
        map.on("mousemove", "admin_2022_city_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];
            let name = feature.properties.name ? feature.properties.name : "";
            map.setFilter("Highlight_DK_Line_City", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line_City", "visibility", "visible");
            let text = `
             <table style="line-height:1.0;font-size:18px;" >
                <tr><td style="text-align:center;">${name} </td></tr>
                <tr><td style="text-align: center;">${city_list.filter((pro) => pro.name == name).length ? city_list.filter((pro) => pro.name == name)[0].value : ''
                }</td></tr>
                </table>
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        // 市级别鼠标离开事件 
        map.on("mouseleave", "admin_2022_city_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line_City", "visibility", "none");
        });

        /**
         * 县级别鼠标移动事件 
         */
        map.on("mousemove", "admin_2024_county_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];
            let name = feature.properties.name ? feature.properties.name : "";
            map.setFilter("Highlight_DK_Line_County", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line_County", "visibility", "visible");
            let text = `
               <table style="line-height:1.0;font-size:18px;" >
                <tr><td style="text-align:center;">${name} </td></tr>
             <tr><td style="text-align: center;">${county_list.filter((pro) => pro.name == name).length ? county_list.filter((pro) => pro.name == name)[0].value : ''
                }</td></tr>
                </table>
            `;


            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        // 县级别鼠标离开事件
        map.on("mouseleave", "admin_2024_county_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line_County", "visibility", "none");
        });

        /**
         * 镇级别鼠标移动事件
         */
        map.on("mousemove", "china_wgs84_town_fill", (e) => {
            map.getCanvas().style.cursor = "pointer";
            let feature = e.features[0];
            let name = feature.properties.town_name ? feature.properties.town_name : "";
            map.setFilter("Highlight_DK_Line_Town", ["all", ["in", "gid", feature.properties.gid]]);
            map.setLayoutProperty("Highlight_DK_Line_Town", "visibility", "visible");
            let text = `
            
                  <table style="line-height:1.0;font-size:18px;" >
                <tr><td style="text-align:center;">${name} </td></tr>
                <tr><td style="text-align: center;">${town_list.filter((pro) => pro.name == name).length ? town_list.filter((pro) => pro.name == name)[0].value : ''
                }</td></tr>
                </table>
            `;
            popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        });

        // 镇级别鼠标离开事件
        map.on("mouseleave", "china_wgs84_town_fill", () => {
            map.getCanvas().style.cursor = "";
            popup.setLngLat([0, 0]);
            popup.setHTML("");
            map.setLayoutProperty("Highlight_DK_Line_Town", "visibility", "none");
        });

        /**
         * 村级别鼠标移动事件 
         */
        // map.on("mousemove", "china_wgs84_cun_fill", (e) => {
        //     map.getCanvas().style.cursor = "pointer";
        //     let feature = e.features[0];
        //     let name = feature.properties.name ? feature.properties.name : "";
        //     map.setFilter("Highlight_DK_Line_Cun", ["all", ["in", "gid", feature.properties.gid]]);
        //     map.setLayoutProperty("Highlight_DK_Line_Cun", "visibility", "visible");
        //     let text = `
        //          <table style="line-height:1.0;font-size:18px;" >
        //         <tr><td style="text-align:center;">${name} </td></tr>
        //         <tr><td style="text-align: center;">${cun_list.filter((pro) => pro.name == name).length ? cun_list.filter((pro) => pro.name == name)[0].value : ''
        //         }</td></tr>
        //         </table>
        //     `;
        //     popup.setLngLat(e.lngLat).setHTML(text).addTo(map);
        // });

        // // 村级别鼠标离开事件
        // map.on("mouseleave", "china_wgs84_cun_fill", () => {
        //     map.getCanvas().style.cursor = "";
        //     popup.setLngLat([0, 0]);
        //     popup.setHTML("");
        //     map.setLayoutProperty("Highlight_DK_Line_Cun", "visibility", "none");
        // });

    });



});



</script>

<template>
    <div>
        <div class="map" id="map"></div>
        <a-spin class="spin" v-if="spin" :tip="spintext" size="large"></a-spin>


        <!--tree工具栏-->
        <div class="left-tool">

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
                    <span>重置地图</span>
                </template>
                <a-button @click="rectMap()" size="large" class="boxshadow">
                    <RotateCcw />

                </a-button>
            </a-tooltip>

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
                            <img :src="item.url" style="width: 100%; height: 100px; border-radius: 2px" v-if="item.url"
                                @click="switchTile(item)" />
                            <div v-else
                                style="width: 100%; height: 100px; border-radius: 2px;background-color: aliceblue;"
                                @click="switchTile(item)">
                            </div>
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
                            <img :src="item.url" v-if="item.url"
                                style="width: 100%; height: 100px; border-radius: 2px" />
                            <div v-else
                                style="width: 100%; height: 100px; border-radius: 2px;background-color: aliceblue;"
                                @click="switchTile(item)">
                            </div>
                            <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
                                {{ item.name }}
                            </div>
                        </a-card-grid>
                    </a-card>
                    <br />



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

::v-deep .mapboxgl-ctrl-scale {
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
    background-color: #10101069;
}

::v-deep .mapboxgl-popup-content {
    background: #10101092;
    border-radius: 2px;
    box-shadow: 0 10px 2px rgba(0, 0, 0, 0.1);

    padding: 10px 5px;
    pointer-events: auto;
    position: relative;
    color: #f4eeeee7;
    font-size: 16px;
}
</style>
