<script setup>
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.css";
import "../../../public/mapboxgl/mapbox-gl-js-3.0.1/mapbox-gl.js";
import "../../../public/mapboxgl/pulgins/mapbox-gl-compare.css";
import "../../../public/mapboxgl/pulgins/mapbox-gl-compare.js";
import "../../../public/mapboxgl/pulgins/rasterTileLayer.js";
import { config, mapbox } from "@/config/tileserver.js";
import page from "../../../package.json";
// import syncMove from '@mapbox/mapbox-gl-sync-move';
import * as echarts from "echarts"
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import Header from "@/components/header/index.vue";
import c2 from "@/assets/images/map/c2.svg";
import { MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons-vue';

import {
    ScanSearch,
    Layers,
    Globe,
    Map,
    MountainSnow,
    Scale3D,
    Ruler,
    Minus,
    ArrowDownSquareIcon,
    FoldersIcon,
    ChevronDownIcon,
    Info,
    LucideAreaChart,
    MapPinned,
    ChevronUp,
    MoreHorizontal,
    PanelRightOpenIcon,
    SidebarOpen,
    Clock,
    X,
    Building2Icon,
    CheckSquareIcon,
    CheckCircleIcon,
    CheckCircle2Icon,
    CircleX,
    CircleAlertIcon,
    LandPlotIcon,
    LucidePanelsTopBottom,
    LayoutPanelLeftIcon,
    LandmarkIcon,
    LayoutPanelTopIcon,
    LucideSquareMousePointer,
    Download,
    Satellite,
    LandPlot,
    ShieldCheck,
    UserCheck,
    Grid2x2Check,
    ArrowUp,
    Plus,
    ChevronLeft,
    ChevronRight,
    Menu,
    ArrowDown
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import html2canvas from 'html2canvas';
import StateManager from "@/utils/state_manager";
import { treeLeftData } from "./data.js"
import { downloadAndReadExcel } from "@/utils/excel.js"

import {
    popup, popupbig,
    addIcon
} from "@/views/map/map.js";

import VerificationLegend from "@/views/map/verificationLegend.vue"
import JianceLegend from "@/views/map/jianceLegend.vue";
import TucengLegend from "@/views/map/tucengLegend.vue";
import * as turf from "@turf/turf";

import { layers, specYghy } from "@/config/spec-yghy.js";
import { specYghyEchy } from "@/config/spec-yghy-echy.js";






// 设置语言
dayjs.locale('zh-cn');


// 路由
const router = useRouter();

// 表格数据
const dataSource = ref([])

const columns = [
    {
        title: '地市',
        dataIndex: 'city',
        key: 'city',
    },
    {
        title: '区县',
        dataIndex: 'county',
        key: 'county',
    },
    {
        title: '乡镇',
        dataIndex: 'town',
        key: 'town',
    },
    {
        title: '遥感种植面积(亩)',
        dataIndex: 'rs_area',
        key: 'rs_area',
    },
    // {
    //   title: '影像日期',
    //   dataIndex: 'yxrq',
    //   key: 'yxrq',
    // },

    {
        title: '承保面积(亩)',
        dataIndex: 'i_area',
        key: 'i_area',
    },
    {
        title: '保险覆盖率',
        dataIndex: 'i_coverage',
        key: 'i_coverage',
    },
    {
        title: '是否合格',
        dataIndex: 'pass',
        key: 'pass',
    },
]

// 表格数据
const dataSourceDk = ref([])


///①地块面积合计（亩）	②地块面积合计/承保数量	③地块面积是否与承保数量一致？	④是否无地块存在重叠问题？	⑤地块内玉米种植面积合计（亩）	⑥地块内标的作物面积合计/承保数量	⑦玉米种植面积差异率是否达标？	⑧该大户的地块是否合格？

const columnsDk = [
    {
        title: '被保险人信息',
        children: [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '证件号码',
                dataIndex: 'sfz',
                key: 'sfz',
            },
            {
                title: '手机尾号',
                dataIndex: 'telphone',
                key: 'telphone',
            }]
    },


    {
        title: '保单信息',
        children: [


            {
                title: '保单号',
                dataIndex: 'bdh',
                key: 'bdh',
            },
            {
                title: '险种',
                dataIndex: 'type_xl',
                key: 'type_xl',
            },
            {
                title: '保险机构',
                dataIndex: 'bxjg',
                key: 'bxjg',
            },
            {
                title: '标的位置',
                dataIndex: 'city',
                key: 'city',
            },

            {
                title: '承保数量',
                dataIndex: 'cbsl',
                key: 'cbsl',
            }
        ]
    },



    {
        title: '地块核验结果',
        children: [

            {
                title: '地块面积(亩)',
                dataIndex: 'v1',
                key: 'v1',
            },
            {
                title: '覆盖率',
                dataIndex: 'v2',
                key: 'v2',
            },
            {
                title: '地块与承保面积(亩)',
                dataIndex: 'v3',
                key: 'v3',
            },
            {
                title: '地块重叠',
                dataIndex: 'v4',
                key: 'v4',
            },
            {
                title: '地块内标的面积(亩)',
                dataIndex: 'v5',
                key: 'v5',
            },
            {
                title: '标的占比',
                dataIndex: 'v6',
                key: 'v6',
            },
            {
                title: '差异率是否达标',
                dataIndex: 'v7',
                key: 'v7',
            },
            {
                title: '地块是否合格',
                dataIndex: 'v8',
                key: 'v8',
            },

        ]
    },

]


// 任务弹窗
const open = ref(false);


// 导出PDF
const exportPDF = () => {
    const element = document.querySelector('.right-card');

    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 30, 10);
        pdf.save(`${taskName.value}.pdf`);
    });
}
// 获取label
const getLabelByValue = (value) => {
    // console.log(value)
    const label = value.split('-').map(item => options[0].children[0].children[item].label).join(' ');
    return label;
}




/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadTown = async (name) => {

    geomClear()
    //   goGeomUn(window.mapp)


    if (name == "'济阳区'") {
        name = "'济阳县'"
    }

    if (name == "'莱芜区'") {
        name = "'莱芜市'"
    }

    let features = await api.get_table_by_filter(
        "admin_2024_town",
        `and (f_xzqhmc in (${name}) or c_xzqmc in (${name})) `,
        `ST_AsGeoJSON(ST_Simplify(geom,0.0001)) as json,c_xzqdm,c_xzqmc,f_xzqhmc,f_xzqhdm,gid,t_xzqmc,p_xzqmc,t_xzqdm`
    );

    //echy_sql_qy_dq_town
    let echy_sql_qy_dq_town = await api.get_table_tj_echy("echy_sql_qy_dq_town");



    features.forEach(e => {
        if (e.f_xzqhmc == '济阳县') {
            e.f_xzqhmc = '济阳区'
        }
    })

    let properties_1 = [];
    let properties_2 = [];

    geomClear();

    if (echy_sql_qy_dq_town && features) {
        features.map((feature) => {


            let daa1 = echy_sql_qy_dq_town.filter(e => (e.version == '2024年_玉米_第一次_0913' && e.town == feature.t_xzqmc && (e.county == feature.f_xzqhmc || e.county == '莱芜区')))
            let daa2 = echy_sql_qy_dq_town.filter(e => (e.version == '2024年_玉米_第二次_1125' && e.town == feature.t_xzqmc && (e.county == feature.f_xzqhmc || e.county == '莱芜区')))
            // console.log(daa1)
            // console.log(feature)
            let newFeature_1 = {
                type: "Feature",
                geometry: JSON.parse(feature.json),
                properties: {
                    c_xzqdm: feature.c_xzqdm,
                    c_xzqmc: feature.c_xzqmc,
                    f_xzqhdm: feature.f_xzqhdm,
                    f_xzqhmc: feature.f_xzqhmc,
                    gid: feature.gid,
                    p_xzqmc: feature.p_xzqmc,
                    t_xzqdm: feature.t_xzqdm,
                    t_xzqmc: feature.t_xzqmc,
                    coverage: 0,
                    rs_area: 0,
                    tbsl: 0,
                }
            }

            if ((header.value) && daa1.length > 0) {
                newFeature_1.properties.coverage = daa1[0].fgl * 100;
                newFeature_1.properties.rs_area = daa1[0].rs_area;
                newFeature_1.properties.tbsl = daa1[0].tbsl;
            }
            properties_1.push(newFeature_1)

            let newFeature_2 = {
                type: "Feature",
                geometry: JSON.parse(feature.json),
                properties: {
                    c_xzqdm: feature.c_xzqdm,
                    c_xzqmc: feature.c_xzqmc,
                    f_xzqhdm: feature.f_xzqhdm,
                    f_xzqhmc: feature.f_xzqhmc,
                    gid: feature.gid,
                    p_xzqmc: feature.p_xzqmc,
                    t_xzqdm: feature.t_xzqdm,
                    t_xzqmc: feature.t_xzqmc,
                    coverage: 0,
                    rs_area: 0,
                    tbsl: 0,
                }
            }

            if ((header.value) && daa2.length > 0) {
                newFeature_2.properties.coverage = daa2[0].fgl * 100;
                newFeature_2.properties.rs_area = daa2[0].rs_area;
                newFeature_2.properties.tbsl = daa2[0].tbsl;
            }
            properties_2.push(newFeature_2)
        })
        // console.log(properties_1)
        drawGeom([properties_1, properties_2])
    }





};




/**
 * 移除地图上的行政区边界图层
 */
const goGeomUnOne = (newMap) => {
    if (window.countylayer) {
        countylayer.map((cl) => {
            newMap.getLayer("adminGeom" + cl.gid) && newMap.removeLayer("adminGeom" + cl.gid);
            newMap.getLayer("adminGeomOut" + cl.gid) && newMap.removeLayer("adminGeomOut" + cl.gid);
            newMap.getLayer("textLayer" + cl.gid) && newMap.removeLayer("textLayer" + cl.gid);
            newMap.getSource("adminGeom" + cl.gid) && newMap.removeSource("adminGeom" + cl.gid);
        })
        countylayer = []
    }
};


/**
 * 移除地图上的行政区边界图层
 */
