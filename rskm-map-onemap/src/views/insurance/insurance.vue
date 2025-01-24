<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { message } from "ant-design-vue";
import { api } from "@/config/api.js";
import * as turf from "@turf/turf";
// import downloadTextFile from "@/utils/downloadFile.js";
import dayjs from "dayjs";
import {
    Headset,
    Info,
    //   Search,
    //   RotateCw
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
        title: "保单号",
        dataIndex: "insurancenum",
        key: "insurancenum",
        fixed: true,
        width: 230,
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
        title: "保险机构",
        dataIndex: "i_com_name",
        key: "i_com_name",
        width: 100,
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
        width: 100,
    },
    {
        title: "被保人",
        dataIndex: "insured",
        key: "insured",
        minWidth: 400,
    },

    {
        title: "地块面积",
        dataIndex: "area_mi",
        key: "area_mi",
        width: 100,
    },
    //   {
    //     title: "地块面积(亩)",
    //     dataIndex: "area_mu",
    //     key: "area_mu",
    //     width: 60,
    //   },

    {
        title: "位置",
        dataIndex: "province",
        key: "province",
        minWidth: 300,
    },
    {
        title: "保期",
        dataIndex: "start_date",
        key: "start_date",
        width: 180,
    },
    //   {
    //     title: "终保时间",
    //     dataIndex: "end_date",
    //     key: "end_date",
    //     width: 100,
    //   },
    //   {
    //     title: "下载",
    //     dataIndex: "operation",
    //     minWidth: 60,
    //   },
]);

/**
 * 获取分页
 */
const pagination = ref({
    pageSize: 10, // 每页显示10条数据
    total: 1, // 总数据条数
    responsive: false,
    //pageSizeOptions: false,
    showSizeChanger: false,
    showLessItems: false,
    showTotal: (total, range) => {
        return `${total} 条`;
    },
    onChange: (page) => {
        loadTabel(page, pagination.value.pageSize);
    },
});

/**
 * 分页查询
 * @param {*} page 页数
 * @param {*} size 数据量
 * @param {*} filter 条件
 */
const loadTabel = async (page = 1, size = 10, filter = "") => {
    const data = await api.get_table_pagesize("rskm_pt", page, size, filter);
    //res.then((data) => {
    dataSource.value = data;
    loading.value = false;
    // });
    return data;
};

/**
 * 数据总数
 * @param {*} filter 条件
 */
const loadCount = async (filter = "") => {
    const data = await api.get_table_count("rskm_pt", filter);
    // res.then((data) => {
    //  console.log(data);
    pagination.value.total = Number(data[0].count);
    // });
    return data;
};

const loading = ref(true);

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

    goGeomUn()

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
        padding: { top: 400, bottom: 600 },
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

const customRowFun = (record, index) => {
    return {
        onClick: (event) => {
            goGeom(record.geom);
        },
        style: {
            // 字体颜色
            color: record.remarkDesc ? record.remarkDesc.fontColor : "#262626",
            // 行背景色
            "background-color": index % 2 == 0 ? "#FAFAFA" : "#FFFFFF",
        },
    };
};



defineExpose({
    goGeom,
    loadTabel,
    loadCount,
    loading,
    pagination,
});
</script>

<template>
    <a-result v-show="!dataSource.length" status="info" title="没有查询到关联数据!" sub-title="该条件下数据不存在，请尝试其他查询条件。">
    </a-result>

    <div class="insurance-page" v-show="dataSource.length">
        <a-table :dataSource="dataSource" :columns="columns" :sticky="true" :pagination="pagination" :loading="loading"
            :customRow="customRowFun" size="small">
            <!-- <template #title>2024年山东</template>
<template #footer>Footer</template> -->
            <template #bodyCell="{ column, text, record }">

                <template v-if="column.dataIndex === 'insurancenum'">
                    <div style="width: 100%;height">
                        {{ record.insurancenum }}
                    </div>
                </template>

                <template v-if="column.dataIndex == 'province'">
                    <a-tooltip placement="top">
                        <template #title>{{ ((record.province || '') + (record.city || '') + (record.county || '') +
                            (record.town || '') + (record.village ||
                                '')) }}</template>

                        {{ ((record.province || '') + (record.city || '') + (record.county || '') + (record.town || '')
                            +
                            (record.village ||
                                '')).length > 15 ? ((record.province || '') + (record.city || '') + (record.county || '') +
                                    (record.town ||
                                        '') + (record.village ||
                                            '')).substring(0, 15) + "..." : ((record.province || '') + (record.city || '') + (record.county
                                                || '') +
                                                (record.town || '') + (record.village ||
                                                    '')) }}
                    </a-tooltip>

                </template>

                <template v-if="column.dataIndex == 'start_date'">

                    {{ dayjs(record.start_date).format("YYYY/MM/DD") }}-
                    {{ dayjs(record.end_date).format("YYYY/MM/DD") }}
                </template>

                <template v-if="column.dataIndex == 'insured_quantity'">
                    {{ record.insured_quantity && Number(record.insured_quantity).toFixed(2) }}
                </template>

                <template v-if="column.dataIndex == 'area_mi'">
                    {{ record.area_mu && Number(record.area_mu).toFixed(2) }}亩
                    <!-- {{ record.area_mi && Number(record.area_mi).toFixed(2) }}平米 -->
                </template>
            </template>
        </a-table>
    </div>
</template>

<style scoped>
.insurance-page {
    cursor: pointer;
}
</style>
