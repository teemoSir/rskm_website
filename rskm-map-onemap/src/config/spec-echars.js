
import { config } from "@/config/tileserver-echars.js";


/**
 * 
 */
let specEchars = [
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
            'line-width': 1,
            'line-color': '#ccc',
            'line-opacity': 0.8
        },
        minzoom: 2,


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

            'fill-color': 'RGB(130,170,253)',
            "fill-opacity": 0.8,

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

            'fill-color': 'RGB(130,170,253)',
            "fill-opacity": 0.8
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
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {

            'fill-color': 'RGB(130,170,253)',
            "fill-opacity": 0.8
        }, minzoom: 10,
        maxzoom: 12
    },




    {
        id: "china_wgs84_cun_fill",
        'type': 'fill',
        source: config.china_wgs84_all.name,
        "source-layer": config.china_wgs84_all.name,

        layout: {
            // visibility: "none",
            "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'fill-color': 'RGB(130,170,253)',
            "fill-opacity": 0.8
        }, minzoom: 12.05,
        maxzoom: 20
    },

    // 线条
    {
        id: "china_wgs84_cun",
        'type': 'line',
        source: config.china_wgs84_all.name,
        "source-layer": config.china_wgs84_all.name,
        layout: {
            visibility: "visible",
            //     "text-optional": true,
        },
        'slot': 'bottom',
        'paint': {
            'line-width': 4.4,
            'line-color': '#3ba272',
        }
        , minzoom: 12.05,
        //  maxzoom: 20
    },
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
            'line-width': 4.4,
            'line-color': '#5470c6',

        }
        , minzoom: 10,
        // maxzoom: 12
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
            'line-width': 4.4,
            'line-color': '#ee6666',
        },
        minzoom: 8.5,
        // maxzoom: 10
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
            'line-width': 1.4,
            'line-color': '#fff',
        },
        minzoom: 6,
        //  maxzoom: 8.5

    },


    // {
    //     id: "POI_WORLD_1",
    //     type: "symbol",
    //     source: config.wpoi.name,
    //     "source-layer": config.wpoi.name,
    //     filter: [
    //         "in",
    //         "priority",
    //         //"0" ,//机场 国外地址
    //         // "1" //乡
    //         //"2" //镇
    //         //"2" //镇
    //         //   "3", //岛礁 海域
    //         //  "4", //岛礁 海域
    //         //"5", //国内内陆岛礁
    //         //   "6" ,//部分省
    //         //  "7" //部分市
    //         //    "10" //部分市
    //         //  "11" //部分市
    //         //  "12" //部分市
    //         //   "13" //部分市
    //         // "14" //部分市
    //         // "15" //部分市
    //         // "16" //部分市
    //         // "17", // 西沙群岛
    //         // "105" // 无
    //         // "106" // 无
    //         // "107" // 无
    //         // "108" // 无
    //         //   "109", // 特别行政区
    //         // "110", //县级市
    //         //  "111" ,// 县
    //         //"112" ,// 区
    //         // "113" ,// 无
    //         //  "114" ,// 兴趣市
    //         // "115" ,// 兴趣市
    //         // "116", // 二级市
    //         // "117", //自治州 地区
    //         // "555", //境界地名




    //         //    "301",// 无
    //         "303", // 国家名称
    //         // "302",// 无
    //         // "304",
    //         //  "305",// 国内省 直辖市
    //         "300", // 中华人民共和国

    //     ],
    //     layout: {
    //         "symbol-avoid-edges": true,
    //         "icon-rotation-alignment": "viewport",
    //         "text-pitch-alignment": "viewport",
    //         visibility: "visible",
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         // "text-padding": 10,
    //         "text-padding": [
    //             "interpolate",
    //             ["exponential", 1.5],
    //             ["zoom"],
    //             2,
    //             5,
    //             5,
    //             10,
    //             16,
    //             20,
    //         ],
    //         "text-field": "{name_chn}",
    //         "text-size": 16,

    //     },
    //     'slot': 'middle',
    //     paint: {
    //         "text-halo-color": "#ccc",
    //         "text-color": "RGBA(255,255,255,1)",
    //         'text-halo-width': 1.2
    //     },
    //     minzoom: 1,
    //     maxzoom: 3.99,

    // },
    // {
    //     id: "POI_WORLD_2",
    //     type: "symbol",
    //     source: config.wpoi.name,
    //     "source-layer": config.wpoi.name,
    //     filter: [
    //         "in",
    //         "priority",
    //         //"0" ,//机场 国外地址
    //         // "1" //乡
    //         //"2" //镇
    //         //"2" //镇
    //         //   "3", //岛礁 海域
    //         //  "4", //岛礁 海域
    //         //"5", //国内内陆岛礁
    //         //   "6" ,//部分省
    //         //  "7" //部分市
    //         //    "10" //部分市
    //         //  "11" //部分市
    //         //  "12" //部分市
    //         //   "13" //部分市
    //         // "14" //部分市
    //         // "15" //部分市
    //         // "16" //部分市
    //         // "17", // 西沙群岛
    //         // "105" // 无
    //         // "106" // 无
    //         // "107" // 无
    //         // "108" // 无
    //         //   "109", // 特别行政区
    //         // "110", //县级市
    //         //  "111" ,// 县
    //         //"112" ,// 区
    //         // "113" ,// 无
    //         //  "114" ,// 兴趣市
    //         // "115" ,// 兴趣市
    //         // "116", // 二级市
    //         // "117", //自治州 地区
    //         // "555", //境界地名




    //         //    "301",// 无
    //         "303", // 国家名称
    //         // "302",// 无
    //         // "304",
    //         "305",// 国内省 直辖市
    //         //  "300", // 中华人民共和国

    //     ],
    //     layout: {
    //         "symbol-avoid-edges": true,
    //         "icon-rotation-alignment": "viewport",
    //         "text-pitch-alignment": "viewport",
    //         visibility: "visible",
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         // "text-padding": 10,
    //         "text-padding": [
    //             "interpolate",
    //             ["exponential", 1.5],
    //             ["zoom"],
    //             2,
    //             5,
    //             5,
    //             10,
    //             16,
    //             20,
    //         ],
    //         "text-field": "{name_chn}",
    //         "text-size": 16,

    //     },
    //     paint: {
    //         "text-color": "rgba(50,42, 42, 1)",
    //         "text-halo-color": "#ccc",
    //         'text-halo-width': 2.2
    //     },
    //     'slot': 'middle',
    //     minzoom: 4,
    //     maxzoom: 5.99,

    // },
    // {
    //     id: "POI_WORLD_3",
    //     type: "symbol",
    //     source: config.wpoi.name,
    //     "source-layer": config.wpoi.name,
    //     filter: [
    //         "in",
    //         "priority",
    //         //"0" ,//机场 国外地址
    //         // "1" //乡
    //         //"2" //镇
    //         //"2" //镇
    //         "3", //岛礁 海域
    //         "4", //岛礁 海域
    //         //"5", //国内内陆岛礁
    //         //   "6" ,//部分省
    //         "7",//部分市
    //         //    "10" //部分市
    //         "11",//部分市
    //         "12", //部分市
    //         "13", //部分市
    //         "14", //部分市
    //         "15", //部分市
    //         "16", //部分市
    //         "17", // 西沙群岛
    //         // "105" // 无
    //         // "106" // 无
    //         // "107" // 无
    //         // "108" // 无
    //         "109", // 特别行政区
    //         // "110", //县级市
    //         //  "111" ,// 县
    //         //"112" ,// 区
    //         // "113" ,// 无
    //         //   "114" ,// 兴趣市
    //         //  "115" ,// 兴趣市
    //         "116", // 二级市
    //         "117", //自治州 地区
    //         "555", //境界地名




    //         //    "301",// 无
    //         "303", // 国家名称
    //         // "302",// 无
    //         // "304",
    //         "305",// 国内省 直辖市
    //         //  "300", // 中华人民共和国

    //     ],
    //     layout: {
    //         "symbol-avoid-edges": true,
    //         "icon-rotation-alignment": "viewport",
    //         "text-pitch-alignment": "viewport",
    //         visibility: "visible",
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         //  "text-padding": 10,
    //         "text-padding": [
    //             "interpolate",
    //             ["exponential", 1.5],
    //             ["zoom"],
    //             2,
    //             5,
    //             5,
    //             10,
    //             16,
    //             20,
    //         ],
    //         "text-field": "{name_chn}",
    //         "text-size": [
    //             "match",
    //             ["get", "priority"],
    //             "117", 18,
    //             16,
    //         ],

    //     },
    //     paint: {
    //         "text-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117",
    //             "RGBA(255,255,255,1)",
    //             "RGBA(50,42, 42, 1)",

    //         ],
    //         "text-halo-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117", "RGBA(50,42, 42, 1)",
    //             "RGBA(255,255,255,1)"
    //         ],
    //         //  'text-width': 6.0,
    //         'text-halo-width': 2.0
    //     },
    //     'slot': 'middle',
    //     minzoom: 6,
    //     maxzoom: 8.99,

    // },
    // {
    //     id: "POI_WORLD_4",
    //     type: "symbol",
    //     source: config.wpoi.name,
    //     "source-layer": config.wpoi.name,
    //     filter: [
    //         "in",
    //         "priority",
    //         "0",//机场 国外地址
    //         // "1" //乡
    //         //"2" //镇
    //         //"2" //镇
    //         "3", //岛礁 海域
    //         "4", //岛礁 海域
    //         "5", //国内内陆岛礁
    //         //   "6" ,//部分省
    //         "7",//部分市
    //         //    "10" //部分市
    //         "11",//部分市
    //         "12", //部分市
    //         "13", //部分市
    //         "14", //部分市
    //         "15", //部分市
    //         "16", //部分市
    //         "17", // 西沙群岛
    //         // "105" // 无
    //         // "106" // 无
    //         // "107" // 无
    //         // "108" // 无
    //         "109", // 特别行政区
    //         "110", //县级市
    //         "111",// 县
    //         //"112" ,// 区
    //         // "113" ,// 无
    //         //   "114" ,// 兴趣市
    //         //  "115" ,// 兴趣市
    //         "116", // 二级市
    //         "117", //自治州 地区
    //         "555", //境界地名




    //         //    "301",// 无
    //         // "303", // 国家名称
    //         // "302",// 无
    //         // "304",
    //         "305",// 国内省 直辖市
    //         //  "300", // 中华人民共和国

    //     ],
    //     layout: {
    //         "symbol-avoid-edges": true,
    //         "icon-rotation-alignment": "viewport",
    //         "text-pitch-alignment": "viewport",
    //         visibility: "visible",
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         //  "text-padding": 10,
    //         "text-padding": [
    //             "interpolate",
    //             ["exponential", 1.5],
    //             ["zoom"],
    //             2,
    //             5,
    //             5,
    //             10,
    //             16,
    //             20,
    //         ],
    //         "text-field": "{name_chn}",
    //         "text-size": [
    //             "match",
    //             ["get", "priority"],
    //             "117", 20,
    //             18,
    //         ],

    //     },
    //     paint: {
    //         "text-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117",
    //             "RGBA(255,255,255,1)",
    //             "RGBA(50,42, 42, 1)",

    //         ],
    //         "text-halo-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117", "RGBA(50,42, 42, 1)",
    //             "RGBA(255,255,255,1)"
    //         ],
    //         //  'text-width': 6.0,
    //         'text-halo-width': 2.0
    //     },
    //     'slot': 'middle',
    //     minzoom: 9,
    //     maxzoom: 10.99,

    // },
    // {
    //     id: "POI_WORLD_5",
    //     type: "symbol",
    //     source: config.wpoi.name,
    //     "source-layer": config.wpoi.name,
    //     filter: [
    //         "in",
    //         "priority",
    //         "0",//机场 国外地址
    //         // "1" //乡
    //         "2", //镇
    //         "3", //岛礁 海域
    //         "4", //岛礁 海域
    //         "5", //国内内陆岛礁
    //         //   "6" ,//部分省
    //         "7",//部分市
    //         "10",//部分市
    //         "11",//部分市
    //         "12", //部分市
    //         "13", //部分市
    //         "14", //部分市
    //         "15", //部分市
    //         "16", //部分市
    //         "17", // 西沙群岛
    //         // "105" // 无
    //         // "106" // 无
    //         // "107" // 无
    //         // "108" // 无
    //         "109", // 特别行政区
    //         "110", //县级市
    //         "111",// 县
    //         "112",// 区
    //         // "113" ,// 无
    //         //   "114" ,// 兴趣市
    //         //  "115" ,// 兴趣市
    //         "116", // 二级市
    //         "117", //自治州 地区
    //         "555", //境界地名




    //         //    "301",// 无
    //         // "303", // 国家名称
    //         // "302",// 无
    //         // "304",
    //         // "305",// 国内省 直辖市
    //         //  "300", // 中华人民共和国

    //     ],
    //     layout: {
    //         "symbol-avoid-edges": true,
    //         "icon-rotation-alignment": "viewport",
    //         "text-pitch-alignment": "viewport",
    //         visibility: "visible",
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         //  "text-padding": 10,
    //         "text-padding": [
    //             "interpolate",
    //             ["exponential", 1.5],
    //             ["zoom"],
    //             2,
    //             5,
    //             5,
    //             10,
    //             16,
    //             20,
    //         ],
    //         "text-field": "{name_chn}",
    //         "text-size": [
    //             "match",
    //             ["get", "priority"],
    //             "117", 16,
    //             15,
    //         ],

    //     },
    //     'slot': 'middle',
    //     paint: {
    //         "text-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117",
    //             "RGBA(255,255,255,1)",
    //             "RGBA(50,42, 42, 1)",

    //         ],
    //         "text-halo-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117", "RGBA(50,42, 42, 1)",
    //             "RGBA(255,255,255,1)"
    //         ],

    //         'text-halo-width': 1.0
    //     },
    //     minzoom: 10,
    //     maxzoom: 13,

    // },
    // {
    //     id: "POI_WORLD_6",
    //     type: "symbol",
    //     source: config.wpoi.name,
    //     "source-layer": config.wpoi.name,
    //     filter: [
    //         "in",
    //         "priority",
    //         "0",//机场 国外地址
    //         "1",//乡
    //         "2", //镇
    //         "3", //岛礁 海域
    //         "4", //岛礁 海域
    //         "5", //国内内陆岛礁
    //         //   "6" ,//部分省
    //         "7",//部分市
    //         "10",//部分市
    //         "11",//部分市
    //         "12", //部分市
    //         "13", //部分市
    //         "14", //部分市
    //         "15", //部分市
    //         "16", //部分市
    //         "17", // 西沙群岛
    //         // "105" // 无
    //         // "106" // 无
    //         // "107" // 无
    //         // "108" // 无
    //         "109", // 特别行政区
    //         "110", //县级市
    //         "111",// 县
    //         "112",// 区
    //         // "113" ,// 无
    //         "114",// 兴趣市
    //         "115",// 兴趣市
    //         "116", // 二级市
    //         "117", //自治州 地区
    //         "555", //境界地名




    //         //    "301",// 无
    //         // "303", // 国家名称
    //         // "302",// 无
    //         // "304",
    //         // "305",// 国内省 直辖市
    //         //  "300", // 中华人民共和国

    //     ],
    //     layout: {
    //         "symbol-avoid-edges": true,
    //         "icon-rotation-alignment": "viewport",
    //         "text-pitch-alignment": "viewport",
    //         visibility: "visible",
    //         "text-font": ["Microsoft YaHei"],
    //         "text-optional": true,
    //         //  "text-padding": 10,
    //         // "text-padding": [
    //         //     "interpolate",
    //         //     ["exponential", 1.5],
    //         //     ["zoom"],
    //         //     2,
    //         //     5,
    //         //     5,
    //         //     10,
    //         //     16,
    //         //     20,
    //         // ],
    //         "text-field": "{name_chn}",
    //         "text-size": [
    //             "match",
    //             ["get", "priority"],
    //             "117", 16,
    //             16,
    //         ],

    //     },
    //     paint: {
    //         "text-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117",
    //             "RGBA(255,255,255,1)",
    //             "RGBA(50,42, 42, 1)",

    //         ],
    //         "text-halo-color": [
    //             "match",
    //             ["get", "priority"],
    //             "117", "RGBA(50,42, 42, 1)",
    //             "RGBA(255,255,255,1)"
    //         ],
    //         'text-halo-width': 1.2
    //     },
    //     'slot': 'middle',
    //     minzoom: 13,

    // },




    {
        id: "Highlight_DK_Line",
        name: "",
        type: "line",
        source: config.admin_2022_city.name,
        "source-layer": config.admin_2022_city.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none", "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'line-color': '#000',
            'line-width': 3,
            'line-opacity': 0.6,
            //    "line-dasharray": [0.8, 0.2]
        },
        'slot': 'top',
        interactive: true,
    },

    {
        id: "Highlight_DK_Line_County",
        name: "",
        type: "line",
        source: config.admin_2022_county.name,
        "source-layer": config.admin_2022_county.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none", "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'line-color': '#000',
            'line-width': 3,
            'line-opacity': 0.6,
            //    "line-dasharray": [0.8, 0.2]
        },
        'slot': 'top',
        interactive: true,
    },

    {
        id: "Highlight_DK_Line_Town",
        name: "",
        type: "line",
        source: config.china_wgs84_town.name,
        "source-layer": config.china_wgs84_town.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none", "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'line-color': '#000',
            'line-width': 3,
            'line-opacity': 0.6,
            //    "line-dasharray": [0.8, 0.2]
        },
        'slot': 'top',
        interactive: true,
    },


    {
        id: "Highlight_DK_Line_Cun",
        name: "",
        type: "line",
        source: config.china_wgs84_all.name,
        "source-layer": config.china_wgs84_all.name,

        //     maxzoom: 18,
        layout: {
            visibility: "none",
            "line-join": "round",
            "line-cap": "round",
        },
        "paint": {
            'line-color': '#000',
            'line-width': 3,
            'line-opacity': 0.6,
            //    "line-dasharray": [0.8, 0.2]
        },
        'slot': 'top',
        interactive: true,
    },



    // {
    //     id: "Highlight_DK_Line_Click",
    //     name: "点击高亮",
    //     type: "fill",
    //     source: config.procjet_2024_yghy_hz10_county.name,
    //     "source-layer": config.procjet_2024_yghy_hz10_county.name,
    //     minzoom: 10,
    //     layout: {
    //         visibility: "none",
    //     },
    //     "paint": {
    //         'fill-color': '#fff',
    //         // 'line-width': 2,
    //         'fill-opacity': 0.6,
    //     },
    //     'slot': 'top',
    //     interactive: true,
    // },


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
            //    "symbol-avoid-edges": true,
            //    "icon-rotation-alignment": "viewport",
            //   "text-pitch-alignment": "viewport",
            //   visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            "text-padding": 30,
            "text-field": "{name}",
            //  "text-size": 14,
            //    "icon-image": "500", // 引用精灵图中的图标
            // "icon-size": 1,// 根据需要调整图标大小
            //  "icon-anchored": "bottom", // 设置图标的锚点位置
            // "icon-offset": [0, 15], // 设置图标相对于锚点的偏移量，单位为像素
            // "text-anchor": "top", // 设置文字的锚点位置
            // "text-offset": [0, -1.8], // 设置文字相对于图标的偏移量

        },
        paint: {
            "text-color": "#000",
            "text-halo-color": "#fff",
            'text-halo-width': 1.5
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
            ["to-string", ["get", "province_code"]],
            '370000',
        ],
        layout: {
            //    "symbol-avoid-edges": true,
            //    "icon-rotation-alignment": "viewport",
            //   "text-pitch-alignment": "viewport",
            //   visibility: "visible",
            "text-font": ["Microsoft YaHei"],
            "text-optional": true,
            "text-padding": 30,
            "text-field": "{name}",
            //  "text-size": 14,
            //    "icon-image": "500", // 引用精灵图中的图标
            // "icon-size": 1,// 根据需要调整图标大小
            //  "icon-anchored": "bottom", // 设置图标的锚点位置
            // "icon-offset": [0, 15], // 设置图标相对于锚点的偏移量，单位为像素
            // "text-anchor": "top", // 设置文字的锚点位置
            // "text-offset": [0, -1.8], // 设置文字相对于图标的偏移量

        },
        paint: {
            "text-color": "#000",
            "text-halo-color": "#fff",
            'text-halo-width': 1.5
        },
        //       'slot': 'bottom',
        minzoom: 8.51,
        maxzoom: 10.5
    },






]










export { specEchars }