const geomClear = () => {

    if (window.map) {
        window.map.getLayer("adminGeom") && window.map.removeLayer("adminGeom");
        window.map.getLayer("adminGeomOut") && window.map.removeLayer("adminGeomOut");
        window.map.getLayer("textLayer") && window.map.removeLayer("textLayer");
        window.map.getLayer("adminGeomOutLabel") && window.map.removeLayer("adminGeomOutLabel");
        window.map.getSource("adminGeom") && window.map.removeSource("adminGeom");
    }
    if (window.mapp) {
        window.mapp.getLayer("adminGeom") && window.mapp.removeLayer("adminGeom");
        window.mapp.getLayer("adminGeomOut") && window.mapp.removeLayer("adminGeomOut");
        window.mapp.getLayer("textLayer") && window.mapp.removeLayer("textLayer");
        window.mapp.getLayer("adminGeomOutLabel") && window.mapp.removeLayer("adminGeomOutLabel");
        window.mapp.getSource("adminGeom") && window.mapp.removeSource("adminGeom");
    }
};

/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const goGeomOne = (data, property) => {


    // 判定颜色
    let color = ""
    if (property.coverage) {
        if (property.coverage > 105) {
            color = "RGB(236,102,103)"
        } else if (property.coverage <= 60) {
            color = "RGB(248,200,94)"
        } else {
            color = "RGB(144,204,120)"
        }
    } else {
        color = "#ccc"
    }




    //添加图层
    map.addSource("adminGeom" + property.gid, {
        type: "geojson",
        // lineMetrics: true, // 线渐变必须条件
        data: {
            "type": "Feature",
            "geometry": JSON.parse(data),
            "properties": property
        },
    });
    map.addLayer({
        id: "adminGeom" + property.gid,
        type: "fill",
        source: "adminGeom" + property.gid,
        paint: {
            "fill-color": color,
            "fill-opacity": 0.5,
        },
    });
    if (header.value) {
        // 点击区县
        map.addLayer({
            id: "adminGeomOut" + property.gid,
            type: "line",
            source: "adminGeom" + property.gid,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": color,
                "line-width": 2.5,
            },
        });

        map.addLayer({
            id: "textLayer" + property.gid,
            type: "symbol",
            source: "adminGeom" + property.gid,
            layout: {
                "text-field": "{f_xzahmc}{t_xzqmc}",
                "text-size": 18,
            },
            paint: {
                "text-halo-blur": 1,
                "text-color": color,
                "text-halo-color": "#000",
                "text-halo-width": 1.5,
                "text-halo-blur": 0.8, // 文字轮廓模糊度
            },
        });
    } else {
        map.addLayer({
            id: "adminGeomOut" + property.gid,
            type: "line",
            source: "adminGeom" + property.gid,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-color": color,
                "line-width": 4.5,
            },
        });

        map.addLayer({
            id: "textLayer" + property.gid,
            type: "symbol",
            source: "adminGeom" + property.gid,
            layout: {
                "text-field": "{city_name}{name}",
                "text-size": 18,
            },
            paint: {
                "text-halo-blur": 1,
                "text-color": color,
                "text-halo-color": "#000",
                "text-halo-width": 1.5,
                "text-halo-blur": 0.8, // 文字轮廓模糊度
            },
        });
    }







};

/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const drawGeom = (data) => {


    geomClear()

    let source_1 = {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: data[0]
        },
    }
    let source_2 = {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: data[1]
        },
    }

    map.addSource("adminGeom", source_1)
    mapp.addSource("adminGeom", source_2)


    let l01 = {
        id: "adminGeom",
        type: "fill",
        source: "adminGeom",
        paint: {
            "fill-opacity": 0.6,
            'fill-color': [
                'case',
                ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                'rgba(248,200,94,1)',
                ['>=', ['get', 'coverage'], 105],
                'RGB(236,102,103)',
                ['all', ['<', ['get', 'coverage'], 105], ['>=', ['get', 'coverage'], 60]],
                'RGB(144,204,120)',
                '#ccc',
            ],
        },
    }

    if (activeKey.value == 1) {
        window.map.addLayer(l01);
        window.mapp.addLayer(l01);
    }



    if (header.value) {
        // 点击区县
        let adminGeomOut = {
            id: "adminGeomOut",
            type: "line",
            source: "adminGeom",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                'line-color': [
                    'case',
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
                    'RGB(144,204,120)',
                    '#ccc',
                ],
                "line-width": 2.5,
            },
        };
        map.addLayer(adminGeomOut);
        mapp.addLayer(adminGeomOut);

        let textLayer = {
            id: "textLayer",
            type: "symbol",
            source: "adminGeom",
            layout: {
                "text-field": "{f_xzahmc}{t_xzqmc}",
                "text-size": 24,
            },
            paint: {
                // 'text-color': "#fff",
                'text-color': [
                    'case',
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
                    'RGB(144,204,120)',
                    '#ccc',
                ],
                "text-halo-color": "#000",
                "text-halo-width": 2,
                // "text-halo-blur": 0.8, // 文字轮廓模糊度
            },
        };

        map.addLayer(textLayer);
        mapp.addLayer(textLayer);
    } else {
        let adminGeomOut = {
            id: "adminGeomOut",
            type: "line",
            source: "adminGeom",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                'line-color': [
                    'case',
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
                    'RGB(144,204,120)',
                    '#ccc',
                ],
                "line-width": 2.5,
            },
        };

        window.map.addLayer(adminGeomOut);
        window.mapp.addLayer(adminGeomOut);

        let textLayer = {
            id: "textLayer",
            type: "symbol",
            source: "adminGeom",
            layout: {
                "text-field": "{city_name}{name}",
                "text-size": 24,
            },
            paint: {
                // 'text-color': "#fff",
                'text-color': [
                    'case',
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
                    'RGB(144,204,120)',
                    '#ccc',
                ],
                "text-halo-color": "#000",
                "text-halo-width": 2,
                // "text-halo-blur": 0.8, // 文字轮廓模糊度
            },
        };

        map.addLayer(textLayer);
        mapp.addLayer(textLayer);
    }







};


/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const goGeomLine = (data, newMap) => {
    newMap.addSource("adminGeom", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: data
        },
    });

    if (header.value) {
        // 点击区县
        newMap.addLayer({
            id: "adminGeomOut",
            type: "line",
            source: "adminGeom",
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                'line-color': '#fff',
                "line-width": 5.5,
                "line-opacity": 0.4,
            },
        });

        newMap.addLayer({
            id: "adminGeomOutLabel",
            type: "symbol",
            source: "adminGeom",
            layout: {
                "text-field": "{t_xzqmc}",
                "text-size": 20,
            },
            paint: {
                "text-halo-blur": 1.6,
                'text-color': '#fff',
                "text-halo-color": "#000",
                "text-halo-width": 1.5,
                "text-halo-blur": 1.8, // 文字轮廓模糊度
            },
        });

    }
}




/**
 * 气泡事件
 */
const loadEvent = ((newMap) => {
    newMap.on("click", () => {
        newMap.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "none");
        newMap.getLayer("lockGeom") && newMap.removeLayer("lockGeom");
        newMap.getLayer("lockGeomFake") && newMap.removeLayer("lockGeomFake");
        newMap.getSource("lockGeom") && newMap.removeSource("lockGeom");
    });

    newMap.on("mousemove", "adminGeom", async (e) => {
        newMap.getCanvas().style.cursor = "pointer";
        addEventGeomArea(e, newMap)
    });

    newMap.on("mouseleave", "adminGeom", async (e) => {
        popupbig && popupbig.setHTML(undefined);
        popupbig && popupbig.setLngLat([0, 0]);

        popup && popup.setHTML(undefined);
        popup && popup.setLngLat([0, 0]);

        newMap.getCanvas().style.cursor = "";
    });
    newMap.on("click", "rskm_pt", async (e) => {
        addEventDk(e, newMap)
    });

    // newMap.on("mousemove", "adminGeom", () => {
    //     newMap.getCanvas().style.cursor = "pointer";
    // });

    // newMap.on("mouseleave", "adminGeom", () => {
    //     newMap.getCanvas().style.cursor = "";
    // });

    newMap.on("mousemove", "rskm_pt", () => {
        newMap.getCanvas().style.cursor = "pointer";
    });

    newMap.on("mouseleave", "rskm_pt", () => {
        newMap.getCanvas().style.cursor = "";
    });


    newMap.on("rotate", (e) => {
        eventRotate();
    });


})

/**
 * 处理地图旋转事件
 * @function
 * @returns {void}
 */
const eventRotate = () => {
    const bear = mapp.getBearing();
    const pitch = mapp.getPitch();
    const rad = -(bear * (Math.PI / 180));
    const r = document.getElementById("Zero");
    if (r) r.style.transform = `rotateZ(${rad}rad)`;
}

/**
 * 处理地图渲染事件
 * @function
 * @returns {void}
 */
const eventRender = (double = undefined) => {
    const MAP_LAYERS = StateManager.get("MAP_LAYERS") || "{}";
    const ll = {
        lng: window.lnglatrender?.lng.toFixed(6) ?? "0",
        lat: window.lnglatrender?.lat.toFixed(6) ?? "0"
    };

    mapp && (document.getElementById("xyz").innerHTML = `
    <span style='padding-right: 10px;'>${MAP_LAYERS.st ? `审图号：${MAP_LAYERS.st}` : ""}</span>
    <span style='padding-right: 10px;'>© ${page.name}</span>
    <span style='padding-right: 10px;'>经纬度：${ll.lng}° ${ll.lat}°</span>
    <span style='padding-right: 10px;'>等级：${mapp.getZoom().toFixed(2) || ""} </span>
    <span style='padding-right: 10px;'>模式：${(mapp.getProjection().name || "default") === "globe" ? "三维" : "二维"} </span>
    <span style='padding-right: 10px;'>${MAP_LAYERS.name || ""}</span>`);


}


/**
 * 
 * @param 行政区域点击
 * @param newMap 
 */
const addEventGeomArea = async (e, newMap) => {


    popupbig && popupbig.setHTML(undefined);
    popupbig && popupbig.setLngLat([0, 0]);

    const feature = e.features[0];
    // console.log(feature)
    let text = await setCountyPopup(feature);

    // newMap.setFilter("Highlight_DK_Line_Click", [
    //     "all",
    //     ["in", "name", feature.properties.name],
    // ]);
    // newMap.setPaintProperty("adminGeom", "fill-opacity", 1);

    popupbig.setLngLat(e.lngLat).setHTML(text).addTo(newMap);
}



/**
 * 
 * @param 行政区域点击
 * @param newMap 
 */
const addEventArea = async (e, newMap) => {


    popupbig && popupbig.setHTML(undefined);
    popupbig && popupbig.setLngLat([0, 0]);

    const feature = e.features[0];
    // console.log(feature)
    let text = await setCountyPopup(feature);

    newMap.setFilter("Highlight_DK_Line_Click", [
        "all",
        ["in", "gid", feature.properties.gid],
    ]);
    newMap.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");

    newMap.flyTo({
        center: e.lngLat,
        // speed: 1,
        // curve: 1,
        // easing (t) {
        //     return t;
        // },
    });
    popupbig.setLngLat(e.lngLat).setHTML(text).addTo(newMap);
}


