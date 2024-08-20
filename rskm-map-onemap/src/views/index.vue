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
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/zh-cn";
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
  PanelBottomOpen,
  PanelTopOpen,
} from "lucide-vue-next";

import page from "../../package.json";
const value = ref("user1");
import StateManager from "@/utils/state_manager";
dayjs.extend(updateLocale);
dayjs.updateLocale("zh-cn", {
  weekStart: 0,
});

message.config({
  top: `200px`,
  //   duration: 2,
  maxCount: 2,
  rtl: true,
  prefixCls: "提示",
});

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
  //   console.log(optionsType);
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

// 菜单
// const data = reactive(["主页", "数据分析"]);
const activeKey = ref("1");
// const value_data = ref(data[0]);

// 数据列表
const open = ref(false);
const onClose = () => {
  open.value = false;
};
const menu = ref(false);

// 年份
const value5 = ref(
  dayjs(StateManager.get("rskm_pt_year") || new Date().toLocaleDateString())
);

const panelChangeRL = (value, mode) => {
  StateManager.clear("rskm_pt_year");
  StateManager.set("rskm_pt_year", dayjs(value).format("YYYY"));

  message.loading(
    `进入 ${StateManager.get("rskm_pt_year", dayjs(value).format("YYYY"))} 年度`,
    2000
  );

  setTimeout((e) => {
    location.reload();
  }, 2000);
};
</script>

<template>
  <a-page-header
    class="header"
    :title="page.name"
    :sub-title="page.cnname + ' V' + page.version"
    :avatar="{ src: logo }"
    style="color: #ccc"
  >
    <template #footer>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="主页" />
        <a-tab-pane key="2" tab="分析统计" />
      </a-tabs>
    </template>

    <template #extra>
      <!-- <a-button key="3" type="info" style="color: #ccc">2024年</a-button> -->
      <a-space direction="vertical" :size="5">
        <a-date-picker
          v-model:value="value5"
          picker="year"
          format="YYYY 年"
          :popupStyle="{ top: '150px' }"
          @panelChange="panelChangeRL"
        />
      </a-space>
      <a-button key="2" type="info" style="color: #ccc">山东省</a-button>
    </template>
  </a-page-header>
  <div class="page">
    <!--一张图平台-->
    <SDMap></SDMap>
    <div v-if="activeKey == '1'">
      <!--检索搜索-->
      <div class="search">
        <a-row>
          <!-- <a-col :span="24"> </a-col>
          <a-col :span="24"> &nbsp; </a-col> -->

          <a-col :span="2">
            <a-tooltip placement="bottom">
              <template #title>高级筛查</template>
              <a-button size="large" class="searchshadow" @click="menu = !menu">
                <Grip :color="!menu ? '#fff' : 'RGB(36,172,242)'" />
              </a-button>
            </a-tooltip>
          </a-col>
          <a-col :span="16">
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
              <a-tooltip placement="bottom">
                <template #title>查询</template>
                <a-button type="primary" size="large" class="searchshadow"
                  ><Search />
                </a-button>
              </a-tooltip>

              <a-tooltip placement="bottom">
                <template #title>保单详情</template>
                <a-button size="large" class="searchshadow" @click="open = !open">
                  <PanelBottomOpen v-if="!open" />
                  <PanelTopOpen v-else />
                </a-button>
              </a-tooltip>
            </a-input-group>
          </a-col>

          <a-col :span="4"> </a-col>
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

      <!--保单信息-->
      <!-- <div class="insurance" v-if="1 == 2">
      
      </div> -->

      <a-drawer
        title="保单详情"
        placement="bottom"
        :open="open"
        @close="onClose"
        :height="500"
        :mask="false"
        bodyStyle="padding:0"
        size="small"
      >
        <Insurance></Insurance>
      </a-drawer>
    </div>

    <div v-if="activeKey == '2'"></div>
  </div>
  <!--图例-->
  <div class="tuli">
    <Legend></Legend>
  </div>
</template>

<style scoped>

.searchshadow {
  cursor: pointer;

  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  font-size: 16px;
  height: 66px;
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
  z-index: 20000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
}


/deep/ .ant-drawer .ant-drawer-body{
    padding: 0;
}
/deep/ .ant-drawer-body{
    padding: 0;
}

/deep/ .ant-drawer{
    padding: 0;
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
/deep/ .ant-tabs-tab {
  width: 10rem;
}
/deep/ .ant-tabs-tab-btn {
  color: rgb(240, 235, 235);
  width: 100%;
  text-align: center;
}

/deep/ .ant-tabs-tab-active {
  background: rgba(248, 247, 247, 0.096);
}

/deep/ .ant-picker {
  background: transparent;
  border: 0;
  padding: 0;
}
/deep/ .ant-picker input {
  color: #ccc;
}

.search {
  position: absolute;
  left: 15px;
  top: 140px;
  width: 50%;
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
  left: 5px;
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

.insurance {
  position: absolute;
  bottom: 15px;

  width: calc(100% - 300px);
}
</style>
