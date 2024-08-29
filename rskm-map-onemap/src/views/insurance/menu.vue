<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/map";
import { message } from "ant-design-vue";
import { ShieldCheck, Warehouse, MapPinned } from "lucide-vue-next";
import { filterFeature } from "@/views/map/map.js";
import { storeToRefs } from "pinia";
import { treeStore } from "@/store/store.js";

// 解构状态
const storeTree = treeStore();
let { treeXz, treeJg, treeQy } = storeToRefs(storeTree);

const values_type = ref([]);
const values_com = ref([]);
const selectedKeysCom = ref([]);
const checkedKeysCom = ref(["0-0"]);
// watch(selectedKeysCom, () => {
//   //console.log("selectedKeys", selectedKeysType);
// });
watch(checkedKeysCom, () => {
 // console.log("checkedKeysCom", checkedKeysCom);

  let sql = [];
  checkedKeysCom.value.forEach((ckt) => {
    ckt.split("|").length > 1 && sql.push(ckt.split("|")[1]);
  });

  treeJg.value = sql;
  //console.log(treeJg.value);
  sql.length && filterRSKMPT();
  !sql.length && filterRSKMPT(false);
});

const activeKeyLS = ref("2");
const onRect = () => {
  values_type.value = [];
  values_com.value = [];
};

// 机构名称downlist
const optionsComs = ref([]);
const loadTreeCom = () => {
  for (let i in window["rskm_pt_insure_com"]) {
    optionsComs.value.push({
      value: window["rskm_pt_insure_com"][i].insurcompanycode,
      label: Number(i) + 1 + " " + window["rskm_pt_insure_com"][i].insurcompanyname,
      key: Number(i) + 1,
    });
  }
  //   console.log(optionsComs);
  //   console.log(window["rskm_pt_insure_com"]);
};

// 保险类型downlist
const optionsType = ref([]);
const loadTreeType = () => {
  let its = window["rskm_pt_insure_type"] || [];
  its.map((it, i) => {
    if (getFilterDataTree(it.xzname)) {
      // console.log(it.xzname, i);
      optionsType.value.push({
        value: it.xzname,
        label: it.xzname + ` ${it.insurancetype}`,
        key: it.codenum,
      });
    }
  });
  //   for (let i in its) {
  //     optionsType.value.push({
  //       value: its[i].xzname,
  //       label: Number(i) + 1 + " " + its[i].xzname,
  //       key: Number(i) + 1,
  //     });
  //   }
  //   console.log(optionsType);
  // console.log(window["rskm_pt_insure_type"]);
};

// 默认加载
const defaultComVals = ref(["0-0"]);
const defaultTypeVals = ref(["0-0"]);

const comTableData = ref();
/**
 *保险平台tree
 */
const watchInsCom = () => {
  const list = [
    {
      title: "全部",
      key: "0-0",
      children: [],
    },
  ];

  let ics = window.rskm_pt_insure_com || [];

  ics.map((ins) => {
    //console.log(ins)
    list[0].children.push({
      title: ins.insurcompanyname,
      key: `0-0-|${ins.insurcompanycode}`,
    });
  });

  //console.log(checkedKeysType);
  comTableData.value = list;
};

const selectedKeysType = ref([]);

// watch(selectedKeysType, () => {
//   //console.log("selectedKeys", selectedKeysType);
// });

const checkedKeysType = ref(["0-0"]);
// 保险险种筛选
watch(checkedKeysType, () => {
 // console.log("checkedKeys", checkedKeysType.value);
  let sql = [];
  checkedKeysType.value.forEach((ckt) => {
    ckt.split("|").length > 1 && sql.push(ckt.split("|")[1]);
  });
  //console.log(sql.join(","));
  treeXz.value = sql;
  sql.length && filterRSKMPT();
  !sql.length && filterRSKMPT(false);
});

