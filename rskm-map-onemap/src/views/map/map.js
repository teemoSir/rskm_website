/**
 * @file 地图组件和相关工具函数
 * @module 地图组件
 */

import { config, mapbox } from "@/config/tileserver.js";
import { api } from "@/config/api.js";
import { specYghy } from "../../config/spec-yghy";
import { spec } from "../../config/spec";
import { fills } from "../../config/fill";
import StateManager from "@/utils/state_manager"
import dayjs from "dayjs";
import page from "../../../package.json";
import { storeToRefs } from "pinia";
import { treeStore } from "@/store/store.js";

const storeTree = treeStore();
const { treeXz, treeJg, treeQy, searchTypeStore, searchNameStore } = storeToRefs(storeTree);

/**
 * 处理地图旋转事件
 * @function
 * @returns {void}
 */
const eventRotate = () => {
    const bear = map.getBearing();
    const pitch = map.getPitch();
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

    map && (document.getElementById("xyz").innerHTML = `
     <span style='padding-right: 10px;'>© ${page.name}</span>
    <span style='padding-right: 10px;'>${MAP_LAYERS.st ? `审图号：${MAP_LAYERS.st}` : ""}</span>
    <span style='padding-right: 10px;'>经纬度：${ll.lng}° ${ll.lat}°</span>
    <span style='padding-right: 10px;'>等级：${map.getZoom().toFixed(2) || ""} </span>
    <span style='padding-right: 10px;'>模式：${(map.getProjection().name || "default") === "globe" ? "三维" : "二维"} </span>
    <span style='padding-right: 10px;'>${MAP_LAYERS.name || ""}</span>`);


}

/**
 * Mapbox 小型弹出窗口实例
 * @type {mapboxgl.Popup}
 */
const popup = new mapboxgl.Popup({
    closeOnClick: false,
    //  closeButton: false,
});

popup.setOffset(5);

/**
 * Mapbox 大型弹出窗口实例
 * @type {mapboxgl.Popup}
 */
const popupbig = new mapboxgl.Popup({
    closeOnClick: true,
    //  closeButton: true,
    maxWidth: "480px",

});

popupbig.setOffset(5);

/**
 * 向地图添加图层
 * @function
 * @returns {void}1
 */
