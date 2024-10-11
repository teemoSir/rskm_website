<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import SDMap from "@/views/map/index.vue";
import Header from "@/components/header/index.vue";
import {
  BookX,
  CalendarPlus,
  CheckCheckIcon,
  Download,
  GitPullRequestCreate,

  Home,

  Satellite,

  TowerControl,

  TrainFrontTunnelIcon,
  TreesIcon
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StateManager from "@/utils/state_manager";
import { shandongArea } from "./data"

import {
  addLayersYghy, popup, popupbig
} from "@/views/map/map.js";

import VerificationLegend from "@/views/map/verificationLegend.vue"
import * as turf from "@turf/turf";

// 设置语言
dayjs.locale('zh-cn');


// 路由
const router = useRouter();


/**
 * 统计图更新
 */
const chardata = ref([
  { value: 78, name: '核验合格' },
  { value: 22, name: '核验不合格' },
])

// 初始化echarts
const loadEcharts = () => {
  // console.log(echarts)
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option = {
    color: ["#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      " #ea7ccc"],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '2%',
      left: 'center'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },

        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: chardata.value,
        label: {
          show: true,
          formatter: '{b}: {d}%',
        },
        labelLine: {
          show: true
        }
      }
    ]
  };

  option && myChart.setOption(option);

}

// 表格数据
const dataSource = ref([])




// 表格列
const columns = [

  // {
  //   title: '序号',
  //   dataIndex: 'number',
  //   key: 'number',
  // },
  {
    title: '保单信息',
    dataIndex: 'bdh',
    key: 'bdh', width: 200

  },
  // {
  //   title: '被保险人',
  //   dataIndex: 'name',
  //   key: 'name', width: 100
  // },
  // {
  //   title: '身份编码',
  //   dataIndex: 'sfz',
  //   key: 'sfz', width: 100
  // },
  // {
  //   title: '电话号码',
  //   dataIndex: 'telphone',
  //   key: 'telphone', width: 100,
  // },
  // {
  //   title: '险类',
  //   dataIndex: 'type',
  //   key: 'type', width: 100,
  // },

  // {
  //   title: '险种',
  //   dataIndex: 'type_xl',
  //   key: 'type_xl', width: 100,
  // },
  // {
  //   title: '机构',
  //   dataIndex: 'bxjg',
  //   key: 'bxjg', width: 100,
  // },
  // {
  //   title: '市',
  //   dataIndex: 'city',
  //   key: 'city', width: 100,
  // },
  // {
  //   title: '区县',
  //   dataIndex: 'quxian',
  //   key: 'quxian',
  // },
  // {
  //   title: '乡镇',
  //   dataIndex: 'xiangzhen',
  //   key: 'xiangzhen',
  // },
  // {
  //   title: '村',
  //   dataIndex: 'cun',
  //   key: 'cun',   width: 100,
  // },

  {
    title: '面积信息(亩)',
    dataIndex: 'cbsl',
    key: 'cbsl',
    width: 100,
  },

  // {
  //   title: '保险期间',
  //   dataIndex: 'bxqj',
  //   key: 'bxqj',
  //   width: 100,
  // },
  // {
  //   title: '上传时间',
  //   dataIndex: 'bdscsj',
  //   key: 'bdscsj',
  //   width: 100,
  // },
  // {
  //   title: '修改时间',
  //   dataIndex: 'bdxgsj',
  //   key: 'bdxgsj',
  //   width: 100,
  // },
  // {
  //   title: '地块面积(亩)',
  //   dataIndex: 'v1',
  //   key: 'v1',
  //   width: 100,
  // },
  {
    title: '质量评价结果',
    dataIndex: 'v2',
    key: 'v2',
    width: 100,
  },
  {
    title: '面积一致性',
    dataIndex: 'v3',
    key: 'v3',
    width: 60,
  },
  {
    title: '地块重叠',
    dataIndex: 'v4',
    key: 'v4',
    width: 60,
  },
  // {
  //   title: '标的种植面积',
  //   dataIndex: 'v5',
  //   key: 'v5',
  //   width: 60,
  // },
  // {
  //   title: '标的面积占比',
  //   dataIndex: 'v6',
  //   key: 'v6',
  //   width: 60,
  // },
  {
    title: '占比是否达标',
    dataIndex: 'v7',
    key: 'v7',
    width: 60,
  },
  {
    title: '地块是否合格',
    dataIndex: 'v8',
    key: 'v9',
    width: 60,
  }
]




