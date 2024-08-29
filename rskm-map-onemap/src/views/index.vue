<script setup>
import { logo } from "./index";
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/map";
import SDMap from "./map/map.vue";
import { message } from "ant-design-vue";
import Legend from "./map/legend.vue";
import Insurance from "./insurance/insurance.vue";
import Menu from "./insurance/menu.vue";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/zh-cn";
import {
  //   Headset,
  // Info,
  Search,
  FileDigit,
  //   X,
  //   Sprout,
  ShieldCheck,
  MapPinned,
  Home,
  Grip,
  Settings,
  TextSearch,
  PanelBottomOpen,
  PanelTopOpen,
} from "lucide-vue-next";

import page from "../../package.json";
import StateManager from "@/utils/state_manager";
import * as turf from "@turf/turf";
import { filterFeature } from "./map/map";
import { layers } from "@/config/spec";

const value = ref("user1");
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

const inSerchRef = ref();
const insuranceRef = ref(null);


//菜单
const current = ref(["mail"]);
const items = ref([
  {
    key: "mail",
    icon: () => h(Home),
    label: "首页",
    title: "首页",
  },
  {
    key: "app",
    icon: () => h(TextSearch),
    label: "信息查询",
    title: "信息查询",
    children: [
      {
        type: "group",
        label: "保单",
        children: [
          {
            label: "保单详情",
            key: "app:1",
          },
        ],
      },
      {
        type: "group",
        label: "耕地",
        children: [
          {
            label: "耕地详情",
            key: "app:2",
          },
        ],
      },
    ],
  },
  {
    key: "sub1",
    icon: () => h(FileDigit),
    label: "统计分析",
    title: "统计分析",
    children: [
      {
        type: "group",
        label: "数据分析",
        children: [
          {
            label: "农险一张图",
            key: "sub5:1",
          },
          {
            label: "保单统计",
            key: "sub4:1",
          },
          {
            label: "结构分析",
            key: "sub1:2",
            children: [
              {
                label: "区域",
                key: "sub2:3",
              },
              {
                label: "机构",
                key: "sub2:4",
              },
            ],
          },
          {
            label: "成效分析",
            key: "sub3:2",
          },
        ],
      },
    ],
  },
  {
    key: "cloud",
    icon: () => h(Settings),
    label: "平台能力",
    title: "平台能力",
    children: [
      {
        type: "group",
        label: "基础数据",
        children: [
          {
            label: "区划管理",
            key: "cloud4:1",
          },
          {
            label: "地块管理",
            key: "cloud3:1",
          },
        ],
      },

      {
        type: "group",
        label: "气象",
        children: [
          {
            label: "卫星云图",
            key: "cloud2:1",
          },
          {
            label: "实时气象",
            key: "cloud1:2",
          },
        ],
      },
    ],
  },
  {
    key: "alipay",
    label: h(
      "a",
      {
        href: "",
        target: "_blank",
      },
      ""
    ),
    title: "Navigation Four - Link",
  },
]);

const onSearch = () => {};

// const callback = (val) => {
//   console.log(val);
// };

const searchListName = [
  { name: "单号", type: 1 },
  { name: "区域", type: 2 },
];

const value3 = ref(searchListName[0].name);
//搜索框
const searchValue = ref();
watch(searchValue, () => {
  //点击X清空
  !searchValue.value && filterRSKMPT();
});

// 检索类型
const setSearchListName = (d) => {
  value3.value = d.name;
  inSerchRef.value.focus();
  searchValue.value = "";
};

// 菜单
// const data = reactive(["主页", "数据分析"]);
const activeKey = ref("1");
// const value_data = ref(data[0]);

// 数据列表
const open = ref(true);

watch(open, () => {
  open && (loadReady.value = 400);
  if (open && !searchValue.value) {
    insuranceRef.value.loadCount();
    insuranceRef.value.loadTabel();
  }
});
const onClose = () => {
  open.value = false;
};

// 增加数据延时
const loadReady = ref(1);

const menu = ref(false);

// 年份
const value5 = ref(
  dayjs(StateManager.get("rskm_pt_year") || new Date().toLocaleDateString())
);

//跳转年份数据
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

const goGeomUn = () => {
  map.getLayer("lockGeom") && map.removeLayer("lockGeom");
  map.getSource("lockGeom") && map.removeSource("lockGeom");
};

/**
 * 查找地块
 * @param {} data
 */
