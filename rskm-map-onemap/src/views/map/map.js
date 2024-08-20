import { config, mapbox, api } from "@/config/map.js";
import { waySpec } from "../../config/spec";
import { fills } from "../../config/fill";
import StateManager from "@/utils/state_manager"
import dayjs from "dayjs";
/**
 * 旋转事件
 */
const eventRotate = () => {
    let bear = map.getBearing();
    let pitch = map.getPitch();
    let rad = -(bear * (Math.PI / 180));
    let r = document.getElementById("Zero");
    r && (r.style.transform = `rotateZ(${rad}rad)`);

    bear = undefined;
    rad = undefined;
    r = undefined;
}

/**
 * 渲染事件
 */
const eventRender = () => {

    let MAP_LAYERS = StateManager.get("MAP_LAYERS") || "{}";
    let ll = {
        lng: (window["lnglatrender"] || { lng: 0, lat: 0 }).lng.toFixed(6),
        lat: (window["lnglatrender"] || { lng: 0, lat: 0 }).lat.toFixed(6),
    } || { lng: 0, lat: 0 };
    let sth = MAP_LAYERS.st ? "审图号：" + MAP_LAYERS.st : "";
    let mc = "RSKM";
    let zoom = map.getZoom().toFixed(2); //
    let ty = MAP_LAYERS.name || "";
    let pro = map.getProjection().name || "default";


    document.getElementById("xyz").innerHTML = `
    <span style='padding-right: 10px;'>${sth}</span>
    <span style='padding-right: 10px;' >© ${mc}</span>
    <span style='padding-right: 10px;'>经纬度：${ll.lng}° ${ll.lat}°</span>
    <span style='padding-right: 10px;'>等级：${zoom} </span>
     <span style='padding-right: 10px;'>模式：${(pro == "globe") ? "三维" : "二维"} </span>
    <span style='padding-right: 10px;'>${ty}</span>`;

    MAP_LAYERS = undefined;
    ll = undefined;
    sth = undefined;
    zoom = undefined;
    ty = undefined;
}

/**
 * 鼠标浮动
 */
const popup = new mapboxgl.Popup({
    closeOnClick: false,
    closeButton: false,
    maxWidth: "350px",
});

/**
 * 鼠标浮动
 */
const popupbig = new mapboxgl.Popup({
    closeOnClick: true,
    closeButton: true,
    maxWidth: "380px",
});



// 添加
const addLayers = () => {
    // 配图
    waySpec.forEach((layer) => {
        map.getLayer(layer.id) && map.removeLayer(layer.id);
    });

    // 源数据
    let sources = config;

    for (let source in sources) {
        //console.log(source);
        map.getSource(sources[source].name) && map.removeSource(sources[source].name);
    }

    // 重载数据

    for (let source in sources) {
        !map.getSource(sources[source].name) &&
            map.addSource(sources[source].name, sources[source].tile);
    }

    // 重载配图
    waySpec.forEach((spec) => {
        //console.log(spec);
        !map.getLayer(spec.id) && map.addLayer(spec);
    });
};

const addIcon = () => {
    fills.forEach((f) => {
        map.loadImage(f.icon, (err, image) => {
            if (!map.hasImage(f.id)) {
                map.addImage(f.id, image);
            }
        });
    });
};

const setPopup = async (data) => {

    let feature = await api.get_insure_by_gid("rskm_pt", `and gid=${data.properties.gid}`)
    feature = feature[0];
    if (!feature) return false

    let insurancenum = feature.insurancenum || "";
    let area_mi = feature.area_mi
        ? Number(feature.area_mi).toFixed(2)
        : "";
    let area_mu = feature.area_mi
        ? (Number(feature.area_mi) / 667).toFixed(2)
        : "";
    let start_date = dayjs(feature.start_date).format("YYYY/MM/DD") || "";
    let end_date = dayjs(feature.end_date).format("YYYY/MM/DD");
    let insured_quantity = Number(feature.insured_quantity).toFixed(2) || "";
    let province_city_county_town_village =
        (feature.province || "") +
        (feature.city || "") +
        (feature.county || "") +
        (feature.town || "") +
        (feature.village || "");
    let r_data = feature.r_data || "";
    let t_data = feature.t_data || "";
    // let insurcompany_code = feature.insurcompany_code || "";
    // let insurcompany = window["rskm_pt_insure_com"].filter(
    //     (r) => r.insurcompanycode == insurcompany_code
    // );

    let insured = feature.insured || "";

    let codenum_code = feature.i_com_name || "";
    let codenum_type = feature.i_type_name || "";


    let text = `
        <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 14px;"  title="${r_data + t_data
        }" >
        <tr style="line-height:1.5;border-top:0.5px dotted rgba(255,255,255,0.1);    font-size: 14px;"><th width="60" style="vertical-align: center;" rowspan="12" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-chart-gantt"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/></svg>
            <br>基本<br>信息</th>
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
        <br>分析<br>数据</th> </tr>
        <tr><th style="text-align: right;width:80px;padding-right:5px;">数据符合:</th><td style="" ><span style=" letter-spacing:0.5px;">${(
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


export {
    eventRotate,
    eventRender,
    popup,
    popupbig,
    addLayers,
    addIcon,
    setPopup
}