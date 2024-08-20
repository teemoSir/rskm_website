<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { message } from "ant-design-vue";
import { api } from "@/config/map";
import * as turf from "@turf/turf";
import downloadTextFile from "@/utils/downloadFile.js";
import moment from "moment";
import {
  Headset,
  Info,
  Search,
  RotateCw,
  X,
  Sprout,
  FilePenLine,
  Grip,
  ChevronDown,
  LandPlot,
  Locate,
  CalendarHeart,
  FolderDown,
  TextSearch,
} from "lucide-vue-next";

const dataSourceCount = ref(0);
const dataSource = ref([]);
const columns = ref([
  {
    title: "保单",
    dataIndex: "insurancenum",
    key: "insurancenum",
    fixed: true,
  },
  //   {
  //     title: "查看",
  //     dataIndex: "lock",
  //     width: 80,
  //   },
  //   {
  //     title: "关联地块",
  //     dataIndex: "edit",
  //     width: 80,
  //   },
  //   {
  //     title: "ID",
  //     dataIndex: "gid",
  //     key: "gid",
  //     width: 100,
  //   },
  {
    title: "机构",
    dataIndex: "i_com_name",
    key: "i_com_name",
  },
  {
    title: "险种",
    dataIndex: "i_type_name",
    key: "i_type_name",
  },
  {
    title: "承保数量(亩)",
    dataIndex: "insured_quantity",
    key: "insured_quantity",
    width: 150,
  },
  {
    title: "被保人",
    dataIndex: "insured",
    key: "insured",
  },

  {
    title: "地块面积",
    dataIndex: "area_mi",
    key: "area_mi",
    width: 200,
  },
  //   {
  //     title: "地块面积(亩)",
  //     dataIndex: "area_mu",
  //     key: "area_mu",
  //     width: 60,
  //   },

  {
    title: "区域",
    dataIndex: "province",
    key: "province",
  },
  {
    title: "保期",
    dataIndex: "start_date",
    key: "start_date",
    width: 150,
  },
  //   {
  //     title: "终保时间",
  //     dataIndex: "end_date",
  //     key: "end_date",
  //     width: 100,
  //   },
  {
    title: "下载",
    dataIndex: "operation",
    width: 60,
  },
]);

/**
 * 获取分页
 */
const pagination = ref({
  pageSize: 10, // 每页显示10条数据
  total: 1, // 总数据条数
  responsive: true,
  pageSizeOptions: false,
  showLessItems: true,
  showTotal: (total, range) => {
    return `${total} 条`;
  },
  onChange: (page) => {
    loadTabel(page, pagination.value.pageSize);
  },
});

const loadTabel = (page = 1, size = 10) => {
  const res = api.get_table_pagesize("rskm_pt", page, size);
  res.then((data) => {
    dataSource.value = data;
    loading.value = false;
  });
};

const loadCount = () => {
  const res = api.get_table_count("rskm_pt");
  res.then((data) => {
    console.log(data);
    pagination.value.total = Number(data[0].count);
  });
};

const loading = ref(true);

/**
 * 查询
 * @param {*} data
 */
// const onSearchHeader = (data) => {
//   const features2 = map.getSource("rskm_pt");
//   console.log(features2);

//   let ff = features2.filter((feature) => {
//     return feature.properties.insurancenum == data;
//   });

//   map.setFilter("Highlight_DK_Line_Click", [
//     "all",
//     ["in", "insurancenum", ff[0].properties.insurancenum],
//   ]);
//   map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");
//   fitBox(ff[0]);
// };

// const customRow = (record) => {
//   return {
//     onClick: (e) => {
//       // console.log(record.geom);
//       goGeom(record.geom);
//     },
//   };
// };

const goGeomUn = (data) => {};
/**
 * 查找地块
 * @param {} data
 */
const goGeom = (data) => {
  // console.log(data);

  map.getLayer("lockGeom") && map.removeLayer("lockGeom");
  map.getSource("lockGeom") && map.removeSource("lockGeom");

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
      "line-opacity": 0.8,
      "line-width": 6,
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

onMounted(() => {
  loadTabel();

  loadCount();
});

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

const formState = reactive({
  layout: "horizontal",
  fieldA: "",
  fieldB: "",
});
const formItemLayout = computed(() => {
  const { layout } = formState;
  return layout === "horizontal"
    ? {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 14,
        },
      }
    : {};
});
const buttonItemLayout = computed(() => {
  const { layout } = formState;
  return layout === "horizontal"
    ? {
        wrapperCol: {
          span: 14,
          offset: 4,
        },
      }
    : {};
});
</script>

<template>
  <a-result  v-show="!dataSource.length"
    status="success"
    title="查询成功!"
    sub-title="本年度没有保单数据, 请尝试其他年份。"
  >
    <!-- <template #extra>
      <a-button key="console" type="primary">Go Console</a-button>
      <a-button key="buy">Buy Again</a-button>
    </template> -->
  </a-result>

  <div class="insurance-page" v-show="dataSource.length">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :sticky="true"
      :pagination="pagination"
      :loading="loading"
    >
      <!-- <template #title>2024年山东</template>
     <template #footer>Footer</template>  -->
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-popconfirm
            v-if="dataSource.length"
            title="确定下载该地块?"
            @confirm="downloadTextFile(record.geom, `${record.insurancenum}.json`)"
          >
            <FolderDown />
          </a-popconfirm>
        </template>
        <template v-if="column.dataIndex === 'insurancenum'" @click="goGeom(record.geom)">
          <div style="width: 100%">
            {{ record.insurancenum }}
          </div>
        </template>

        <template v-if="column.dataIndex == 'province'">
          {{ record.province }}{{ record.city }}{{ record.county }}{{ record.town
          }}{{ record.village }}
        </template>

        <template v-if="column.dataIndex == 'start_date'">
          {{ moment(record.start_date).format("YYYY/MM/DD") }} <br />
          {{ moment(record.end_date).format("YYYY/MM/DD") }}
        </template>

        <template v-if="column.dataIndex == 'insured_quantity'">
          {{ record.insured_quantity && Number(record.insured_quantity).toFixed(2) }}
        </template>

        <template v-if="column.dataIndex == 'area_mi'">
          {{ record.area_mu && Number(record.area_mu).toFixed(2) }}亩 <br />(
          {{ record.area_mi && Number(record.area_mi).toFixed(2) }}平米)
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.insurance-page {
  cursor: pointer;
}

/* /deep/ .ant-table {
  background: transparent;
  color: beige;
}

/deep/ .ant-table-wrapper .ant-table-thead > tr > th {
  background: rgba(0, 0, 0, 0.4);
  color: beige;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}
/deep/ .ant-table-row:hover {
  color: rgb(13, 13, 13);
}

/deep/
  .ant-table-thead
  > tr
  > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
  height: 0;
}
/deep/ .ant-table:not(.ant-table-bordered) .ant-table-tbody > tr > td {
  border-top: 1px solid rgba(239, 233, 233, 0.452);
}

/deep/ .ant-table-wrapper .ant-table-cell-fix-left {
  background: rgba(0, 0, 0, 0.5);
  border-right: 1px solid rgba(239, 233, 233, 0.552);
}

/deep/ .ant-table-wrapper .ant-table-sticky-holder {
  background: rgba(0, 0, 0, 0);
}


/deep/ .ant-form-item .ant-form-item-label >label{
    color: beige;
} */
</style>