const addEventDk = async (e, newMap) => {


    popupbig && popupbig.setHTML("");
    popupbig && popupbig.setLngLat([0, 0]);

    newMap.getCanvas().style.cursor = "pointer";
    const feature = e.features[0];
    let text;

    if (newMap.getContainer().id == 'before') {
        text = await setPopup(feature.properties, 0);
    } else {
        text = await setPopup(feature.properties, 1);
    }

    map.setFilter("Highlight_DK_Line_Click", [
        "all",
        ["in", "bbxrmc", feature.properties.bbxrmc],
        ["in", "bdh", feature.properties.bdh],
    ]);
    mapp.setFilter("Highlight_DK_Line_Click", [
        "all",
        ["in", "bbxrmc", feature.properties.bbxrmc],
        ["in", "bdh", feature.properties.bdh],
    ]);


    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");
    mapp.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");

    // fitBox(feature);
    newMap.flyTo({
        center: e.lngLat,
        // zoom: 7.5,
        // speed: 1,
        // curve: 1,
        // easing (t) {
        //     return t;
        // },
    });
    popupbig.setLngLat(e.lngLat).setHTML(text).addTo(newMap);

}





/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setPopup = async (info, index) => {
    // console.log(info)

    if (!info) return false;
    // let data = await api.get_table_by_filter("procjet_2024_yghy_hz10_excel", `and bdh in('${info.bdh}') and bbxrmc in ('${info.bbxrmc}') `,
    //     `gid, bdh, bbxrmc, bbxrzjh, bbxrdh, xianzhong, type_xl, bxjg_code, bxjg, shi, shi_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, bxqj, bdscsj, bdxgsj, v1, v2, v3, v4, v5, v6, v7, v8`);

    let data = await api.get_table_by_filter("procjet_2024_yghy_dahu", `and bdh in('${info.bdh}') and bbxrmc in ('${info.bbxrmc}') `,
        `bdh, bbxrmc, bbxrzjh, bbxrdh, xianzhong, bxjg, shi, shi_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, v1, v2, v3, v4, v5, v6, v7, v8, version`);


    console.log(info)
    let successData = data[index] || {};
    let meginfo = {}

    meginfo.bdh = info.bdh || "";
    meginfo.province_city_county_town_village =
        (info.shi || "") +
        (info.quxian || "") +
        (info.zhen || "") +
        (info.cun || "");
    meginfo.bbxrmc = info.bbxrmc || "";
    meginfo.youxiao = info.youxiao || "";
    meginfo.bxjg = info.bxjg || "";
    meginfo.xianzhong = info.xianzhong || "";
    meginfo.bbxrzjh = info.bbxrzjh || "";
    meginfo.bbxrdh = info.bbxrdh || "";
    meginfo.bxqj = "";//successData.bxqj.replace(/年|月|日/g, "/");

    meginfo.tbsl = successData.cbsl || 0;
    meginfo.v1 = Number(successData.v1).toFixed(2) || 0;
    meginfo.v2 = Number((Number(successData.v2) < 1 ? (Number(successData.v2) * 100) : Number(successData.v2))).toFixed(2) || 0;
    meginfo.v3 = successData.v3 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.v4 = successData.v4 == '1' ? "<div style=' color: #fff;background-color: #91cc75;'>通过</div>" : "<div style=' color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.v5 = Number(successData.v5).toFixed(2) || 0;
    meginfo.v6 = Number((Number(successData.v6) < 1 ? (Number(successData.v6) * 100) : Number(successData.v6))).toFixed(2) || 0;
    meginfo.v7 = successData.v7 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.v8 = successData.v8 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.dkmj = successData.v1 ? Number(successData.v1).toFixed(1) : 0;
    meginfo.ygjg = info.ygjg || "";

    // console.log(meginfo)
    meginfo.bdmj = successData.v5 ? Number(successData.v5).toFixed(1) : "";
    meginfo.bdzb = (Number(meginfo.bdmj) / Number(meginfo.dkmj) * 100).toFixed(2);
    meginfo.dkcdl = Number(info.dkcdl).toFixed(2) || 0;
    meginfo.cdmj = (Number(meginfo.dkmj) * Number(meginfo.dkcdl)).toFixed(2)

    // ①地块面积合计（亩）	
    // ②地块面积合计/承保数量	
    // ③地块面积是否与承保数量一致？
    // ④是否无地块存在重叠问题？	
    // ⑤地块内玉米种植面积合计（亩）	
    // ⑥地块内标的作物面积合计/承保数量	
    // ⑦玉米种植面积差异率是否达标？	
    // ⑧该大户的地块是否合格？

    let text = document.getElementById("text").innerHTML;


    for (let key in meginfo) {
        text = text.replace(`{${key}}`, meginfo[key])
    }

    return text;


}



/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setCountyPopup = async (data) => {


    //// console.log(data, data.properties.name)

    let text = ``;
    text = `
    <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 18px;color:#5a5959"  title="区域核验" >
        <tr style="line-height:1.5;"><th style="text-align: right;width:180px;padding-right:5px">核验区域:</th><td >${(data.properties.f_xzqhmc + data.properties.t_xzqmc) || data.properties.name}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">投保面积:</th><td >${data.properties.tbsl ? Number(data.properties.tbsl).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">遥感面积:</th><td >${data.properties.rs_area ? Number(data.properties.rs_area).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">地块与投保面积之比:</th><td >${parseInt(data.properties.coverage)}%</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;;padding-right:5px">是否超保:</th><td >${data.properties.coverage >= 105 ? "<div style='background-color:RGB(236,102,103);color:#000;padding:2px;border-radius:2px'>超保</div>" : "<div  style='background-color:RGB(147,207,122);color:#000;padding:2px;border-radius:2px'>未超保</div>"}</td><tr>
        </table>`


    return text
}

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCountyFit = async (name, newMap) => {
    //// console.log(String(code).substring(0, 4));
    let features = await api.get_table_by_filter(
        "admin_2022_county",
        `and name in (${name})  order by county_code`,
        `ST_AsGeoJSON(ST_Simplify(geom,0.1)) as json,city_code,city_name,county_code,gid,name,province_name`
    );

    newMap.fitBounds(turf.bbox(JSON.parse(features[0].json)), {
        padding: { top: 50, left: 50, right: 50, bottom: 50 },
        linear: true,
    });
}

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCounty = async (name) => {

    //// console.log(String(code).substring(0, 4));
    let features = await api.get_table_by_filter(
        "admin_2022_county",
        `and name in (${name})  order by county_code`,
        `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,city_code,city_name,county_code,gid,name,province_name`
    );


    //echy_sql_qy_dq_county
    let echy_sql_qy_dq_county = await api.get_table_tj_echy("echy_sql_qy_dq_county");



    // console.log(echy_sql_qy_dq_county)
    // console.log(features)

    if (features.length == 1) {
        let feature = JSON.parse(features[0].json);
        let bbox = turf.bbox(feature)
        map.fitBounds(bbox, {
            padding: { left: 20, right: 20 }
        });
    } else {
        let properties_1 = [];
        let properties_2 = [];

        geomClear();


        features.map((feature) => {


            let daa1 = echy_sql_qy_dq_county.filter(e => (e.version == '2024年_玉米_第一次_0913' && e.county == feature.name))
            let daa2 = echy_sql_qy_dq_county.filter(e => (e.version == '2024年_玉米_第二次_1125' && e.county == feature.name))

            let newFeature_1 = {
                type: "Feature",
                geometry: JSON.parse(feature.json),
                properties: {
                    city_code: feature.city_code,
                    city_name: feature.city_name,
                    county_code: feature.county_code,
                    gid: feature.gid,
                    name: feature.name,
                    province_name: feature.province_name,
                    pass: feature.pass,
                    coverage: daa1[0].fgl * 100,
                    rs_area: daa1[0].rs_area,
                    tbsl: daa1[0].tbsl,
                }
            }

            if (!header.value) {
                newFeature_1.properties.coverage = daa1[0].fgl * 100;
                newFeature_1.properties.rs_area = daa1[0].rs_area;
                newFeature_1.properties.tbsl = daa1[0].tbsl;
            }
            properties_1.push(newFeature_1)

            let newFeature_2 = {
                type: "Feature",
                geometry: JSON.parse(feature.json),
                properties: {
                    city_code: feature.city_code,
                    city_name: feature.city_name,
                    county_code: feature.county_code,
                    gid: feature.gid,
                    name: feature.name,
                    province_name: feature.province_name,
                    pass: feature.pass,
                    coverage: daa2[0].fgl * 100,
                    rs_area: daa2[0].rs_area,
                    tbsl: daa2[0].tbsl,
                }
            }

            if (!header.value) {
                newFeature_2.properties.coverage = daa2[0].fgl * 100;
                newFeature_2.properties.rs_area = daa2[0].rs_area;
                newFeature_2.properties.tbsl = daa2[0].tbsl;
            }
            properties_2.push(newFeature_2)
        })

        // // console.log(geoms)

        fitCenter()

        drawGeom([properties_1, properties_2])


    }

};


// 初始化视野
const fitCenter = () => {
    map.flyTo({
        center: [118.28, 36.80],
        zoom: 6.6,
        speed: 1,
        curve: 2,
        // easing (t) {
        //     return t;
        // },
    });

    mapp.flyTo({
        center: [118.28, 36.80],
        zoom: 6.6,
        speed: 1,
        curve: 2,
        // easing (t) {
        //     return t;
        // },
    });
};

let tongji = {
    bdh_count: ref("-"),
    dk_count: ref("-"),
    area_count: ref("-"),
    ct_bd: ref("-"),
    ct_dk: ref("-")
}

/**
 * 获取统计
 * @param key 
 * @param name 
 */
const getCount = async (key, name = "") => {
    //// console.log(String(code).substring(0, 4));
    let data = await api.get_table_tj(
        key,
        name,
    );
    if (data.length > 0) {
        // // console.log(data)
        // // console.log( data[0].bdh_count)
        tongji.bdh_count.value = data[0].bdh_count;
        tongji.dk_count.value = data[0].dk_count;
        tongji.area_count.value = data[0].area_count;
        tongji.ct_bd.value = data[0].ct_bd;
        tongji.ct_dk.value = data[0].ct_dk;
    }


    // chardata.value = [
    //   { value: Number(data[0].ct_dk), name: '遥感面积' },
    //   { value: Number(data[0].dk_count), name: '承保面积' },
    // ]

    //loadEcharts();

};


