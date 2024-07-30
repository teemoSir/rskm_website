<script setup>
// import {
//   UserOutlined,
//   ApartmentOutlined,
//   FileProtectOutlined,
// } from "@ant-design/icons-vue";
import { logo } from "./index";
import { message } from "ant-design-vue";
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { api } from "../config/map";
import SDMap from "./SDMap.vue";
import * as turf from "@turf/turf";
import {
  Headset,
  Info,
  Search,
  RotateCw,
  X,
  Sprout,
  LocateFixed,
  Grip,
  ChevronDown,
  Component,
  Download,
  CircleX,
  Calculator,
  Logs,
  Sheet,
  MapPinned,
} from "lucide-vue-next";
import { tableToExcel } from "../utils/toExcel";
import StateManager from "../utils/state_manager";

const value = ref("user1");

const optionsType = ref([]);
const optionsComs = ref([]);

const loadTreeCom = () => {
  for (let i in window["rskm_pt_insure_com"]) {
    let vvs = window["rskm_pt_insure_com"][i].insurcompanyname;
    let sa = window["rskm_pt_insure_com"][i].insurcompanycode;
    optionsComs.value.push({
      value: sa,
      label: vvs,
      key: Number(i) + 1,
    });
  }
  console.log(optionsComs);
  console.log(window["rskm_pt_insure_com"]);
};
const loadTreeType = () => {
  for (let i in window["rskm_pt_insure_type"]) {
    let vv = window["rskm_pt_insure_type"][i].xzname;

    let children = [];

    optionsType.value.push({
      value: vv,
      label: Number(i) + 1 + " " + vv,
      key: Number(i) + 1,
    });
  }
  console.log(optionsType);
  //   console.log(window["rskm_pt_insure_type"]);
};

onMounted(() => {
  loadData();

  //    setTimeout(() => {
  //     console.log(map.getStyle().layers);

  //     map.getStyle().layers.forEach((dd) => {
  //       if (dd.type == "raster") {

  //         map.getLayer(dd.id) && map.removeLayer(dd.id);
  //         map.getSource(dd.id) && map.removeSource(dd.id);
  //       }
  //     });
  //   }, 1000);
});

nextTick(() => {
  loadTable();
});

//加载
const loadTable = (where) => {
  dataSource.value = [];
  let jh = api.procjet_wxsd_dk_xiaomai_v1(where);

  jh.then((data) => {
    // window["procjet_wxsd_dk_xiaomai_v1"] = data;
    //    ((select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80)/count(gid)::numeric)*100 as 合格地块数量占比,
    //    ((select SUM(area_mi/666.667) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80)/SUM(area_mi/666.667)::numeric)*100 as 合格地块面积占比
    if (data) {
      // console.log(data);
      for (let i in data) {
        dataSource.value.push({
          bxjg: data[i]["bxjg"],
          bdzs: data[i]["bdzs"],
          dksl: data[i]["dksl"],
          dkzmj: data[i]["dkzmj"],
          hegedikuaishuliang: data[i]["hegedikuaishuliang"],
          hgdkslzb:
            (Number(data[i]["hgdkslzb"] || 0) / Number(data[i]["dksl"] || 0)) * 100,
          hgdkmjzb:
            (Number(data[i]["hgdkmjzb"] || 0) / Number(data[i]["dkzmj"] || 0)) * 100,
        });
      }
    }
  });
};

