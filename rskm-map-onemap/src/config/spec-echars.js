import Google from "@/assets/images/map/Google.jpg";
import JL from "@/assets/images/map/JL.jpg";
import MB from "@/assets/images/map/MB.jpg";
import ZKXT_2 from "@/assets/images/map/ZKXT_2.jpg";
import ZKXT_1 from "@/assets/images/map/ZKXT_1.jpg";
import TDT_2 from "@/assets/images/map/TDT_2.jpg";
import TDT_1 from "@/assets/images/map/TDT_1.jpg";
import ESRI from "@/assets/images/map/ESRI.jpg";
import StateManager from "@/utils/state_manager";
import { config } from "@/config/tileserver-echars.js";


let layers = [
    {
        id: 24,
        name: "Google-影像",
        projection: true,
        st: "",
        url: Google,
        zj: false,
        key: "",
        param: [["google", "Google.Satellite.Map"]],
        isShow: true,
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

    {
        id: 12,
        name: "天地图-标准",
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
        param: [["xinqiu", "Geovisearth.Satellite.Map"]],
    },
    {
        id: 18,
        name: "中科星图-标准",
        st: "GS(2023)1924号",
        projection: true,
        url: ZKXT_2,
        zj: true,
        key: "0a4f0eda380b7d267046c9c385e423580079e75fa7384905b53b332bf147794c",//44194e4bbd714ee9cd453c7ff3e5635b56bc9d61b26946f7631c69fa96d91e60
        param: [["xinqiu1", "Geovisearth.Normal.Map"]],
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
        name: "自定义-底图",
        projection: true,
        st: "",
        url: "",
        zj: true,
        param: [["bing", ""]],
        key: "",
    },
]


let isShowLayer = StateManager.get("MAP_LAYERS") || { id: '' };
layers.forEach(layer => {
    layer.isShow = (isShowLayer.id == layer.id ? true : false);
});


/**
 * 
 */
let specEchars = [

    {
        id: "admin_2022_province_fill",
        'type': 'fill',
        source: config.admin_2022_province.name,
        "source-layer": config.admin_2022_province.name,
        layout: {
            visibility: "visible",
        },
        'slot': 'bottom',
        'paint': {
            'fill-color': '#fff',
            "fill-opacity": 0.4,
            'fill-outline-color': 'rgba(0,0,0,0)'
        },
        minzoom: 2,
        maxzoom: 6
    },



    {
        id: "admin_2022_city_fill",
        'type': 'fill',
        source: config.admin_2022_city.name,
        "source-layer": config.admin_2022_city.name,
        layout: {
            visibility: "visible",
            "text-optional": true,
        },
        filter: [
            "in",
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        'slot': 'bottom',
        'paint': {
            'fill-color': '#fff',
            "fill-opacity": 0.4,
            'fill-outline-color': 'rgba(0,0,0,0)'

        },
        minzoom: 6,
        maxzoom: 8.5

    },






    {
        id: "admin_2024_county_fill",
        'type': 'fill',
        source: config.admin_2022_county.name,
        "source-layer": config.admin_2022_county.name,
        filter: [
            "in",
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        layout: {
            // visibility: "none",
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {

            'fill-color': '#fff',
            "fill-opacity": 0.4,
            'fill-outline-color': 'rgba(0,0,0,0)'
        },
        minzoom: 8.5,
        maxzoom: 10
    },






    {
        id: "china_wgs84_town_fill",
        'type': 'fill',
        source: config.china_wgs84_town.name,
        "source-layer": config.china_wgs84_town.name,

        layout: {
            // visibility: "none",
            //  "text-optional": true,
        },
        //  'slot': 'bottom',
        'paint': {

            'fill-color': '#fff',
            "fill-opacity": 0.4,
            'fill-outline-color': 'rgba(0,0,0,0)'
        }, minzoom: 10,
        maxzoom: 12
    },




    // {
    //     id: "china_wgs84_cun_fill",
    //     'type': 'fill',
    //     source: config.china_wgs84_all.name,
    //     "source-layer": config.china_wgs84_all.name,

    //     layout: {
    //         // visibility: "none",
    //         "text-optional": true,
    //     },
    //     'slot': 'bottom',
    //     'paint': {
    //         'fill-color': '#fff',
    //         "fill-opacity": 0.4,
    //         'fill-outline-color': 'rgba(0,0,0,0)'
    //     }, minzoom: 12,

    // },


    {
        id: "Highlight_DK_Line_Province",
        name: "",
        type: "fill",
        source: config.admin_2022_province.name,
        "source-layer": config.admin_2022_province.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none"
        },
        "paint": {
            'fill-color': 'red',
            'fill-opacity': 0.3,
        },
        'slot': 'top',
        interactive: true,
        maxzoom: 6
    },
    {
        id: "Highlight_DK_Line_City",

        type: "fill",
        source: config.admin_2022_city.name,
        "source-layer": config.admin_2022_city.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none", "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'fill-color': 'red',
            'fill-opacity': 0.3,
        },
        'slot': 'top',
        interactive: true,
        maxzoom: 8.5
    },

    {
        id: "Highlight_DK_Line_County",

        type: "fill",
        source: config.admin_2022_county.name,
        "source-layer": config.admin_2022_county.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none", "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'fill-color': 'red',
            'fill-opacity': 0.3,
        },
        'slot': 'top',
        interactive: true,
    },

    {
        id: "Highlight_DK_Line_Town",
        name: "",
        type: "fill",
        source: config.china_wgs84_town.name,
        "source-layer": config.china_wgs84_town.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none", "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'fill-color': 'red',
            'fill-opacity': 0.3,
        },
        'slot': 'top',
        interactive: true,
    },


    // {
    //     id: "Highlight_DK_Line_Cun",
    //     name: "",
    //     type: "fill",
    //     source: config.china_wgs84_all.name,
    //     "source-layer": config.china_wgs84_all.name,

    //     //     maxzoom: 18,
    //     layout: {
    //         visibility: "none",
    //         "line-join": "round",
    //         "line-cap": "round",
    //     },
    //     "paint": {
    //         'fill-color': 'red',
    //         'fill-opacity': 0.3,
    //     },
    //     'slot': 'top',
    //     interactive: true,
    // },



    // 线条
    // {
    //     id: "china_wgs84_cun",
    //     'type': 'line',
    //     source: config.china_wgs84_all.name,
    //     "source-layer": config.china_wgs84_all.name,
    //     layout: {
    //         visibility: "visible",
    //         //     "text-optional": true,
    //     },
    //     'slot': 'bottom',
    //     'paint': {
    //         'line-width': 2,
    //         'line-color': '#000',
    //         'line-opacity': 0.5,
    //     }
    //     , minzoom: 12,
    //     //  maxzoom: 20
    // },
    {
        id: "china_wgs84_town",
        'type': 'line',
        source: config.china_wgs84_town.name,
        "source-layer": config.china_wgs84_town.name,
        layout: {
            visibility: "visible",
            //     "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 2,
            'line-color': '#000',
            'line-opacity': 0.5,

        }
        , minzoom: 10,
        maxzoom: 12
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
        filter: [
            "in",
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        'slot': 'bottom',
        'paint': {
            'line-width': 2,
            'line-color': '#000',
            'line-opacity': 0.5,
        },
        minzoom: 8.5,
        maxzoom: 10
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
        filter: [
            "==",
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        'slot': 'bottom',
        'paint': {
            'line-width': 2,
            'line-color': '#000',
            'line-opacity': 0.5,
        },
        minzoom: 6,
        maxzoom: 8.5
    },
    {
        id: "admin_2022_province",
        'type': 'line',
        source: config.admin_2022_province.name,
        "source-layer": config.admin_2022_province.name,
        layout: {
            visibility: "visible",
            "text-optional": true,
        },
        // filter: [
        //     "==",
        //     ["to-string", ["get", "province_code"]],
        //     '370000',
        // ],
        'slot': 'bottom',
        'paint': {
            'line-width': 2.5,
            'line-color': 'rgba(10,10,10,1)',
            'line-opacity': 0.4,
        },
        minzoom: 2,
        maxzoom: 6
    },


    {
        id: "admin_2022_city_text",
        type: "symbol",
        source: config.admin_2022_city.name,
        "source-layer": config.admin_2022_city.name,
        filter: [
            "==",
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        layout: {
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            "text-padding": 40,
            "text-field": "{name}",
            "text-size": 20,
        },
        paint: {
            "text-halo-color": "#000",
            "text-color": "#fff",
            'text-halo-width': 2.5
        },
        //       'slot': 'bottom',
        minzoom: 6,
        maxzoom: 8.5
    },

    {
        id: "admin_2022_county_text",
        type: "symbol",
        source: config.admin_2022_county.name,
        "source-layer": config.admin_2022_county.name,
        filter: [
            "==",
            ["get", "province_code"],
            370000,
        ],
        layout: {
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            "text-padding": 40,
            "text-field": "{name}",
            "text-size": 19,
        },
        paint: {
            "text-halo-color": "#000",
            "text-color": "RGBA(255,255,255,1)",
            'text-halo-width': 2.5
        },
        //       'slot': 'bottom',
        minzoom: 8.51,
        maxzoom: 10
    },

    {
        id: "china_wgs84_town_text",
        type: "symbol",
        source: config.china_wgs84_town.name,
        "source-layer": config.china_wgs84_town.name,
        filter: [
            "==",
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        layout: {
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            "text-padding": 40,
            "text-field": "{town_name}",
            "text-size": 18,
        },
        paint: {
            "text-halo-color": "#000",
            "text-color": "RGBA(255,255,255,1)",
            'text-halo-width': 2.5
        },
        minzoom: 10,
        maxzoom: 12
    },
    // {
    //     id: "china_wgs84_cun_text",
    //     type: "symbol",
    //     source: config.china_wgs84_all.name,
    //     "source-layer": config.china_wgs84_all.name,
    //     filter: [
    //         "==",
    //         ["to-string", ["get", "province_code"]],
    //         '370000',
    //     ],
    //     layout: {
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         "text-padding": 30,
    //         "text-field": "{name}",
    //         "text-size": 16,

    //     },
    //     paint: {
    //         "text-halo-color": "#000",
    //         "text-color": "RGBA(255,255,255,1)",
    //         'text-halo-width': 2.5
    //     },
    //     //       'slot': 'bottom',
    //     minzoom: 12
    // },

    {
        id: "POI_WORLD_1",
        type: "symbol",
        source: config.wpoi.name,
        "source-layer": config.wpoi.name,
        filter: [
            "in",
            "priority",
            //     "303", // 国家名称
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
            "text-size": 22,
        },
        'slot': 'middle',
        paint: {
            "text-halo-color": "#000",
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
            //   "303", // 国家名称
            "305",// 国内省 直辖市

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
            "text-size": 20,

        },
        paint: {
            "text-halo-color": "#000",
            "text-color": "RGBA(255,255,255,1)",
            'text-halo-width': 1.5
        },
        'slot': 'middle',
        minzoom: 4,
        maxzoom: 5.99,

    },



]










export { layers, specEchars }