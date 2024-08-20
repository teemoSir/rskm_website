<script setup>
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.css";
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl";
import "../../../public/mapboxgl/pulgins/rasterTileLayer";
import { onMounted, ref, nextTick, watch, reactive, h, onUnmounted } from "vue";
import { config, mapbox, api } from "@/config/map.js";
import { layers, waySpec } from "@/config/spec-v2";
import { message, notification, Button } from "ant-design-vue";
import moment from "moment";
import bboxx from "@/utils/bbox";
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
  //   Pencil,
  //   Dot,
  //   Waypoints,
  //   Pentagon,
  //   Square,
  //   RectangleHorizontal,
  //   Route,
  //   Brush,
  //   Circle,
  //   Slash,
  //   MoveHorizontal,
  Scale3D,
  House,
  X,
} from "lucide-vue-next";

import c7 from "@/assets/images/map/c7.svg";
import c2 from "@/assets/images/map/c2.svg";
// import compass from "@/assets/images/map/compass.png";
// import compassPointer from "@/assets/images/map/compassPointer.png";
// import north from "@/assets/images/map/north-b.png";
import { fills } from "@/config/fill";
import getCeliang from "@/utils/celiang";
import {
  eventRotate,
  eventRender,
  popupbig,
  popup,
  addLayers,
  addIcon,
  setPopup,
} from "@/views/map/map.js";

