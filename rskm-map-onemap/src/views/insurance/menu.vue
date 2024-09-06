<script setup>
import { ref, watch, onMounted } from "vue";
import { api } from "@/config/api.js";
import { ShieldCheck, Warehouse, MapPinned, RotateCw, Search } from "lucide-vue-next";
import { filterFeature } from "@/views/map/map.js";
import { storeToRefs } from "pinia";
import { treeStore } from "@/store/store.js";
import { filterRskm } from "@/views/map/map.js";
import Admin from "@/views/standard/admin.vue";

// 解构状态
const storeTree = treeStore();
let { treeXz, treeJg, treeQy } = storeToRefs(storeTree);

// 定义响应式变量
const values_type = ref([]);
const values_com = ref([]);
// const selectedKeysCom = ref([]);
const checkedKeysCom = ref(["0-0"]);
const activeKeyLS = ref("2");
const optionsComs = ref([]);
const optionsType = ref([]);
const defaultComVals = ref(["0-0"]);
const defaultTypeVals = ref(["0-0"]);
const comTableData = ref();
// const selectedKeysType = ref([]);
const checkedKeysType = ref(["0-0"]);
const insTableData = ref([]);

const filterGeometryAndPage = (checkedKeys) => {
 // console.log(checkedKeys)
  treeQy.value = checkedKeys.value;
  filterRskm();
}

// 监听checkedKeysCom变化
watch(checkedKeysCom, () => {
  treeJg.value = checkedKeysCom.value;
  filterRskm();
});

// 监听checkedKeysType变化
watch(checkedKeysType, () => {
  treeXz.value = checkedKeysType.value;
  filterRskm();
});

// 加载机构名称下拉列表
const loadTreeCom = () => {
  for (let i in window["rskm_pt_insure_com"]) {
    optionsComs.value.push({
      value: window["rskm_pt_insure_com"][i].insurcompanycode,
      label: Number(i) + 1 + " " + window["rskm_pt_insure_com"][i].insurcompanyname,
      key: Number(i) + 1,
    });
  }
};

// 加载保险类型下拉列表
const loadTreeType = () => {
  let its = window["rskm_pt_insure_type"] || [];
  its.map((it, i) => {
    if (getFilterDataTree(it.xzname)) {
      optionsType.value.push({
        value: it.xzname,
        label: it.xzname + ` ${it.insurancetype}`,
        key: it.codenum,
      });
    }
  });
};

// 保险平台tree
const watchInsCom = () => {
  const list = [
    {
      title: "全部机构",
      key: "0-0",
      children: [],
    },
  ];

  let ics = window.rskm_pt_insure_com || [];
  ics.map((ins) => {
    list[0].children.push({
      title: ins.insurcompanyname,
      key: `0-0-${ins.insurcompanycode}`,
    });
  });

  comTableData.value = list;
};

// 保险类型 tree
const watchInsType = () => {
  const list = [
    {
      title: "全部险种",
      key: "0-0",
      children: [],
    },
  ];
  let its = window.rskm_pt_insure_type || [];
  let itsType = [];
  its.filter((is) => {
    itsType.push(is.insurancetype);
  });

  [...new Set(itsType)].forEach((t, id) => {
    let listk = [];
    its.forEach((r) => {
      if (r.insurancetype == t && getFilterDataTree(r.xzname)) {
        listk.push({
          title: r.xzname,
          key: `0-0-${id}-${r.codenum}`,
        });
      }
    });

    if (listk.length > 0) {
      list[0].children.push({
        title: t,
        children: listk,
        key: `0-0-${id}`,
      });
    }
  });

  insTableData.value = list;
};

// 获取统一类型
const getFilterDataTree = (name) => {
  let arrType = ["小麦", "玉米", "大豆"];
  return arrType.some(a => name.includes(a));
};

// 加载数据
const loadData = async () => {
  let rskm_pt_insure_type = await api.get_table_by_filter(
    "rskm_pt_insure_type",
    "",
    "codenum,xzname,id,insurancetype,insurancetypeid"
  );
  if (rskm_pt_insure_type.length > 0) {
    window.rskm_pt_insure_type = rskm_pt_insure_type;
    loadTreeType();
    watchInsType();
  }

  let rskm_pt_insure_com = await api.get_table_by_filter(
    "rskm_pt_insure_com",
    "",
    "insurcompanycode,insurcompanyname,id"
  );

  if (rskm_pt_insure_com) {
    window.rskm_pt_insure_com = rskm_pt_insure_com;
    loadTreeCom();
    watchInsCom();
  }
};

// 初始化
onMounted(() => {
  treeXz.value = checkedKeysCom.value;
  treeJg.value = checkedKeysCom.value;
  treeQy.value = checkedKeysCom.value;
  loadData();
});

// 重置筛选条件
const onRect = () => {
  values_type.value = [];
  values_com.value = [];
};
</script>

<template>
  <a-tabs v-model:activeKey="activeKeyLS">
    <a-tab-pane key="2">
      <template #tab>
        <ShieldCheck />
        <div>险种险类</div>
      </template>
      <div style="padding: 15px">
        <div>
          <a-tree
            v-model:checkedKeys="checkedKeysType"
            v-model:expandedKeys="defaultTypeVals"
            checkable
            :autoExpandParent="true"
            v-show="insTableData.length"
            :height="500"
            :tree-data="insTableData"
            blockNode
            :selectable="false"
          />
        </div>
      </div>
    </a-tab-pane>

    <a-tab-pane key="1">
      <template #tab>
        <Warehouse />
        <div>保险机构</div>
      </template>
      <div style="padding: 15px">
        <div>
          <a-tree
            v-model:checkedKeys="checkedKeysCom"
            v-model:expandedKeys="defaultComVals"
            checkable
            :autoExpandParent="true"
            v-show="comTableData.length"
            :height="500"
            :tree-data="comTableData"
            blockNode
            :selectable="false"
          />
        </div>
      </div>
    </a-tab-pane>

    <a-tab-pane key="3">
      <template #tab>
        <MapPinned />
        <div>行政区划</div>
      </template>
      <div style="padding: 15px">
        <Admin :filterGeometryAndPage="filterGeometryAndPage"></Admin>
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
        </a-button>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="11">
        <a-button size="large" style="width: 100%" class="boxshadow" @click="onRect()">
          <template #icon>
            <RotateCw style="margin-right: 10px" />
          </template>
          重置
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
/deep/ .ant-tabs-nav-list > .ant-tabs-tab {
  margin: 0;
}

/deep/ .ant-tabs-tab {
  width: 155px;
  text-align: center;
}

/deep/ .ant-tabs-tab-btn {
  color: rgb(240, 235, 235);
  width: 100%;
  text-align: center;
}

/deep/ .ant-tabs-tab-active {
  background: rgba(248, 247, 247, 0.096);
  margin: 0;
}
</style>