const expandedKeys = ref(['0-0']);
const selectedKeys = ref(['0-0']);


watch(selectedKeys, () => {
    //// console.log(selectedKeys.value[0])

    switch (selectedKeys.value[0]) {
        case "0-0":

            header.value = "";
            break;
        case "0-0-0":
            header.value = "济阳区";
            break;
        case "0-0-1":
            header.value = "莱芜区";
            break;
        case "0-0-2":
            header.value = "桓台县";
            break;
        case "0-0-3":
            header.value = "高青县";
            break;
        case "0-0-4":
            header.value = "海阳市";
            break;
        case "0-0-5":
            header.value = "招远市";
            break;
        case "0-0-6":
            header.value = "汶上县";
            break;
        case "0-0-7":
            header.value = "冠县";
            break;
        case "0-0-8":
            header.value = "东阿县";
            break;
        case "0-0-9":
            header.value = "无棣县";
            break;
        default:
            break;
    }
    loadLocalData("无棣县");
})






/**
 * 右侧默认菜单
 */
const activeKey = ref('1');

watch(activeKey, () => {
    header.value = "";
    // setTimeout(() => {
    //     // map && loadLocalData()
    //     // mapp && loadLocalData()

    // }, 0)




    geomClear()
    removeLayerDk()
    // if (activeKey.value == 2) {

    // } else {

    // }
    loadLocalData()
})

/**
 * 统计信息
 */

const cbmj = ref(0);
const ygmj = ref(0);
const bxfgl = ref(0);
const cbxz = ref(0);
const cbxz_val = ref(0);
const zcxz = ref(0);
const zcxz_val = ref(0);
const bzxz = ref(0);
const bzxz_val = ref(0);



// const loadDataRight = async (filter) => {

//     // 地块第二个柱状图
//     if (!header.value) {
//         await getAnalysisEchars2("yghy_sql_4")
//         await getAnalysisEchars4('yghy_sql_6')

//     } else {
//         // 图表三统计
//         await getAnalysisEchars3('yghy_sql_5', `and quxian in ('${filter}')`);
//         await getAnalysisEchars4('yghy_sql_6', `and quxian in ('${filter}')`);
//     }

//     // 地块概况及饼图查询
//     if (!filter) {
//         await getAnalysisDK("yghy_sql_3")
//     } else {
//         await getAnalysisDK("yghy_sql_3", `and quxian in ('${filter}')`)

//     }


// }


/**
 * 打印区域行政地图与独立县地图
 * @param filter 
 */
const loadLayers = () => {
    // console.log("打印区域行政地图与独立县地图")
    if (!header.value) {
        //loadCounty("'东阿县','济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','无棣县'");
    } else {
        if (activeKey.value == 2) {
            loadCounty("'" + header.value + "'");
        } else if (activeKey.value == 1) {
            loadCounty("'" + header.value + "'");
            // loadTown("'" + header.value + "'");
        }
    }




}

/**
 * 初始化图表
 * @param filter 
 */
const loadLocalData = () => {
    geomClear()
    // console.log("loadLocalData")


    popup && popup.setHTML(undefined);
    popup && popup.setLngLat([0, 0]);

    popupbig && popupbig.setHTML(undefined);
    popupbig && popupbig.setLngLat([0, 0]);

    if (activeKey.value == 1) {
        loadLayers()
    } else {
        addLayerDk()

        // console.log("loadCountyFit")
        if (!header.value) {
            fitCenter()
        } else {
            loadCountyFit(`'${header.value}'`, window.map)
            loadCountyFit(`'${header.value}'`, window.mapp)
            loadTown(`'${header.value}'`)
        }
    }
}




const bdmjbfhs = ref("")
const dhsl = ref("")
const dk_area = ref("")
const dkcd = ref("")
const dkhghs = ref("")
const dkmjbfs = ref("")
const tb_area = ref("")
const ydkdhsl = ref("")
const wdkdhsl = ref("")
const dkbhghs = ref("")

/**
 * 地块统计
 * @param key 
 * @param name 
 */
const getAnalysisDK = async (key, where = "") => {

    let data = await api.get_table_tj(
        key,
        where,
    );
    //// console.log(data[0])

    if (data[0]) {
        bdmjbfhs.value = data[0].bdmjbfhs;
        dhsl.value = data[0].dhsl;
        dk_area.value = data[0].dk_area;
        dkcd.value = data[0].dkcd;
        dkmjbfs.value = data[0].dkmjbfs;
        tb_area.value = data[0].tb_area;
        ydkdhsl.value = data[0].ydkdhsl;
        dkhghs.value = data[0].dkhghs;
        wdkdhsl.value = data[0].wdkdhsl;
        dkbhghs.value = data[0].dkbhghs;
    }

};



let rightEcData = ref([])
/**
 * 图表统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars2 = async (key, where = "") => {

    let data = await api.get_table_tj(
        key,
        where,
    );
    //// console.log(data)

    if (data) {


        let county = []
        let dhsl = []
        let dkhghs = []
        data.forEach(item => {
            county.push(item.county)
            dhsl.push(item.dhsl)
            dkhghs.push(item.dkhghs)
        });
        rightEcData.value = [county, dkhghs, dhsl]
    }


};




/**
 * 区域统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars3 = async (key, where = "") => {

    let data = await api.get_table_tj(
        key,
        where,
    );
    // // console.log(data)

    if (data) {


        let xiangzhen = []
        let dhsl = []
        let dkhghs = []
        data.forEach(item => {
            xiangzhen.push(item.xiangzhen)
            dhsl.push(item.dhsl)
            dkhghs.push(item.dkhghs)
        });
        rightEcData.value = [xiangzhen, dkhghs, dhsl];
        echartsDK02(...rightEcData.value);
    }


};



let rightEcDataJG = ref([]);
/**
 * 机构统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars4 = async (key, where = "") => {

    let data = await api.get_table_tj(
        key,
        where,
    );
    // // console.log(data)

    if (data) {
        let bxjg = []
        let dhsl = []
        let dkhghs = []
        data.forEach(item => {
            bxjg.push(item.bxjg)
            dhsl.push(item.dhsl)
            dkhghs.push(item.dkhghs)
        });
        rightEcDataJG.value = [bxjg, dkhghs, dhsl];
        echartsDK03(...rightEcDataJG.value);
    }


};

let hzBaseData = [];


/**
 * 地块浮动框
 * @param page 
 * @param size 
 * @param filter 
 */
const loadTabel = async (page, size, filter = "") => {
    let dkList = await api.get_page("procjet_2024_yghy_hz10_excel", page, size, filter);
    //// console.log(dkList)
    let arr = []
    dkList.map((dk) => {
        arr.push(dk)
    })
    dataSourceDk.value = arr;
}


/**
 * 隐藏地块图形
 */
const removeLayerDk = () => {
    map.setLayoutProperty('rskm_pt', 'visibility', 'none');
    map.setLayoutProperty('rskm_pt_outline', 'visibility', 'none');
    map.setLayoutProperty('rskm_pt_name', 'visibility', 'none');
    map.setLayoutProperty('rskm_pt_name_1', 'visibility', 'none');

    mapp.setLayoutProperty('rskm_pt', 'visibility', 'none');
    mapp.setLayoutProperty('rskm_pt_outline', 'visibility', 'none');
    mapp.setLayoutProperty('rskm_pt_name', 'visibility', 'none');
    mapp.setLayoutProperty('rskm_pt_name_1', 'visibility', 'none');

}

/**
 * 地块图形
 */
const addLayerDk = () => {
    map.setLayoutProperty('rskm_pt', 'visibility', 'visible');
    map.setLayoutProperty('rskm_pt_outline', 'visibility', 'visible');
    map.setLayoutProperty('rskm_pt_name', 'visibility', 'visible');
    map.setLayoutProperty('rskm_pt_name_1', 'visibility', 'visible');

    mapp.setLayoutProperty('rskm_pt', 'visibility', 'visible');
    mapp.setLayoutProperty('rskm_pt_outline', 'visibility', 'visible');
    mapp.setLayoutProperty('rskm_pt_name', 'visibility', 'visible');
    mapp.setLayoutProperty('rskm_pt_name_1', 'visibility', 'visible');


}

/**
 * 区域状态
 */
const header = ref("")


const searchSaData = ref()

/**
 * 绑定智能检索
 */
const valueSearch = ref('');
const options = ref([]);
const onSearch = async (searchText) => {
    if (searchText.length > 1) {
        let data = await api.get_table_by_filter(
            "procjet_2024_yghy_hz4country",
            ` and bbxrmc like '%25${searchText}%25'`,
            "	gid, ST_AsGeoJSON(geom) as geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao, dkmj, dkcdl, bdmj, dkbcd, shape_leng, shape_area, cbsl, bxqj, v1, v2, v3, v4, v5, v6, v7, v8");
        searchSaData.value = data;

        let nsmes = [...new Set(data.map(n => ({ value: n.bbxrmc, bbxrzjh: n.bbxrzjh, cun: n.cun })))];
        //// console.log(nsmes)
        options.value = [...new Set(nsmes.map(item =>
            JSON.stringify(item)
        ))].map(val => JSON.parse(val))
    } else {
        options.value = [];
    }
};
const onSelect = (selectedOption) => {
    valueSearch.value = selectedOption;
    //// console.log(valueSearch.value);

    // 绘制

    let newGeom = searchSaData.value.filter((sa) => {
        return sa.bbxrmc == selectedOption
    })
    //// console.log(newGeom)
    //newGeom[0] && drawGeom(newGeom[0].geom)

    let inputdata = [];

    newGeom.map((feature) => {
        inputdata.push({
            type: "Feature",
            geometry: JSON.parse(feature.geom)
        })
    })

    searchDrawGeom(inputdata)

    if (valueSearch.value.length > 1) {
        onSearch(valueSearch.value);
    }
};

const clearGeom = () => {

    map.getLayer("lockGeomFake") && map.removeLayer("lockGeomFake");
    map.getSource("lockGeomFake") && map.removeSource("lockGeomFake");
};


/**
* 查找地块
* @param {} data
*/
const searchDrawGeom = (data) => {
    clearGeom()

    map.addSource("lockGeomFake", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: data
        },
    });
    map.addLayer({
        id: "lockGeomFake",
        type: "fill",
        source: "lockGeomFake",
        paint: {
            "fill-color": "#fff",
            "fill-opacity": 0.5,
            // "fill-width":8,
        },
    });

    // const allCoordinates = data.reduce((acc, feature) => {
    //   return acc.concat(feature.geometry.coordinates.flat());
    // }, []);

    const bbox = turf.bbox({
        type: "FeatureCollection",
        features: data
    });


    map.fitBounds(bbox, {
        padding: { top: 400, bottom: 600 },
        linear: true,
        // easing: (t) => {
        //   return t * (1 - t);
        // },
    });
};


