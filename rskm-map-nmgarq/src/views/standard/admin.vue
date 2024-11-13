<script setup>
import { api } from "@/config/api.js";
import { onMounted, ref, watch, defineProps } from "vue";
import * as turf from "@turf/turf";
import StateManager from "@/utils/state_manager";

/**
 * 默认行政区名称
 * @type {string}
 */
const defaultName = StateManager.get("defaultAdmin");

/**
 * 树形结构数据
 * @type {import('vue').Ref<Array<Object>>}
 */
const treeData = ref([
  {
    title: defaultName,
    key: "0-0",
    children: [],
  },
]);

/**
 * 展开的节点键值
 * @type {import('vue').Ref<Array<string>>}
 */
const expandedKeys = ref(["0-0"]);

/**
 * 选中的节点键值
 * @type {import('vue').Ref<Array<string>>}
 */
const selectedKeys = ref([]);

/**
 * 勾选的节点键值
 * @type {import('vue').Ref<Array<string>>}
 */
const checkedKeys = ref(["0-0"]);

watch(selectedKeys, () => {
  // console.log("selectedKeys", selectedKeys);
  // console.log(treeData.value[0]);
});

watch(checkedKeys, () => {
  // console.log("checkedKeys", checkedKeys);
  //图新筛选
  props.filterGeometryAndPage && props.filterGeometryAndPage(checkedKeys);
});

/**
 * 节点展开处理函数
 * @param {*} a - 展开事件参数
 * @param {Object} b - 包含节点信息的对象
 * @param {Object} b.node - 展开的节点
 * @param {boolean} b.expanded - 是否展开
 */
const expandChildren = (a, b) => {
  console.log(a, b);

  if (b.node.key.split("-").length > 4) {
  } else if (b.node.key.split("-").length > 3) {
    //  console.log(33333);
    b.expanded && loadTown(b.node.key);
  } else if (b.node.key.split("-").length > 2) {
    // console.log(22222);
    b.expanded && loadCounty(b.node.key);
  }

  if (!b.expanded) {
    goGeomUn();
  } else {
    goGeom(b.node.feature.json);
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
      "line-width": 12,
      "line-opacity": 0.6,
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
    padding: { top: 200, bottom: 200, left: 300 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
};

/**
 * 选中节点处理函数
 * @param {*} a - 选中事件参数
 * @param {Object} b - 包含节点信息的对象
 * @param {Object} b.node - 选中的节点
 * @param {boolean} b.selected - 是否选中
 */
const selectChildren = (a, b) => {
  //console.log(b.node);

  if (b.node.selected) {
    goGeomUn();
  } else {
    goGeom(b.node.feature.json);
  }
};

/**
 * 加载市级数据
 * @returns {Promise<void>}
 */
const loadCity = async () => {
  let features = await api.get_table_by_filter(
    "admin_2022_city",
    `and province='${defaultName}' order by code`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,gid,name_2,name,province,province_code,code `
  );

  //console.log(feature);
  if (features.length > 0) {
    treeData.value[0].children = [];

    for (const feature of features) {
      treeData.value[0].children.push({
        title: `${feature.name}`,
        key: "0-0-" + feature.code,
        feature: feature,
        children: [
          {
            title: "加载中...",
            key: "0-0-" + feature.code + "-0",
            disabled: true,
          },
        ],
      });
    }
  }
};

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCounty = async (code) => {
  //console.log(String(code).substring(0, 4));
  let features = await api.get_table_by_filter(
    "admin_2022_county",
    `and province_name='${defaultName}' and city_code='${String(code.split("-")[2]).substring(
      0,
      4
    )}00' order by county_code`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,city_code,city_name,county_code,gid,name,province_name`
  );

  if (features.length > 0) {
    for (const re of treeData.value[0].children) {
      if (String(re.key.split("-")[2]) == code.split("-")[2]) {
        re.children = [];

        for (const feature of features) {
          re.children.push({
            title: feature.name,
            key: re.key + "-" + feature.county_code,
            feature: feature,
            children: [
              {
                title: "加载中...",
                key: code + "-0",
                disabled: true,
              },
            ],
          });
        }

        break;
      }
    }
  }
};

/**
 * 加载乡镇级数据
 * @param {string} code - 县级行政区代码
 * @returns {Promise<void>}
 */
const loadTown = async (code) => {
  let features = await api.get_table_by_filter(
    "admin_2024_town",
    `and p_xzqmc='${defaultName}' and f_xzqhdm='${code.split("-")[3]}' order by t_xzqdm`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.0001)) as json,f_xzqhdm,gid,t_xzqdm,t_xzqmc,f_xzqhmc`
  );

  if (features.length > 0) {
    for (const re of treeData.value[0].children) {
      if (
        String(re.key.split("-")[2]).substring(0, 4) == code.split("-")[2].substring(0, 4)
      ) {
        for (const ress of re.children) {
          if (ress.key == code) {
            ress.children = [];
            for (const feature of features) {
              ress.children.push({
                title: feature.t_xzqmc,
                key: ress.key + "-" + feature.t_xzqdm,
                feature: feature,
              });
            }
            break;
          }
        }
      }
    }
  }
};

onMounted(() => {
  loadCity();
});

/**
 * 组件属性
 * @type {Object}
 * @property {Function} filterGeometryAndPage - 筛选几何图形和页面的函数
 */
const props = defineProps({
  filterGeometryAndPage: Function,
});
</script>
<template>
  <div>
    <a-tree
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      checkable
      :tree-data="treeData"
      :height="500"
      @expand="expandChildren"
      @select="selectChildren"
      blockNode
    >
      <template #title="{ title, key }">
        <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
        <template v-else>{{ title }}</template>
      </template>
    </a-tree>
  </div>
</template>

<style scoped></style>