window.map = null;
const initMap = () => {
  mapboxgl.workerCount = navigator.hardwareConcurrency + 2;
  mapboxgl.maxParallelImageRequests = 10;
  mapboxgl.accessToken = mapbox.key;

  map = new mapboxgl.Map({
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
        color: "rgb(186, 210, 235)", // Lower atmosphere
        "high-color": "rgb(36, 92, 223)", // Upper atmosphere
        "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
        "space-color": "rgb(11, 11, 25)", // Background color
        "star-intensity": 0.3, // Background star brightness (default 0.35 at low zoooms )
      },
      sources: {},
      layers: [
        {
          id: "background",
          type: "background",
          layout: {},
          paint: {
            "background-color": "#f5f5f5",
          },
          interactive: true,
        },
      ],
      _ssl: true,
    },
    projection: "globe",
  });

  map.addControl(
    new mapboxgl.AttributionControl({
      customAttribution: "<div id='xyz'></div>",
    })
  );

  map.addControl(
    new mapboxgl.ScaleControl({
      maxWidth: 150,
      unit: "metric",
    })
  );
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
    window["lnglatrender"] = {
      lng: e.lngLat.lng,
      lat: e.lngLat.lat,
    };
  });

  /**
   * 渲染运行时
   */
  map.on("render", (e) => {
    eventRender();
  });

  let layerDK = "rskm_pt";

  /**
   * 鼠标移入监听地块
   */
  map.on("mousemove", layerDK, (e) => {
    if (map.getZoom() < 8) return;

    map.getCanvas().style.cursor = "pointer";
    const feature = e.features[0];

    if (window["tgid"] == feature.properties.gid) return;

    let insurancenum = feature.properties.insurancenum || "";
    let area_mi = feature.properties.area_mi
      ? Number(feature.properties.area_mi).toFixed(2) + "㎡"
      : "";
    let area_mu = feature.properties.area_mi
      ? (Number(feature.properties.area_mi) / 667).toFixed(2) + "亩"
      : "";
    let start_date = moment(feature.properties.start_date).format("YYYY年MM月DD日") || "";
    let end_date = moment(feature.properties.end_date).format("YYYY年MM月DD日");
    let insured_quantity = Number(feature.properties.insured_quantity).toFixed(2) || "";
    let province_city_county_town_village =
      (feature.properties.province || "") +
      (feature.properties.city || "") +
      (feature.properties.county || "") +
      (feature.properties.town || "") +
      (feature.properties.village || "");
    let r_data = feature.properties.r_data || "";
    let insurcompany_code = feature.properties.insurcompany_code || "";
    let insurcompany = window["rskm_pt_insure_com"].filter(
      (r) => r.insurcompanycode == insurcompany_code
    );
    insurcompany_code = insurcompany[0].insurcompanyname;
    //rskm_pt_insure_com.filter((com)=>{com.})

    //  map.setFilter("Highlight_DK", ["all", ["in", "gid", feature.properties.gid]]);
    // map.setLayoutProperty("Highlight_DK", "visibility", "visible");

    map.setFilter("Highlight_DK_Line", ["all", ["in", "gid", feature.properties.gid]]);
    map.setLayoutProperty("Highlight_DK_Line", "visibility", "visible");

    //   <tr ><th>起保时间:</th><td>${start_date}</td></tr>
    //         <tr ><th>到期时间:</th><td>${end_date}</td></tr>
    //         <tr > <th style="vertical-align: top;">备注说明:</th><td>${r_data}</td></tr>
    //<tr><th style="vertical-align: top;">位置:</th><td style="">${province_city_county_town_village} </td></tr>
    let text = `
        <table style="line-height:1.0;width:100%;letter-spacing: -1px; font-size: 14px;" >
        <tr><th style="vertical-align: top;width:50px">机构:</th><td style="">${insurcompany_code} </td></tr>
        <tr><th style="vertical-align: top;">面积:</th><td style="" >${area_mu} </td><tr>
      
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

  map.on("click", () => {
    // map.setLayoutProperty("Highlight_DK_Click", "visibility", "none");
    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "none");
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
    zoom: 7.5,
    speed: 1,
    curve: 2,
    easing(t) {
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
    addTiles();

    addLayers();

    fitCenter();

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
  //  历史缓存 重置底图
  addRasterTileLayer(layers.value[17].param, layers.value[17].key);
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
  layerList.forEach((layer) => {
    loadLayer.push(layer[0]);
    //调用接口，添加图层
    var param = key ? { key: key } : null;
    !map.getLayer(layer[0]) && map.addLayer(rasterTileLayer(layer[0], layer[1], param));
  });
};

// 地图类型
let machine = ref("mercator");
watch(machine, () => {
  //spin.value = true;
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
  console.log(StateManager.get("MAP_LAYERS"));

  // 叠加
  addLayers();
};

const goGlobal = () => {
  map.flyTo({
    center: [100.223855, 36.315451],
    zoom: 3,
    speed: 1,
    curve: 2,
    easing(t) {
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
 *
 * 行政边界
 */
// watch(state, () => {
//   [
//     "admin_2022_province",
//     "admin_2022_city",
//     "admin_2024_county",
//     "admin_2024_town",
//     "admin_2024_village",
//   ].forEach((v) => {
//     map.setLayoutProperty(v, "visibility", state.ZJiSHow ? "visible" : "none");
//   });
// });

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

const closeNotification = () => {};
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
  nextTick(() => {
    initMap();

    eventLoad();

    loadBaseSource();

    loadDraw();
  });
});

onUnmounted(() => {
  window.map = undefined;
  window.gl_draw = undefined;
});
</script>

<template>
  <div>
    <div class="map" id="map"></div>
    <a-spin class="spin" v-if="spin" :tip="spintext" size="large"></a-spin>
    <!--地图工具栏-->
    <div class="right-tool">
      <a-tooltip placement="leftTop">
        <template #title>
          <span>全球视角</span>
        </template>
        <a-button @click="goGlobal()" size="large" class="boxshadow">
          <House />
        </a-button>
      </a-tooltip>

      <a-tooltip title="重置视角 " placement="left">
        <div @click="Zero()" class="pst">
          <img id="Zero" :src="c2" @click="Zero()" />
        </div>
      </a-tooltip>
      <a-tooltip placement="leftTop">
        <template #title>
          <span>最佳视野</span>
        </template>
        <a-button @click="fitCenter()" size="large" class="boxshadow">
          <ScanEye />
        </a-button>
      </a-tooltip>
      <br />
      <a-tooltip title="底图切换" placement="left">
        <a-button @click="switchLayer()" size="large" class="boxshadow">
          <Layers v-if="!rightLayer" />
          <X color="#3277fc" v-else />
          <span class="arrow">◣</span>
        </a-button>
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

      <a-tooltip placement="leftTop">
        <template #title>
          <span>{{ terrainSP ? "关闭地形" : "开启地形" }}</span>
        </template>
        <a-button @click="onTerrain()" size="large" class="boxshadow"
          ><MountainSnow :color="!terrainSP ? '#fff' : '#3277fc'"
        /></a-button>
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

            <span class="arrow">◣</span></a-button
          >
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
      <br />

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

    <!--图层列表 -->
    <div class="switch-layer" v-if="rightLayer">
      <a-card title="" v-show="machine != 'mercator'">
        <a-card-grid
          v-for="item in layers"
          class=""
          :key="item.id"
          :style="{
            width: '25%',
            textAlign: 'center',
            display: item.projection ? 'block' : 'none',
          }"
        >
          <img
            :src="item.url"
            style="width: 100%; height: 100px; border-radius: 2px"
            @click="switchTile(item)"
          />
          <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
            {{ item.name }}
          </div>
        </a-card-grid>
      </a-card>
      <a-card title="" v-show="machine == 'mercator'">
        <a-card-grid
          v-for="item in layers"
          :key="item.id"
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
          @click="switchTile(item)"
        >
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
        <!-- <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">行政边界</div>

          <a-switch
            v-model:checked="state.ZJiSHow"
            checked-children="显示"
            un-checked-children="隐藏"
          />
        </a-card-grid> -->
        <!--地名注记-->
        <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
            地名
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state.DMZJiSHow"
               size="small"
            />
          </div>
        </a-card-grid>

        <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
            省界
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              size="small"
              v-model:checked="state_layer.checked7"
            />
          </div>
        </a-card-grid>

        <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
            市界
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
               size="small"
              v-model:checked="state_layer.checked8"
            />
          </div>
        </a-card-grid>

        <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
            县界
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state_layer.checked4"
               size="small"
            />
          </div>
        </a-card-grid>

        <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
            镇界
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state_layer.checked5"
               size="small"
            />
          </div>
        </a-card-grid>

        <a-card-grid
          :style="{
            width: '25%',
            textAlign: 'center',
          }"
        >
          <div style="font-weight: 8000; font-size: 16px; color: #ffffff">
            村界
            <a-switch
              checked-children="显示"
              un-checked-children="隐藏"
              v-model:checked="state_layer.checked6"
               size="small"
            />
          </div>
        </a-card-grid>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
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
/deep/ .ant-btn {
  margin-top: 4px;
}
/deep/ .ant-card {
  border-radius: 2px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 0;
}
/deep/ .ant-card-grid {
  padding: 5px 5px;
  box-shadow: none;
}

/deep/ .mapboxgl-ctrl-top-right {
  display: none;
}

.right-tool {
  position: absolute;
  right: 20px;
  top: 140px;
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

  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  width: 55px;
  height: 55px;
  color: #f7f1f1;
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.boxshadow:hover {
  background-color: rgba(0, 0, 0, 1);
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
/deep/ .mapboxgl-ctrl-attrib {
  background-color: rgba(0, 0, 0, 0.5);
  color: #eee9e9e7;
  padding: 3px;
}
.pst {
}
.pst > img {
  height: 64px;
  width: 54px;
  cursor: pointer;
}
.pst:hover {
  background-color: rgba(0, 0, 0, 0.5);
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
/deep/ .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
  align-self: center;
  border-bottom-color: #161616c9;
  border-top: none;
}
/deep/ .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  align-self: flex-start;
  border-bottom-color: #161616c9;
  border-left: none;
  border-top: none;
}
/deep/ .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
  align-self: flex-end;
  border-bottom-color: #161616c9;
  border-right: none;
  border-top: none;
}
/deep/ .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  align-self: center;
  border-bottom: none;
  border-top-color: #161616c9;
}
/deep/ .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
  align-self: flex-start;
  border-bottom: none;
  border-left: none;
  border-top-color: #161616c9;
}
/deep/ .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  align-self: flex-end;
  border-bottom: none;
  border-right: none;
  border-top-color: #161616c9;
}
/deep/ .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  align-self: center;
  border-left: none;
  border-right-color: #161616c9;
}
/deep/ .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
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
/deep/ .mapboxgl-popup-content {
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

.arrow {
  position: absolute;
  left: 1px;
  bottom: -6px;
}
</style>
../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.js../../../public/mapboxgl/pulgins/mapbox-gl-draw.js../../../public/mapboxgl/pulgins/rasterTileLayer.js../../config/spec-v2.js../../utils/bbox.js../../config/fill.js../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.js../../../public/mapboxgl/pulgins/rasterTileLayer.js