/**
 * 菜单栏显示
 */
const xSquareShow = ref(false)


/**
 * 统计栏显示
 */
const xRightSquareShow = ref(false)


/**
 * 图层控制
 */
const radioValue = ref(false);




watch(radioValue, (newr) => {
    if (newr) {
        map.setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'visible');
        map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'visible');
    } else {
        map.setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'none');
        map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'none');
    }
})




/**
 * 获取分页
 */
const pagination = ref({
    pageSize: 10, // 每页显示10条数据
    total: 1, // 总数据条数
    responsive: true,
    //pageSizeOptions: false,
    showLessItems: true,
    showTotal: (total, range) => {
        return `${total} 条`;
    },
    onChange: (page) => {
        loadTabel(page, pagination.value.pageSize);
    },
});





/**
 * 数据总数
 * @param {*} filter 条件
 */
const loadCount = async (filter = "") => {
    const data = await api.get_count("procjet_2024_yghy_hz10_excel", filter);
    pagination.value.total = Number(data[0].count);
    // // console.log(data[0].count)
};


const lockDownHtml = ref()

/**
 * excel 下载
 */
const lockDownExcel = async (path, sheet) => {
    let data = await downloadAndReadExcel(path, sheet)
    lockDownHtml.value = data.join("<hr>");

    lockDownOpen.value = true;
}


const lockDownOpen = ref(false)

const loadDoubleMap2 = () => {


    let map1 = initMap("before");
    let map2 = initMap("after", "rgba(145, 210, 235,0.3)");

    //  // console.log(map1, map2)

    window.map = map1;
    window.mapp = map2;

    syncMove(map1, map2)
}

let compare;
/**
 * 
 */
const loadDoubleMap = () => {


    let container = '#comparison-container';
    let before = initMap("before");
    let after = initMap("after");

    //console.log(before, after)

    window.map = before;
    window.mapp = after;

    compare = new mapboxgl.Compare(before, after, container, {
        // orientation: 'horizontal' 
    });

    compare.setSlider(0);






    document.body.addEventListener('mousemove', (event) => {
        observeSaLeft.value = compare.currentPosition;
    });
}


/**
 * 初始化地图
 * @function
 */
const initMap = (id, color = "rgba(186, 210, 235,0.3)") => {
    mapboxgl.workerCount = navigator.hardwareConcurrency + 2;
    mapboxgl.maxParallelImageRequests = 12;
    mapboxgl.accessToken = mapbox.key;
    mapboxgl.prewarm();

    const mapl = new mapboxgl.Map({
        container: id,
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
                color: color, //低层大气 rgb(186, 210, 235)
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
                        "background-color": id == 'before' ? "#f0f3fa" : "#ccc",
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
    mapl.addControl(
        new mapboxgl.AttributionControl({
            customAttribution: "<div id='xyz'></div>",
        })
    );

    const cc = new mapboxgl.ScaleControl({
        maxWidth: 150,
        unit: "metric",
    });
    !mapl.hasControl(cc) && mapl.addControl(cc, 'bottom-right');

    mapl.on("load", () => {
        addTiles();
    });

    mapl.addControl(
        new mapboxgl.AttributionControl({
            customAttribution: "<div id='xyz'></div>",
        })
    );

    return mapl;
};

// 地图类型
let machine = ref("globe");

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
        if (map) {
            map.getLayer(layerId) && map.removeLayer(layerId);
            map.getSource(layerId) && map.removeSource(layerId);
        }
        if (mapp) {
            mapp.getLayer(layerId) && mapp.removeLayer(layerId);
            mapp.getSource(layerId) && mapp.removeSource(layerId);
        }
    });
    loadLayer = [];
    layerList &&
        layerList.forEach((layer) => {
            loadLayer.push(layer[0]);
            //调用接口，添加图层
            var param = key ? { key: key } : null;
            if (map) {
                !map.getLayer(layer[0]) && map.addLayer(rasterTileLayer(layer[0], layer[1], param));
            }


            if (mapp) {
                !mapp.getLayer(layer[0]) && mapp.addLayer(rasterTileLayer(layer[0], layer[1], param));
            }
        });


    /**
     * 定位一致
     */
    if (map) {
        let style = map.getStyle()
        map.moveLayer(style.layers[style.layers.length - 1].id, 'level');

    }
    if (mapp) {
        let style = mapp.getStyle()
        mapp.moveLayer(style.layers[style.layers.length - 1].id, 'level');
    }

};


/**
 * 单选菜单
 */
const selectValue = ref(["0-0"]);
watch(selectValue, () => {
    // message.info(selectValue.value)
    selectedKeys.value = [selectValue.value]
})

const ygjg = ref([]);
const loadYGJG = async () => {
    //echy_sql_ygjg
    ygjg.value = await api.get_table_tj_echy("echy_sql_ygjg");
}


/** =
 * 数据加载
 */
const loadData = () => {
    // console.log("loadData")
    // loadCBSL()
    // loadYGSL()
    // loadCBHC()
    // loadCBXZ()
    // loadDK()
    // loadDKDQ()
    // loadQYDQ()
    // loadQYJG()
    // loadDKJG()
    // loadYGJG()
    // loadBDSL()


}



// 挂载
onMounted(() => {

    Ieight.value = ({
        y: window.innerHeight - 580, x: 400
    })

    loadDoubleMap()

    // loadData()

    map && map.on("load", () => {

        addLayersYghy(map, specYghy);
        map && loadEvent(map);

        // map.addSource('procjet_2024_yghy_yumi_zhangshi', {
        //     'type': 'raster',
        //     'scheme': 'tms',
        //     'tiles': [
        //         'http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_yumi_zhangshi@EPSG%3A900913@png/{z}/{x}/{y}.png'

        //     ],

        //     'tileSize': 256 // 瓦片大小
        // });

        // map.addLayer({
        //     'id': 'procjet_2024_yghy_yumi_zhangshi',
        //     'type': 'raster',
        //     'source': 'procjet_2024_yghy_yumi_zhangshi',
        //     "paint": {
        //         "raster-opacity": 0.7
        //     },
        // });

        map.setLayoutProperty('procjet_2024_yghy_yumi_zhangshi', 'visibility', 'visible');
        //  map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'visible');

        // map.setLayoutProperty('rskm_pt', 'visibility', 'visible');
        // map.setLayoutProperty('rskm_pt_outline', 'visibility', 'visible');
        // map.setLayoutProperty('rskm_pt_name', 'visibility', 'visible');
        // map.setLayoutProperty('rskm_pt_name_1', 'visibility', 'visible');
    })

    mapp && mapp.on("load", () => {
        addLayersYghy(mapp, specYghyEchy);
        mapp && loadEvent(mapp);

        // mapp.addSource('procjet_2024_yghy_yumi_zhangshi', {
        //     'type': 'raster',
        //     'scheme': 'tms',
        //     'tiles': [
        //         'http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_yumi_zhangshi@EPSG%3A900913@png/{z}/{x}/{y}.png'

        //     ],

        //     'tileSize': 256 // 瓦片大小
        // });

        // mapp.addLayer({
        //     'id': 'procjet_2024_yghy_yumi_zhangshi',
        //     'type': 'raster',
        //     'source': 'procjet_2024_yghy_yumi_zhangshi',
        //     "paint": {
        //         "raster-opacity": 0.7
        //     },
        // });



        mapp.setLayoutProperty('procjet_2024_yghy_yumi_zhangshi', 'visibility', 'visible');
        //  mapp.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'visible');



        // mapp.setLayoutProperty('rskm_pt', 'visibility', 'visible');
        // mapp.setLayoutProperty('rskm_pt_outline', 'visibility', 'visible');
        // mapp.setLayoutProperty('rskm_pt_name', 'visibility', 'visible');
        // mapp.setLayoutProperty('rskm_pt_name_1', 'visibility', 'visible');



        fitCenter()

    })
    /**
       * 渲染运行时
       */
    mapp.on("move", (e) => {
        eventRender();
    });

    mapp.on("mousemove", (e) => {
        window.lnglatrender = {
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
        };
        eventRender();
    });

})

// 追加地形
const loadTerrain = (mm) => {
    let bool = mm.getSource("mapbox-dem");
    !bool &&
        mm.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.terrain-rgb",
            tileSize: 512,
            maxzoom: 16,
        });
};



/**
 * 向地图添加图层-遥感核验
 * @function
 * @returns {void}1
 */
const addLayersYghy = (newMap, css) => {
    css.forEach((layer) => {
        newMap.getLayer(layer.id) && newMap.removeLayer(layer.id);
    });

    const sources = config;

    for (const source in sources) {
        newMap.getSource(sources[source].name) && newMap.removeSource(sources[source].name);
    }

    for (const source in sources) {
        !newMap.getSource(sources[source].name) &&
            newMap.addSource(sources[source].name, sources[source].tile);
    }

    css.forEach((spec) => {
        !newMap.getLayer(spec.id) && newMap.addLayer(spec);
    });
};



/**
 * 总控按钮
 */


const data = reactive(['长势监测', '灾损监测']);
const segmented = ref(data[0]);
watch(segmented, () => {
    (segmented.value == '区域') ? (activeKey.value = 1) : (activeKey.value = 2)
})



/**
 * 根据改变重载
 */
watch(header, () => {
    // loadData();
})











/**
 * 菜单
 */