const loadData = () => {
  /**
   * 行政
   */

  //   api.rskm_pt_insure_type.then((data) => {

  //   });
  window["rskm_pt_insure_type"] = [
    {
      xzname: "惠民县",
      children: [
        { zname: "石庙镇" },
        { zname: "姜楼镇" },
        { zname: "李庄镇" },
        { zname: "何坊街道" },
        { zname: "孙武街道" },
        { zname: "桑落墅镇" },
        { zname: "清河镇" },
        { zname: "淄角镇" },
        { zname: "胡集镇" },
        { zname: "大年陈镇" },
        { zname: "辛店镇" },
        { zname: "皂户李镇" },
        { zname: "魏集镇" },
        { zname: "麻店镇" },
      ],
      id: 1,
    },
    {
      xzname: "商河县",
      children: [
        { zname: "白桥镇" },
        { zname: "沙河乡" },
        { zname: "怀仁镇" },
        { zname: "孙集乡" },
        { zname: "韩庙乡" },
        { zname: "郑路镇" },
        { zname: "张坊乡" },
        { zname: "龙桑寺镇" },
        { zname: "贾庄镇" },
        { zname: "殷巷镇" },
        { zname: "许商街道" },
        { zname: "玉皇庙镇" },
      ],
      id: 2,
    },
    {
      xzname: "巨野县",
      id: 3,
      children: [
        { zname: "太平镇" },
        { zname: "董官屯镇" },
        { zname: "经济技术开发区" },
        { zname: "独山镇" },
        { zname: "大谢集镇" },
        { zname: "田庄镇" },
        { zname: "柳林镇" },
        { zname: "永丰街道办事处" },
        { zname: "田桥镇" },
        { zname: "陶庙镇" },
        { zname: "龙堌镇" },
        { zname: "章缝镇" },
        { zname: "大义镇" },
        { zname: "凤凰街道办事处" },
        { zname: "麒麟镇" },
        { zname: "核桃园镇" },
        { zname: "万丰镇" },
        { zname: "营里镇" },
      ],
    },
    {
      xzname: "齐河县",
      id: 4,
      children: [
        { zname: "胡官屯镇" },
        { zname: "祝阿镇" },
        { zname: "焦庙镇" },
        { zname: "安头乡" },
        { zname: "仁里集镇" },
        { zname: "大黄乡" },
        { zname: "晏北街道" },
        { zname: "马集镇" },
        { zname: "华店乡" },
        { zname: "赵官镇" },
        { zname: "潘店镇" },
        { zname: "刘桥乡" },
        { zname: "表白寺镇" },
        { zname: "晏城街道" },
        { zname: "宣章屯镇" },
      ],
    },
    {
      xzname: "阳谷县",
      id: 5,
      children: [
        { zname: "李台镇" },
        { zname: "侨润街道" },
        { zname: "十五里元镇" },
        { zname: "高庙王乡" },
        { zname: "阿城镇" },
        { zname: "安乐镇" },
        { zname: "闫楼镇" },
        { zname: "石佛镇" },
        { zname: "大布乡" },
        { zname: "西湖镇" },
        { zname: "定水镇" },
        { zname: "张秋镇" },
        { zname: "郭屯镇" },
        { zname: "金斗营乡" },
        { zname: "七级镇" },
        { zname: "博济桥街道" },
        { zname: "寿张镇" },
        { zname: "狮子楼街道" },
      ],
    },
  ];
  loadTreeType();

  /**
   * 保险平台
   */

  //   api.rskm_pt_insure_com.then((data) => {
  //     window["rskm_pt_insure_com"] = data;
  //     loadTreeCom();
  //   });

  window["rskm_pt_insure_com"] = [
    { insurcompanyname: "国寿财", insurcompanycode: 1 },
    { insurcompanyname: "人保", insurcompanycode: 2 },
    { insurcompanyname: "国元", insurcompanycode: 3 },
    { insurcompanyname: "平安山东", insurcompanycode: 4 },
    { insurcompanyname: "中华", insurcompanycode: 5 },
    { insurcompanyname: "泰山", insurcompanycode: 6 },
    { insurcompanyname: "安华", insurcompanycode: 7 },
  ];
  loadTreeCom();
};
/**
 *保险平台
 * @param {*} path
 * @param {*} level
 */
function digCom(path = "0") {
  const list = [
    {
      title: "全部",
      key: "0-0",
      children: [],
    },
  ];

  for (let iu in window["rskm_pt_insure_com"]) {
    const key = `0-0-${iu}`;
    const treeNode = {
      title: window["rskm_pt_insure_com"][iu].insurcompanyname,
      key,
    };
    list[0].children.push(treeNode);
    // checkedKeysType.value.push(key)
  }
  return list;
}
const selectedKeysType = ref([]);
const checkedKeysType = ref(["0-0"]);
const expandedKeysType = ref(["0-0"]);
watch(selectedKeysType, () => {
  //console.log("selectedKeys", selectedKeysType);
});
const sql = ref([]);
watch(checkedKeysType, () => {
  sql.value = [];

  if (checkedKeysType.value.join().indexOf("0-0-0") > -1) {
    sql.value.push("惠民县");
  }

  if (checkedKeysType.value.join().indexOf("0-0-1") > -1) {
    sql.value.push("商河县");
  }
  if (checkedKeysType.value.join().indexOf("0-0-2") > -1) {
    sql.value.push("巨野县");
  }
  if (checkedKeysType.value.join().indexOf("0-0-3") > -1) {
    sql.value.push("齐河县");
  }
  if (checkedKeysType.value.join().indexOf("0-0-4") > -1) {
    sql.value.push("阳谷县");
  }

  if (checkedKeysType.value.includes("0-0")) {
    sql.value = [];
  }
  //console.log(sql.value.join());

  // 数据分析
  loadTable(sql.value.join());

  // 图形同步
  updateLayer(sql);
});

