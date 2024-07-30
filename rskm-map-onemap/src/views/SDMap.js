import { config, mapbox, api } from "@/config/map.js";
import { waySpec } from "../config/spec";
import { fills } from "../config/fill";
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
    let MAP_LAYERS = localStorage.getItem("MAP_LAYERS") || "{}";
    let ll = {
        lng: (window["lnglatrender"] || { lng: 0, lat: 0 }).lng.toFixed(6),
        lat: (window["lnglatrender"] || { lng: 0, lat: 0 }).lat.toFixed(6),
    } || { lng: 0, lat: 0 };
    let sth = JSON.parse(name).st ? "审图号：" + JSON.parse(name).st : "";
    let mc = "RSKM";
    let zoom = map.getZoom().toFixed(2); //
    let ty = JSON.parse(name).name || "";

    document.getElementById("xyz").innerHTML = `
    <span style='padding-right: 10px;'>${sth}</span>
    <span style='padding-right: 10px;' >© ${mc}</span>
    <span style='padding-right: 10px;'>经纬度：${ll.lng} ${ll.lat}</span>
    <span style='padding-right: 10px;'>等级：${zoom} </span>
    <span style='padding-right: 10px;'>图源：${ty}</span>`;

    name = undefined;
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


export {
    eventRotate,
    eventRender,
    popup,
    popupbig,
    addLayers,
    addIcon
}