const addLayers = () => {
    spec.forEach((layer) => {
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

    spec.forEach((s) => {
        !map.getLayer(s.id) && map.addLayer(s);
    });
};

/**
 * 向地图添加图层-遥感核验
 * @function
 * @returns {void}1
 */
const addLayersYghy = () => {
    specYghy.forEach((layer) => {
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

    specYghy.forEach((spec) => {
        !map.getLayer(spec.id) && map.addLayer(spec);
    });
};

/**
 * 向地图添加图标
 * @function
 * @returns {void}
 */
const addIcon = () => {
    fills.forEach((f) => {
        map.loadImage(f.icon, (err, image) => {
            if (!map.hasImage(f.id)) {
                map.addImage(f.id, image);
            }
        });
    });
};

/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setPopup = async (data) => {
    const feature = await api.get_table_by_filter("rskm_pt", `and gid=${data.properties.gid}`, ` gid, insurancenum, insurcompany_code, insured, start_date, end_date, region_code, insurance_id, create_date, city, county, province, village, town, insurancetarget, insured_quantity, area_mi, area_mu, i_com_name, i_type_name `);
    if (!feature[0]) return false;

    const insurancenum = feature[0].insurancenum || "";
    const area_mi = feature[0].area_mi
        ? Number(feature[0].area_mi).toFixed(2)
        : "";
    const area_mu = feature[0].area_mi
        ? (Number(feature[0].area_mi) / 667).toFixed(2)
        : "";
    const start_date = dayjs(feature[0].start_date).format("YYYY/MM/DD") || "";
    const end_date = dayjs(feature[0].end_date).format("YYYY/MM/DD");
    const insured_quantity = Number(feature[0].insured_quantity).toFixed(2) || "";
    const province_city_county_town_village =
        (feature[0].province || "") +
        (feature[0].city || "") +
        (feature[0].county || "") +
        (feature[0].town || "") +
        (feature[0].village || "");
    const r_data = feature[0].r_data || "";
    const t_data = feature[0].t_data || "";
    const insured = feature[0].insured || "";
    const codenum_code = feature[0].i_com_name || "";
    const codenum_type = feature[0].i_type_name || "";

    const text = `
        <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 14px;"  title="${r_data + t_data
        }" >
        <tr style="line-height:1.5;border-top:0.5px dotted rgba(255,255,255,0.1);    font-size: 14px;"><th width="30" style="vertical-align: center;" rowspan="12" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-chart-gantt"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/></svg>
            <br></th>
        </tr>
        <tr style="line-height:1.5;" ><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;  ">保单:</th><td >${insurancenum}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px">机构:</th><td >${codenum_code}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px">承保数量:</th><td >${insured_quantity}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px">保期:</th><td >${start_date} 至 ${end_date}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">险种:</th><td > ${codenum_type}</td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">被保人:</th><td >${insured}</td></tr>

        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">位置:</th><td>${province_city_county_town_village} </td></tr>
        <tr style="   font-size: 14px;"><th rowspan="4" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>
        <br></th> </tr>
        <tr><th style="text-align: right;width:80px;padding-right:5px;">面积匹配:</th><td style="" ><span style=" letter-spacing:0.5px;">${(
            (area_mu / insured_quantity) *
            100
        ).toFixed(2)} %</span></td><td></td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">标的面积:</th><td style=""> ${area_mi} ㎡ / ${area_mu} 亩
        </td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">重复地块:</th><td style=""> 0
        </td></tr>
        </table>
    `;

    return text
}

/**
 * 过滤地图上的要素
 * @function
 * @param {string[]} layers - 要过滤的图层名称
 * @param {any[]} filter - 过滤表达式
 * @returns {void}
 */
const filterFeature = (layers, filter = []) => {
    layers.forEach((gd) => {
        map.setFilter(gd, filter);
    });
};

/**
 * 应用过滤器到 RSKM 图层
 * @function
 * @returns {void}
 */
const filterRskm = () => {
    // console.log(treeXz.value?.length);
    // console.log(treeXz.value);
    // console.log(treeJg.value?.length);
    // console.log(treeJg.value);
    // console.log(treeQy.value?.length);
    // console.log(treeQy.value);

    const layers = ["rskm_pt", "rskm_pt_name", "rskm_pt_name_1", "rskm_pt_outline"];

    if ((treeXz.value?.length === 0 || treeJg.value?.length === 0 || treeQy.value?.length === 0) && !searchNameStore.value) {
        filterFeature(layers, ["in", "insurancenum", ""]);
    } else if (treeXz.value?.length > 0 || treeJg.value?.length > 0 || treeQy.value?.length > 0 || searchNameStore.value) {
        const tree = ["all"];

        if (treeXz.value[0] !== "0-0") {
            const arrs = treeXz.value.filter(e => e.split("-").length > 3).map(e => e.split("-")[3]);
            tree.push(["in", "insurancetarget", ...arrs]);
        }

        if (treeJg.value[0] !== "0-0") {
            const arrs = treeJg.value.filter(e => e.split("-").length > 2).map(e => e.split("0-0-")[1]);
            tree.push(["in", "insurcompany_code", ...arrs]);
        }

        if (searchNameStore.value && searchTypeStore.value == "区域") {
            tree.push(
                // [
                //     "any",
                //     [">", ["index-of", ["get", "province"], searchNameStore.value.trim()], -1],
                //     [">", ["index-of", ["get", "city"], searchNameStore.value.trim()], -1],
                //     [">", ["index-of", ["get", "county"], searchNameStore.value.trim()], -1],
                //     [">", ["index-of", ["get", "town"], searchNameStore.value.trim()], -1],
                //     [">", ["index-of", ["get", "village"], searchNameStore.value.trim()], -1],
                // ]


                [">", ["index-of", searchNameStore.value.trim(), ["concat", ['to-string', ['get', "province"]], ['to-string', ['get', "city"]], ['to-string', ['get', "county"]], ['to-string', ['get', "town"]], ['to-string', ['get', "village"]]]], -1],
            )
        }

        if (searchNameStore.value && searchTypeStore.value == "单号") {
            tree.push(
                ["in", "insurancenum", searchNameStore.value.trim()]
            )
        }


        if (treeQy.value[0] !== "0-0") {


            const townCodes = [];
            const countryCodes = [];
            const cityCodes = [];

            for (const e of treeQy.value) {
                const code = e.split("-")[e.split("-").length - 1];
                const dashCount = (e.match(/-/g) || []).length;
                dashCount === 4 && townCodes.push(code);
                dashCount === 3 && countryCodes.push(code);
                dashCount === 2 && cityCodes.push(code.slice(0, 4));
            }

            const isCity = ["any"];
            if (townCodes.length > 0) {
                townCodes.forEach(code => isCity.push(["==", ["slice", ["get", "region_code"], 0, 9], code]));
            }

            if (countryCodes.length > 0) {
                countryCodes.forEach(code => isCity.push(["==", ["slice", ["get", "region_code"], 0, 6], code]));
            }

            if (cityCodes.length > 0) {
                cityCodes.forEach(code => isCity.push(["==", ["slice", ["get", "region_code"], 0, 4], code]));
            }

            tree.push(isCity);
        }
        console.log(tree);
        filterFeature(layers, tree);
    } else {
        filterFeature(layers, null);
    }

    // 数据筛选分页
    pageSizeUpdate();
};

const pageSizeUpdate = () => {

}

/**
 * 计算字符串中破折号的出现次数
 * @function
 * @param {string} str - 输入字符串
 * @returns {number} 破折号出现的次数
 */
const countDashOccurrences = (str) => (str.match(/-/g) || []).length;

export {
    eventRotate,
    eventRender,
    popup,
    popupbig,
    addLayers,
    addLayersYghy,
    addIcon,
    setPopup,
    filterFeature,
    filterRskm
}