const insTableData = ref();
//保险类型 tree
const watchInsType = () => {
  const list = [
    {
      title: "全部",
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
    // 第二级
    let listk = [];
    its.forEach((r) => {
      if (r.insurancetype == t && getFilterDataTree(r.xzname)) {
        listk.push({
          title: r.xzname,
          key: `0-0-${id}-|${r.codenum}`,
        });
      }
    });

    // 第一级
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
  let bool = false;
  let arrType = ["小麦", "玉米", "大豆"];
  arrType.forEach((a) => {
    if (name.indexOf(a) > -1) {
      bool = true;
    }
  });

  return bool;
};

//初始化
onMounted(() => {
  loadData();
});
// const mode = ref("left");
const loadData = () => {
  /**
   * 险种
   */

  api.rskm_pt_insure_type.then((data) => {
    window.rskm_pt_insure_type = data;
    loadTreeType();
    watchInsType();
  });

  /**
   * 保险平台
   */

  api.rskm_pt_insure_com.then((data) => {
    window.rskm_pt_insure_com = data;
    loadTreeCom();
    watchInsCom();
  });
};

// 条件筛查图形
const filterRSKMPT = (bool = true) => {
  // console.log(treeJg.value.length);
  let layers = ["rskm_pt", "rskm_pt_name"];
  if (bool) {
    let tree = ["all"];
    treeXz.value.length > 0 && tree.push(["in", "insurancetarget", ...treeXz.value]);
    treeJg.value.length > 0 && tree.push(["in", "insurcompany_code", ...treeJg.value]); //...treeJg.value
    //  console.log(tree);
    //区域
    tree.length > 0 && filterFeature(layers, tree);
  } else {
    filterFeature(layers, [
      "all", // county,city,village,town
      ["==", ["get", "insurancenum"], ""],
    ]);
  }
};
</script>
<template>
  <a-tabs v-model:activeKey="activeKeyLS" :tab-position="mode">
    <a-tab-pane key="2">
      <template #tab>
        <ShieldCheck />
        <div>险种险类</div>
      </template>
      <div style="padding: 15px">
        <!--    <div v-if="!checkedKeysType.length">
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
        </div>-->
        <div v-if="!values_type.length">
          <a-tree
            v-model:checkedKeys="checkedKeysType"
            v-model:expandedKeys="defaultTypeVals"
            checkable
            :autoExpandParent="true"
            v-if="insTableData"
            :height="300"
            :tree-data="insTableData"
            blockNode
            :selectable="false"
          >
            <!-- <template #title="{ title, key,id }">
          <div v-if="key">{{ title }} <sub>{{id}}</sub></div>
          <template v-else>{{ title }}</template>
        </template> -->
          </a-tree>
        </div>
      </div>
    </a-tab-pane>

    <a-tab-pane key="1">
      <template #tab>
        <Warehouse />
        <div>保险机构</div>
      </template>
      <div style="padding: 15px">
        <!--  <div v-if="!checkedKeysCom.length">
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
        </div>-->
        <div>
          <a-tree
            v-model:checkedKeys="checkedKeysCom"
            v-model:expandedKeys="defaultComVals"
            checkable
            :autoExpandParent="true"
            :expandedKeys="defaultComVals"
            v-if="comTableData"
            :height="300"
            :tree-data="comTableData"
            blockNode
            :selectable="false"
          >
            <!-- <template #title="{ title, key }">
          <div v-if="key">{{ title }}</div>
          <template v-else>{{ title }}</template>
        </template> -->
          </a-tree>
        </div>
      </div>
    </a-tab-pane>

    <!-- <a-tab-pane key="3">
      <template #tab>
        <MapPinned />
        <div>行政区划</div>
      </template>
      <div style="padding: 15px"></div>
    </a-tab-pane> -->
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
        <a-button size="large" style="width: 100%" class="boxshadow" @click="onRect()">
          <template #icon>
            <RotateCw style="margin-right: 10px" />
          </template>
          重置
        </a-button></a-col
      >
    </a-row>
  </div>
</template>

<style scoped>
/deep/ .ant-tabs-nav-list > .ant-tabs-tab {
  margin: 0;
}

/deep/ .ant-tabs-tab {
 
  width: 200px;
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