const updateLayer = (data) => {
  //耕地 StateManager
  //   let gds = ["procjet_2024_wxsd_name", "procjet_2024_wxsd", "procjet_2024_wxsd_outine"];
  //   gds.forEach((gd) => {
  //     toggleLayerVisibility(gd, state.checked1);
  //   });

  //保单地块
  let hgdks = [
    "procjet_wxsd_dk_xiaomai_name",
    "procjet_wxsd_dk_xiaomai",
    "procjet_wxsd_dk_xiaomai_outline",
  ];

  console.log(data.value);

  if (data.value.length > 0) {
    let newFilter = ["all", ["any", [">", ["get", "bili"], 0]], ["any"]];
    data.value.forEach((dd) => {
      newFilter[2].push(["==", ["get", "quxian"], dd]);
    });

    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  } else {
    let newFilter = ["all", ["any", [">", ["get", "bili"], 0]]];

    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  }
};

/**
 *保险类型
 * @param {*} path
 * @param {*} level
 */
function digType(path = "0") {
  const list = [
    {
      title: "全部",
      key: "0-0",
      children: [],
    },
  ];

  for (let iu in window["rskm_pt_insure_type"]) {
    const key = `0-0-${iu}`;
    let children = [];
    window["rskm_pt_insure_type"][iu].children.forEach((rp) => {
      children.push({
        title: rp.zname,
        key: key + "-" + rp.zname,
      });
    });

    const treeNode = {
      title: window["rskm_pt_insure_type"][iu].xzname,
      key,
      children: children,
    };
    list[0].children.push(treeNode);
    // checkedKeysType.value.push(key)
  }
  //console.log(checkedKeysType);

  return list;
}
const selectedKeysCom = ref([]);
const checkedKeysCom = ref([]);
watch(selectedKeysCom, () => {
  console.log("selectedKeys", selectedKeysType);
});
watch(checkedKeysCom, () => {
  console.log("checkedKeys", checkedKeysType.value);
});

const values_type = ref([]);
const values_com = ref([]);

const onRect = () => {
  values_type.value = ["0-0"];
  values_com.value = [];
  //   checkedKeysCom.value = [];
  //   checkedKeysType.value = [];
};

const onSearch = () => {};

const mode = ref("left");
const activeKeyLS = ref("2");
const callback = (val) => {
  console.log(val);
};

const searchListName = [
  { name: "保单编号", type: 1 },
  { name: "行政区划", type: 2 },

  //   { name: "行政区划", type: 3 },
  //   { name: "起保时间", type: 4 },
  //   { name: "投保数量", type: 5 },
];

const value3 = ref(searchListName[0].name);
const value4 = ref("201143511A52024000127");

const setSearchListName = (d) => {
  value3.value = d.name;
};

const menu = ref(false);

const dataSource = ref([]);

const columns = [
  {
    title: "保险机构",
    dataIndex: "bxjg",
    key: "bxjg",
  },
  {
    title: "保单总数(张)",
    dataIndex: "bdzs",
    key: "bdzs",
  },
  //   {
  //     title: "有地块保单数量 (张)",
  //     dataIndex: "dkbdsl",
  //     key: "dkbdsl",
  //   },
  //   {
  //     title: "有地块保单承保面积 (亩)",
  //     dataIndex: "dkbdcbmj",
  //     key: "dkbdcbmj",
  //   },
  {
    title: "地块数量(块)",
    dataIndex: "dksl",
    key: "dksl",
  },
  {
    title: "地块总面积(亩)",
    dataIndex: "dkzmj",
    key: "dkzmj",
  },
  {
    title: "合格地块(块)",
    dataIndex: "hegedikuaishuliang",
    key: "hegedikuaishuliang",
  },
  {
    title: "合格地块占比",
    dataIndex: "hgdkslzb",
    key: "hgdkslzb",
  },
  {
    title: "合格面积占比",
    dataIndex: "hgdkmjzb",
    key: "hgdkmjzb",
  },
];