const selectedKeysNume = ref(['0-0']);
const openKeys = ref([]);
function getItem (label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
const ad = () => {
    let arr = [];
    arr.push(getItem("全部试点区县", '0-0'))
    treeLeftData[0].children.forEach((tl) => {
        arr.push(getItem(tl.title, tl.key))
    })

    return arr;
}
//const namead = header.value ? ref(header.value) : ref("全部试点区县")
const items = reactive([
    getItem(header.value || '全部试点区县', '0-0', () => h(AppstoreOutlined), ad()),
]);
const handleClick = e => {
    // console.log('click', e);
    selectedKeys.value = [e.key];


    items[0].label = e.item.originItemValue.label;
    openKeys.value = []

};
watch(openKeys, val => {
    // console.log('openKeys', val);
});


const activeKeyChildren = ref("1")

/**
 * 初始化高
 */
const Ieight = ref({
    y: 500, x: 400
})


const switchLayer = () => {
    rightLayer.value = !rightLayer.value;
    //console.log(rightLayer.value);
};


let terrainSP = ref(false);
/**
 * 地形开启关闭
 */
const onTerrain = () => {
    terrainSP.value = !terrainSP.value;

    terrainSP.value && map.setTerrain({ source: "mapbox-dem", exaggeration: 1.0 });
    !terrainSP.value && map.setTerrain(undefined);

    terrainSP.value && mapp.setTerrain({ source: "mapbox-dem", exaggeration: 1.0 });
    !terrainSP.value && mapp.setTerrain(undefined);
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

/**
 * 模式切换
 */
const three3D = () => {
    if (map.getProjection().name == "globe") {
        map.setProjection("mercator");
        mapp.setProjection("mercator");

        message.success("二维地图切换完成", 1);
    } else {
        map.setProjection("globe");
        mapp.setProjection("globe");

        message.success("三维地图切换完成", 1);
    }



    machine.value = map.getProjection().name;
};



const rightHeight = ref("-3000px")

const state = reactive({
    ZJiSHow: true,
    DMZJiSHow: true,
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

// 图层控制
const state_layer = reactive({
    checked4: true,
    checked5: true,
    checked6: true,
    checked7: true,
    checked8: true,
});




const placement = ref('right');
const opens = ref(false);
const showDrawers = () => {
    opens.value = true;
};
const onClose = () => {
    opens.value = false;
};


/**
 * 选择器
 */
const dataSegmented = reactive([{
    value: '1月',
    disabled: true,
}, {
    value: '2月',
    disabled: true,
}, {
    value: '3月',
    disabled: true,
}, {
    value: '4月',
    disabled: false,
},
{
    value: '5月',
    disabled: false,
},
{
    value: '6月',
    disabled: false,
}, {
    value: '7月',
    disabled: false,
},
{
    value: '8月',
    disabled: false,
},
{
    value: '9月',
    disabled: false,
},
{
    value: '10月',
    disabled: false,
},
{
    value: '11月',
    disabled: true,
},
{
    value: '12月',
    disabled: true,
},
]);
const valueSegmented = ref(dataSegmented[dataSegmented.length - 1]);


/**
 * 监听sa元素的left值变化
 */
let observeSaLeft = ref();



</script>

<template>


    <!-- 头部 -->
    <div class="header">
        <Header></Header>

    </div>

    <!-- 地图 -->

    <div class="verification" :style="{ width: !opens ? '100%' : 'calc(100% - 520px)' }">
        <div id="comparison-container" style="position: absolute;left: 0;top:0;z-index: 1000;width: 100%;height: 100%">
            <div id="before" class="map">
            </div>
            <div id="after" class="map">
            </div>
        </div>

        <!--地图工具栏-->
        <div class="right-tool" :style="MapToolPosition">


            <a-tooltip placement="leftTop">
                <template #title>
                    <span>最佳视野</span>
                </template>
                <a-button @click="fitCenter()" size="large" class="boxshadow">
                    <ScanSearch color="RGB(58,123,251)" />
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
                        <Layers v-if="!rightLayer" color="RGB(58,123,251)" />
                        <X color="RGB(58,123,251)" v-else />
                        <span class="arrow">◣</span>
                    </a-button>
                </a-tooltip>
                <!--图层列表 -->
                <div class="switch-layer" v-if="rightLayer">
                    <a-card title="">
                        <div v-for="item in layers" style="float: left;" :key="item.id" :style="{
                            width: '25%',
                            textAlign: 'center',

                            display: item.projection ? 'block' : 'none',
                        }">
                            <img :src="item.url" style="width: 100%; height: 50px; border-radius: 2px"
                                @click="switchTile(item)" />
                            <div :class="item.isShow ? 'mmapcs-av' : 'mmapcs'">
                                {{ item.name }}
                            </div>
                        </div>
                    </a-card>
                    <br />


                    <a-card v-if="1 == 2">

                        <!--地名注记-->
                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center',
                            padding: '10px'
                        }">
                            <div style=" font-size: 12px; color: #000">
                                地名
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state.DMZJiSHow" size="small" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center', padding: '10px'
                        }">
                            <div style=" font-size: 12px; color: #000">
                                省界
                                <a-switch checked-children="显示" un-checked-children="隐藏" size="small"
                                    v-model:checked="state_layer.checked7" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center', padding: '10px'
                        }">
                            <div style=" font-size: 12px; color: #000">
                                市界
                                <a-switch checked-children="显示" un-checked-children="隐藏" size="small"
                                    v-model:checked="state_layer.checked8" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center', padding: '10px'
                        }">
                            <div style=" font-size: 12px; color: #000">
                                县界
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state_layer.checked4" size="small" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center', padding: '10px'
                        }">
                            <div style=" font-size: 12px; color: #000">
                                镇界
                                <a-switch checked-children="显示" un-checked-children="隐藏"
                                    v-model:checked="state_layer.checked5" size="small" />
                            </div>
                        </a-card-grid>

                        <a-card-grid :style="{
                            width: '25%',
                            textAlign: 'center', padding: '10px'
                        }">
                            <div style=" font-size: 12px; color: #000">
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
                    <Map v-if="machine != 'mercator'" color="RGB(58,123,251)"></Map>
                    <Globe v-else color="RGB(58,123,251)" />
                </a-button>
            </a-tooltip>

            <a-tooltip placement="left">
                <template #title>
                    <span>{{ !ruler ? "开始量测" : "关闭量测" }}</span>
                </template>

                <div v-if="2 == 3">
                    <!-- {{ ruler }} -->
                    <a-button @click="onPencilRuler()" size="large" class="boxshadow">
                        <!-- <PencilRuler /> -->
                        <Ruler v-if="!ruler" color="RGB(58,123,251)" />
                        <X color="RGB(58,123,251)" v-else="ruler" />
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
                                <Scale3D color="RGB(58,123,251)" />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="left">
                            <template #title>
                                <span>距离测量<br />点击左键绘制节点<br />双击左键完成测量</span>
                            </template>
                            <a-button size="large" class="boxshadow" @click="celiang_line_string">
                                <Ruler color="RGB(58,123,251)" />
                                <div>
                                    <Minus color="RGB(58,123,251)" :size="30"
                                        style="position: absolute; left: 12px; top: 26px" />
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


            <a-tooltip placement="leftTop" v-if="1 == 2">
                <template #title>
                    <span>绘制</span>
                </template>
                <div>
                    <!-- {{ draw }} -->
                    <a-button @click="onDraw()" size="large" class="boxshadow">
                        <Pencil color="RGB(58,123,251)" />


                        <span class="arrow">◣</span>
                    </a-button>
                    <!--绘制列表 -->
                    <div class="right-draw" v-if="draw">
                        <a-tooltip placement="leftTop">
                            <template #title>
                                <span>绘制点</span>
                            </template>
                            <a-button size="large" class="boxshadow">
                                <Dot color="RGB(58,123,251)" />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="leftTop">
                            <template #title>
                                <span>绘制线条</span>
                            </template>
                            <a-button size="large" class="boxshadow">
                                <!-- <Route /> -->
                                <Slash color="RGB(58,123,251)" />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="leftTop">
                            <template #title>
                                <span>绘制矩形</span>
                            </template>
                            <a-button size="large" class="boxshadow">
                                <RectangleHorizontal color="RGB(58,123,251)" />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="leftTop">
                            <template #title>
                                <span>绘制多边形</span>
                            </template>
                            <a-button size="large" class="boxshadow">
                                <Pentagon color="RGB(58,123,251)" />
                            </a-button>
                        </a-tooltip>
                        <a-tooltip placement="leftTop">
                            <template #title>
                                <span>绘制圆形</span>
                            </template>
                            <a-button size="large" class="boxshadow">
                                <Circle color="RGB(58,123,251)" />
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
                    <Plus color="RGB(58,123,251)" />
                </a-button>
            </a-tooltip>
            <a-tooltip placement="leftTop">
                <template #title>
                    <span>缩小</span>
                </template>
                <a-button @click="zoomOut()" size="large" class="boxshadow">
                    <Minus color="RGB(58,123,251)" />
                </a-button>
            </a-tooltip>
        </div>
    </div>

    <!-- 页面 -->
    <div class="page">
        <div style="position: absolute;top: 90px;left: 50%; z-index: 1000;margin-left: -275px;">


            <h1 style="font-family: 'FZZongYi-M05'; text-align: center;color: #fff;">
                <span style="text-shadow: 1px 2px 2px #000;"> 2024年玉米长势监测 </span>
            </h1>



            <a-segmented v-model:value="valueSegmented" :options="dataSegmented" />
        </div>


        <a-drawer :width="520" title="" :placement="placement" :open="opens" @close="onClose" :mask="false">
            <br>
            <!-- <a-button style="margin-right: 8px" @click="onClose">关闭</a-button> -->
            <a-button type="primary" @click="onClose" style="position: absolute;right:10px">
                <X></X>
            </a-button>
            <br>
            <br>
            <p>

                <a-typography-title :level="1"
                    style="color: RGB(31,31,31);line-height: 80px;  font-family: 'FZZongYi-M05';">
                    {{ header ?
                        header :
                        "试点县区域"
                    }}
                    <a-tag v-for="item in ygjg.filter(e => (e.quxian == header))" :key="item.quxian"
                        style="z-index: 10000;" color="RGB(81,196,43)">{{ item.ygjg ? item.ygjg : '' }}</a-tag>

                    <a-tag v-if="!header" style="z-index: 10000;" color="RGB(81,196,43)">测绘院</a-tag>
                    <a-tag v-if="!header" style="z-index: 10000;" color="RGB(81,196,43)">航天信德 </a-tag>
                    <a-tag v-if="!header" style="z-index: 10000;" color="RGB(81,196,43)">二十一世纪</a-tag>



                </a-typography-title>

            <div style="margin: -25px 0 15px 0;">
                <a-row type="flex">
                    <a-statistic title="核验年份" value="2024年" />

                    <a-statistic title="核验作物" value="玉米" :style="{
                        margin: '0 32px',
                    }" />

                </a-row>
            </div>

            <div>
                <a-tabs v-model:activeKey="activeKeyChildren" tabBarGutter="2" :centered="true" tabPosition="top">
                    <a-tab-pane key="1" tab="整体">
                        <div v-if="activeKey == 1">
                            <a-table :columns="columnsQqzt" :data-source="dataQqzt" :pagination="false" bordered
                                size="small" :scroll="Ieight">
                                <template #suffix>
                                    %
                                </template>
                                <template #bodyCell="{ column, record }">

                                    <template v-if="column.dataIndex == 'qushi'">

                                        <div v-if="record.repayment > record.borrow" style="color: red;">
                                            <ArrowUp color="red"></ArrowUp> {{ Number(Number(record.repayment) -
                                                Number(record.borrow)).toFixed(2) }}
                                        </div>
                                        <div v-if="record.repayment < record.borrow" style="color: green;">
                                            <ArrowDown color="green"></ArrowDown> {{ Number(Number(record.repayment) -
                                                Number(record.borrow)).toFixed(2) }}
                                        </div>
                                        <div v-if="record.repayment == record.borrow">
                                            无变化
                                        </div>

                                    </template>

                                </template>
                            </a-table>
                        </div>
                        <div v-else>
                            <a-table :columns="columnsDkzt" :data-source="dataDkzt" :pagination="false" bordered
                                size="small" :scroll="Ieight">
                                <template #bodyCell="{ column, record }">

                                    <template v-if="column.dataIndex == 'qushi'">

                                        <div v-if="record.repayment > record.borrow" style="color: red;">
                                            <ArrowUp color="red"></ArrowUp> {{ String(Number(Number(record.repayment) -
                                                Number(record.borrow)).toFixed(0)) }}
                                        </div>
                                        <div v-if="record.repayment < record.borrow" style="color: green;">
                                            <ArrowDown color="green"></ArrowDown> {{ String(
                                                parseInt(Number(record.repayment) -
                                                    Number(record.borrow)).toFixed(0)) }}
                                        </div>
                                        <div v-if="record.repayment == record.borrow">
                                            无变化
                                        </div>

                                    </template>

                                </template>
                            </a-table>
                        </div>

                    </a-tab-pane>
                    <a-tab-pane key="2" tab="地区">

                    </a-tab-pane>
                    <a-tab-pane key="3" tab="机构">

                    </a-tab-pane>
                </a-tabs>

                <div v-show="activeKeyChildren == '2'">


                    <div v-show="activeKey == 1">
                        <a-table :columns="columnsQqdq" :data-source="dataQqdq" :pagination="false" :scroll="Ieight"
                            size="small" bordered>
                            <template #bodyCell="{ column, record }">

                                <template v-if="column.dataIndex == 'repayment2'">

                                    <div v-if="record.repayment2 > 1.05" style="color: red;">
                                        超保
                                    </div>

                                    <div v-if="record.repayment2 < 0.6" style="color: orange;">
                                        不足
                                    </div>
                                    <div v-if="(record.repayment2 >= 0.6 && record.repayment2 <= 1.05)"
                                        style="color: green;">
                                        合格
                                    </div>

                                </template>
                                <template v-if="column.dataIndex == 'repayment'">

                                    <div v-if="record.repayment > 0" style="color: red;">
                                        <ArrowUp color="red"></ArrowUp><br> {{ record.repayment }}
                                    </div>
                                    <div v-if="record.repayment < 0" style="color: green;">
                                        <ArrowDown color="green"></ArrowDown><br> {{ record.repayment }}
                                    </div>
                                    <div v-if="record.repayment == 0">
                                        无变化
                                    </div>

                                </template>

                            </template>
                        </a-table>
                        <a-button type="link" :href="'/data/20241226/区域-地区-两次对比.xlsx'" :size="size">查看详细信息</a-button>

                    </div>

                    <div v-show="activeKey == 2">
                        <a-table :columns="columnsDkdq" :data-source="dataDkdq" :pagination="false" :scroll="Ieight"
                            size="small" bordered></a-table>

                        <a-button type="link" :href="'/data/20241226/区域-机构-两次对比.xlsx'" :size="size">查看详细信息</a-button>
                    </div>
                </div>

                <div v-show="activeKeyChildren == '3'">



                    <div v-show="activeKey == 1">
                        <a-table :columns="columnsQqjg" :data-source="dataQqjg" :pagination="false" bordered
                            :scroll="Ieight" size="small"></a-table>
                        <a-button type="link" :href="'/data/20241226/地块-地区-两次对比.xlsx'" :size="size">查看详细信息</a-button>
                    </div>

                    <div v-show="activeKey == 2">
                        <a-table :columns="columnsDkjg" :data-source="dataDkjg" :pagination="false" bordered
                            :scroll="Ieight" size="small"></a-table>
                        <a-button type="link" :href="'/data/20241226/地块-机构-两次对比.xlsx'" :size="size">查看详细信息</a-button>
                    </div>

                    <!-- <a-button type="link" :size="size">查看详细信息</a-button> -->


                </div>
            </div>




            </p>

        </a-drawer>




        <!-- 左侧菜单栏 -->
        <div style="position: absolute;left: 15px;top: 100px;z-index: 1000;">

            <a-menu id="dddddd" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeysNume"
                :inlineCollapsed="false"
                style=" background: linear-gradient(to bottom, rgba(251, 250, 250, 0.93), rgba(204, 204, 204, 0.898));border-radius: 3px; "
                :items="items" @click="handleClick"></a-menu>
        </div>
        <!-- 中间 -->
        <div class="center-card" :style="{ cursor: 'all-scroll', left: !opens ? '50%' : '40%' }">

        </div>


        <!--右侧统计栏-->

        <div class="right-card" :style="{ top: rightHeight ? rightHeight : '-3000px' }">

            <a-typography-title :level="1"
                style="color: RGB(31,31,31);line-height: 80px;  font-family: 'FZZongYi-M05';">
                {{ header ?
                    header :
                    "试点县区域"
                }}
                <a-tag v-for="item in ygjg.filter(e => (e.quxian == header))" :key="item.quxian" style="z-index: 10000;"
                    color="RGB(81,196,43)">{{ item.ygjg ? item.ygjg : '' }}</a-tag>

                <a-tag v-if="!header" style="z-index: 10000;" color="RGB(81,196,43)">测绘院</a-tag>
                <a-tag v-if="!header" style="z-index: 10000;" color="RGB(81,196,43)">航天信德 </a-tag>
                <a-tag v-if="!header" style="z-index: 10000;" color="RGB(81,196,43)">二十一世纪</a-tag>



            </a-typography-title>

            <div style="margin: -25px 0 15px 0;">
                <a-row type="flex">
                    <a-statistic title="核验年份" value="2024年" />

                    <a-statistic title="核验作物" value="玉米" :style="{
                        margin: '0 32px',
                    }" />

                </a-row>
            </div>

            <div>
                <a-tabs v-model:activeKey="activeKeyChildren" tabBarGutter="2" :centered="true" tabPosition="top">
                    <a-tab-pane key="1" tab="整体">
                        <div v-if="activeKey == 1">
                            <a-table :columns="columnsQqzt" :data-source="dataQqzt" :pagination="false" bordered
                                size="small" :scroll="Ieight">
                                <template #suffix>
                                    %
                                </template>
                                <template #bodyCell="{ column, record }">

                                    <template v-if="column.dataIndex == 'qushi'">

                                        <div v-if="record.repayment > record.borrow" style="color: red;">
                                            <ArrowUp color="red"></ArrowUp> {{ Number(Number(record.repayment) -
                                                Number(record.borrow)).toFixed(2) }}
                                        </div>
                                        <div v-if="record.repayment < record.borrow" style="color: green;">
                                            <ArrowDown color="green"></ArrowDown> {{ Number(Number(record.repayment) -
                                                Number(record.borrow)).toFixed(2) }}
                                        </div>
                                        <div v-if="record.repayment == record.borrow">
                                            无变化
                                        </div>

                                    </template>

                                </template>
                            </a-table>
                        </div>
                        <div v-else>
                            <a-table :columns="columnsDkzt" :data-source="dataDkzt" :pagination="false" bordered
                                size="small" :scroll="Ieight">
                                <template #bodyCell="{ column, record }">

                                    <template v-if="column.dataIndex == 'qushi'">

                                        <div v-if="record.repayment > record.borrow" style="color: red;">
                                            <ArrowUp color="red"></ArrowUp> {{ String(Number(Number(record.repayment) -
                                                Number(record.borrow)).toFixed(0)) }}
                                        </div>
                                        <div v-if="record.repayment < record.borrow" style="color: green;">
                                            <ArrowDown color="green"></ArrowDown> {{ String(
                                                parseInt(Number(record.repayment) -
                                                    Number(record.borrow)).toFixed(0)) }}
                                        </div>
                                        <div v-if="record.repayment == record.borrow">
                                            无变化
                                        </div>

                                    </template>

                                </template>
                            </a-table>
                        </div>

                    </a-tab-pane>
                    <a-tab-pane key="2" tab="地区">

                    </a-tab-pane>
                    <a-tab-pane key="3" tab="机构">

                    </a-tab-pane>
                </a-tabs>

                <div v-show="activeKeyChildren == '2'">


                    <div v-show="activeKey == 1">
                        <a-table :columns="columnsQqdq" :data-source="dataQqdq" :pagination="false" :scroll="Ieight"
                            size="small" bordered>
                            <template #bodyCell="{ column, record }">

                                <template v-if="column.dataIndex == 'repayment2'">

                                    <div v-if="record.repayment2 > 1.05" style="color: red;">
                                        超保
                                    </div>

                                    <div v-if="record.repayment2 < 0.6" style="color: orange;">
                                        不足
                                    </div>
                                    <div v-if="(record.repayment2 >= 0.6 && record.repayment2 <= 1.05)"
                                        style="color: green;">
                                        合格
                                    </div>

                                </template>
                                <template v-if="column.dataIndex == 'repayment'">

                                    <div v-if="record.repayment > 0" style="color: red;">
                                        <ArrowUp color="red"></ArrowUp><br> {{ record.repayment }}
                                    </div>
                                    <div v-if="record.repayment < 0" style="color: green;">
                                        <ArrowDown color="green"></ArrowDown><br> {{ record.repayment }}
                                    </div>
                                    <div v-if="record.repayment == 0">
                                        无变化
                                    </div>

                                </template>

                            </template>
                        </a-table>
                        <a-button type="link" :href="'/data/20241226/区域-地区-两次对比.xlsx'" :size="size">查看详细信息</a-button>

                    </div>

                    <div v-show="activeKey == 2">
                        <a-table :columns="columnsDkdq" :data-source="dataDkdq" :pagination="false" :scroll="Ieight"
                            size="small" bordered></a-table>

                        <a-button type="link" :href="'/data/20241226/区域-机构-两次对比.xlsx'" :size="size">查看详细信息</a-button>
                    </div>
                </div>

                <div v-show="activeKeyChildren == '3'">



                    <div v-show="activeKey == 1">
                        <a-table :columns="columnsQqjg" :data-source="dataQqjg" :pagination="false" bordered
                            :scroll="Ieight" size="small"></a-table>
                        <a-button type="link" :href="'/data/20241226/地块-地区-两次对比.xlsx'" :size="size">查看详细信息</a-button>
                    </div>

                    <div v-show="activeKey == 2">
                        <a-table :columns="columnsDkjg" :data-source="dataDkjg" :pagination="false" bordered
                            :scroll="Ieight" size="small"></a-table>
                        <a-button type="link" :href="'/data/20241226/地块-机构-两次对比.xlsx'" :size="size">查看详细信息</a-button>
                    </div>

                    <!-- <a-button type="link" :size="size">查看详细信息</a-button> -->


                </div>
            </div>




        </div>

    </div>


    <!--图例-->

    <div style="position: absolute;bottom: 35px;right: 20px;z-index: 1000;">
        <JianceLegend v-if="activeKey == 1" core="map"></JianceLegend>
    </div>

    <!--图层控制-->
    <div class="tuli" :style="{ left: (observeSaLeft - 200) + 'px' }">
        <TucengLegend v-if="activeKey == 1" core="map"></TucengLegend><br>

    </div>

    <div class="tuli-right" :style="{ left: observeSaLeft + 'px' }">
        <TucengLegend v-if="activeKey == 1" core="mapp"></TucengLegend><br>
    </div>




    <div id="text">
        <table class="text">
            <tr>
                <th colspan="10">

                    <div
                        style=" font-size: 18px;text-align: left;padding: 5px 2px;background-color: RGB(72,123,248) ;display: flex;align-items: center;color: #fff">

                        <ShieldCheck :size="22" />
                        &nbsp;保单信息
                    </div>
                </th>
            </tr>
            <tr>

                <th>被保险人：</th>
                <td>{bbxrmc}</td>
            </tr>
            <tr>

                <th>保单号：</th>
                <td style="font-size: 15px;">{bdh}</td>
            </tr>
            <tr>

                <th>投保地点：</th>
                <td>{province_city_county_town_village} </td>
            </tr>
            <tr>

                <th>保险机构：</th>
                <td>{bxjg}</td>
            </tr>
            <tr>

                <th>遥感机构：</th>
                <td>{ygjg}</td>
            </tr>
            <tr>

                <th>险种名称：</th>
                <td>{xianzhong}</td>
            </tr>
            <tr>

                <th>投保数量：</th>
                <td>{tbsl}亩</td>
            </tr>
            <!-- <tr>

                <th>保险期间：</th>
                <td>{bxqj}</td>
            </tr> -->
            <tr>
                <th colspan="10">
                    <div
                        style=" font-size: 18px;text-align: left;padding: 5px 2px;background-color: RGB(72,123,248) ;display: flex;align-items: center;color: #fff">
                        <UserCheck :size="22" />&nbsp;大户信息
                    </div>

                </th>
            </tr>
            <tr>

                <th>大户地块核验：</th>
                <td>{v8} </td>
            </tr>
            <tr>

                <th>地块面积核验：</th>
                <td>{v3}</td>
            </tr>
            <tr>

                <th>地块重叠核验：</th>
                <td> {v4}</td>
            </tr>
            <tr>

                <th>标的面积核验：</th>
                <td> {v7}</td>
            </tr>
            <tr>
                <th>地块面积信息：</th>
                <td>面积：{v1} 亩 <br> 占比：{v2} %</td>
            </tr>
            <tr>

                <th>地块标的信息：</th>
                <td>标的面积：{v5} 亩<br>标的占比：{v6} %</td>
            </tr>



        </table>
    </div>


