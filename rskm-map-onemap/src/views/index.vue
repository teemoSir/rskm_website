<script setup>
// import {
//   UserOutlined,
//   ApartmentOutlined,
//   FileProtectOutlined,
// } from "@ant-design/icons-vue";
import { logo } from "./index";
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { api } from "../config/map";
import SDMap from "./map/map.vue";
import { message } from "ant-design-vue";
import Legend from "./map/legend.vue";
import Insurance from "./insurance/insurance.vue";
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
  Logs,
  CalendarHeart,
  NotepadText,
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
      label: Number(i) + 1 + " " + vvs,
      key: Number(i) + 1,
    });
  }
  //   console.log(optionsComs);
  //   console.log(window["rskm_pt_insure_com"]);
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
});

const loadData = () => {
  /**
   * 险种
   */

  api.rskm_pt_insure_type.then((data) => {
    window["rskm_pt_insure_type"] = data;
    loadTreeType();
  });

  /**
   * 保险平台
   */

  api.rskm_pt_insure_com.then((data) => {
    window["rskm_pt_insure_com"] = data;
    loadTreeCom();
  });
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
  //console.log(checkedKeysType);
  return list;
}
const selectedKeysType = ref([]);
const checkedKeysType = ref([]);
watch(selectedKeysType, () => {
  //console.log("selectedKeys", selectedKeysType);
});
watch(checkedKeysType, () => {
  //console.log("checkedKeys", checkedKeysType);
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
  //console.log("selectedKeys", selectedKeysType);
});
watch(checkedKeysCom, () => {
  //console.log("checkedKeys", checkedKeysType);
});

const values_type = ref([]);
const values_com = ref([]);

const onRect = () => {
  values_type.value = [];
  values_com.value = [];
};

const onSearch = () => {};

const mode = ref("left");
const activeKeyLS = ref(1);
const callback = (val) => {
  console.log(val);
};

const searchListName = [
  { name: "保单", type: 1 },
  { name: "区域", type: 3 },
];

const value3 = ref(searchListName[0].name);
const value4 = ref();

const setSearchListName = (d) => {
  value3.value = d.name;
};

/**
 * 图例
 */
let legends = [
  //   {
  //     key: 1,
  //     title: "耕地",
  //     isShow: ref(false),
  //     type: "polygon",
  //     outlineColor: "RGBA(255,255,251,1)",
  //     fillColor: "RGBA(43,128,251,0.5)",
  //     outlineWidth: 1,
  //   },
  {
    key: 2,
    title: "保单地块",
    isShow: ref(true),
    type: "polygon",
    outlineColor: "RGBA(0,0,0,0.8)",
    fillColor: "RGBA(34,177,76,0.8)",
    outlineWidth: 3,
  },
  //   {
  //     key: 3,
  //     title: "不合格地块",
  //     isShow: ref(true),
  //     type: "polygon",
  //     outlineColor: "RGBA(0,0,0,0.8",
  //     fillColor: "RGBA(237,28,36,0.8)",
  //     outlineWidth: 3,
  //   },
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

const menu = ref(false);

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
// 菜单
const data = reactive(["主页", "保单信息", "数据分析", "风险预警"]);
const value_data = ref(data[0]);
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
      <a-row style="width: 750px">
        <a-col :span="18">
          <a-segmented v-model:value="value_data" :options="data" block> </a-segmented>
        </a-col>
        <!-- <a-col :span="2">
          <CalendarHeart color="#ccc" />
        </a-col>
        <a-col :span="2"> <div style="margin-top: 3px">2024年</div> </a-col> -->
        <a-col :span="1"> </a-col>
        <a-col :span="1">
          <LocateFixed color="#ccc" />
        </a-col>
        <a-col :span="1"> <div style="margin-top: 3px">山东</div> </a-col>
        <a-col :span="1"> </a-col>
        <a-col :span="1"> <Info color="#ccc" /></a-col>
      </a-row>
    </template>
  </a-page-header>
  <div class="page">
    <!--一张图平台-->
    <SDMap></SDMap>
    <div v-if="value_data == '主页'">
      <!--检索搜索-->
      <div class="search">
        <a-row>
          <a-col :span="24"> </a-col>
          <a-col :span="24"> &nbsp; </a-col>

          <a-col :span="4">
            <a-button size="large" class="searchshadow" @click="menu = !menu">
              <Grip :color="!menu ? '#fff' : 'RGB(36,172,242)'" />
            </a-button>
          </a-col>
          <a-col :span="20">
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
                style="width: 200px"
                class="searchshadow"
                placeholder="请输入检索关键字"
              />
              <a-button type="primary" size="large" class="searchshadow"
                ><Search />
              </a-button>
            </a-input-group>
          </a-col>
        </a-row>
      </div>
      <!--类型控制单元-->
      <div class="left-cd" v-if="menu">
        <a-tabs v-model:activeKey="activeKeyLS" :tab-position="mode">
          <a-tab-pane key="3" tab="区域"></a-tab-pane>
          <a-tab-pane key="1" tab="机构">
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
          <a-tab-pane key="2" tab="险种">
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
        </a-tabs>
        <div>
          <a-row v-if="values_type.length || values_com.length">
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
    </div>

    <div v-if="value_data == '保单信息'">
      <div class="insurance">
        <Insurance></Insurance>
      </div>
    </div>
  </div>

  <div class="tuli">
    <Legend></Legend>
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
  width: 450px;
  /* height: calc(80%); */
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px 15px 0 0;
  height: calc(50%);
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

  width: 550px;
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

.tuli {
  position: absolute;
  right: 10px;
  bottom: 20px;
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

/deep/ .ant-segmented {
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
}
.insurance {
  position: absolute;
  left: 15px;
  bottom: 100px;

  width: calc(100% - 30px);
 
}
</style>