const onSearchHeader = () => {
  console.log(value3.value);
  console.log(value4.value);

  fitCenter();

  setTimeout(() => {
    go();
  }, 500);

  const go = () => {
    if (value3.value == "保单编号") {
      if (value4.value) {
        let features2 = map.querySourceFeatures("procjet_wxsd_dk_xiaomai", {
          sourceLayer: "procjet_wxsd_dk_xiaomai",
        });

        // console.log(features2);
        let ff = features2.filter((feature) => {
          return feature.properties.baodanhao == value4.value;
        });

        // console.log(ff[0]);

        map.setFilter("Highlight_DK_Line_Click", [
          "all",
          ["in", "baodanhao", ff[0].properties.baodanhao],
        ]);
        map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");
        fitBox(ff[0]);
      }
    } else if (value3.value == "地块GID") {
      if (value4.value) {
        let features2 = map.querySourceFeatures("procjet_2024_wxsd", {
          sourceLayer: "procjet_2024_wxsd",
        });

        console.log(features2);
        let ff = features2.filter((feature) => {
          return feature.properties.gid == value4.value;
        });

        //   console.log(ff[0]);

        map.setFilter("Highlight_DK", ["all", ["in", "gid", ff[0].properties.gid]]);
        map.setLayoutProperty("Highlight_DK", "visibility", "visible");
        fitBox(ff[0]);
      }
    }
  };
};