</template>


<style scoped>
.verification {
    position: absolute;
    left: 0;
    top: 0;

    height: 100%;
}

.header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: linear-gradient(to bottom, rgba(251, 250, 250, 0.93), rgba(204, 204, 204, 0.798));
    z-index: 100000;
    color: #0e0e0e;
    outline: 1px solid #ccc;

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

.tuli {
    position: absolute;
    left: 15px;
    bottom: 10px;
    z-index: 1000;
}

.tuli-right {
    position: absolute;
    bottom: 10px;
    z-index: 1000;
    margin-left: 20px;
}

.layer {
    position: absolute;
    left: 210px;
    bottom: 20px;
}

.left-card {
    position: absolute;
    width: 450px;
    left: 0;
    top: 100px;
    max-height: calc(100% - 100px);
    z-index: 1000;
}

.right-card {
    position: absolute;
    right: 15px;
    top: 92px;
    width: 550px;

    z-index: 1000;
    height: calc(100% - 250px);
    background: linear-gradient(to bottom, rgba(251, 250, 250, 0.93), rgba(204, 204, 204, 0.798));
    padding: 10px;
    /* box-shadow: 2px 2px 5px #f5f4f469 inset; */
    font-family: 'FZZongYi-M05';

}

.center-card {
    /* display: flex;
    justify-content: center;
    justify-items: center; */
    width: 400px;
    z-index: 1000;
    position: absolute;
    top: 100px;

    margin-left: -335px;
    /* background-color: #ccc */
    /* background: linear-gradient(to bottom, rgba(19, 18, 18, 0.39), rgba(3, 11, 85, 0)); */

}

