
import Google from "@/assets/images/map/Google.jpg";
import JL from "@/assets/images/map/JL.jpg";
import MB from "@/assets/images/map/MB.jpg";
import ZKXT_2 from "@/assets/images/map/ZKXT_2.jpg";
import ZKXT_1 from "@/assets/images/map/ZKXT_1.jpg";
import TDT_2 from "@/assets/images/map/TDT_2.jpg";
import TDT_1 from "@/assets/images/map/TDT_1.jpg";
import ESRI from "@/assets/images/map/ESRI.jpg";

import { config } from "@/config/tileserver.js";
import { ref } from "vue";
import StateManager from "@/utils/state_manager";



let layers = ref([
    {
        id: 1,
        name: "Google-影像",
        projection: true,
        st: "",
        url: Google,
        zj: false,
        key: "",
        param: [["google", "Google.Satellite.Map"]],
    },
    // {
    //     id: 1,
    //     projection: false,
    //     name: "高德地图-影像(注记)",
    //     url: Gaode_WX,
    //     key: "",
    //     st: "GS(2023)4677号",
    //     zj: true,
    //     param: [
    //         ["gdyx", "GaoDe.Satellite.Map"],
    //         ["gdyxzj", "GaoDe.Satellite.Annotion"],
    //     ],
    // },
    // {
    //     id: 2,
    //     name: "高德地图-影像",
    //     projection: false,
    //     url: Gaode_WX_WZJ,
    //     st: "GS(2023)4677号",
    //     key: "",
    //     zj: false,
    //     param: [["gdyx", "GaoDe.Satellite.Map"]],
    // },
    // {
    //     id: 3,
    //     name: "高德地图-标准(注记)",
    //     projection: false,
    //     url: Gaode_BZ,
    //     st: "GS(2023)4677号",
    //     key: "",
    //     zj: true,
    //     param: [["gdsl", "GaoDe.Normal.Map"]],
    // },
    // {
    //     id: 4,
    //     name: "高德地图-标准",
    //     projection: false,
    //     url: Gaode_BZ_WZJ,
    //     st: "GS(2023)4677号",
    //     key: "",
    //     zj: false,
    //     param: [["gdslwzj", "GaoDe.Normal_NoTag.Map"]],
    // },
    // {
    //     id: 5,
    //     name: "百度地图-影像(注记)",
    //     projection: false,
    //     url: Baidu_WX,
    //     st: "GS(2023)3206号",
    //     key: "11",
    //     zj: true,
    //     param: [
    //         ["bdyx", "Baidu.Satellite.Map"],
    //         ["bdyxzj", "Baidu.Satellite.Annotion"],
    //     ],
    // },
    // {
    //     id: 6,
    //     name: "百度地图-影像",
    //     projection: false,
    //     url: Baidu_WX_WZJ,
    //     st: "GS(2023)3206号",
    //     key: "11",
    //     zj: false,
    //     param: [["bdyx", "Baidu.Satellite.Map"]],
    // },
    // {
    //     id: 7,
    //     name: "百度地图-标准(注记)",
    //     projection: false,
    //     url: Baidu_BZ,
    //     st: "GS(2023)3206号",
    //     key: "",
    //     zj: true,
    //     param: [
    //         ["bdsl", "Baidu.Normal.Map"],
    //         ["bdsl", "Baidu.Normal_NoTag.Map"],
    //     ],
    // },
    // {
    //     id: 8,
    //     name: "百度地图-标准",
    //     projection: false,
    //     url: Baidu_BZ_WZJ,
    //     st: "GS(2023)3206号",
    //     key: "",
    //     zj: false,
    //     param: [["bdsl", "Baidu.Normal_NoTag.Map"]],
    // },
    // {
    //     id: 9,
    //     name: "天地图-影像(注记)",
    //     projection: true,
    //     url: TDT_WX,
    //     st: "GS(2023)336号",
    //     key: "9998977aa7629c0d5088a986b20567a1",
    //     zj: true,
    //     param: [
    //         ["tdtyx", "TianDiTu.Satellite.Map"],
    //         ["tdtyxzj", "TianDiTu.Satellite.Annotion"],
    //     ],
    // },
    {
        id: 9,
        name: "天地图-地形",
        projection: true,
        url: TDT_1,
        st: "GS(2023)336号",
        key: "2d7a1be22646b7cad8e925293683e1e8",
        zj: false,
        param: [["tdtdx", "TianDiTu.Terrain.Map"]],
    },
    {
        id: 10,
        name: "天地图-影像",
        projection: true,
        url: TDT_1,
        st: "GS(2023)336号",
        key: "2d7a1be22646b7cad8e925293683e1e8",
        zj: false,
        param: [["tdtyx", "TianDiTu.Satellite.Map"]],
    },
    // {
    //     id: 11,
    //     name: "天地图-标准(注记)",
    //     projection: true,
    //     url: TDT_BZ,
    //     st: "GS(2023)336号",
    //     key: "2afa77972bd56e6da7f45dee6517b59a",
    //     zj: true,
    //     param: [
    //         ["tdtsl", "TianDiTu.Normal.Map"],
    //         ["tdtslzj", "TianDiTu.Normal.Annotion"],
    //     ],
    // },
    {
        id: 12,
        name: "天地图-矢量",
        projection: true,
        url: TDT_2,
        st: "GS(2023)336号",
        key: "5a77920c8a19898beea6943e2c0c5bad",
        zj: false,
        param: [["tdtsl", "TianDiTu.Normal.Map"]],
    },

    {
        id: 13,
        name: "ESRI-影像",
        projection: true,
        url: ESRI,
        st: "",
        key: "",
        zj: true,
        param: [["arcc", "ArcGIS.Satellite.Map"]],
    },


    // {
    //     id: 14,
    //     name: "ESRI标准",
    //     projection: false,
    //     url: ESRI_BZ,
    //     key: "",
    //     zj: true,
    //     param: [["Map", "Geoq.Normal.Map"]],
    // },
    // {
    //     id: 15,
    //     name: "ESRI深蓝",
    //     projection: false,
    //     url: ESRI_SL,
    //     key: "",
    //     zj: true,
    //     param: [["PurplishBlue", "Geoq.Normal.PurplishBlue"]],
    // },

    // {
    //     id: 16,
    //     name: "ESRI温色",
    //     url: ESRI_WS,
    //     key: "",
    //     zj: true,
    //     param: [["geoqWarm", "Geoq.Normal.Warm"]],
    // },
    {
        id: 17,
        name: "中科星图-影像",
        st: "GS(2023)1924号",
        projection: true,
        url: ZKXT_1,
        zj: false,
        key: "0a4f0eda380b7d267046c9c385e423580079e75fa7384905b53b332bf147794c",
        param: [["xtyx", "Geovisearth.Satellite.Map"]],
    },
    {
        id: 18,
        name: "星图地球-矢量",
        st: "GS(2023)1924号",
        projection: true,
        url: ZKXT_2,
        zj: true,
        key: "0a4f0eda380b7d267046c9c385e423580079e75fa7384905b53b332bf147794c",//44194e4bbd714ee9cd453c7ff3e5635b56bc9d61b26946f7631c69fa96d91e60
        param: [["xtsl", "Geovisearth.Normal.Map"]],
    },
    {
        id: 19,
        name: "星图地球-地形",
        st: "GS(2023)1924号",
        projection: true,
        url: ZKXT_2,
        zj: true,
        key: "0a4f0eda380b7d267046c9c385e423580079e75fa7384905b53b332bf147794c",//44194e4bbd714ee9cd453c7ff3e5635b56bc9d61b26946f7631c69fa96d91e60
        param: [["xtdx", "Geovisearth.Terrain.Map"]],
    },
    // {
    //     id: 22,
    //     name: "Mapbox-影像",
    //     projection: true,
    //     st: "",
    //     url: MB,
    //     key: "",
    //     zj: true,
    //     param: [["mb", "Mapbox.Satellite.Map"]],
    // },
    {
        id: 23,
        name: "吉林一号-影像",
        projection: true,
        st: "GS吉(2023)011号",
        url: JL,
        zj: false,
        key: "",
        param: [["jilin", "JLONE.Satellite.Map"]],
    },

    {
        id: 25,
        name: "Bing-影像",
        projection: true,
        st: "",
        url: Google,
        zj: true,
        param: [["bing", "Bing.Satellite.Map"]],
        key: "",
    },
])

