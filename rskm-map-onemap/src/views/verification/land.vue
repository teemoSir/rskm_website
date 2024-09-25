<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import SDMap from "@/views/map/index.vue";
import Header from "@/components/header/index.vue";
import {
  BookX,
  CalendarPlus,
  CheckCheckIcon,
  Download,
  GitPullRequestCreate,

  Satellite,

  TrainFrontTunnelIcon
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StateManager from "@/utils/state_manager";

// 设置语言
dayjs.locale('zh-cn');


// 路由
const router = useRouter();
// 初始化echarts
onMounted(() => {
  loadEcharts()
})

// 初始化echarts
const loadEcharts = () => {
  console.log(echarts)
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option = {
    color: ["#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#73c0de",
      "#3ba272",
      "#fc8452",
      "#9a60b4",
      " #ea7ccc"],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '2%',
      left: 'center'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },

        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 78, name: '合格' },
          { value: 22, name: '不合格' },
          { value: 22, name: '未核验' },
        ],
        label: {
          show: true,
          formatter: '{b}: {d}%',


        },
        labelLine: {
          show: true
        }
      }
    ]
  };

  option && myChart.setOption(option);

}

// 表格数据
const dataSource = [
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
  {
    ds: '东营市',
    qx: '东营区',
    xz: '东营镇',
    ygzzmj: '10000',
    yxrq: '2024-01-01',
    cbmj: '10000',
    bxfgl: '100%',
    cb: '1000',
  },
]

// 表格列
const columns = [
  {
    title: '地市',
    dataIndex: 'ds',
    key: 'ds',
  },
  {
    title: '区县',
    dataIndex: 'qx',
    key: 'qx',
  },
  {
    title: '乡镇',
    dataIndex: 'xz',
    key: 'xz',
  },
  {
    title: '遥感种植面积',
    dataIndex: 'ygzzmj',
    key: 'ygzzmj',
  },
  {
    title: '影像日期',
    dataIndex: 'yxrq',
    key: 'yxrq',
  },

  {
    title: '承保面积',
    dataIndex: 'cbmj',
    key: 'cbmj',
  },
  {
    title: '保险覆盖率',
    dataIndex: 'bxfgl',
    key: 'bxfgl',
  },
  {
    title: '超保',
    dataIndex: 'cb',
    key: 'cb',
  },
]

// 起保日期
const qbrq = ref([dayjs("2024-06-01"), dayjs("2024-08-29")])
// 默认任务名称
const taskName = ref(`LAND-富江县-玉米-${dayjs("2024-06-01").format('YYMMDD')}-遥感核验`)




// 下拉框数据
const options = [
  {
    value: '0-0',
    label: '全域',
    children: [
      {
        value: '0-0-0',
        label: '菏泽市',
        children: [
          {
            value: '0-0-0-0',
            label: '牡丹区',
          },
          {
            value: '0-0-0-1',
            label: '定陶区',
          },
        ],
      },

    ],
  },
];
// 任务弹窗
const task = ref(false)

const value = ref(['0-0']);



// 任务数据
let taskData = ref([])
// 监听任务数据变化
watch(() => taskData.value, (newVal, oldVal) => {
  console.log(taskData.value)

  StateManager.set('taskData', taskData.value)
}, { deep: true })