// 初始化视野
const fitCenter = () => {
  //map.flyTo({
  //     center: [118.223855, 36.315451],
  //     zoom: 7.5,
  //   });
  map.setCenter([116.223855, 36.315451]);
  map.setZoom(7.5);
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

const loadExcel = () => {
  tableToExcel("tableExcel");
};

const tongji = ref(false);

/**
 * 图例
 */
let legends = [
  {
    key: 1,
    title: "耕地",
    isShow: ref(false),
    type: "polygon",
    outlineColor: "RGBA(255,255,251,1)",
    fillColor: "RGBA(43,128,251,0.5)",
    outlineWidth: 1,
  },
  {
    key: 2,
    title: "合格地块",
    isShow: ref(true),
    type: "polygon",
    outlineColor: "RGBA(0,0,0,0.8)",
    fillColor: "RGBA(34,177,76,0.8)",
    outlineWidth: 3,
  },
  {
    key: 3,
    title: "不合格地块",
    isShow: ref(true),
    type: "polygon",
    outlineColor: "RGBA(0,0,0,0.8",
    fillColor: "RGBA(237,28,36,0.8)",
    outlineWidth: 3,
  },
  {
    key: 4,
    title: "县级界线",
    isShow: ref(false),
    type: "line",
    fillColor: "yellow",
    outlineWidth: 4,
  },
  {
    key: 5,
    title: "镇级界线",
    isShow: ref(false),
    type: "line",
    fillColor: "#faad14",
    outlineWidth: 4,
  },
  {
    key: 6,
    title: "村级界线",
    isShow: ref(false),
    type: "line-dotted",
    fillColor: "#faad14",
    outlineWidth: 4,
  },
  {
    key: 7,
    title: "省级界线",
    isShow: ref(false),
    type: "line",
    fillColor: "#ccc",
    outlineWidth: 2,
  },
  {
    key: 8,
    title: "市级界线",
    isShow: ref(false),
    type: "line",
    fillColor: "#ccc",
    outlineWidth: 1,
  },
];

const tuli = ref(false);

const state = reactive({
  checked1: false,
  checked2: true,
  checked3: true,
  checked4: true,
  checked5: true,
  checked6: true,
  checked7: true,
  checked8: true,
});

message.config({
  top: `100px`,
  //   duration: 2,
  maxCount: 2,
  rtl: true,
  prefixCls: "提示",
});

watch(state, () => {
  //耕地 StateManager
  let gds = ["procjet_2024_wxsd_name", "procjet_2024_wxsd", "procjet_2024_wxsd_outine"];
  gds.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked1);
  });

  //保单地块
  let hgdks = [
    "procjet_wxsd_dk_xiaomai_name",
    "procjet_wxsd_dk_xiaomai",
    "procjet_wxsd_dk_xiaomai_outline",
  ];

  //合格地块不显示 不合格地块显示
  if (!state.checked2 && state.checked3) {
    let newFilter = [
      "all", // 使用 "all" 表示必须同时满足以下条件
      ["<", ["get", "bili"], 80], // bili 大于等于 80
      [">", ["get", "bili"], 0], // bili 小于等于 100
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  }
  //合格地块不显示 不合格地块显示
  else if (state.checked2 && !state.checked3) {
    let newFilter = [
      "all", // 使用 "all" 表示必须同时满足以下条件
      [">=", ["get", "bili"], 80], // bili 大于等于 80
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  }
  //合格地块he不合格地块同时显示
  else if (state.checked2 && state.checked3) {
    let newFilter = [
      "all", // 使用 "all" 表示必须同时满足以下条件
      [">", ["get", "bili"], 0], // bili 大于等于 80
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  } //合格地块he不合格地块同时显示
  else if (!state.checked2 && !state.checked3) {
    let newFilter = [
      "all", // 使用 "all" 表示必须同时满足以下条件
      ["<", ["get", "bili"], 0], // bili 大于等于 80
    ];
    hgdks.forEach((gd) => {
      map.setFilter(gd, newFilter);
    });
  }

  //县级界线
  let xjjx = ["admin_2024_county"];
  xjjx.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked4);
  });

  //镇级界线
  let zjjx = ["admin_2024_town"];
  zjjx.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked5);
  });

  //村级界线
  let cjjx = ["admin_2024_village"];
  cjjx.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked6);
  });

  //省级界线
  let pjjx = ["admin_2022_province"];
  pjjx.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked7);
  });

  //市级界线
  let cicyjjx = ["admin_2022_city"];
  cicyjjx.forEach((gd) => {
    toggleLayerVisibility(gd, state.checked8);
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
</script>

<template>
  <a-page-header
    class="header"
    title="OneMap  "
    sub-title=" 农险一张图解决方案 V1.0.0"
    :avatar="{ src: logo }"
    style="color: #ccc"
  >
    <template #extra>
      <a-row style="width: 150px">
        <a-col :span="5">
          <LocateFixed color="#ccc" />
        </a-col>
        <a-col :span="5"> <div style="margin-top: 3px">山东</div> </a-col>
        <a-col :span="5"> </a-col>
        <a-col :span="5"> <Info color="#ccc" /></a-col>
      </a-row>
    </template>
  </a-page-header>
  <div class="page">
    <!--一张图平台-->
    <SDMap></SDMap>
    <!--检索搜索-->
    <div class="search">
      <a-row>
        <a-col :span="2">
          <a-button size="large" class="searchshadow" @click="menu = !menu">
            <Grip :color="!menu ? '#fff' : 'RGB(36,172,242)'" :size="30" />
          </a-button>
        </a-col>

        <a-col :span="22">
          <a-input-group compact>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item
                    v-for="s in searchListName"
                    :key="s.type"
                    @click="setSearchListName(s)"
                  >
                    {{ s.name }}
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button class="searchshadow">
                {{ value3 }}
                <!-- <ChevronDown /> -->
              </a-button>
            </a-dropdown>
            <a-input
              size="large"
              v-model:value="value4"
              style="width: 300px"
              class="searchshadow"
              placeholder="请输入检索关键字"
            />
            <a-button
              type="primary"
              size="large"
              class="searchshadow"
              @click="onSearchHeader"
              ><Search />
            </a-button>
          </a-input-group>
        </a-col>
      </a-row>
    </div>
    <!--类型控制单元-->
    <div class="left-cd" v-if="menu">
      <!--多种类型选择器-->
      <div class="header-menu">
        <Component style="margin-right: 10px" :size="20" />筛查
      </div>

      <a-tabs
        v-model:activeKey="activeKeyLS"
        :tab-position="mode"
        :style="{ height: '100%', padding: '10px 0' }"
      >
        <!-- <a-tab-pane key="3" tab="行政区划"></a-tab-pane> -->
        <a-tab-pane key="2" tab="行政区划">
          <!-- <div v-if="!checkedKeysType.length">
            <a-select
              v-model:value="values_type"
              :allowClear="true"
              :bordered="false"
              id="optionsType"
              mode="multiple"
              style="width: 100%"
              placeholder="请选择 或 输入关键字"
              :options="optionsType"
            />
            <hr />
            <a-row v-if="values_type.length">
              <a-col :span="24">
                <a-statistic
                  title="选中条件项"
                  :value="values_type.length"
                  class="demo-class"
                >
                  <template #suffix>
                    <span>/ {{ optionsType.length }}</span>
                  </template>
                </a-statistic>
              </a-col>
            </a-row>
          </div> -->

          <div v-if="!values_type.length">
            <a-tree
              v-model:selectedKeys="selectedKeysType"
              v-model:checkedKeys="checkedKeysType"
              v-model:expandedKeys="expandedKeysType"
              checkable
              v-if="digType().length"
              :height="500"
              :tree-data="digType()"
              blockNode
            >
              <!-- <template #title="{ title, key,id }">
                <div v-if="key">{{ title }} <sub>{{id}}</sub></div>
                <template v-else>{{ title }}</template>
              </template> -->

              <!-- <template #switcherIcon="{ switcherCls }"><MapPinned  style="margin: 0 0 0 -9px;" :size="25" :class="switcherCls" /></template> -->
            </a-tree>
          </div>
        </a-tab-pane>
        <!-- <a-tab-pane key="1" tab="保险机构">
          <div v-if="!checkedKeysCom.length">
            <a-select
              v-model:value="values_com"
              id="optionsCom"
              mode="multiple"
              :allowClear="true"
              :bordered="false"
              style="width: 100%"
              placeholder="请选择 或 输入关键字"
              :options="optionsComs"
            />
            <hr />
            <a-row v-if="values_com.length">
              <a-col :span="24">
                <a-statistic
                  title="选中条件项"
                  :value="values_com.length"
                  class="demo-class"
                >
                  <template #suffix>
                    <span>/ {{ optionsComs.length }}</span>
                  </template>
                </a-statistic>
              </a-col>
            </a-row>
          </div>
          <div v-if="!values_com.length">
            <a-tree
              v-model:selectedKeys="selectedKeysCom"
              v-model:checkedKeys="checkedKeysCom"
              checkable
              :autoExpandParent="true"
              :defaultExpandAll="true"
              v-if="digCom().length"
              :height="300"
              :tree-data="digCom()"
              blockNode
              :selectable="false"
            >
        
            </a-tree>
          </div>
        </a-tab-pane> -->
      </a-tabs>
      <!-- <div>
        <br />
        <a-row
          v-if="
            values_type.length ||
            values_com.length ||
            checkedKeysCom.length ||
            checkedKeysType.length
          "
        >
          <a-col :span="11">
            <a-button
              type="primary"
              size="large"
              style="width: 100%"
              class="boxshadow"
              @click="onSearch()"
            >
              <template #icon>
                <Search style="margin-right: 10px" />
              </template>
              条件筛查
            </a-button></a-col
          >
          <a-col :span="2"></a-col>
          <a-col :span="11">
            <a-button
              size="large"
              style="width: 100%"
              class="boxshadow"
              @click="onRect()"
            >
              <template #icon>
                <RotateCw style="margin-right: 10px" />
              </template>
              重置
            </a-button></a-col
          >
        </a-row>
      </div> -->
    </div>

    <!--统计分析 -->
    <div class="table-fx" v-if="tongji">
      <table class="table-tj" id="tableExcel">
        <thead>
          <tr>
            <th colspan="7" style="font-size: 22px; line-height: 50px; text-align: left">
              统计分析
              <small>{{ sql.join(",") || "惠民县,商河县,巨野县,齐河县,阳谷县" }}</small>
              <div
                style="position: absolute; right: 15px; top: 10px; cursor: pointer"
                @click="tongji = !tongji"
              >
                <CircleX />
              </div>
            </th>
          </tr>
          <tr>
            <th
              v-for="ii in columns"
              :key="ii.key"
              style="
                font-size: 16px;
                line-height: 45px;
                text-align: left;
                background-color: #cccccc69;
              "
            >
              {{ ii.title }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="it in dataSource.filter((r) => r.bxjg != '合计')" :key="it.key">
            <td>{{ it.bxjg }}</td>
            <td>{{ Number(it.bdzs) ? it.bdzs : "--" }}</td>
            <td>{{ Number(it.dksl) ? it.dksl : "--" }}</td>
            <td>
              {{ Number(it.dkzmj) ? Number(it.dkzmj).toFixed(2) : "--" }}
            </td>
            <td>{{ Number(it.hegedikuaishuliang) ? it.hegedikuaishuliang : "--" }}</td>
            <td v-if="Number(it.hgdkslzb) < 80" style="color: red">
              <a-tooltip>
                <template #title>
                  合格地块占比 = 合格地块总数量 / 保单地块总数量 x 100%</template
                >
                {{
                  isNaN(Number(it.hgdkslzb).toFixed(2))
                    ? "--"
                    : Number(it.hgdkslzb).toFixed(2) + "%"
                }}
              </a-tooltip>
            </td>
            <td style="color: green" v-else>
              <a-tooltip>
                <template #title>
                  合格地块占比 = 合格地块总数量 / 保单地块总数量 x 100%</template
                >
                {{
                  isNaN(Number(it.hgdkslzb).toFixed(2))
                    ? "--"
                    : Number(it.hgdkslzb).toFixed(2) + "%"
                }}
              </a-tooltip>
            </td>
            <td style="color: red" v-if="Number(it.hgdkmjzb) < 80">
              <a-tooltip>
                <template #title>
                  合格地块占比 = 合格地块总面积 / 保单地块总面积 x 100%</template
                >
                {{
                  isNaN(Number(it.hgdkmjzb).toFixed(2))
                    ? "--"
                    : Number(it.hgdkmjzb).toFixed(2) + "%"
                }}
              </a-tooltip>
            </td>
            <td style="color: green" v-else>
              <a-tooltip>
                <template #title>
                  合格地块占比 = 合格地块总面积 / 保单地块总面积 x 100%</template
                >
                {{
                  isNaN(Number(it.hgdkmjzb).toFixed(2))
                    ? "--"
                    : Number(it.hgdkmjzb).toFixed(2) + "%"
                }}
              </a-tooltip>
            </td>
          </tr>
          <tr
            v-for="it in dataSource.filter((r) => r.bxjg == '合计')"
            :key="it.key"
            style="
              border-top: 1px solid #000;
              text-align: left;
              line-height: 45px;
              background-color: #cccccc69;
            "
          >
            <th>{{ it.bxjg }}</th>
            <th>{{ it.bdzs }}</th>
            <th>{{ it.dksl }}</th>
            <th>{{ Number(it.dkzmj).toFixed(2) }}</th>
            <th>{{ it.hegedikuaishuliang }}</th>
            <th>
              {{
                isNaN(Number(it.hgdkslzb).toFixed(2)) ? 0 : Number(it.hgdkslzb).toFixed(2)
              }}
              %
            </th>
            <th>
              {{
                isNaN(Number(it.hgdkmjzb).toFixed(2)) ? 0 : Number(it.hgdkmjzb).toFixed(2)
              }}
              %
            </th>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="10" align="" @click="loadExcel">
              <a-tooltip>
                <template #title>下载Excel</template>
                <Download style="position: absolute; right: 15px; bottom: 25px" />
              </a-tooltip>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="table-btn" v-if="!tongji" @click="tongji = !tongji">
      <div style="display: flex; align-items: center; padding: 15px 0">
        <!-- <Calculator /> -->
        <Sheet />
      </div>
    </div>

    <div
      class="tuli"
      :style="{
        background: tuli ? 'rgba(253, 250, 250, 0.9)' : 'rgba(0, 0, 0, 0.7)',
        color: tuli ? 'rgba(0, 0, 0, 0.7)' : 'rgba(253, 250, 250, 0.8)',
      }"
    >
      <div
        style="display: flex; align-items: center; padding: 15px 0"
        @click="tuli = !tuli"
      >
        <Logs />

        <label v-if="tuli" style="padding-left: 15px"> 图例</label>
        <!-- <CircleX v-if="tuli"   style="position:absolute;right:15px;"  /> -->
      </div>

      <div v-if="tuli" style="padding: 5px 0px 10px 5px; width: 200px">
        <a-row
          v-for="tar in legends"
          :key="tar.key"
          style="display: flex; align-items: center; line-height: 30px"
        >
          <a-col :span="6">
            <div
              v-if="tar.type == 'polygon'"
              :style="{
                background: tar.fillColor,
                border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
                width: '35px',
                height: '20px',
              }"
            ></div>
            <div
              v-if="tar.type == 'line-dotted'"
              :style="{
                borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
                width: '35px',
                height: '0px',
                paddingTop: '3.5px',
              }"
            ></div>

            <div
              v-if="tar.type == 'line'"
              :style="{
                borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
                width: '35px',
                height: '0px',
                paddingTop: '3.5px',
              }"
            ></div>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :span="17">
            {{ tar.title }}

            <div style="position: absolute; right: 5px; bottom: 0">
              <a-switch
                v-if="tar.key == 1"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked1"
              />
              <a-switch
                v-if="tar.key == 2"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked2"
              />
              <a-switch
                v-if="tar.key == 3"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked3"
              />
              <a-switch
                v-if="tar.key == 4"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked4"
              />
              <a-switch
                v-if="tar.key == 5"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked5"
              />
              <a-switch
                v-if="tar.key == 6"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked6"
              />
              <a-switch
                v-if="tar.key == 7"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked7"
              />
              <a-switch
                v-if="tar.key == 8"
                checked-children="显示"
                un-checked-children="隐藏"
                v-model:checked="state.checked8"
              />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
