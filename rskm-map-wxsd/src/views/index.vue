<script setup>
// import {
//   UserOutlined,
//   ApartmentOutlined,
//   FileProtectOutlined,
// } from "@ant-design/icons-vue";
import { logo } from "./index";

import { ref, computed, watch, onMounted, nextTick } from "vue";
import { api } from "../config/map";
import SDMap from "../views/SDMap.vue";
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
} from "lucide-vue-next";

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
  setTimeout(() => {}, 1000);
});

nextTick(() => {
  loadTable();
});
const loadTable = () => {
  // api.procjet_wxsd_dk_xiaomai;

  api.procjet_wxsd_dk_xiaomai.then((data) => {
    window["procjet_wxsd_dk_xiaomai"] = data;

    if (data) {
      console.log(data);
      for (let i in data) {
        // console.log(data[i]);
        //dataSource = data;
        dataSource.value.push({
          bxjg: data[i]["bxjg"],
          bdzs: data[i]["bdzs"],
          dksl: data[i]["dksl"],
          dkzmj: data[i]["dkzmj"],
          hegedikuaishuliang: data[i]["hegedikuaishuliang"],
          hgdkslzb: data[i]["hgdkslzb"],
          hgdkmjzb: data[i]["hgdkmjzb"],
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
      id: 1,
    },
    {
      xzname: "商河县",
      id: 2,
    },
    {
      xzname: "巨野县",
      id: 3,
    },
    {
      xzname: "齐河县",
      id: 4,
    },
    {
      xzname: "阳谷县",
      id: 5,
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
const checkedKeysType = ref([]);
watch(selectedKeysType, () => {
  //console.log("selectedKeys", selectedKeysType);
});
watch(checkedKeysType, () => {
  console.log("checkedKeys", checkedKeysType);
});

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
    const treeNode = {
      title: window["rskm_pt_insure_type"][iu].xzname,
      key,
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
  values_type.value = [];
  values_com.value = [];
  checkedKeysCom.value = [];
  checkedKeysType.value = [];
};

const onSearch = () => {};

const mode = ref("left");
const activeKeyLS = ref(1);
const callback = (val) => {
  console.log(val);
};

const searchListName = [
  { name: "保单编号", type: 1 },
  { name: "地块GID", type: 2 },
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

// const dataSource = () => {
//   let list = [
//     // {
//     //     bxjg:"111", bdzs:"111", dkbdsl:"111"
//     // },
//     // {
//     //     bxjg:"111", bdzs:"111", dkbdsl:"111"
//     // },
//   ];

//   for (let i in optionsComs.value) {
//     list.push({
//       bxjg: optionsComs.value[i].label,
//     });
//   }
//   list.push({
//     bxjg: "合计",
//   });
//   return list;
// };

const columns = [
  {
    title: "保险机构",
    dataIndex: "bxjg",
    key: "bxjg",
  },
  {
    title: "保单总数 (张)",
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
    title: "地块数量 (块)",
    dataIndex: "dksl",
    key: "dksl",
  },
  {
    title: "地块总面积 (亩)",
    dataIndex: "dkzmj",
    key: "dkzmj",
  },
  {
    title: "合格地块数量 (块)",
    dataIndex: "hegedikuaishuliang",
    key: "hegedikuaishuliang",
  },
  {
    title: "合格地块数量占比",
    dataIndex: "hgdkslzb",
    key: "hgdkslzb",
  },
  {
    title: "合格地块面积占比",
    dataIndex: "hgdkmjzb",
    key: "hgdkmjzb",
  },
];

const onSearchHeader = () => {
  console.log(value3.value);
  console.log(value4.value);

  if (value3.value == "保单编号") {
    if (value4.value) {
      let features2 = map.querySourceFeatures("procjet_wxsd_dk_xiaomai", {
        sourceLayer: "procjet_wxsd_dk_xiaomai",
      });

      // console.log(features2);
      let ff = features2.filter((feature) => {
        return feature.properties.baodanhao == value4.value;
      });

      console.log(ff[0]);

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

      console.log(ff[0]);

      map.setFilter("Highlight_DK", ["all", ["in", "gid", ff[0].properties.gid]]);
      map.setLayoutProperty("Highlight_DK", "visibility", "visible");
      fitBox(ff[0]);
    }
  }
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
</script>

<template>
  <a-page-header
    class="header"
    title="OneMap  "
    sub-title=" 智农险一张图解决方案 V1.0.0"
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
        <Component color="#fff" style="margin-right: 10px" />统计分析
      </div>

      <a-tabs
        v-model:activeKey="activeKeyLS"
        :tab-position="mode"
        :style="{ height: '100%' }"
      >
        <!-- <a-tab-pane key="3" tab="行政区划"></a-tab-pane> -->
        <a-tab-pane key="2" tab="行政区划">
          <div v-if="!checkedKeysType.length">
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
          </div>
          <div v-if="!values_type.length">
            <a-tree
              v-model:selectedKeys="selectedKeysType"
              v-model:checkedKeys="checkedKeysType"
              checkable
              :autoExpandParent="true"
              :defaultExpandAll="true"
              v-if="digType().length"
              :height="300"
              :tree-data="digType()"
              blockNode
              :selectable="false"
            >
              <!-- <template #title="{ title, key,id }">
                <div v-if="key">{{ title }} <sub>{{id}}</sub></div>
                <template v-else>{{ title }}</template>
              </template> -->
            </a-tree>
          </div>
        </a-tab-pane>
        <a-tab-pane key="1" tab="保险机构">
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
              <!-- <template #title="{ title, key }">
                <div v-if="key">{{ title }}</div>
                <template v-else>{{ title }}</template>
              </template> -->
            </a-tree>
          </div>
        </a-tab-pane>
      </a-tabs>
      <div>
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
      </div>
    </div>

    <!--统计分析 -->
    <div class="table-fx">
      <!-- <a-table :dataSource="dataSource" :columns="columns" size="small">
      </a-table> -->
      <table class="table-tj">
        <tr>
          <th v-for="ii in columns" :key="ii.key">{{ ii.title }}</th>
        </tr>
        <tr v-for="it in dataSource.filter((r) => r['bxjg'] != '合计')" :key="it.key">
          <!-- <td>{{ it }}</td> -->
          <td>{{ it["bxjg"] }}</td>
          <td>{{ it["bdzs"] }}</td>
          <td>{{ it["dksl"] }}</td>
          <td>{{ it["dkzmj"] }}</td>
          <td>{{ it["hegedikuaishuliang"] }}</td>
          <td>{{ Number(it["hgdkslzb"]).toFixed(2) }}</td>
          <td>{{ Number(it["hgdkmjzb"]).toFixed(2) }}</td>
        </tr>
        <tr v-for="it in dataSource.filter((r) => r['bxjg'] == '合计')" :key="it.key">
          <!-- <td>{{ it }}</td> -->
          <td>{{ it["bxjg"] }}</td>
          <td>{{ it["bdzs"] }}</td>
          <td>{{ it["dksl"] }}</td>
          <td>{{ it["dkzmj"] }}</td>
          <td>{{ it["hegedikuaishuliang"] }}</td>
          <td>{{ Number(it["hgdkslzb"]).toFixed(2) }}</td>
          <td>{{ Number(it["hgdkmjzb"]).toFixed(2) }}</td>
        </tr>
      </table>
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
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  /* height: calc(50%); */
  border-radius: 3px;
}

.left-cd:hover {
  background-color: rgba(0, 0, 0, 0.6);
}
.header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.6);
  z-index: 20000;
  background-color: rgba(0, 0, 0, 0.6);
}

/deep/.ant-page-header-heading-title {
  color: aliceblue;
}
/deep/ .ant-page-header-heading-sub-title {
  color: #ccc;
}
/deep/ .ant-tabs-tab-btn {
  font-size: 16px;

  color: #fff;
}
/deep/ .ant-tabs-tab-active {
  background-color: #ffffff18;
  color: #fff;
}

/deep/ .ant-tree {
  background-color: transparent;
  color: #ccc;
}

/deep/ .ant-select-selection-item {
  background-color: rgba(50, 119, 252, 1);
  color: #fff;
}

/deep/ .ant-select-selection-placeholder {
  color: #807d7dc0;

  font-size: 14px;
}

/deep/ .ant-select-clear {
  color: #ccc;
  background-color: transparent;
}

/deep/ .ant-select-clear:hover {
  color: rgba(50, 119, 252, 1);
}

/deep/ .ant-statistic-content {
  color: #fff;
}

/deep/ .ant-statistic-title {
  color: #fff;
}

.search {
  position: absolute;
  left: 20px;
  top: 100px;

  width: 90%;
}

.header-menu {
  padding: 0 20px 20px 20px;
  font-size: 20px;
  font-weight: 2000;
  background-color: transparent;
  color: #fff;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-content: center;
}

.table-fx {
  position: absolute;
  bottom: 50px;
  left: 15px;
  width: 80%;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
}

.table-tj th {
  
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  font-weight: 2000;
}
.table-tj {
  color: #fff;
  line-height: 35px;
  width: 100%;
  text-align: center;
}
</style>