const goGeom = (data) => {
  // console.log(data);

  goGeomUn();

  map.addSource("lockGeom", {
    type: "geojson",
    data: JSON.parse(data),
  });
  map.addLayer({
    id: "lockGeom",
    type: "line",
    source: "lockGeom",
    paint: {
      "line-color": "red",
      "line-opacity": 0.6,
      "line-width": 5,
    },
  });

  map.fitBounds(turf.bbox(JSON.parse(data)), {
    padding: { top: 200, bottom: 600 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
};

// 查询单个保单号
const searchByfilter = async () => {
  if (searchValue.value && value3.value == "单号") {
    let feature = await api.get_insure_by_filter(
      "rskm_pt",
      `and insurancenum='${searchValue.value}'`,
      `ST_AsGeoJSON(geom) as json `
    );

    feature = feature[0];

    if (!feature) {
      message.warning(`暂无【${searchValue.value}】单号数据`, 3);
      filterRSKMPT();
      return false;
    } else {
      message.success(`【${searchValue.value}】单号，查询到1条数据`, 3, async () => {
        goGeom(feature.json);
        filterRSKMPT(1);
      });
    }
  } else if (searchValue.value && value3.value == "区域") {
    let filter = `and (province ILIKE  '%25${searchValue.value}%25' or city ILIKE  '%25${searchValue.value}%25' or county ILIKE  '%25${searchValue.value}%25' or town ILIKE  '%25${searchValue.value}%25' or village ILIKE  '%25${searchValue.value}%25')`;
    open.value = true;
    const data = await api.get_table_count("rskm_pt", filter);

    if (Number(data[0].count)) {
      insuranceRef.value.loading = true;
      message.success(
        `【${searchValue.value}】区域，查询到${data[0].count}条关联数据`,
        3,
        () => {
          insuranceRef.value.loading = false;
          insuranceRef.value.loadTabel(1, 30, filter);
          insuranceRef.value.loadCount(filter);
        }
      );

      filterRSKMPT(2);
    } else {
      message.warning(`暂未查询到【${searchValue.value.trim()}】区域的数据`, 3);
      insuranceRef.value.loading = false;
      open.value = !true;
      filterRSKMPT();
    }
  } else {
    filterRSKMPT();
  }
};

// 图形筛查
const filterRSKMPT = (type) => {
  //console.log(searchValue.value.trim());
  let layers = ["rskm_pt_outline", "rskm_pt", "rskm_pt_name"];
  switch (type) {
    case 1:
      //单号
      filterFeature(layers, [
        "all", //
        ["==", ["get", "insurancenum"], searchValue.value.trim()],
      ]);
      break;
    case 2:
      //区域
      filterFeature(layers, [
        "any", // county,city,village,town
        [">", ["index-of", searchValue.value.trim(), ["get", "county"]], -1],
        [">", ["index-of", searchValue.value.trim(), ["get", "city"]], -1],
        [">", ["index-of", searchValue.value.trim(), ["get", "village"]], -1],
        [">", ["index-of", searchValue.value.trim(), ["get", "town"]], -1],
      ]);
      break;

    default:
      filterFeature(layers, [
        "all", // county,city,village,town
        ["!=", ["get", "insurancenum"], null],
      ]);
      break;
  }
};

setTimeout(() => {
  // loadReady.value = 400;
  open.value = false;
}, 0);
</script>

<template>
  <a-page-header
    class="header"
    :title="page.name"
    :sub-title="page.cnname + ' V' + page.version"
    :avatar="{ src: logo }"
    style="color: #ccc"
  >
    <a-menu
      v-model:selectedKeys="current"
      mode="horizontal"
      :items="items"
      style="position: absolute; left: 600px; top: 0px; line-height: 92px"
    />
    <template #extra>
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
      <div class="search" style="width: 600px">
        <a-row>
          <a-col :span="3">
            <a-tooltip placement="bottom">
              <template #title>高级筛查</template>
              <a-button size="large" class="searchshadow" @click="menu = !menu">
                <Grip :color="!menu ? '#fff' : 'RGB(36,172,242)'" />
              </a-button>
            </a-tooltip>
          </a-col>

          <a-col :span="21">
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
                  <!-- <ChevronDown  />
                  <ChevronUp  /> -->

                  <div style="display: flex; align-items: center">
                    <ShieldCheck v-if="value3 == '单号'" :size="20" />
                    <MapPinned v-else :size="20" />
                    &nbsp; {{ value3 }}
                  </div>
                </a-button>
              </a-dropdown>
              <a-input
                ref="inSerchRef"
                size="large"
                v-model:value="searchValue"
                style="width: 300px"
                class="searchshadow"
                :placeholder="value3 == '区域' ? '请输入地址区域' : '请输入保险单号'"
                :allowClear="true"
                @keyup.enter="searchByfilter"
              />
              <a-tooltip placement="bottom">
                <template #title>查询</template>
                <a-button
                  type="primary"
                  size="large"
                  class="searchshadow"
                  @click="searchByfilter"
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
        </a-row>
      </div>
      <!--类型控制单元-->
      <div class="leftMenu" v-show="menu">
        <Menu></Menu>
      </div>

      <!--保单信息-->
      <a-drawer
        title=""
        placement="bottom"
        :open="open"
        @close="onClose"
        :mask="true"
        bodyStyle="padding:0"
        :height="loadReady"
      >
        <Insurance ref="insuranceRef"></Insurance>
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

  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
  border-radius: 2px;
  font-size: 14px;

  color: #f7f1f1;
  border: 1px solid #99999948;

  height: 60px;
}

.boxshadow {
  cursor: pointer;

  border-radius: 3px;

  height: 55px;

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

.leftMenu {
  position: absolute;
  left: 15px;
  top: 190px;
  /* width: 570px; */
  /* height: calc(80%); */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
  /* padding: 15px 15px 0 0; */
  /* height: calc(50%); */
  border-radius: 4px;
}

.header {
  z-index: 20000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
}

/deep/ .ant-input {
  background-color: transparent;
  color: #fff;
}
/deep/ .ant-input-clear-icon {
  color: #fff;
}
/deep/ .ant-menu-item svg {
  width: 15px;
  height: 15px;
}

/deep/ .ant-menu-submenu-horizontal svg {
  width: 15px;
  height: 15px;
}
/deep/ .ant-menu-light {
  background-color: transparent;
  color: #ccc;
}

/deep/ .ant-drawer .ant-drawer-body {
  padding: 0;
}
/deep/ .ant-drawer-body {
  padding: 0;
}

/deep/ .ant-drawer {
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
  top: 110px;
  width: 650;
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

.searchshadow::placeholder {
  color: #cccccc63;
}
</style>