.center-card-title {
    font-size: 40px;
    color: #f7f1f1d5;
}

p {
    padding: 5px;
    /* background: linear-gradient(to bottom, rgba(204, 204, 204, 0.1), rgba(204, 204, 204, 0.2)); */
    border-radius: 2px;
    border-bottom: 1px dotted #cccccc38;
    background: rgba(204, 204, 204, 0.08)
}



::v-deep .ant-select-selector {
    border: 0;
    background-color: transparent;
}

.hovering {
    background-color: rgba(18, 126, 214, 0.058);
    outline: 1.5px solid rgba(18, 126, 214, 0.658);
    border-radius: 2px;
}



::v-deep .ant-tabs-tab .ant-tabs-tab-btn {
    width: 180px;
    text-align: center;
}

.tjfx {
    height: 240px
}


.tjfx th {
    font-size: 16px;
    color: #5a5959;
    text-align: left;




}

.tjfx td {
    font-size: 18px;
    color: #5a5959;
    text-align: right;


}


::v-deep .ant-divider-with-text {
    margin: 5px 0;
}

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



::v-deep .ant-page-header-heading-title {
    color: #323334;
}

::v-deep .ant-page-header-heading-sub-title {
    color: #66757f;
    font-weight: 600;

}

::v-deep .ant-menu-light {
    color: #66757f;
    font-weight: 600;
}

::v-deep .ant-picker input {
    color: #66757f;
}


.xRightSquareShow {
    position: absolute;
    right: 12px;
    top: 120px;
    cursor: pointer;
    padding: 13px 14px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    border-radius: 2px;
    color: #fff;
    border: 1px double #99999986;
}

.xSquareShow {
    position: absolute;
    left: 12px;
    top: 120px;
    cursor: pointer;
    padding: 13px 14px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    border-radius: 2px;
    color: #fff;
    border: 1px double #99999986;
}



.text th {
    border-collapse: collapse;
    font-size: 17px;
    text-align: right;
    padding: 2px 3px;
    letter-spacing: -1px;
    width: 120px;
    color: #2c2c2c;
}

.text tr {

    /* border-bottom: 1px dotted #2c2c2c61; */
    /* background-color: #ccc; */
}

.text td {
    border-collapse: collapse;
    font-size: 17px;
    text-align: left;
    width: 180px;
    letter-spacing: -1px;
    color: #2c2c2c;

}

.text {
    cursor: pointer;
}


.demo-class {
    border-bottom: 1px dotted rgb(215, 212, 212);
    padding: 0;
}

::v-deep .ant-statistic .ant-statistic-title {
    padding: 0;
    margin: 0;
    color: rgb(93, 91, 91);
    font-size: 16px;
}

::v-deep .ant-statistic {
    padding: 0 10px;
}

::v-deep .ant-statistic .ant-statistic-content {
    font-size: 22px;
    line-height: 30px;
}




::v-deep .ant-segmented-item-selected {
    background-color: #3277fc;
    color: #fff;

}


::v-deep .ant-tabs .ant-tabs-tab+.ant-tabs-tab {
    margin: 0
}

::v-deep .ant-tabs-nav .ant-tabs-nav-operations {
    display: none;
}


::v-deep .ant-tabs-tab .ant-tabs-tab-btn {
    width: 160px;
}

::v-deep .ant-timeline-item-tail {
    border-inline-start: 3px solid rgba(249, 249, 249, 0);


}

::v-deep .ant-page-header .ant-page-header-content {
    margin: 0;
    padding: 0;
    background-color: #48b04c;
}

.right-tool {
    position: absolute;
    right: 15px;
    top: 110px;
    /* width: 2rem; */
    z-index: 1000;
}

.boxshadow {
    cursor: pointer;

    /* background-color: rgba(0, 0, 0, 0.6); */
    background: linear-gradient(to bottom, rgba(251, 250, 250, 0.93), rgba(204, 204, 204, 0.798));
    border-radius: 2px;
    width: 50px;
    height: 50px;
    color: #ccc;
    border: 1px solid #99999986;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0 5px 0;
}

.boxshadow:hover {
    background-color: #3277fc;
    color: #fff;
}

.arrow {
    position: absolute;
    left: 1px;
    bottom: -6px;
}

.right-ruler,
.right-draw {
    position: absolute;
    right: 60px;
    z-index: 1000;
    border: 0;
    margin-top: -58px;
}

.switch-layer {
    position: absolute;
    right: 81px;
    top: 100px;
    width: 400px;
    z-index: 1000;
    border: 0;
}



.pst>img {
    height: 50px;
    width: 50px;
    cursor: pointer;
}

.mmapcs {
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    position: relative;

    color: #faf9f9c0;
    font-size: 0.8rem;
    font-weight: 3000;
}

.mmapcs-av {
    /* background-color: #2b8ee7; */
    background: linear-gradient(to bottom, #2b8fe79c, #2b8fe7f8);
    z-index: 1000;
    position: relative;

    color: #f2f2f8ec;
    font-size: 0.8rem;

}

::v-deep .mapboxgl-popup-content {
    background: linear-gradient(to bottom, rgba(251, 250, 250, 0.83), rgba(251, 250, 250, 0.83));
}

.map {

    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}

/* For demo */
:deep(.slick-slide) {
    text-align: center;
    height: 100px;
    line-height: 100px;
    /* background: red; */
    overflow: hidden;
    font-size: 20px;
}

:deep(.slick-slide h3) {
    color: #eeeeefc7;
    text-shadow: 2px 3px 2px #000;
}

:deep(.slick-dots li button) {
    background-color: RGB(66, 119, 249);
    height: 5px;
    width: 20px;
    opacity: 1;
    box-shadow: 1px 1px 2px #000;
}
</style>