.searchshadow {
  cursor: pointer;

  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  font-size: 14px;
  height: 55px;
  color: #f7f1f1;
  border: 0;
  padding: 0 26px;
}
.boxshadow {
  cursor: pointer;

  border-radius: 3px;

  height: 50px;

  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.boxshadow:hover {
  background-color: rgba(0, 0, 0, 1);
}
.page {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(53, 51, 51);
}

.left-cd {
  position: absolute;
  left: 20px;
  top: 200px;
  width: 400px;
  /* height: calc(80%); */
  background-color: rgba(247, 245, 245, 0.753);
  padding: 15px;
  /* height: calc(50%); */
  border-radius: 3px;
}

.left-cd:hover {
  background-color: rgba(247, 245, 245, 1);
}
.header {
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.6); */
  z-index: 20000;
  /* background-color: rgba(0, 0, 0, 0.6); */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5));
}

/deep/.ant-page-header-heading-title {
  color: aliceblue;
}
/deep/ .ant-page-header-heading-sub-title {
  color: #ccc;
}
/deep/ .ant-tabs-tab-btn {
  font-size: 16px;

  /* color: #fff; */
}
/deep/ .ant-tabs-tab-active {
  background-color: #ffffff18;
  /* color: #fff; */
}

/deep/ .ant-tree {
  background-color: transparent;
  /* color: #ccc; */
}