// 任务创建
const taskCreate = () => {

  task.value = false;
  taskData.value.push({
    ID: `${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    title: `DK-富江县-玉米-${dayjs("2024-06-01").format('YYMMDD')}-遥感核验`,
    area: value.value.join(' '),
    qbrq: qbrq.value[0] ? dayjs(qbrq.value[0]).format('YYYY/MM/DD') : '2024/6/1~2024/8/29',
    zbrq: qbrq.value[1] ? dayjs(qbrq.value[1]).format('YYYY/MM/DD') : '2024/6/1~2024/8/29',
    xzqh: ['玉米'],
    status: Math.floor(Math.random() * 3),
    cb: Math.floor(Math.random() * 100)
  })
}


// 任务弹窗
const open = ref(false);
const showModal = () => {
  open.value = true;
};
// 任务弹窗确定
const handleOk = e => {
  console.log(e);
  open.value = false;

  taskCreate()
};
// 任务删除
const taskDelete = (id) => {
  taskData.value = taskData.value.filter(item => item.ID !== id)
}

const hovering = ref()

const taskSelect = (item) => {
 // console.log(item)
  hovering.value = item.ID;

}


// 导出PDF
const exportPDF = () => {
  const element = document.querySelector('.right-card');

  html2canvas(element).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 30, 10);
    pdf.save(`${taskName.value}.pdf`);
  });
}
// 获取label
const getLabelByValue = (value) => {
  console.log(value)
  const label = value.split('-').map(item => options[0].children[0].children[item].label).join(' ');
  return label;
}

// 加载本地数据
const loadLocalData = () => {
  const data = StateManager.get('taskData')
  if (data) {
    taskData.value = [];
    taskData.value.push(...data)
  } else {
    taskCreate()
  }
}




// 挂载
onMounted(() => {

  loadLocalData()

})
</script>

<template>

  <!-- 头部 -->
  <div class="header">
    <Header></Header>
  </div>

  <!-- 地图 -->
  <div class="verification">
    <SDMap :MapToolPosition="{ top: '110px', right: '550px' }"></SDMap>
  </div>

  <!-- 页面 -->
  <div class="page">
    <a-modal v-model:open="open" title="任务创建" @ok="handleOk" cancelText="取消" okText="提交任务">
      <p>

        <a-form-item label="任务名称">
          <a-input v-model:value="taskName" />
        </a-form-item>

        <a-form-item label="起保日期">
          <a-range-picker v-model:value="qbrq" placeholder="请选择起保日期" :locale="locale" />
        </a-form-item>

        <a-form-item label="行政区域">
          <a-cascader v-model:value="value" multiple :options="options" placeholder="请选择行政区域"
            suffix-icon="Shopping Around">
            <template #tagRender="data">
              <a-tag :key="data.value" color="blue">{{ data.label }}</a-tag>
            </template>
          </a-cascader>
        </a-form-item>
        <!-- <a-form-item>
          <a-button type="primary" @click="()">提交任务</a-button>
        </a-form-item> -->
      </p>
    </a-modal>
    <!-- 左边 -->
    <div class="left-card">
      <div style="padding: 15px">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-card title="▍地块核验任务制定" :bordered="true" size="small">
              <a-button type="primary" style="position: absolute;right: 10px;top: 5px;" @click="showModal" v-if="!task">
                <GitPullRequestCreate :size="16" style="margin-right: 5px;" />创建任务
              </a-button>

              <p v-if="taskData.length > 0" style="overflow-y: auto;max-height: calc(100vh - 240px);">

                <a-descriptions layout="vertical" bordered size="small" v-for="item in taskData"
                  @click="taskSelect(item)" style="margin-bottom: 10px;"
                  :class="hovering === item.ID ? 'hovering' : ''">

                  <a-descriptions-item :label="item.title">

                    任务编码：{{ item.ID }}<br>
                    <!-- 核验范围：{{ getLabelByValue(item.area) }}<br> -->
                    标的品种：{{ item.xzqh.join(',') }}<br>
                    起保日期：{{ item.qbrq }} - {{ item.zbrq }}<br>
                    超保比例：{{ item.cb }} %<br>
                    <div style="margin-top: -20px;margin-left: 260px;">

                      <a-tag color="#f50" v-if="item.status == 0">
                        <Satellite :size="16" />待验证
                      </a-tag>
                      <a-tag color="#2db7f5" v-if="item.status == 2">
                        <Satellite :size="16" />通过
                      </a-tag>
                      <a-tag color="#87d068" v-if="item.status == 1">
                        <Satellite :size="16" />未通过
                      </a-tag>

                    </div>

                    <a-tooltip>
                      <template #title>删除此任务</template>
                      <BookX style=" cursor: pointer;position: absolute;margin-top: -130px;right: 30px"
                        @click="taskDelete(item.ID)" v-if="hovering == item.ID" color="#999">
                      </BookX>
                    </a-tooltip>
                    <!-- <a-tag color="#108ee9">#108ee9</a-tag> 
                    dem 作业过程
                    1.资料收集与准备
                    2.踏选部网采集
                    3.定向建模
                    4.特征采集
                    5.TIN构建DEM
                    6.检查编辑
                    7.数据发布
                    8.数据应用
                    
                    -->
                  </a-descriptions-item>

                </a-descriptions>

              </p>
              <p v-else>
                <a-result title="请创建核验规则"></a-result>
              </p>
            </a-card>
          </a-col>

        </a-row>
      </div>
    </div>

    <!-- 中间 -->
    <div class="center-card">
      <a-typography-title class="center-card-title">地块核验与分析
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <a-tag color="#87d068">区县级
              <CheckCheckIcon :size="16" />
            </a-tag>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="router.push('/verification/county')">区县级</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="router.push('/verification/town')">乡镇级</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="router.push('/verification/village')">村级</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

      </a-typography-title>


    </div>

    <div class="right-card">
      <div style=" padding: 15px">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-card title="▍地块核验统计" :bordered="false" size="small">
              <a-button type="primary" ghost style="position: absolute;right: 10px;top: 5px;" @click="exportPDF()">
                <CalendarPlus :size="16" style="margin-right: 5px;" />生成核验报告
              </a-button>

              <p style="width: 100%;padding: 10px;background-color: #5470c6;color: #fff;"><label
                  style="font-weight: bold;">
                  承保合格率</label><span style="float: right;">99.00%</span></p>
              <a-row>


                <a-col :span="8">
                  <br>


                  <p style="width: 100%;"><label style="font-weight: bold;">承保数量</label><span
                      style="float: right;">1234.00亩</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">签单保费</label><span
                      style="float: right;">10000亩</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">参保户次</label><span
                      style="float: right;">10000亩</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">地块数量</label><span
                      style="float: right;">10000亩</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">地块面积</label><span
                      style="float: right;">10000亩</span></p>
                  <p style="width: 100%;"><label style="font-weight: bold;">重叠地块</label><span
                      style="float: right;">10000亩</span></p>

                </a-col>
                <a-col :span="16">
                  <div id="main" style="width: 100%;height:300px;"></div>
                </a-col>
              </a-row>

            </a-card>
            <br>
            <a-card title="▍遥感核验报表" :bordered="false" size="small">


              <a-button type="primary" ghost style="position: absolute;right: 10px;top: 5px;">
                <Download :size="16" /> 下载核验报表
              </a-button>


              <p>
                <a-typography-text>
                  XX市XX县XX乡（区域名称，此处以乡镇级为例）<br>
                  标的品种：玉米<br>
                  起保日期：2024/6/1~2024/8/29<br>
                  承保面积：AAA亩（完全成本 XXX亩，完全成本复合 XXX亩，收入保险 XXX亩）<br>
                  遥感面积：BBB亩<br>
                  保险覆盖率：XX% （= AAA/BBB×100%）<br>
                  是否超保：否<br>
                </a-typography-text>

              </p>
              <p style="overflow-y: auto;max-height: calc(100vh - 940px);">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="false" />
              </p>




            </a-card>
          </a-col>
        </a-row>

      </div>

    </div>
  </div>
</template>

<style scoped>
.verification {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.5); */
}

.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.4));
  z-index: 100000;

}




/* ::v-deep .ant-input {
  background-color: transparent;
  color: #fff;
} */

/* ::v-deep .ant-input-clear-icon {
  color: #fff;
} */

::v-deep .ant-menu-item svg {
  width: 15px;
  height: 15px;
}

::v-deep .ant-menu-submenu-horizontal svg {
  width: 15px;
  height: 15px;
}

::v-deep .ant-menu-light {
  background-color: transparent;
  color: #ccc;
}

/* 
::v-deep .ant-drawer .ant-drawer-body {
  padding: 0;
}

::v-deep .ant-drawer-body {
  padding: 0;
}

::v-deep .ant-drawer {
  padding: 0;
} */

::v-deep .ant-page-header-heading-title {
  color: aliceblue;
}

::v-deep .ant-page-header-heading-sub-title {
  color: #ccc;
}

::v-deep .ant-tabs-tab-btn {
  font-size: 16px;

  color: #fff;
}

::v-deep .ant-tabs-tab-active {
  background-color: #ffffff18;
  color: #fff;
}

/* 
::v-deep .ant-select-selection-item {
  background-color: rgba(50, 119, 252, 1);
  color: #fff;
}

::v-deep .ant-select-selection-placeholder {
  color: #807d7dc0;

  font-size: 14px;
}

::v-deep .ant-select-clear {
  color: #ccc;
  background-color: transparent;
}

::v-deep .ant-select-clear:hover {
  color: rgba(50, 119, 252, 1);
} */

/* ::v-deep .ant-statistic-content {
  color: #fff;
}

::v-deep .ant-statistic-title {
  color: #fff;
}

::v-deep .ant-picker {
  background: transparent;
  border: 0;
  padding: 0;
}

::v-deep .ant-picker input {
  color: #ccc;
} */


.left-card {
  position: absolute;
  width: 450px;

  left: 0;
  top: 100px;
  max-height: calc(100% - 100px);
  z-index: 1000;
}

.right-card {
  position: absolute;
  right: 0;
  top: 100px;
  width: 550px;

  z-index: 1000;
  max-height: calc(100% - 100px);
}

.center-card {
  display: flex;
  justify-content: center;
  justify-items: center;
  width: 100%;
  z-index: 100;
  position: absolute;
  top: 90px;
  background: linear-gradient(to bottom, rgba(19, 18, 18, 0.39), rgba(3, 11, 85, 0));
}

.center-card-title {
  font-size: 40px;
  color: #f7f1f1d5;
}

p {
  padding: 5px;
  /* background: linear-gradient(to bottom, rgba(204, 204, 204, 0.1), rgba(204, 204, 204, 0.2)); */
  border-radius: 2px;
  border-bottom: 1px dotted #cccccc38;
  background: rgba(204, 204, 204, 0.08)
}



::v-deep .ant-select-selector {
  border: 0;
  background-color: transparent;
}

.hovering {
  background-color: rgba(18, 126, 214, 0.058);
  outline: 1.5px solid rgba(18, 126, 214, 0.658);
  border-radius: 2px;
}
</style>