let isShowLayer = StateManager.get("MAP_LAYERS") || { id: '' };
layers.value.forEach(layer => {
    layer.isShow = (isShowLayer.id == layer.id ? true : false);
});





/**
 * 地图
 */
let spec = [


    {
        id: "admin_2022_province",
        'type': 'line',
        source: config.admin_2022_province.name,
        "source-layer": config.admin_2022_province.name,

        layout: {
            visibility: "visible",
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 0.7,
            // 'line-width': ["interpolate",
            //     ["exponential", 1.5],
            //     ["zoom"],
            //     2,
            //     0.5,
            //     5,
            //     1,
            //     8,
            //     2.5,],
            'line-color': '#ccc',
            'line-opacity': 1
        },
        minzoom: 2,
        maxzoom: 12.99

    },
    {
        id: "admin_2022_city",
        'type': 'line',
        source: config.admin_2022_city.name,
        "source-layer": config.admin_2022_city.name,
        layout: {
            visibility: "visible",
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 0.5,
            'line-color': '#fff',

            // "line-opacity": ["interpolate",
            //     ["exponential", 1.5],
            //     ["zoom"],
            //     6,
            //     1,
            //     13,
            //     0.3,
            //     14,
            //     0.2,],
        },
        minzoom: 6,
        maxzoom: 8.99

    },

    {
        id: "admin_2024_village",
        'type': 'line',
        source: config.admin_2024_village.name,
        "source-layer": config.admin_2024_village.name,
        layout: {
            visibility: "visible",
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 1.5,
            'line-color': 'RGB(255,127,39)',
            // 'line-width': ["interpolate",
            //     ["exponential", 1.5],
            //     ["zoom"],
            //     2,
            //     0.5,
            //     13,
            //     3.5,
            //     14,
            //     4.5,],
            'line-opacity': 1,
            "line-dasharray": [1.5, 1.5],
        }
        , minzoom: 12,
        maxzoom: 20
    },

    {
        id: "admin_2024_town",
        'type': 'line',
        source: config.admin_2024_town.name,
        "source-layer": config.admin_2024_town.name,
        layout: {
            visibility: "visible",
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 1,
            'line-color': '#fff',
            // 'line-opacity': 1,
            // "line-opacity": ["interpolate",
            //     ["exponential", 1.5],
            //     ["zoom"],
            //     7,
            //     1,
            //     13,
            //     0.3,
            //     14,
            //     0.2,],

        }
        , minzoom: 11.4,
        maxzoom: 20
    },


    {
        id: "admin_2024_county",
        'type': 'line',
        source: config.admin_2022_county.name,
        "source-layer": config.admin_2022_county.name,
        layout: {
            //  visibility: "visible",
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 1,
            'line-color': '#ccc',

            // "line-opacity": ["interpolate",
            //     ["exponential", 1.5],
            //     ["zoom"],
            //     7,
            //     1,
            //     13,
            //     0.3,
            //     14,
            //     0.2,],
        },
        minzoom: 9,
        maxzoom: 11.4
    },


    {
        id: "admin_2024_province_yghy_outline",
        'type': 'line',
        source: config.admin_2022_province.name,
        "source-layer": config.admin_2022_province.name,
        filter: [
            "in",
            ["to-string", ["get", "first_gid"]],
            '370000',
        ],
        layout: {
            //  visibility: "visible",
            //   "text-optional": true,
            'line-join': 'round', // 设置线条连接处为圆角
            'line-cap': 'round', // 设置线条端点为圆角
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 10,
            'line-color': '#cccccc',

            "line-opacity": 0.7,
        },
    },
    {
        id: "admin_2024_province_yghy",
        'type': 'fill',
        source: config.admin_2022_province.name,
        "source-layer": config.admin_2022_province.name,
        filter: [
            "!=",
            ["to-string", ["get", "first_gid"]],
            '370000',
        ],
        layout: {
            //  visibility: "visible",
            //   "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {

            'fill-color': '#000',

            "fill-opacity": ["interpolate",
                ["exponential", 1.5],
                ["zoom"],
                7,
                0.4,
                13,
                0.2,
                14,
                0.0,],
        },
    },

    // {
    //     id: "world_china_building",
    //     name: "建筑",
    //     type: "fill-extrusion",
    //     source: config.world_china_polygon.name,
    //     "source-layer": config.world_china_polygon.name,
    //     minzoom: 15,
    //     filter: [
    //         "in",
    //         "building",
    //         "yes"
    //     ],
    //     paint: {
    //         "fill-extrusion-height": 30,
    //         "fill-extrusion-color": "#fff",
    //         "fill-extrusion-opacity": 0.6
    //     },
    //     interactive: true,
    // },

    // {
    //     id: "world_china_polygon",
    //     name: "基础地物",
    //     type: "fill",
    //     source: config.world_china_polygon.name,
    //     "source-layer": config.world_china_polygon.name,
    //     minzoom: 10,
    //     // filter: [
    //     //     "in",
    //     //     "naturals",
    //     //     "water"
    //     // ],
    //     paint: {
    //         "fill-color": [
    //             "match",
    //             ["get", "naturals"],
    //             "water", "#7acfef",
    //             "land", "#a2e29c",
    //             "#fff",
    //         ],

    //         //"#7acfef",
    //         "fill-opacity": 1
    //     },
    //     interactive: true,
    // },

    {
        id: "POI_WORLD_1",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            //"0" ,//机场 国外地址
            // "1" //乡
            //"2" //镇
            //"2" //镇
            //   "3", //岛礁 海域
            //  "4", //岛礁 海域
            //"5", //国内内陆岛礁
            //   "6" ,//部分省
            //  "7" //部分市
            //    "10" //部分市
            //  "11" //部分市
            //  "12" //部分市
            //   "13" //部分市
            // "14" //部分市
            // "15" //部分市
            // "16" //部分市
            // "17", // 西沙群岛
            // "105" // 无
            // "106" // 无
            // "107" // 无
            // "108" // 无
            //   "109", // 特别行政区
            // "110", //县级市
            //  "111" ,// 县
            //"112" ,// 区
            // "113" ,// 无
            //  "114" ,// 兴趣市
            // "115" ,// 兴趣市
            // "116", // 二级市
            // "117", //自治州 地区
            // "555", //境界地名




            //    "301",// 无
            "303", // 国家名称
            // "302",// 无
            // "304",
            //  "305",// 国内省 直辖市
            "300", // 中华人民共和国

        ],
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            // "text-padding": 10,
            "text-padding": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                2,
                5,
                5,
                10,
                16,
                20,
            ],
            "text-field": "{name_chn}",
            "text-size": 16,

        },
        'slot': 'middle',
        paint: {
            "text-halo-color": "#ccc",
            "text-color": "RGBA(255,255,255,1)",
            'text-halo-width': 1.2
        },
        minzoom: 1,
        maxzoom: 3.99,

    },
    {
        id: "POI_WORLD_2",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            //"0" ,//机场 国外地址
            // "1" //乡
            //"2" //镇
            //"2" //镇
            //   "3", //岛礁 海域
            //  "4", //岛礁 海域
            //"5", //国内内陆岛礁
            //   "6" ,//部分省
            //  "7" //部分市
            //    "10" //部分市
            //  "11" //部分市
            //  "12" //部分市
            //   "13" //部分市
            // "14" //部分市
            // "15" //部分市
            // "16" //部分市
            // "17", // 西沙群岛
            // "105" // 无
            // "106" // 无
            // "107" // 无
            // "108" // 无
            //   "109", // 特别行政区
            // "110", //县级市
            //  "111" ,// 县
            //"112" ,// 区
            // "113" ,// 无
            //  "114" ,// 兴趣市
            // "115" ,// 兴趣市
            // "116", // 二级市
            // "117", //自治州 地区
            // "555", //境界地名




            //    "301",// 无
            "303", // 国家名称
            // "302",// 无
            // "304",
            "305",// 国内省 直辖市
            //  "300", // 中华人民共和国

        ],
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            // "text-padding": 10,
            "text-padding": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                2,
                5,
                5,
                10,
                16,
                20,
            ],
            "text-field": "{name_chn}",
            "text-size": 16,

        },
        paint: {
            "text-color": "rgba(50,42, 42, 1)",
            "text-halo-color": "#ccc",
            'text-halo-width': 2.2
        },
        'slot': 'middle',
        minzoom: 4,
        maxzoom: 5.99,

    },
    {
        id: "POI_WORLD_3",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            //"0" ,//机场 国外地址
            // "1" //乡
            //"2" //镇
            //"2" //镇
            "3", //岛礁 海域
            "4", //岛礁 海域
            //"5", //国内内陆岛礁
            //   "6" ,//部分省
            "7",//部分市
            //    "10" //部分市
            "11",//部分市
            "12", //部分市
            "13", //部分市
            "14", //部分市
            "15", //部分市
            "16", //部分市
            "17", // 西沙群岛
            // "105" // 无
            // "106" // 无
            // "107" // 无
            // "108" // 无
            "109", // 特别行政区
            // "110", //县级市
            //  "111" ,// 县
            //"112" ,// 区
            // "113" ,// 无
            //   "114" ,// 兴趣市
            //  "115" ,// 兴趣市
            "116", // 二级市
            "117", //自治州 地区
            "555", //境界地名




            //    "301",// 无
            "303", // 国家名称
            // "302",// 无
            // "304",
            "305",// 国内省 直辖市
            //  "300", // 中华人民共和国

        ],
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            //  "text-padding": 10,
            "text-padding": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                2,
                5,
                5,
                10,
                16,
                20,
            ],
            "text-field": "{name_chn}",
            "text-size": [
                "match",
                ["get", "priority"],
                "117", 18,
                16,
            ],

        },
        paint: {
            "text-color": [
                "match",
                ["get", "priority"],
                "117",
                "RGBA(255,255,255,1)",
                "RGBA(50,42, 42, 1)",

            ],
            "text-halo-color": [
                "match",
                ["get", "priority"],
                "117", "RGBA(50,42, 42, 1)",
                "RGBA(255,255,255,1)"
            ],
            //  'text-width': 6.0,
            'text-halo-width': 2.0
        },
        'slot': 'middle',
        minzoom: 6,
        maxzoom: 8.99,

    },
    {
        id: "POI_WORLD_4",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            "0",//机场 国外地址
            // "1" //乡
            //"2" //镇
            //"2" //镇
            "3", //岛礁 海域
            "4", //岛礁 海域
            "5", //国内内陆岛礁
            //   "6" ,//部分省
            "7",//部分市
            //    "10" //部分市
            "11",//部分市
            "12", //部分市
            "13", //部分市
            "14", //部分市
            "15", //部分市
            "16", //部分市
            "17", // 西沙群岛
            // "105" // 无
            // "106" // 无
            // "107" // 无
            // "108" // 无
            "109", // 特别行政区
            "110", //县级市
            "111",// 县
            //"112" ,// 区
            // "113" ,// 无
            //   "114" ,// 兴趣市
            //  "115" ,// 兴趣市
            "116", // 二级市
            "117", //自治州 地区
            "555", //境界地名




            //    "301",// 无
            // "303", // 国家名称
            // "302",// 无
            // "304",
            "305",// 国内省 直辖市
            //  "300", // 中华人民共和国

        ],
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            //  "text-padding": 10,
            "text-padding": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                2,
                5,
                5,
                10,
                16,
                20,
            ],
            "text-field": "{name_chn}",
            "text-size": [
                "match",
                ["get", "priority"],
                "117", 20,
                18,
            ],

        },
        paint: {
            "text-color": [
                "match",
                ["get", "priority"],
                "117",
                "RGBA(255,255,255,1)",
                "RGBA(50,42, 42, 1)",

            ],
            "text-halo-color": [
                "match",
                ["get", "priority"],
                "117", "RGBA(50,42, 42, 1)",
                "RGBA(255,255,255,1)"
            ],
            //  'text-width': 6.0,
            'text-halo-width': 2.0
        },
        'slot': 'middle',
        minzoom: 9,
        maxzoom: 10.99,

    },
    {
        id: "POI_WORLD_5",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            "0",//机场 国外地址
            // "1" //乡
            "2", //镇
            "3", //岛礁 海域
            "4", //岛礁 海域
            "5", //国内内陆岛礁
            //   "6" ,//部分省
            "7",//部分市
            "10",//部分市
            "11",//部分市
            "12", //部分市
            "13", //部分市
            "14", //部分市
            "15", //部分市
            "16", //部分市
            "17", // 西沙群岛
            // "105" // 无
            // "106" // 无
            // "107" // 无
            // "108" // 无
            "109", // 特别行政区
            "110", //县级市
            "111",// 县
            "112",// 区
            // "113" ,// 无
            //   "114" ,// 兴趣市
            //  "115" ,// 兴趣市
            "116", // 二级市
            "117", //自治州 地区
            "555", //境界地名




            //    "301",// 无
            // "303", // 国家名称
            // "302",// 无
            // "304",
            // "305",// 国内省 直辖市
            //  "300", // 中华人民共和国

        ],
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            //  "text-padding": 10,
            "text-padding": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                2,
                5,
                5,
                10,
                16,
                20,
            ],
            "text-field": "{name_chn}",
            "text-size": [
                "match",
                ["get", "priority"],
                "117", 16,
                15,
            ],

        },
        'slot': 'middle',
        paint: {
            "text-color": [
                "match",
                ["get", "priority"],
                "117",
                "RGBA(255,255,255,1)",
                "RGBA(50,42, 42, 1)",

            ],
            "text-halo-color": [
                "match",
                ["get", "priority"],
                "117", "RGBA(50,42, 42, 1)",
                "RGBA(255,255,255,1)"
            ],

            'text-halo-width': 1.0
        },
        minzoom: 10,
        maxzoom: 13,

    },
    {
        id: "POI_WORLD_6",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            "0",//机场 国外地址
            "1",//乡
            "2", //镇
            "3", //岛礁 海域
            "4", //岛礁 海域
            "5", //国内内陆岛礁
            //   "6" ,//部分省
            "7",//部分市
            "10",//部分市
            "11",//部分市
            "12", //部分市
            "13", //部分市
            "14", //部分市
            "15", //部分市
            "16", //部分市
            "17", // 西沙群岛
            // "105" // 无
            // "106" // 无
            // "107" // 无
            // "108" // 无
            "109", // 特别行政区
            "110", //县级市
            "111",// 县
            "112",// 区
            // "113" ,// 无
            "114",// 兴趣市
            "115",// 兴趣市
            "116", // 二级市
            "117", //自治州 地区
            "555", //境界地名




            //    "301",// 无
            // "303", // 国家名称
            // "302",// 无
            // "304",
            // "305",// 国内省 直辖市
            //  "300", // 中华人民共和国

        ],
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            //  "text-padding": 10,
            // "text-padding": [
            //     "interpolate",
            //     ["exponential", 1.5],
            //     ["zoom"],
            //     2,
            //     5,
            //     5,
            //     10,
            //     16,
            //     20,
            // ],
            "text-field": "{name_chn}",
            "text-size": [
                "match",
                ["get", "priority"],
                "117", 16,
                16,
            ],

        },
        paint: {
            "text-color": [
                "match",
                ["get", "priority"],
                "117",
                "RGBA(255,255,255,1)",
                "RGBA(50,42, 42, 1)",

            ],
            "text-halo-color": [
                "match",
                ["get", "priority"],
                "117", "RGBA(50,42, 42, 1)",
                "RGBA(255,255,255,1)"
            ],
            'text-halo-width': 1.2
        },
        'slot': 'middle',
        minzoom: 13,

    },

    {
        id: "rskm_pt",
        name: "保单地块",
        "type": "fill",
        source: config.rskm_pt.name,
        "source-layer": config.rskm_pt.name,
        minzoom: 4.4,

        'slot': 'top',
        "paint": {
            //  "fill-color":
            //     [">", ["index-of", "小麦","i_type_name" ], -1],
            'fill-color': [
                'case',
                [">", ["index-of", "小麦", ['get', "i_type_name"]], -1],
                'RGB(248,200,94)',
                'RGB(158,224,132)'
            ],
            //  "fill-color": [
            //     'case',
            //     ['boolean',['feature-state','hover'],false],
            //     "blue",
            //     "yellow"
            //  ],
            // "fill-outline-color": "#000",
            //  "fill-opacity":0.4,
            "fill-opacity": ["interpolate",
                ["exponential", 1.5],
                ["zoom"],
                3,
                1,
                7,
                0.7,
                13,
                0.6,
                14,
                0.4, 17,
                0.2,],
        },
        interactive: true,
    },
    {
        id: "rskm_pt_outline",
        name: "保单地块外框",
        type: "line",
        source: config.rskm_pt.name,
        "source-layer": config.rskm_pt.name,
        layout: {
            "line-join": "round",
            "line-cap": "round",
        },
        'slot': 'top',
        "paint": {
            // 'line-blur':0.5,
            // 'line-color': 'RGBA(213,217,41,0.7)',
            'line-color': [
                'case',
                [">", ["index-of", "小麦", ['get', "i_type_name"]], -1], // 检查属性值是否大于 80

                'RGB(248,200,94)',
                'RGB(158,224,132)'
            ],
            //  'line-width': 4,
            'line-width': ["interpolate",
                ["exponential", 1.5],
                ["zoom"],
                9,
                0,
                10,
                0,
                13,
                2.0,
                14,
                2.5,],
            "line-opacity": ["interpolate",
                ["exponential", 1.5],
                ["zoom"],
                7,
                0.5,
                14,
                0.7,
                15,
                1,],
        },
        interactive: true,
    },



    {
        id: "Highlight_DK_Line",
        name: "保单地块高亮",
        type: "fill",
        source: config.rskm_pt.name,
        "source-layer": config.rskm_pt.name,
        minzoom: 10,
        //     maxzoom: 18,
        layout: {
            visibility: "none",
        },
        "paint": {
            'fill-color': 'red',
            // 'line-width': 2,
            'fill-opacity': 0.4,
            //    "line-dasharray": [0.8, 0.2]
        },
        'slot': 'top',
        interactive: true,
    },

    {
        id: "Highlight_DK_Line_Click",
        name: "点击高亮",
        type: "fill",
        source: config.rskm_pt.name,
        "source-layer": config.rskm_pt.name,
        minzoom: 10,
        layout: {
            visibility: "none",
        },
        "paint": {
            'fill-color': 'green',
            // 'line-width': 2,
            'fill-opacity': 0.4,
        },
        'slot': 'top',
        interactive: true,
    },

    {
        id: "rskm_pt_name",
        type: "symbol",
        source: config.rskm_pt.name,
        "source-layer": config.rskm_pt.name,
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            // "text-optional": true, \n{r}{t}\n{quxian}{cun}
            // "text-padding": 50,
            "text-field": "{insured}",
            "text-size": 13,

        },
        'slot': 'top',
        paint: {
            "text-color": "#000", // 文字颜色
            //   "text-halo-color": "yellow", // 文字轮廓颜色
            'text-halo-color': [
                'case',
                [">", ["index-of", "小麦", ['get', "i_type_name"]], -1], // 检查属性值是否大于 80
                'RGB(248,200,94)',
                'RGB(158,224,132)'
            ],
            "text-halo-width": 1.4, // 文字轮廓宽度
            "text-halo-blur": 0.5, // 文字轮廓模糊度
        },
        minzoom: 12,
        maxzoom: 14.55,
    },
    {
        id: "rskm_pt_name_1",
        type: "symbol",
        source: config.rskm_pt.name,
        "source-layer": config.rskm_pt.name,
        layout: {
            "symbol-avoid-edges": true,
            "icon-rotation-alignment": "viewport",
            "text-pitch-alignment": "viewport",
            visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            // "text-optional": true, \n{r}{t}\n{quxian}{cun}
            // "text-padding": 50,
            "text-field": "{insured}\n{area_mu}\n{i_com_name}",
            "text-size": 14,

        },
        'slot': 'top',
        paint: {
            "text-color": "#000", // 文字颜色
            //  "text-halo-color": "yellow", // 文字轮廓颜色
            'text-halo-color': [
                'case',
                [">", ["index-of", "小麦", ['get', "i_type_name"]], -1], // 检查属性值是否大于 80
                'RGB(248,200,94)',
                'RGB(158,224,132)'
            ],
            "text-halo-width": 1.5, // 文字轮廓宽度
            "text-halo-blur": 0.5, // 文字轮廓模糊度
        },
        minzoom: 14.56,
    },
    {
        id: "admin_2024_village_name",
        type: "symbol",
        source: config.admin_2024_village.name,
        "source-layer": config.admin_2024_village.name,
        layout: {
            //    "symbol-avoid-edges": true,
            //    "icon-rotation-alignment": "viewport",
            //   "text-pitch-alignment": "viewport",
            //   visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            //  "text-padding": 200,
            "text-field": "{name}",
            "text-size": 14,
            "icon-image": "500", // 引用精灵图中的图标
            "icon-size": 1,// 根据需要调整图标大小
            //  "icon-anchored": "bottom", // 设置图标的锚点位置
            // "icon-offset": [0, 15], // 设置图标相对于锚点的偏移量，单位为像素
            "text-anchor": "top", // 设置文字的锚点位置
            "text-offset": [0, -1.8], // 设置文字相对于图标的偏移量

        },
        paint: {
            "text-color": "#000",
            "text-halo-color": "#fff",
            'text-halo-width': 1.5
        },
        'slot': 'bottom',
        minzoom: 14,
    },


]




export { layers, spec }