/deep/ .ant-select-selection-item {
  background-color: rgba(50, 119, 252, 1);
  /* color: #fff; */
}

/deep/ .ant-select-selection-placeholder {
  color: #807d7de3;

  font-size: 14px;
}

/deep/ .ant-select-clear {
  /* color: #ccc;
  background-color: transparent; */
}

/deep/ .ant-select-clear:hover {
  color: rgba(50, 119, 252, 1);
}

/deep/ .ant-statistic-content {
  /* color: #fff; */
}

/deep/ .ant-statistic-title {
  /* color: #fff; */
}

.search {
  position: absolute;
  left: 20px;
  top: 100px;

  width: 90%;
}

.header-menu {
  padding: 0 0 15px 15px;
  font-size: 18px;
  font-weight: 2000;
  /* background-color: transparent; */
  /* color: #fff;
   */
  border-bottom: 1px solid #0c0c0cbb;
  display: flex;
  align-content: center;
}

.table-fx {
  position: absolute;
  bottom: 50px;
  left: 15px;

  background-color: rgba(245, 241, 241, 0.904);
  padding: 15px;
  border-radius: 2px;
  cursor: pointer;
}

/* .table-fx:hover {
  background-color: rgba(245, 241, 241, 1);
} */

.table-tj th {
  border-bottom: 1px solid #141414;
  font-size: 15px;
  font-weight: 1000;
  padding: 0 15px 0 0;
}

.table-tj tr:hover {
  background-color: rgba(8, 8, 8, 0.055);
  font-weight: 2000;
}
.table-tj {
  line-height: 30px;
  width: 100%;
  border-radius: 2px;
}

.table-btn {
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 20px;
  bottom: 50px;
  padding: 0 15px;
  color: #ccc;
  border-radius: 2px;
}

.tuli {
  position: absolute;
  right: 20px;
  bottom: 50px;
  padding: 0 15px;
  border-radius: 2px;
}

/* /deep/ .ant-message-notice>.ant-message-notice-content{
    background-color: rgba(0, 0, 0, 0.6);
    color: #f7f1f1;
} */
</style>