// 任务弹窗
const task = ref(false)

const checkedValue = ref([]);
// 起保日期
const qbrq = ref([dayjs("2024-06-01"), dayjs("2024-08-29")])
// 默认任务名称
const taskName = ref(`${(checkedValue.value.length ? checkedValue.value[0] + "-HY" : "HY")}-玉米-${dayjs(qbrq.value[0]).format('YYMMDD')}-遥感核验`)



// 任务数据
let taskData = ref([])
// 监听任务数据变化
watch(() => taskData.value, (newVal, oldVal) => {
  StateManager.set('taskDataDk', taskData.value)
}, { deep: true })





// 任务创建
const taskCreate = () => {
  //console.log(checkedValue.value, qbrq.value, taskName.value)
  if (checkedValue.value.length == 0 || !qbrq.value || !taskName.value) {
    message.warn("请添加必须条件", 2)
    return;
  }
  open.value = false;
  task.value = false;

  let str = Math.random().toString(36).substring(2, 9).toUpperCase();
  taskData.value.push({
    ID: `${Date.now()}${str}`,
    title: str + `-${(checkedValue.value.length ? checkedValue.value[0] + `等${(checkedValue.value.length ? checkedValue.value.length : "1")}县` : checkedValue.value[0])}-玉米-${dayjs(qbrq.value[0]).format('YYMMDD')}`,
    area: checkedValue.value,
    qbrq: qbrq.value[0] ? dayjs(qbrq.value[0]).format('YYYY/MM/DD') : '2024/6/1~2024/8/29',
    zbrq: qbrq.value[1] ? dayjs(qbrq.value[1]).format('YYYY/MM/DD') : '2024/6/1~2024/8/29',
    xzqh: ['玉米'],
    status: Math.floor(Math.random() * 3),
    cb: Math.floor(Math.random() * 100)
  })
}


// 任务弹窗
const open = ref(false);
const showModal = () => {
  open.value = true;
};
// 任务弹窗确定
const handleOk = e => {
  taskCreate()
};


const touchTask = ref()

// 任务删除
const taskDelete = (id) => {
  taskData.value = taskData.value.filter(item => item.ID !== id)
}

const hovering = ref()

const taskSelect = (item) => {
  touchTask.value = item;

  goGeomUn();

  if (hovering.value == item.ID) {
    hovering.value = -1;
  } else {
    hovering.value = item.ID;
  }

  //定位地图
  if (item.area.length == 1) {
    loadCounty(item.area[0].join())

    getCount("yghy_sql_1", item.area[0].join())
  } else {
    getCount("yghy_sql_2")

    map.flyTo({
      center: [118.223855, 36.315451],
      zoom: 7.5,
      speed: 1,
      curve: 2,
      easing(t) {
        return t;
      },
    });
  }


}


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
  console.log(value)
  const label = value.split('-').map(item => options[0].children[0].children[item].label).join(' ');
  return label;
}

// 加载本地数据
const loadLocalData = () => {
  const data = StateManager.get('taskDataDk')
  if (data) {
    taskData.value = [];
    taskData.value.push(...data)
  } else {
    taskCreate()
  }
}

/**
 * 树形结构数据
 * @type {import('vue').Ref<Array<Object>>}
 */
const treeData = ref(shandongArea);


let mapdata = [];

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadTown = async (code) => {
  mapdata = []

  let features = await api.get_table_by_filter(
    "admin_2024_town",
    `and f_xzqhdm in ('371524','370322','371525','370687','370321','370125','370830','371623','370685') order by f_xzqhdm`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,c_xzqdm,c_xzqmc,f_xzqhmc,f_xzqhdm,gid,t_xzqmc,p_xzqmc,t_xzqdm`
  );



  //console.log(features)
  if (features.length > 0) {
    for (const re of treeData.value) {
      re.children = [];
      //   console.log(re)
      for (const feature of features) {
        //  console.log(re.code, feature.f_xzqhdm)
        if (re.code == feature.f_xzqhdm) {
          let fs = {
            label: feature.t_xzqmc,
            value: feature.t_xzqdm,
            feature: feature,
          }
          re.children.push(fs);
          mapdata.push(fs)
        }



        // // 绘制边界高亮
        // goGeom(feature.json);
      }
    }

    // select * from public.admin_2024_town where c_xzqmc like '%莱芜%'
    // console.log(treeData.value)



  }
};



/**
 * 移除地图上的行政区边界图层
 */
const goGeomUn = () => {
  map.getLayer("adminGeom") && map.removeLayer("adminGeom");
  map.getLayer("adminGeomOut") && map.removeLayer("adminGeomOut");
  map.getSource("adminGeom") && map.removeSource("adminGeom");
};

/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const goGeom = (data) => {
  goGeomUn();

  map.addSource("adminGeom", {
    type: "geojson",
    lineMetrics: true, // 线渐变必须条件
    data: JSON.parse(data),
  });
  map.addLayer({
    id: "adminGeom",
    type: "line",
    source: "adminGeom",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "RGB(50,119,252)",
      "line-width": 8,
      "line-opacity": 0.8,
    },
  });

  map.addLayer({
    id: "adminGeomOut",
    type: "line",
    source: "adminGeom",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#fff",
      "line-width": 0.5,
    },
  });

  map.fitBounds(turf.bbox(JSON.parse(data)), {
    padding: { top: 100, left: 600, right: 600 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
};

/**
 * 气泡事件
 */
const loadEvent = (() => {

  let layerDK = "rskm_pt";

  /**
   * 鼠标移入监听地块
   */
  map.on("mousemove", layerDK, (e) => {
    if (map.getZoom() < 8) return;

    map.getCanvas().style.cursor = "pointer";
    let feature = e.features[0];

    let area_mi = feature.properties.area_mi ? feature.properties.area_mi : "";
    let xianzhong = feature.properties.xianzhong ? feature.properties.xianzhong : "";
    let bxjg = feature.properties.bxjg
      ? feature.properties.bxjg
      : "";
    let bbxrmc = feature.properties.bbxrmc ? feature.properties.bbxrmc : "";


    map.setFilter("Highlight_DK_Line", ["all", ["in", "gid", feature.properties.gid]]);
    map.setLayoutProperty("Highlight_DK_Line", "visibility", "visible");

    let text = `
    <table style="width:100%;letter-spacing: -1px; font-size: 16px;" >
    <tr><td style="">${bxjg} </td></tr>
    <tr><td style="">${bbxrmc} </td></tr>
    <tr><td style="" >${area_mi ? (area_mi / 666.667).toFixed(1) : "-"} 亩</td><tr>
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

  //清空绘制
  const goGeomUn = () => {
    map.getLayer("lockGeom") && map.removeLayer("lockGeom");
    map.getSource("lockGeom") && map.removeSource("lockGeom");
  };

  map.on("click", () => {
    // map.setLayoutProperty("Highlight_DK_Click", "visibility", "none");
    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "none");
    goGeomUn();
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
})


/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setPopup = async (data) => {
  const feature = await api.get_table_by_filter("procjet_2024_yghy_shandon", `and gid=${data.properties.gid}`, ` gid,geom,bdh,bbxrmc,bbxrzjh,bbxrdh,xianlei,xianzhong,bxjg,shi,shidm,quxian,quxiandm,zhen,zhendm,cun,cundm,youxiao,area_mi `);
  if (!feature[0]) return false;

  const bdh = feature[0].bdh || "";

  const area_mu = feature[0].area_mi
    ? (Number(feature[0].area_mi) / 667).toFixed(1)
    : "";
  const province_city_county_town_village =
    (feature[0].shi || "") +
    (feature[0].quxian || "") +
    (feature[0].zhen || "") +
    (feature[0].cun || "");
  const bbxrmc = feature[0].bbxrmc || "";
  const youxiao = feature[0].youxiao || "";
  const bxjg = feature[0].bxjg || "";
  const xianzhong = feature[0].xianzhong || "";
  const bbxrzjh = feature[0].bbxrzjh || "";
  const bbxrdh = feature[0].bbxrdh || "";



  const text = `
        <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 16px;"  title="地块信息" >
        <tr style="line-height:1.5;border-top:0.5px dotted rgba(255,255,255,0.1); font-size: 16px;"><th width="30" style="vertical-align: center;" rowspan="16" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-chart-gantt"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/></svg>
            <br>基本信息</th>
        </tr>
        <tr style="line-height:1.5;" ><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;  ">保单:</th><td >${bdh}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px">机构:</th><td >${bxjg}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px">状态:</th><td >${youxiao ? "有效" : "无效"}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px">面积:</th><td >${area_mu}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">险种:</th><td > ${xianzhong}</td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">被保人:</th><td >${bbxrmc}</td></tr>
     <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">作物:</th><td>玉米 </td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:80px;padding-right:5px;vertical-align: top;">区域:</th><td>${province_city_county_town_village} </td></tr>
      
        </table>
    `;

  return text
}

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCounty = async (name) => {
  //console.log(String(code).substring(0, 4));
  let features = await api.get_table_by_filter(
    "admin_2022_county",
    `and name='${name}'  order by county_code`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,city_code,city_name,county_code,gid,name,province_name`
  );

  let json = features[0].json;
  json && goGeom(json)
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
  //console.log(String(code).substring(0, 4));
  let data = await api.get_table_tj(
    key,
    name,
  );
  if (data.length > 0) {
    // console.log(data)
    // console.log( data[0].bdh_count)
    tongji.bdh_count.value = data[0].bdh_count;
    tongji.dk_count.value = data[0].dk_count;
    tongji.area_count.value = data[0].area_count;
    tongji.ct_bd.value = data[0].ct_bd;
    tongji.ct_dk.value = data[0].ct_dk;
  }


  chardata.value = [
    { value: Number(data[0].ct_dk), name: '遥感面积' },
    { value: Number(data[0].dk_count), name: '承保面积' },
  ]

  loadEcharts();

};

/**
 * 统计结果
 */
const loadTJData = async (page = "1", size = "30") => {

  let features = await api.get_page(
    "procjet_2024_yghy_chj",
    page,
    size,
    "and quxian in ('恒台县','济阳区','东阿县','高青县','冠县','海阳市','莱芜区','汶上县','无棣县','招远市')"
  )

  dataSource.value = features;
}


/**
 * 数据总数
 * @param {*} filter 条件
 */
const loadCount = async (filter = "") => {
  const data = await api.get_count("procjet_2024_yghy_chj", "and quxian in ('恒台县','济阳区','东阿县','高青县','冠县','海阳市','莱芜区','汶上县','无棣县','招远市')");
  pagination.value.total = Number(data[0].count);
  return data;
};



/**
 * 获取分页
 */
const pagination = ref({
  pageSize: 30, // 每页显示10条数据
  total: 1, // 总数据条数
  responsive: true,
  //pageSizeOptions: false,
  showLessItems: true,
  showTotal: (total, range) => {
    return `${total} 条`;
  },
  onChange: (page) => {
    loadTJData(page, pagination.value.pageSize);
  },
});


// 挂载
onMounted(() => {
  loadEcharts()
  /**
   * 任务加载
   */
  loadLocalData()




  /**
   * 基础数据加载
   */
  map && map.on("load", () => {
    /**
       * tree 加载
       */
    loadTown()

    //loadCounty();

    /**
     * 加载遥感核验图层
     */
    addLayersYghy()

    /**
     * 加载气泡数据
     */
    loadEvent();


    /**
     * 获取全局统计
     */
    getCount("yghy_sql_2")


    /**
     * 加载统计结果
     */
    loadTJData()


    /**
     * 数据总量
     */
    loadCount();
  })

})
</script>

<template>

  <!-- 头部 -->
  <div class="header">
    <Header></Header>
  </div>

  <!-- 地图 -->
  <div class="verification">
    <SDMap :MapToolPosition="{ top: '110px', right: '550px' }"></SDMap>
  </div>

  <!-- 页面 -->
  <div class="page">
    <a-modal v-model:open="open" title="任务创建" @ok="handleOk" cancelText="取消" okText="提交任务">
      <p>

        <!-- <a-form-item label="任务名称">
          <a-input v-model:value="taskName" disabled />
        </a-form-item> -->

        <a-form-item label="起保日期">
          <a-range-picker v-model:value="qbrq" placeholder="请选择起保日期" :locale="locale" />
        </a-form-item>

        <a-form-item label="行政区域">
          <a-cascader v-model:value="checkedValue" multiple :options="treeData" placeholder="请选择行政区域"
            :dropdownMatchSelectWidth="400" suffix-icon="Shopping Around">
            <template #tagRender="data">
              <a-tag :key="data.value" color="blue">{{ data.label }}</a-tag>
            </template>
          </a-cascader>
        </a-form-item>
        <!-- <a-form-item>
          <a-button type="primary" @click="()">提交任务</a-button>
        </a-form-item> -->
      </p>
    </a-modal>
    <!-- 左边 -->
    <div class="left-card">
      <div style="padding: 15px">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-card title="▍遥感核验任务制定" :bordered="true" size="small">
              <a-button type="primary" style="position: absolute;right: 10px;top: 5px;" @click="showModal" v-if="!task">
                <GitPullRequestCreate :size="16" style="margin-right: 5px;" />创建任务
              </a-button>
              <p v-if="taskData.length > 0" style="overflow-y: auto;max-height: calc(100vh - 240px); cursor: pointer;">
                <a-descriptions layout="vertical" bordered size="small" v-for="item in taskData"
                  @click="taskSelect(item)" style="margin-bottom: 5px;" :class="hovering === item.ID ? 'hovering' : ''">
                  <a-descriptions-item :label="item.title">
                    <a-tooltip>
                      <template #title>删除任务</template>
                      <BookX style=" cursor: pointer; float:right;margin-top: -38px;" @click="taskDelete(item.ID)"
                        v-if="hovering == item.ID" color="red">
                      </BookX>
                    </a-tooltip>
                    任务编码：{{ item.ID }}<br>
                    <!-- 核验范围：{{ getLabelByValue(item.area) }}<br> -->
                    <!-- 标的品种：{{ item.xzqh.join(',') }}<br> -->
                    起保日期：{{ item.qbrq }} - {{ item.zbrq }}<br>
                    检核区域：
                    {{ item.area.map(d => d = d[0]).join() }}
                    <br>

                    <div style="">

                      <a-tag color="#87d068" v-if="item.area.length == 1">
                        <TowerControl :size="15" />乡镇级
                      </a-tag>
                      <a-tag color="#2db7f5" v-else>
                        <Home :size="15" />区县级 ({{ item.area.length }}个)
                      </a-tag>

                      <a-tag color="red">
                        <TreesIcon :size="15" />玉米
                      </a-tag>
                    </div>

                  </a-descriptions-item>

                </a-descriptions>

              </p>
              <p v-else>
                <a-result title="请创建核验规则"></a-result>
              </p>
            </a-card>
          </a-col>

        </a-row>
      </div>
    </div>

    <!-- 中间 -->
    <div class="center-card">
      <a-typography-title class="center-card-title">地块核验与分析
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <a-tag color="#87d068">静态
              <CheckCheckIcon :size="16" />
            </a-tag>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="router.push('/verification/index')">静态</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="router.push('/verification/index')">动态</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

      </a-typography-title>


    </div>

    <div class="right-card">
      <div style=" padding: 15px">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-card title="▍遥感核验统计" :bordered="false" size="small">
              <a-button type="primary" ghost style="position: absolute;right: 10px;top: 5px;" @click="exportPDF()">
                <CalendarPlus :size="16" style="margin-right: 5px;" />生成核验报告
              </a-button>

              <!-- <p style="width: 100%;padding: 10px;background-color: #5470c6;color: #fff;"><label
                  style="font-weight: bold;">
                  XX市XX县XX乡</label></p> -->
              <p style="width: 100%;padding: 10px;background-color: #5470c6;color: #fff;"><label
                  style="font-weight: bold;">
                  {{ touchTask ? touchTask.area.join() : "全域" }}</label><span style="float: right;"></span></p>
              <p style="width: 100%;padding: 10px;background-color: #5470c6;color: #fff;"><label
                  style="font-weight: bold;">
                  保险覆盖率</label><span style="float: right;">-</span></p>
              <a-row>


                <a-col :span="7">
                  <br>


                  <p style="width: 100%;"><label style="font-weight: bold;">承保数量</label><span style="float: right;">{{
                    tongji.bdh_count }} </span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">承保面积</label><span style="float: right;">{{
                    tongji.area_count }} 亩</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">遥感面积</label><span
                      style="float: right;">-</span>
                  </p>
                  <!-- <p style="width: 100%;"><label style="font-weight: bold;">保险覆盖率</label><span
                      style="float: right;">-</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">是否超保</label><span
                      style="float: right;">-</span>
                  </p> -->
                  <p style="width: 100%;"><label style="font-weight: bold;">重叠地块</label><span style="float: right;">{{
                    tongji.ct_dk
                  }} 块</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">重叠保单</label><span style="float: right;">{{
                    tongji.ct_bd
                  }} </span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">地块数量</label><span style="float: right;">{{
                    tongji.dk_count
                  }} 块</span></p>

                </a-col>
                <a-col :span="16">
                  <div id="main" style="width: 95%;height:280px;"></div>
                </a-col>
              </a-row>

            </a-card>
            <br>
            <a-card title="▍遥感核验报表" :bordered="false" size="small">


              <a-button type="primary" ghost style="position: absolute;right: 10px;top: 5px;">
                <Download :size="16" /> 下载核验报表
              </a-button>


              <!-- 
              ID: `${Date.now()}${str}`,
    title: str + `-${(checkedValue.value.length ? checkedValue.value[0] + `等${(checkedValue.value.length ? checkedValue.value.length : "1")}县` : checkedValue.value[0])}-玉米-${dayjs(qbrq.value[0]).format('YYMMDD')}`,
    area: checkedValue.value,
    qbrq: qbrq.value[0] ? dayjs(qbrq.value[0]).format('YYYY/MM/DD') : '2024/6/1~2024/8/29',
    zbrq: qbrq.value[1] ? dayjs(qbrq.value[1]).format('YYYY/MM/DD') : '2024/6/1~2024/8/29',
    xzqh: ['玉米'], -->

              <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination.value" :sticky="true"
                size="small" :scroll="{ y: 500 }">
                <template #bodyCell="{ column, text, record }">

                  <template v-if="column.dataIndex === 'bdh'">
                    <div style="width: 100%;">
                      {{ record.bdh }}

                      <a-tag color="cyan"> {{ record.name }}</a-tag>
                      <a-tag color="orange"> {{ record.bxjg }}</a-tag>
                      <a-tag color="purple"> {{ record.type_xl }}</a-tag>

             
                    </div>
                  </template>

                  <template v-if="column.dataIndex === 'cbsl'">
                    <div style="width:100%;">

                      地块 {{ record.v1 }}<br>
                      承保 {{ record.cbsl }} <br>
                      标的 {{ record.v5 }}<br>
                    
                      <a-tag color="pink">标的占{{ record.v6 }}</a-tag>
                  
                    </div>
                  </template>


                  <template v-if="column.dataIndex === 'v2'">
                    <div style="width:100%;">


                      <a-tag color="red" v-if="record.v2 != '1'"> {{ record.v2 == '1' ? "" : "超保" }} </a-tag>
                      <a-tag color="red" v-if="record.v3 != '1'"> {{ record.v3 == '1' ? "" : "地块与承保面积不一致" }} </a-tag>
                      <a-tag color="red" v-if="record.v4 != '1'"> {{ record.v4 == '1' ? "" : "地块重叠" }} </a-tag>
                      <a-tag color="red" v-if="record.v7 != '1'"> {{ record.v7 == '1' ? "" : "玉米差异率不达标" }} </a-tag>
                      <a-tag color="red" v-if="record.v8 != '1'"> {{ record.v8 == '1' ? "" : "地块不合格" }} </a-tag>
                      <!-- <a-tag color="green">green</a-tag>
                      <a-tag color="cyan">cyan</a-tag>
                      <a-tag color="pink">cyan</a-tag> -->
                    </div>
                  </template>

                </template>
              </a-table>
              <!-- </p>
              <p style="overflow-y: auto;max-height: calc(100vh - 740px);"> -->



            </a-card>
          </a-col>
        </a-row>

      </div>

    </div>
  </div>


  <!--图例-->

  <div class="tuli">
    <VerificationLegend></VerificationLegend>

  </div>

</template>

<style scoped>
.verification {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.4));
  z-index: 100000;

}




/* ::v-deep .ant-input {
  background-color: transparent;
  color: #fff;
} */

/* ::v-deep .ant-input-clear-icon {
  color: #fff;
} */

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

/* 
::v-deep .ant-drawer .ant-drawer-body {
  padding: 0;
}

::v-deep .ant-drawer-body {
  padding: 0;
}

::v-deep .ant-drawer {
  padding: 0;
} */

::v-deep .ant-page-header-heading-title {
  color: aliceblue;
}

::v-deep .ant-page-header-heading-sub-title {
  color: #ccc;
}

::v-deep .ant-tabs-tab-btn {
  font-size: 16px;

  color: #fff;
}

::v-deep .ant-tabs-tab-active {
  background-color: #ffffff18;
  color: #fff;
}

/* 
::v-deep .ant-select-selection-item {
  background-color: rgba(50, 119, 252, 1);
  color: #fff;
}

::v-deep .ant-select-selection-placeholder {
  color: #807d7dc0;

  font-size: 14px;
}

::v-deep .ant-select-clear {
  color: #ccc;
  background-color: transparent;
}

::v-deep .ant-select-clear:hover {
  color: rgba(50, 119, 252, 1);
} */

/* ::v-deep .ant-statistic-content {
  color: #fff;
}

::v-deep .ant-statistic-title {
  color: #fff;
}

::v-deep .ant-picker {
  background: transparent;
  border: 0;
  padding: 0;
}

::v-deep .ant-picker input {
  color: #ccc;
} */
.tuli {
  position: absolute;
  left: 5px;
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
  right: 0;
  top: 100px;
  width: 550px;

  z-index: 1000;
  max-height: calc(100% - 100px);
}

.center-card {
  display: flex;
  justify-content: center;
  justify-items: center;
  width: 100%;
  z-index: 100;
  position: absolute;
  top: 90px;
  background: linear-gradient(to bottom, rgba(19, 18, 18, 0.39), rgba(3, 11, 85, 0));
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
</style>
