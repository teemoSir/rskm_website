<script setup>
import * as echarts from "echarts"
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import SDMap from "@/views/map/index.vue";
import Header from "@/components/header/index.vue";
import {
  ArrowDownSquareIcon,
  FoldersIcon,
  ChevronDownIcon,
  Info,
  LucideAreaChart,
  MapPinned,
  ChevronUp,
  MoreHorizontal,
  PanelRightOpenIcon,
  SidebarOpen,

  X,
  Building2Icon,
  CheckSquareIcon,
  CheckCircleIcon,
  CheckCircle2Icon,
  CircleX,
  CircleAlertIcon,
  LandPlotIcon,
  LucidePanelsTopBottom,
  LayoutPanelLeftIcon,
  LandmarkIcon,
  LayoutPanelTopIcon,
  LucideSquareMousePointer,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import StateManager from "@/utils/state_manager";
import { treeLeftData } from "./data"
import { storeToRefs } from "pinia";
import { treeStore } from "@/store/store.js";

import {
  addLayersYghy, popup, popupbig
} from "@/views/map/map.js";

import VerificationLegend from "@/views/map/verificationLegend.vue"
import AreaLegend from "@/views/map/areaLegend.vue";
import * as turf from "@turf/turf";
// import { hzBaseData } from "@/views/verification/data/hz.js"




// 设置语言
dayjs.locale('zh-cn');


// 路由
const router = useRouter();



/**
 * 区域一图
 */
const loadEcharts = (data) => {


  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;

  option = {

    aria: {
      enabled: false,
      decal: {
        show: false
      }
    },
    color: [

      "#ee6666",
      "#91cc75",
      "#fac858",
    ],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '-1%',
      left: 'center',
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    series: [
      {

        name: '',
        type: 'pie',
        radius: ['50%', '95%'],

        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 3
        },
        label: {
          show: false,
          position: 'center',

        },
        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };

  option && myChart.setOption(option);

}
/**
 * 区域二图
 */
const loadEcharts02 = (yAxis, series1, series2) => {

  let app = {};
  let chartDom = document.getElementById('loadEcharts02');

  let myChart = echarts.init(chartDom);
  let option = undefined;

  const posList = [
    'left',
    'right',
    'top',
    'bottom',
    'inside',
    'insideTop',
    'insideLeft',
    'insideRight',
    'insideBottom',
    'insideTopLeft',
    'insideTopRight',
    'insideBottomLeft',
    'insideBottomRight'
  ];
  app.configParameters = {
    rotate: {
      min: -90,
      max: 90
    },
    align: {
      options: {
        left: 'left',
        center: 'center',
        right: 'right'
      }
    },
    verticalAlign: {
      options: {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
      }
    },
    position: {
      options: posList.reduce(function (map, pos) {
        map[pos] = pos;
        return map;
      }, {})
    },
    distance: {
      min: 0,
      max: 100
    }
  };
  app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,

    onChange: function () {
      const labelOption = {
        rotate: app.config.rotate,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        position: app.config.position,
        distance: app.config.distance
      };
      myChart.setOption({
        series: [
          {
            label: labelOption
          },
          {
            label: labelOption
          },
        ]
      });
    }
  };


  const labelOption = {
    show: true,
    distance: app.config.distance,
    formatter: function (e) {
      return e.value ? e.value + ' %' : ''
    },
    fontSize: 16,
    // color: 'green',
    // textBorderColor: '#999',
    rich: {
      name: {}
    }
  };
  const grid = {
    left: 80,
    right: 30,
    top: 30,
    bottom: 50
  };
  option = {
    grid,
    color: [

      "#fac858",
      "#91cc75",
      "#ea7ccc",
      "#5470c6",
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: [],
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 16 // 文字大小
        },
      }

    ],
    yAxis: [
      {
        axisLabel: {
          fontSize: 16 // 文字大小
        },
        type: 'category',
        axisTick: { show: false },
        data: yAxis
      }
    ],
    series: [
    ]
  };

  if (series1 && series2) {
    option.series = [];
    option.series.push({
      name: '保险覆盖率',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: series1
    })
    option.series.push({
      name: '承保合格率',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: series2
    })

    option.legend.data.push('保险覆盖率', '承保合格率')
  } else if (series1) {
    option.series = [];
    option.series.push({
      name: '保险覆盖率',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: series1
    })
    option.legend.data.push('保险覆盖率')

  }


  option && myChart.setOption(option);
}

/**
 * 区域三图
 */
const loadEcharts03 = (data, rawdata) => {



  var chartDom = document.getElementById('main03');
  var myChart = echarts.init(chartDom);
  var option;

  // There should not be negative values in rawData
  const rawData = rawdata;
  const totalData = [];
  for (let i = 0; i < rawData[0].length; ++i) {
    let sum = 0;
    for (let j = 0; j < rawData.length; ++j) {
      sum += rawData[j][i];
    }
    totalData.push(sum);
  }
  const grid = {
    left: 80,
    right: 30,
    top: 30,
    bottom: 30
  };
  const series = [
    '合格', '不足', '超保'
  ].map((name, sid) => {
    return {
      name,
      type: 'bar',
      stack: 'total',
      barWidth: '90%',

      label: {
        show: true,
        formatter: (params) => Math.round(params.value * 1000) / 10 + '%'
      },
      data: rawData[sid].map((d, did) =>
        totalData[did] <= 0 ? 0 : d / totalData[did]
      )
    };
  });
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        return params[0].name + '<br/>正常：' + Number(params[0].value * 100).toFixed(0) + '%<br/>不足：' + Number(params[1].value * 100).toFixed(0) + '%<br/>超保：' + Number(params[2].value * 100).toFixed(0) + '%';
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    color: [
      "#91cc75",
      "#fac858",
      "#ee6666",
    ],
    legend: {
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    grid,
    yAxis: {
      axisLabel: {
        fontSize: 16 // 文字大小
      },
      type: 'category',
      data: data
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 16 // 文字大小
      },
    },
    series
  };

  option && myChart.setOption(option);


}


/**
 * 地块一图
 */
const echartsDK01 = (a = 11, b = 22, c = 66) => {

  var chartDom = document.getElementById('echartsDK01');
  if (!chartDom) return;
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    title: {
      //   text: '合格地块占比',
      //  subtext: '2024一期',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: '-3.5%',
      left: 'center',
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    series: [
      {

        color: ["#fac858",
          "#91cc75",
          "#ee6666",],
        name: '',
        type: 'pie',
        radius: ['40%', '80%'],
        data: [
          { value: a, name: '无地块户数' },
          { value: b, name: '地块合格户数' },
          { value: c, name: '地块不合格户数' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  option && myChart.setOption(option);

}


/**
 * 地块二图
 */
const echartsDK02 = (names, hgdhValues, dhValues) => {


  var app = {};

  var chartDom = document.getElementById('echartsDK02');
  if (!chartDom) return;
  var myChart = echarts.init(chartDom);
  var option;

  const posList = [
    'left',
    'right',
    'top',
    'bottom',
    'inside',
    'insideTop',
    'insideLeft',
    'insideRight',
    'insideBottom',
    'insideTopLeft',
    'insideTopRight',
    'insideBottomLeft',
    'insideBottomRight'
  ];
  app.configParameters = {
    rotate: {
      min: -90,
      max: 90
    },
    align: {
      options: {
        left: 'left',
        center: 'center',
        right: 'right'
      }
    },
    verticalAlign: {
      options: {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
      }
    },
    position: {
      options: posList.reduce(function (map, pos) {
        map[pos] = pos;
        return map;
      }, {})
    },
    distance: {
      min: 0,
      max: 100
    }
  };
  app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,

    onChange: function () {
      const labelOption = {
        rotate: app.config.rotate,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        position: app.config.position,
        distance: app.config.distance
      };
      myChart.setOption({

        series: [
          {
            label: labelOption
          },
          {
            label: labelOption
          },
          // {
          //   label: labelOption
          // },
          // {
          //   label: labelOption
          // }
        ]
      });
    }
  };
  const labelOption = {
    show: true,
    //   position: app.config.position,
    distance: app.config.distance,
    //  align: app.config.align,
    // verticalAlign: app.config.verticalAlign,
    // rotate: app.config.rotate,
    // formatter: '{c}  {name|{a}}',
    formatter: '{c}',
    fontSize: 12,
    rich: {
      name: {}
    }
  };

  const grid = {
    left: 60,
    right: 30,
    top: 30,
    bottom: 50
  };
  option = {
    grid,
    color: [

      // "#ea7ccc",
      // "#5470c6",
      // "#73c0de",
      "#3ba272",
      // "#fc8452",
      // "#9a60b4",
      "#ee6666",
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['大户数量', '合格大户'],
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [{
      type: 'value',
      axisLabel: {
        fontSize: 16 // 文字大小
      },
    }

    ],
    yAxis: [
      {
        axisLabel: {
          fontSize: 16 // 文字大小
        },
        type: 'category',
        axisTick: { show: false },
        data: names
      }
    ],

    series: [
      {

        name: '大户数量',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: dhValues
      },
      {
        name: '合格大户',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: hgdhValues
      },

    ]
  };



  option && myChart.setOption(option);

}


/**
 * 地块三图
 */
const echartsDK03 = (names, data1, data2) => {

  var app = {};

  var chartDom = document.getElementById('echartsDK03');
  if (!chartDom) return;
  var myChart = echarts.init(chartDom);
  var option;

  const posList = [
    'left',
    'right',
    'top',
    'bottom',
    'inside',
    'insideTop',
    'insideLeft',
    'insideRight',
    'insideBottom',
    'insideTopLeft',
    'insideTopRight',
    'insideBottomLeft',
    'insideBottomRight'
  ];
  app.configParameters = {
    rotate: {
      min: -90,
      max: 90
    },
    align: {
      options: {
        left: 'left',
        center: 'center',
        right: 'right'
      }
    },
    verticalAlign: {
      options: {
        top: 'top',
        middle: 'middle',
        bottom: 'bottom'
      }
    },
    position: {
      options: posList.reduce(function (map, pos) {
        map[pos] = pos;
        return map;
      }, {})
    },
    distance: {
      min: 0,
      max: 100
    }
  };
  app.config = {
    rotate: 90,
    align: 'left',
    verticalAlign: 'middle',
    position: 'insideBottom',
    distance: 15,

    onChange: function () {
      const labelOption = {
        rotate: app.config.rotate,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        position: app.config.position,
        distance: app.config.distance
      };
      myChart.setOption({
        series: [
          {
            label: labelOption
          },
          {
            label: labelOption
          },
          // {
          //   label: labelOption
          // },
          // {
          //   label: labelOption
          // }
        ]
      });
    }
  };
  const labelOption = {
    show: true,
    //   position: app.config.position,
    distance: app.config.distance,
    //  align: app.config.align,
    // verticalAlign: app.config.verticalAlign,
    // rotate: app.config.rotate,
    // formatter: '{c}  {name|{a}}',
    formatter: '{c}',
    fontSize: 16,
    rich: {
      name: {}
    }
  };

  const grid = {
    left: 60,
    right: 30,
    top: 30,
    bottom: 50
  };
  option = {
    grid,
    color: [


      // "#ea7ccc",
      // "#5470c6",
      // "#73c0de",
      // "#3ba272",
      "#fc8452",
      "#9a60b4",
      // "#ee6666",
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['大户数量', '合格数量'],
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar', 'stack'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    xAxis: [{
      type: 'value',
      axisLabel: {
        fontSize: 16 // 文字大小
      },
    }

    ],
    yAxis: [
      {
        axisLabel: {
          fontSize: 16 // 文字大小
        },
        type: 'category',
        axisTick: { show: false },
        data: names
      }
    ],
    series: [
      {
        name: '大户数量',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: data1
      },
      {
        name: '合格数量',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: data2
      },

    ]
  };

  option && myChart.setOption(option);

}




// 表格数据
const dataSource = ref([])

const columns = [
  {
    title: '地市',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: '区县',
    dataIndex: 'county',
    key: 'county',
  },
  {
    title: '乡镇',
    dataIndex: 'town',
    key: 'town',
  },
  {
    title: '遥感种植面积(亩)',
    dataIndex: 'rs_area',
    key: 'rs_area',
  },
  // {
  //   title: '影像日期',
  //   dataIndex: 'yxrq',
  //   key: 'yxrq',
  // },

  {
    title: '承保面积(亩)',
    dataIndex: 'i_area',
    key: 'i_area',
  },
  {
    title: '保险覆盖率',
    dataIndex: 'i_coverage',
    key: 'i_coverage',
  },
  {
    title: '是否合格',
    dataIndex: 'pass',
    key: 'pass',
  },
]

// 表格数据
const dataSourceDk = ref([])


///①地块面积合计（亩）	②地块面积合计/承保数量	③地块面积是否与承保数量一致？	④是否无地块存在重叠问题？	⑤地块内玉米种植面积合计（亩）	⑥地块内标的作物面积合计/承保数量	⑦玉米种植面积差异率是否达标？	⑧该大户的地块是否合格？

const columnsDk = [
  {
    title: '被保险人信息',
    children: [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '证件号码',
        dataIndex: 'sfz',
        key: 'sfz',
      },
      {
        title: '手机尾号',
        dataIndex: 'telphone',
        key: 'telphone',
      }]
  },


  {
    title: '保单信息',
    children: [


      {
        title: '保单号',
        dataIndex: 'bdh',
        key: 'bdh',
      },
      {
        title: '险种',
        dataIndex: 'type_xl',
        key: 'type_xl',
      },
      {
        title: '保险机构',
        dataIndex: 'bxjg',
        key: 'bxjg',
      },
      {
        title: '标的位置',
        dataIndex: 'city',
        key: 'city',
      },

      {
        title: '承保数量',
        dataIndex: 'cbsl',
        key: 'cbsl',
      }
    ]
  },



  {
    title: '地块核验结果',
    children: [

      {
        title: '地块面积(亩)',
        dataIndex: 'v1',
        key: 'v1',
      },
      {
        title: '覆盖率',
        dataIndex: 'v2',
        key: 'v2',
      },
      {
        title: '地块与承保面积(亩)',
        dataIndex: 'v3',
        key: 'v3',
      },
      {
        title: '地块重叠',
        dataIndex: 'v4',
        key: 'v4',
      },
      {
        title: '地块内标的面积(亩)',
        dataIndex: 'v5',
        key: 'v5',
      },
      {
        title: '标的占比',
        dataIndex: 'v6',
        key: 'v6',
      },
      {
        title: '差异率是否达标',
        dataIndex: 'v7',
        key: 'v7',
      },
      {
        title: '地块是否合格',
        dataIndex: 'v8',
        key: 'v8',
      },

    ]
  },

]


// 任务弹窗
const open = ref(false);


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
// const loadLocalData = () => {
//   const data = StateManager.get('taskData')
//   if (data) {
//     taskData.value = [];
//     taskData.value.push(...data)
//   } else {
//     taskCreate()
//   }
// }

/**
 * 树形结构数据
 * @type {import('vue').Ref<Array<Object>>}
 */
// const treeData = ref(shandongArea);


//let mapdata = [];

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadTown = async (name) => {

  goGeomUn()


  if (name == "'济阳区'") {
    name = "'济阳县'"
  }

  if (name == "'莱芜区'") {
    name = "'莱芜市'"
  }

  let features = await api.get_table_by_filter(
    "admin_2024_town",
    `and (f_xzqhmc in (${name}) or c_xzqmc in (${name})) `,
    `ST_AsGeoJSON(ST_Simplify(geom,0.0001)) as json,c_xzqdm,c_xzqmc,f_xzqhmc,f_xzqhdm,gid,t_xzqmc,p_xzqmc,t_xzqdm`
  );

  window.countylayer = [];
  let ps = []
  //console.log(features)
  features.forEach(feature => {
    let p = {
      c_xzqdm: feature.c_xzqdm,
      c_xzqmc: feature.c_xzqmc,
      f_xzqhdm: feature.f_xzqhdm,
      f_xzqhmc: feature.f_xzqhmc,
      gid: feature.gid,
      p_xzqmc: feature.p_xzqmc,
      t_xzqdm: feature.t_xzqdm,
      t_xzqmc: feature.t_xzqmc,
    }


    // 计算是否超保
    let hzBaseDataClone = hzBaseData.filter(item => item.town == p.t_xzqmc);

    p.rs = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.rs_area), 0);
    p.area = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.i_area), 0);
    p.coverage = (p.area && p.rs) ? (p.area / p.rs * 100) : 0;
    // console.log(p)
    window.countylayer.push(p)

    //feature && goGeom(feature.json, p)

    ps.push({
      type: "Feature",
      geometry: JSON.parse(feature.json),
      properties: p
    })
  })



  if (activeKey.value == 1) {
    goGeom(ps)
  } else {
    goGeomLine(ps)
  }


};




/**
 * 移除地图上的行政区边界图层
 */
const goGeomUnOne = () => {
  if (window.countylayer) {
    countylayer.map((cl) => {
      map.getLayer("adminGeom" + cl.gid) && map.removeLayer("adminGeom" + cl.gid);
      map.getLayer("adminGeomOut" + cl.gid) && map.removeLayer("adminGeomOut" + cl.gid);
      map.getLayer("textLayer" + cl.gid) && map.removeLayer("textLayer" + cl.gid);
      map.getSource("adminGeom" + cl.gid) && map.removeSource("adminGeom" + cl.gid);

    })
    countylayer = []
  }



};


/**
 * 移除地图上的行政区边界图层
 */
const goGeomUn = () => {
  map.getLayer("adminGeom") && map.removeLayer("adminGeom");
  map.getLayer("adminGeomOut") && map.removeLayer("adminGeomOut");
  map.getLayer("textLayer") && map.removeLayer("textLayer");
  map.getLayer("adminGeomOutLabel") && map.removeLayer("adminGeomOutLabel");
  map.getSource("adminGeom") && map.removeSource("adminGeom");


};

/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const goGeomOne = (data, property) => {


  // 判定颜色
  let color = ""
  if (property.coverage) {
    if (property.coverage > 105) {
      color = "RGB(236,102,103)"
    } else if (property.coverage <= 80) {
      color = "RGB(248,200,94)"
    } else {
      color = "RGB(144,204,120)"
    }
  } else {
    color = "#ccc"
  }


  // map.addSource("adminGeom" , {
  //   type: "geojson",
  //   data: {
  //     type: "FeatureCollection",
  //     features: [json],
  //   },
  // });


  //添加图层
  map.addSource("adminGeom" + property.gid, {
    type: "geojson",
    // lineMetrics: true, // 线渐变必须条件
    data: {
      "type": "Feature",
      "geometry": JSON.parse(data),
      "properties": property
    },
  });
  map.addLayer({
    id: "adminGeom" + property.gid,
    type: "fill",
    source: "adminGeom" + property.gid,
    paint: {
      "fill-color": color,
      "fill-opacity": 0.5,
    },
  });
  if (header.value) {
    // 点击区县
    map.addLayer({
      id: "adminGeomOut" + property.gid,
      type: "line",
      source: "adminGeom" + property.gid,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": 2.5,
      },
    });

    map.addLayer({
      id: "textLayer" + property.gid,
      type: "symbol",
      source: "adminGeom" + property.gid,
      layout: {
        "text-field": "{f_xzahmc}{t_xzqmc}",
        "text-size": 18,
      },
      paint: {
        "text-halo-blur": 1,
        "text-color": color,
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
        "text-halo-blur": 0.8, // 文字轮廓模糊度
      },
    });
  } else {
    map.addLayer({
      id: "adminGeomOut" + property.gid,
      type: "line",
      source: "adminGeom" + property.gid,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": color,
        "line-width": 4.5,
      },
    });

    map.addLayer({
      id: "textLayer" + property.gid,
      type: "symbol",
      source: "adminGeom" + property.gid,
      layout: {
        "text-field": "{city_name}{name}",
        "text-size": 18,
      },
      paint: {
        "text-halo-blur": 1,
        "text-color": color,
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
        "text-halo-blur": 0.8, // 文字轮廓模糊度
      },
    });
  }







};

/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const goGeom = (data) => {

  map.addSource("adminGeom", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data
    },
  });


  map.addLayer({
    id: "adminGeom",
    type: "fill",
    source: "adminGeom",
    paint: {
      "fill-opacity": 0.6,
      'fill-color': [
        'case',
        ['all', ['<', ['get', 'coverage'], 80], ['>', ['get', 'coverage'], 0]],
        'rgba(248,200,94,1)',
        ['>', ['get', 'coverage'], 105],
        'RGB(236,102,103)',
        ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 80]],
        'RGB(144,204,120)',
        '#ccc',
      ],
    },
  });


  if (header.value) {
    // 点击区县
    map.addLayer({
      id: "adminGeomOut",
      type: "line",
      source: "adminGeom",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        'line-color': [
          'case',
          ['all', ['<', ['get', 'coverage'], 80], ['>', ['get', 'coverage'], 0]],
          'rgba(248,200,94,1)',
          ['>', ['get', 'coverage'], 105],
          'RGB(236,102,103)',
          ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 80]],
          'RGB(144,204,120)',
          '#ccc',
        ],
        "line-width": 1.5,
      },
    });

    map.addLayer({
      id: "textLayer",
      type: "symbol",
      source: "adminGeom",
      layout: {
        "text-field": "{f_xzahmc}{t_xzqmc}",
        "text-size": 18,
      },
      paint: {
        "text-halo-blur": 1,
        'text-color': [
          'case',
          ['all', ['<', ['get', 'coverage'], 80], ['>', ['get', 'coverage'], 0]],
          'rgba(248,200,94,1)',
          ['>', ['get', 'coverage'], 105],
          'RGB(236,102,103)',
          ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 80]],
          'RGB(144,204,120)',
          '#ccc',
        ],
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
        "text-halo-blur": 0.8, // 文字轮廓模糊度
      },
    });
  } else {
    map.addLayer({
      id: "adminGeomOut",
      type: "line",
      source: "adminGeom",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        'line-color': [
          'case',
          ['all', ['<', ['get', 'coverage'], 80], ['>', ['get', 'coverage'], 0]],
          'rgba(248,200,94,1)',
          ['>', ['get', 'coverage'], 105],
          'RGB(236,102,103)',
          ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 80]],
          'RGB(144,204,120)',
          '#ccc',
        ],
        "line-width": 2.5,
      },
    });

    map.addLayer({
      id: "textLayer",
      type: "symbol",
      source: "adminGeom",
      layout: {
        "text-field": "{city_name}{name}",
        "text-size": 18,
      },
      paint: {
        "text-halo-blur": 1,
        'text-color': [
          'case',
          ['all', ['<', ['get', 'coverage'], 80], ['>', ['get', 'coverage'], 0]],
          'rgba(248,200,94,1)',
          ['>', ['get', 'coverage'], 105],
          'RGB(236,102,103)',
          ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 80]],
          'RGB(144,204,120)',
          '#ccc',
        ],
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
        "text-halo-blur": 0.8, // 文字轮廓模糊度
      },
    });
  }







};


/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const goGeomLine = (data) => {
  map.addSource("adminGeom", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data
    },
  });

  if (header.value) {
    // 点击区县
    map.addLayer({
      id: "adminGeomOut",
      type: "line",
      source: "adminGeom",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        'line-color': '#fff',
        "line-width": 2.5,
        "line-opacity": 0.6,
      },
    });

    map.addLayer({
      id: "adminGeomOutLabel",
      type: "symbol",
      source: "adminGeom",
      layout: {
        "text-field": "{t_xzqmc}",
        "text-size": 20,
      },
      paint: {
        "text-halo-blur": 1.6,
        'text-color': '#fff',
        "text-halo-color": "#000",
        "text-halo-width": 1.5,
        "text-halo-blur": 1.8, // 文字轮廓模糊度
      },
    });

  }
}




/**
 * 气泡事件
 */
const loadEvent = (() => {




  map.on("click", () => {
    // map.setLayoutProperty("Highlight_DK_Click", "visibility", "none");
    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "none");
    map.getLayer("lockGeom") && map.removeLayer("lockGeom");
    map.getLayer("lockGeomFake") && map.removeLayer("lockGeomFake");
    map.getSource("lockGeom") && map.removeSource("lockGeom");

  });

  map.on("click", "adminGeom", async (e) => {
    if (activeKey.value == 1) {
      addEventArea(e)
    } else {
      addEventDk(e)
    }
  });

  map.on("click", "rskm_pt", async (e) => {
    if (activeKey.value == 1) {
      addEventArea(e)
    } else {
      addEventDk(e)
    }
  });
})

const addEventArea = async (e) => {


  popup && popup.setHTML("");
  popup && popup.setLngLat([0, 0]);

  map.getCanvas().style.cursor = "pointer";
  const feature = e.features[0];
  //console.log(feature)
  let text = await setCountyPopup(feature);

  map.setFilter("Highlight_DK_Line_Click", [
    "all",
    ["in", "gid", feature.properties.gid],
  ]);
  map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");

  // fitBox(feature);
  map.flyTo({
    center: e.lngLat,
    // zoom: 7.5,
    speed: 1,
    curve: 1,
    easing(t) {
      return t;
    },
  });
  popupbig.setLngLat(e.lngLat).setHTML(text).addTo(map);
  window.tgid = feature.properties.gid;
}


const addEventDk = async (e) => {


  popup && popup.setHTML("");
  popup && popup.setLngLat([0, 0]);

  map.getCanvas().style.cursor = "pointer";
  const feature = e.features[0];
  //console.log(feature)
  let text = await setPopup(feature.properties);

  // map.setFilter("Highlight_DK_Line_Click", [
  //   "all",
  //   ["in", "gid", feature.properties.gid],
  // ]);
  map.setFilter("Highlight_DK_Line_Click", [
    "all",
    ["in", "bbxrmc", feature.properties.bbxrmc],
    ["in", "bdh", feature.properties.bdh],
    // ["in", "bbxrdh", feature.properties.bbxrdh],
    // ["in", "bbxrzjh", feature.properties.bbxrzjh],
  ]);

  map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");

  // fitBox(feature);
  map.flyTo({
    center: e.lngLat,
    // zoom: 7.5,
    speed: 1,
    curve: 1,
    easing(t) {
      return t;
    },
  });
  popupbig.setLngLat(e.lngLat).setHTML(text).addTo(map);
  window.tgid = feature.properties.gid;
}



/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setPopup = async (info) => {


  if (!info) return false;
  let data = await api.get_table_by_filter("procjet_2024_yghy_hz10_excel", `and bdh in('${info.bdh}') and name in ('${info.bbxrmc}') `,
    ` bdh, name, sfz, telphone, type, type_xl, bxjg, city, city_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, bxqj, bdscsj, bdxgsj, v1, v2, v3, v4, v5, v6, v7, v8 `);


  if (data.length == 0) {
    const bdh = info.bdh || "";
    const area_mu = info.dkmj ? Number(info.dkmj).toFixed(1) : "";
    const province_city_county_town_village =
      (info.shi || "") +
      (info.quxian || "") +
      (info.zhen || "") +
      (info.cun || "");
    const bbxrmc = info.bbxrmc || "";
    const youxiao = info.youxiao || "";
    const bxjg = info.bxjg || "";
    const xianzhong = info.xianzhong || "";
    const bbxrzjh = info.bbxrzjh || "";
    const bbxrdh = info.bbxrdh || "";
    const bdmj = info.bdmj ? Number(info.bdmj).toFixed(1) : "";
    const dkbcd = info.dkbcd || 0;
    const dkcdl = info.dkcdl ? Number(info.dkcdl) * 100 : 0;

    const text = `
        <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 18px;"  title="地块信息" >
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px;vertical-align: top;">核验状态:</th><td><div  style='background-color:RGB(236,102,103);color:#fff'>暂未核验</div></td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px;vertical-align: top;">被保险人:</th><td >${bbxrmc}</td></tr>
        <tr style="line-height:1.5;" ><th style="text-align: right;width:100px;padding-right:5px;vertical-align: top;  ">保单号:</th><td >${bdh}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px;vertical-align: top;">投保地点:</th><td>${province_city_county_town_village} </td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px">机构:</th><td >${bxjg}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px;vertical-align: top;">险种:</th><td > ${xianzhong}</td></tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px">地块面积:</th><td >${area_mu}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px">标的面积:</th><td >${bdmj}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;width:100px;padding-right:5px;vertical-align: top;">联系电话:</th><td>*******${bbxrdh} </td></tr>
        </table>
    `;

    return text
  } else {
    let successData = data[0];
    const bdh = successData.bdh || "";
    const area_mu = successData.dkmj ? Number(successData.dkmj).toFixed(1) : "";
    const province_city_county_town_village =
      (successData.city || "") +
      (successData.quxian || "") +
      (successData.xiangzhen || "") +
      (successData.cun || "");
    const bbxrmc = successData.name || "";
    const bxqj = successData.bxqj || "";
    const bxjg = successData.bxjg || "";
    const type = successData.type || "";
    const xianzhong = successData.type_xl || "";
    const bbxrzjh = successData.bbxrzjh || "";
    const bbxrdh = successData.telphone || "";
    const bdmj = successData.bdmj ? Number(successData.bdmj).toFixed(1) : "";
    const cbsl = successData.cbsl || 0;
    const v1 = successData.v1 || 0;
    const v2 = Number(successData.v2).toFixed(2) || 0;
    const v3 = successData.v3 || 0;
    const v4 = successData.v4 || 0;
    const v5 = successData.v5 || 0;
    const v6 = Number(successData.v6).toFixed(2) || 0;
    const v7 = successData.v7 || 0;
    const v8 = successData.v8 || 0;

    // ①地块面积合计（亩）	
    // ②地块面积合计/承保数量	
    // ③地块面积是否与承保数量一致？
    // ④是否无地块存在重叠问题？	
    // ⑤地块内玉米种植面积合计（亩）	
    // ⑥地块内标的作物面积合计/承保数量	
    // ⑦玉米种植面积差异率是否达标？	
    // ⑧该大户的地块是否合格？

    const text = `
        <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 18px;"  title="地块信息" >
        <tr style="line-height:1.2;"><th style="text-align: right;width:130px;padding-right:5px;vertical-align: top;">被保险人:</th><td >${bbxrmc}</td></tr>
        <tr style="line-height:1.2;" ><th style="text-align: right;padding-right:5px;vertical-align: top; ">保单号:</th><td >${bdh}</td><tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">投保地点:</th><td>${province_city_county_town_village} </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px">保险机构:</th><td >${bxjg}</td><tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">险类险种:</th><td >${type},${xianzhong}</td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px">承保数量:</th><td >${cbsl}亩</td><tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">保险期间:</th><td >${bxqj}</td><tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">联系电话:</th><td>${bbxrdh} </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;"><hr></th><td><hr> </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">地块是否合格:</th><td><div style='color:${v8 == '1' ? 'RGB(158,224,132)' : 'RGB(236,102,103)'};'>${v8 == '1' ? '合格' : '不合格'}</div></td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">地块面积:</th><td>${v1}亩 </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">标的种植面积:</th><td>${v5}亩 </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">保险覆盖率:</th><td>${v2}% </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">地块与承保面积:</th><td>${v3 ? '一致' : '不一致'}</td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">地块无重叠:</th><td>${v4 ? '无重叠地块' : '有重叠地块'} </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">标的差异率:</th><td>${v6}% </td></tr>
        <tr style="line-height:1.2;"><th style="text-align: right;padding-right:5px;vertical-align: top;">标的差异率是否达标:</th><td>${v7 ? '达标' : '未达标'} </td></tr>
        </table>
    `;

    return text
  }

}



/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setCountyPopup = async (data) => {


  //console.log(data, data.properties.name)

  let text = ``;
  text = `
    <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 20px;"  title="区域核验" >
        <tr style="line-height:1.5;"><th style="text-align: right;width:140px;padding-right:5px">核验区域:</th><td >${(data.properties.f_xzqhmc + data.properties.t_xzqmc) || data.properties.name}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">承保面积:</th><td >${data.properties.area ? Number(data.properties.area).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">遥感面积:</th><td >${data.properties.rs ? Number(data.properties.rs).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">保险覆盖率:</th><td >${parseInt(data.properties.coverage)}%</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;;padding-right:5px">是否超保:</th><td >${data.properties.coverage >= 105 ? "超保" : "未超保"}</td><tr>
        </table>`


  return text
}

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCountyFit = async (name) => {
  //console.log(String(code).substring(0, 4));
  let features = await api.get_table_by_filter(
    "admin_2022_county",
    `and name in (${name})  order by county_code`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,city_code,city_name,county_code,gid,name,province_name`
  );

  map.fitBounds(turf.bbox(JSON.parse(features[0].json)), {
    padding: { top: 100, left: 600, right: 600 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
}

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCounty = async (name) => {

  //console.log(String(code).substring(0, 4));
  let features = await api.get_table_by_filter(
    "admin_2022_county",
    `and name in (${name})  order by county_code`,
    `ST_AsGeoJSON(ST_Simplify(geom,0.001)) as json,city_code,city_name,county_code,gid,name,province_name`
  );

  if (features.length == 1) {
    map.fitBounds(turf.bbox(JSON.parse(features[0].json)), {
      padding: { top: 100, left: 600, right: 600 },
      linear: true,
      // easing: (t) => {
      //   return t * (1 - t);
      // },
    });
  } else {
    goGeomUn();

    window.countylayer = [];

    let ps = [];
    features.map((feature) => {
      let p = {
        city_code: feature.city_code,
        city_name: feature.city_name,
        county_code: feature.county_code,
        gid: feature.gid,
        name: feature.name,
        province_name: feature.province_name,
        pass: feature.pass,
      }

      // 计算是否超保
      let hzBaseDataClone = hzBaseData.filter(item => item.county == p.name);

      p.rs = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.rs_area), 0);
      p.area = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.i_area), 0);
      p.coverage = (p.area && p.rs) ? (p.area / p.rs * 100) : 0;

      countylayer.push(p)
      //feature && goGeom(feature.json, p)

      ps.push({
        type: "Feature",
        geometry: JSON.parse(feature.json),
        properties: p
      })
    })
    goGeom(ps)


    fitCenter()
  }

};


// 初始化视野
const fitCenter = () => {
  map.flyTo({
    center: [119, 36],
    zoom: 7,
    speed: 1,
    curve: 2,
    // easing(t) {
    //   return t;
    // },
  });
};

let tongji = {
  bdh_count: ref("-"),
  dk_count: ref("-"),
  area_count: ref("-"),
  ct_bd: ref("-"),
  ct_dk: ref("-")
}

/**
 * 获取统计
 * @param key 
 * @param name 
 */
const getCount = async (key, name = "") => {
  //console.log(String(code).substring(0, 4));
  let data = await api.get_table_tj(
    key,
    name,
  );
  if (data.length > 0) {
    // console.log(data)
    // console.log( data[0].bdh_count)
    tongji.bdh_count.value = data[0].bdh_count;
    tongji.dk_count.value = data[0].dk_count;
    tongji.area_count.value = data[0].area_count;
    tongji.ct_bd.value = data[0].ct_bd;
    tongji.ct_dk.value = data[0].ct_dk;
  }


  // chardata.value = [
  //   { value: Number(data[0].ct_dk), name: '遥感面积' },
  //   { value: Number(data[0].dk_count), name: '承保面积' },
  // ]

  //loadEcharts();

};


const expandedKeys = ref(['0-0']);
const selectedKeys = ref(['0-0']);


watch(selectedKeys, () => {
  //console.log(selectedKeys.value[0])

  switch (selectedKeys.value[0]) {
    case "0-0":
      loadLocalData();
      break;
    case "0-0-0":
      loadLocalData("济阳区");

      break;
    case "0-0-1":
      loadLocalData("莱芜区");
      break;
    case "0-0-2":
      loadLocalData("桓台县");
      break;
    case "0-0-3":
      loadLocalData("高青县");
      break;
    case "0-0-4":
      loadLocalData("海阳市");
      break;
    case "0-0-5":
      loadLocalData("招远市");
      break;
    case "0-0-6":
      loadLocalData("汶上县");
      break;
    case "0-0-7":
      loadLocalData("冠县");
      break;
    case "0-0-8":
      loadLocalData("东阿县");
      break;
    case "0-0-9":
      loadLocalData("无棣县");
      break;
    default:
      break;
  }

  setTimeout(() => {
    reloadEChats()
  })

})






/**
 * 右侧默认菜单
 */
const activeKey = ref('1');


watch(activeKey, () => {
  header.value = "";
  selectedKeys.value = ['0-0'];


  // loadDataRight()

  if (activeKey.value == 2) {
    // 地块统计图

    setTimeout(() => {
      reloadEChats()
    }, 100)
  } else {
    removeLayerDk()
  }

  setTimeout(() => {
    loadLocalData()

  }, 100)

})

/**
 * 统计信息
 */

const cbmj = ref(0);
const ygmj = ref(0);
const bxfgl = ref(0);
const cbxz = ref(0);
const cbxz_val = ref(0);
const zcxz = ref(0);
const zcxz_val = ref(0);
const bzxz = ref(0);
const bzxz_val = ref(0);



const loadDataRight = (filter) => {
  // 地块第二个柱状图
  if (!filter) {
    getAnalysisEchars2("yghy_sql_4")
    getAnalysisEchars4('yghy_sql_6')

  } else {
    // 图表三统计
    getAnalysisEchars3('yghy_sql_5', `and quxian in ('${filter}')`);
    getAnalysisEchars4('yghy_sql_6', `and quxian in ('${filter}')`);
  }

  // 地块概况及饼图查询
  if (!filter) {
    getAnalysisDK("yghy_sql_3")
  } else {
    getAnalysisDK("yghy_sql_3", `and quxian in ('${filter}')`)

  }



}



const loadLayers = (filter) => {
  if (!filter) {
    loadCounty("'东阿县','济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','无棣县'");
  } else {
    if (activeKey.value == 2) {
      loadCounty("'" + filter + "'");
    } else if (activeKey.value == 1) {
      loadCounty("'" + filter + "'");
      loadTown("'" + filter + "'");
    }
  }




}

/**
 * 初始化图表
 * @param filter 
 */
const loadLocalData = (filter) => {

  //console.log(filter, activeKey.value)

  loadDataRight(filter)



  goGeomUn()

  if (activeKey.value == 1) {
    loadLayers(filter)
  } else {
    loadLayerDk()

    if (!filter) {
      fitCenter()
    } else {
      loadCountyFit(`'${filter}'`)
      loadTown(`'${filter}'`)
    }

  }

  header.value = filter;
  // 初始化
  [cbmj, ygmj, bxfgl, cbxz, cbxz_val, zcxz, zcxz_val, bzxz, bzxz_val].forEach(ref => ref.value = 0);


  // console.log(hzBaseData, hzBaseData.length, filter)
  if (!hzBaseData) return false;


  let hzBaseDataClone;
  if (filter) {
    hzBaseDataClone = hzBaseData.filter(item => item.county == filter);
  } else {
    hzBaseDataClone = hzBaseData;
  }
  // console.log(hzBaseDataClone)

  let i_coverage = 0;
  for (const hz in hzBaseDataClone) {
    cbmj.value += Number(hzBaseDataClone[hz].i_area || 0);
    ygmj.value += Number(hzBaseDataClone[hz].rs_area || 0);
    i_coverage += Number(hzBaseDataClone[hz].i_coverage || 0);
    cbxz.value += Number(hzBaseDataClone[hz].i_coverage || 0) > 105 ? 1 : 0;
    zcxz.value += (Number(hzBaseDataClone[hz].i_coverage || 0) <= 105 && Number(hzBaseDataClone[hz].i_coverage || 0) > 80) ? 1 : 0;
    bzxz.value += Number(hzBaseDataClone[hz].i_coverage || 0) <= 80 ? 1 : 0;
  }
  // 覆盖率
  bxfgl.value = Number(i_coverage / hzBaseDataClone.length).toFixed(2);

  //超保乡镇
  cbxz_val.value = Number(cbxz.value / hzBaseDataClone.length * 100).toFixed(2);

  //正常乡镇
  zcxz_val.value = Number(zcxz.value / hzBaseDataClone.length * 100).toFixed(2);

  //不足乡镇
  bzxz_val.value = Number(bzxz.value / hzBaseDataClone.length * 100).toFixed(2);



  // 图表一
  loadEcharts([
    { value: Number(cbxz.value), name: '超保' },
    { value: Number(zcxz.value), name: '正常' },
    { value: Number(bzxz.value), name: '不足' },
  ])


  // 图表二
  let countys = ['济阳区', '莱芜区', '桓台县', '高青县', '海阳市', '招远市', '汶上县', '冠县', '东阿县', '无棣县'];

  if (!filter) {
    let fgl = [];
    let hgl = [];
    countys.map((ca) => {
      // 覆盖率
      let sa = hzBaseData.filter(item => item.county == ca)
      let totalIcoverage = sa.reduce((total, item) => total + Number(item.i_coverage || 0), 0);
      fgl.push(Number(totalIcoverage / sa.length).toFixed(0));

      // 合格率
      let ha = hzBaseData.filter(item => item.county == ca)
      let hatotal = ha.filter((item) => Number(item.pass || 0) == 1);
      hgl.push(Number(hatotal.length / ha.length * 100).toFixed(0));
    })
    loadEcharts02(countys, fgl, hgl)
  } else {
    let fgl = [];
    let hgl = [];
    let towns = []
    // 覆盖率
    let sa = hzBaseData.filter(item => item.county == filter)
    sa.forEach((s) => {
      towns.push(s.town)
      fgl.push(s.i_coverage)
      hgl.push(0)

    })

    loadEcharts02(towns, fgl, hgl)
  }



  // 图表三

  if (!filter) {
    let zc = [];
    let bz = [];
    let cb = [];
    let bxjg = [];


    let promise = api.get_table_tj("yghy_sql_7");
    promise.then((data) => {
      data.forEach((ca) => {
        if (ca.zc && ca.bz && ca.cb) {
          zc.push((ca.zc / (ca.zc + ca.bz + ca.cb)));
          bz.push((ca.bz / (ca.zc + ca.bz + ca.cb)));
          cb.push((ca.cb / (ca.zc + ca.bz + ca.cb)));
        } else {
          zc.push();
          bz.push();
          cb.push();
        }

        //  console.log(ca)

        bxjg.push(ca.name)
      });
      loadEcharts03(bxjg, [zc, bz, cb])
    })

    // console.log(bxjg, [zc, bz, cb])

  }

}



const bdmjbfhs = ref("")
const dhsl = ref("")
const dk_area = ref("")
const dkcd = ref("")
const dkhghs = ref("")
const dkmjbfs = ref("")
const tb_area = ref("")
const ydkdhsl = ref("")
const wdkdhsl = ref("")
const dkbhghs = ref("")

/**
 * 地块统计
 * @param key 
 * @param name 
 */
const getAnalysisDK = async (key, where = "") => {

  let data = await api.get_table_tj(
    key,
    where,
  );
  //console.log(data[0])

  if (data[0]) {


    bdmjbfhs.value = data[0].bdmjbfhs;
    dhsl.value = data[0].dhsl;
    dk_area.value = data[0].dk_area;
    dkcd.value = data[0].dkcd;
    dkmjbfs.value = data[0].dkmjbfs;
    tb_area.value = data[0].tb_area;
    ydkdhsl.value = data[0].ydkdhsl;
    dkhghs.value = data[0].dkhghs;
    wdkdhsl.value = data[0].wdkdhsl;
    dkbhghs.value = data[0].dkbhghs;
  }

};



let rightEcData = ref([])
/**
 * 图表统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars2 = async (key, where = "") => {

  let data = await api.get_table_tj(
    key,
    where,
  );
  // console.log(data)

  if (data) {


    let county = []
    let dhsl = []
    let dkhghs = []
    data.forEach(item => {
      county.push(item.county)
      dhsl.push(item.dhsl)
      dkhghs.push(item.dkhghs)
    });
    rightEcData.value = [county, dkhghs, dhsl]
  }


};




/**
 * 区域统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars3 = async (key, where = "") => {

  let data = await api.get_table_tj(
    key,
    where,
  );
  // console.log(data)

  if (data) {


    let xiangzhen = []
    let dhsl = []
    let dkhghs = []
    data.forEach(item => {
      xiangzhen.push(item.xiangzhen)
      dhsl.push(item.dhsl)
      dkhghs.push(item.dkhghs)
    });
    rightEcData.value = [xiangzhen, dkhghs, dhsl];
    echartsDK02(...rightEcData.value);
  }


};



let rightEcDataJG = ref([]);
/**
 * 机构统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars4 = async (key, where = "") => {

  let data = await api.get_table_tj(
    key,
    where,
  );
  // console.log(data)

  if (data) {
    let bxjg = []
    let dhsl = []
    let dkhghs = []
    data.forEach(item => {
      bxjg.push(item.bxjg)
      dhsl.push(item.dhsl)
      dkhghs.push(item.dkhghs)
    });
    rightEcDataJG.value = [bxjg, dkhghs, dhsl];
    echartsDK03(...rightEcDataJG.value);
  }


};


const reloadEChats = () => {
  // 地块统计图
  echartsDK01(wdkdhsl.value, dkhghs.value, dkbhghs.value);
  // 地块统计二柱状图
  echartsDK02(...rightEcData.value);
  // 地块统计三柱状图
  echartsDK03(...rightEcDataJG.value);
}


let hzBaseData = [];

const LoadHzBaseData = async () => {
  // 在这里实现你的方法
  let data = await api.get_table_by_filter("procjet_2024_yghy_area_excel", "", "gid, city, city_code, county, county_code, town, town_code, type, i_area, rs_area, i_coverage, pass, cun, cun_code")


  data.length > 0 && (hzBaseData = data);
  dataSource.value = hzBaseData;
}


// 挂载
onMounted(() => {

  /**
   * 基础数据加载
   */
  map && map.on("load", () => {

    loadLocalData()

    addLayersYghy()

    loadEvent();

    loadCounty("'东阿县','济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','无棣县'");


  })

  // 装载检索数据


  loadCount();
  loadTabel(1, 10);

  LoadHzBaseData();
})




/**
 * 地块浮动框
 * @param page 
 * @param size 
 * @param filter 
 */
const loadTabel = async (page, size, filter = "") => {
  let dkList = await api.get_page("procjet_2024_yghy_hz10_excel", page, size, filter);
  //console.log(dkList)
  let arr = []
  dkList.map((dk) => {
    arr.push(dk)
  })
  dataSourceDk.value = arr;
}


/**
 * 隐藏地块图形
 */
const removeLayerDk = () => {
  map.setLayoutProperty('rskm_pt', 'visibility', 'none');
  map.setLayoutProperty('rskm_pt_outline', 'visibility', 'none');
  map.setLayoutProperty('rskm_pt_name', 'visibility', 'none');
  map.setLayoutProperty('rskm_pt_name_1', 'visibility', 'none');



  // map.setLayoutProperty('admin_2024_county_yghy_outline', 'visibility', 'visible');
  // map.setLayoutProperty('admin_2024_county_yghy', 'visibility', 'visible');
}

/**
 * 地块图形
 */
const loadLayerDk = () => {
  map.setLayoutProperty('rskm_pt', 'visibility', 'visible');
  map.setLayoutProperty('rskm_pt_outline', 'visibility', 'visible');
  map.setLayoutProperty('rskm_pt_name', 'visibility', 'visible');
  map.setLayoutProperty('rskm_pt_name_1', 'visibility', 'visible');


  // map.setLayoutProperty('admin_2024_county_yghy', 'visibility', 'none');


}

/**
 * 区域状态
 */
const header = ref("")


const searchSaData = ref()

/**
 * 绑定智能检索
 */
const valueSearch = ref('');
const options = ref([]);
const onSearch = async (searchText) => {
  if (searchText.length > 1) {
    let data = await api.get_table_by_filter(
      "procjet_2024_yghy_hz4country",
      ` and bbxrmc like '%25${searchText}%25'`,
      "	gid, ST_AsGeoJSON(geom) as geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao, dkmj, dkcdl, bdmj, dkbcd, shape_leng, shape_area, cbsl, bxqj, v1, v2, v3, v4, v5, v6, v7, v8");
    searchSaData.value = data;

    let nsmes = [...new Set(data.map(n => ({ value: n.bbxrmc, bbxrzjh: n.bbxrzjh, cun: n.cun })))];
    //console.log(nsmes)
    options.value = [...new Set(nsmes.map(item =>
      JSON.stringify(item)
    ))].map(val => JSON.parse(val))
  } else {
    options.value = [];
  }
};
const onSelect = (selectedOption) => {
  valueSearch.value = selectedOption;
  //console.log(valueSearch.value);

  // 绘制

  let newGeom = searchSaData.value.filter((sa) => {
    return sa.bbxrmc == selectedOption
  })
  //console.log(newGeom)
  //newGeom[0] && drawGeom(newGeom[0].geom)

  let inputdata = [];

  newGeom.map((feature) => {
    inputdata.push({
      type: "Feature",
      geometry: JSON.parse(feature.geom)
    })
  })

  drawGeom(inputdata)

  if (valueSearch.value.length > 1) {
    onSearch(valueSearch.value);
  }
};

const clearGeom = () => {

  map.getLayer("lockGeomFake") && map.removeLayer("lockGeomFake");
  map.getSource("lockGeomFake") && map.removeSource("lockGeomFake");
};


/**
* 查找地块
* @param {} data
*/
const drawGeom = (data) => {
  clearGeom()

  map.addSource("lockGeomFake", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data
    },
  });
  map.addLayer({
    id: "lockGeomFake",
    type: "fill",
    source: "lockGeomFake",
    paint: {
      "fill-color": "#fff",
      "fill-opacity": 0.5,
      // "fill-width":8,
    },
  });

  // const allCoordinates = data.reduce((acc, feature) => {
  //   return acc.concat(feature.geometry.coordinates.flat());
  // }, []);

  const bbox = turf.bbox({
    type: "FeatureCollection",
    features: data
  });


  map.fitBounds(bbox, {
    padding: { top: 400, bottom: 600 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
};


/**
 * 菜单栏显示
 */
const xSquareShow = ref(true)


/**
 * 统计栏显示
 */
const xRightSquareShow = ref(true)


/**
 * 图层控制
 */
const radioValue = ref(false);

const layer = ref(true)


watch(radioValue, (newr) => {
  if (newr) {
    map.setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'visible');
    map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'visible');
  } else {
    map.setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'none');
    map.setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'none');
  }
})




/**
 * 获取分页
 */
const pagination = ref({
  pageSize: 10, // 每页显示10条数据
  total: 1, // 总数据条数
  responsive: true,
  //pageSizeOptions: false,
  showLessItems: true,
  showTotal: (total, range) => {
    return `${total} 条`;
  },
  onChange: (page) => {
    loadTabel(page, pagination.value.pageSize);
  },
});





/**
 * 数据总数
 * @param {*} filter 条件
 */
const loadCount = async (filter = "") => {
  const data = await api.get_count("procjet_2024_yghy_hz10_excel", filter);
  pagination.value.total = Number(data[0].count);
  // console.log(data[0].count)
};




</script>

<template>

  <!-- 头部 -->
  <div class="header">
    <Header></Header>
  </div>

  <!-- 地图 -->
  <div class="verification">
    <SDMap :MapToolPosition="{ top: '240px', right: '12px' }"></SDMap>
  </div>

  <!-- 页面 -->
  <div class="page">
    <a-modal v-model:open="open" :title="activeKey == 1 ? '试点区域详情' : '试点大户详情'" @ok="open = !open" width="95%"
      :footer="null">

      <a-table :columns="columns" :data-source="dataSource" v-if="activeKey == 1" bordered size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'i_area'">
            {{ record.i_area ? record.i_area + ' 亩' : '' }}
          </template>
          <template v-if="column.key === 'rs_area'">
            {{ record.rs_area ? record.rs_area + ' 亩' : '' }}
          </template>
          <template v-if="column.key === 'i_coverage'">
            {{ record.i_coverage ? Number(record.i_coverage).toFixed(2) + ' %' : '' }}
          </template>

          <template v-if="column.key === 'pass'">
            <a-tag color="green" v-if="record.pass"> 合格</a-tag>
            <a-tag color="red" v-else> 不合格</a-tag>
          </template>
        </template>
      </a-table>
      <div v-if="activeKey == 2">
        <a-table :columns="columnsDk" :data-source="dataSourceDk" bordered size="middle" :pagination="pagination">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'city'">
              {{ record.city + record.quxian + record.xiangzhen + record.cun }}
            </template>
            <template v-if="column.key === 'cbsl'">
              {{ record.cbsl ? record.cbsl + ' 亩' : '' }}
            </template>
            <template v-if="column.key === 'v1'">
              {{ record.v1 ? record.v1 + ' 亩' : '' }}
            </template>
            <template v-if="column.key === 'v2'">
              {{ record.v1 ? record.v1 + ' %' : '' }}
            </template>
            <template v-if="column.key === 'v6'">
              {{ record.v6 ? record.v6 + ' %' : '' }}
            </template>
            <template v-if="column.key === 'name'">
              {{ record.name ? record.name : '' }}
            </template>
            <template v-if="column.key === 'v3'">
              <a-tag color="green" v-if="record.v3 == 1"> 一致</a-tag>
              <a-tag color="red" v-else> 不一致</a-tag>
            </template>
            <template v-if="column.key === 'v4'">
              <a-tag color="green" v-if="record.v3 == 1"> 无重叠</a-tag>
              <a-tag color="red" v-else> 有重叠</a-tag>
            </template>
            <template v-if="column.key === 'v7'">
              <a-tag color="green" v-if="record.v7 == 1"> 达标</a-tag>
              <a-tag color="red" v-else> 未达标</a-tag>
            </template>
            <template v-if="column.key === 'v8'">
              <a-tag color="#87d068" v-if="record.v8 == 1"> 合格</a-tag>
              <a-tag color="#f50" v-else> 不合格</a-tag>
            </template>
            <template v-if="column.key === 'bdh'">
              保单号:{{ record.bdh }} <br>
              保险期间:{{ record.bxqj }}
            </template>

          </template>
        </a-table>
      </div>
    </a-modal>


    <!-- 左侧菜单栏 -->

    <div class="xSquareShow" v-show="!xSquareShow" @click="xSquareShow = true">
      <a-tooltip placement="right">
        <template #title>
          <span>显示菜单</span>
        </template>
        <SidebarOpen :size="25"></SidebarOpen>
      </a-tooltip>

    </div>
    <div class="left-card" style="padding:0 10px" v-show="xSquareShow">

      <a-row :gutter="16">
        <a-col :span="24">
          <a-card size="small" title="">


            <p style="border-bottom: 1px solid #ccc;">
              <label style="font-size: 16px;font-weight: 1000;">
                <FoldersIcon style="margin-bottom: -5px;"></FoldersIcon> 遥感核验
              </label>


              <a-tooltip placement="right">
                <template #title>
                  <span>隐藏菜单</span>
                </template>


                <X style="float: right;cursor: pointer;" color="#999" @click="xSquareShow = false"></X>
              </a-tooltip>

            </p>

            <div v-if="activeKey == 2" style="padding: 10px 0px;">
              <a-space>

                <!-- <a-input placeholder="请输入搜索关键词"
                  style="width: 320px;border: 0;height: 40px;outline: 1px solid #ccc; border-radius: 1px;" /> -->
                <label style="font-weight: 600;">被保险人查询：</label>
                <a-auto-complete :allowClear="true" v-model:value="valueSearch" :options="options" style="width: 290px;"
                  @select="onSelect" @search="onSearch" placeholder="请输入大户名称">

                  <template #option="item">
                    <div style="display: flex; justify-content: space-between">
                      <span>
                        {{ item.value }}
                        <!-- {{ JSON.stringify(item) }} -->
                      </span>


                      <span>{{ item.cun }} </span>

                      <!-- <span>{{ item.bdmj ? Number(item.bdmj).toFixed(0) : '' }}亩 </span> -->
                      <span>{{ item.bbxrzjh }} </span>
                    </div>
                  </template>
                </a-auto-complete>
                <!-- <a-button style="margin-left: 10px;" type="primary">检索</a-button> -->
              </a-space>
            </div>

            <a-directory-tree v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys" show-icon
              show-line default-expand-all :tree-data="treeLeftData">

              <template #icon="{ key, selected, dataRef }">
                <template v-if="dataRef.isPass === true && key != '0-0'">

                  <div style="float: left;margin-left: 220px;;width: 100px;">
                    <a-tooltip color="RGB(144,204,120)" placement="right">
                      <template #title>{{ dataRef.title }}完成核验</template>
                      <CheckCircle2Icon color="RGB(144,204,120)" :size="20"></CheckCircle2Icon>
                    </a-tooltip>
                  </div>
                </template>
                <template v-if="dataRef.isPass === false && key != '0-0'">

                  <div style="float: left;margin-left: 220px;width: 100px;">

                    <a-tooltip color="RGB(236,102,103)" placement="right">
                      <template #title>{{ dataRef.title }}暂未完成</template>
                      <CircleAlertIcon color="RGB(236,102,103)" :size="20"></CircleAlertIcon>
                    </a-tooltip>
                  </div>
                </template>
              </template>


            </a-directory-tree>

            <br>
            <a-alert message="提示：本期核验数据截止2024年9月30日" type="success" show-icon />
          </a-card>
        </a-col>


      </a-row>



    </div>

    <!-- 中间 -->
    <div class="center-card">
      <!-- <a-typography-title class="center-card-title">遥感核验与分析
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            <a-tag color="#87d068">静态
              <CheckCheckIcon :size="16" />
            </a-tag>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="router.push('/verification/index')">静态</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="router.push('/verification/index')">动态</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

      </a-typography-title> -->


    </div>


    <!--右侧统计栏-->

    <div class="xRightSquareShow" @click="xRightSquareShow = true">
      <a-tooltip placement="left">
        <template #title>
          <span>显示统计栏</span>
        </template>


        <PanelRightOpenIcon :size="25"></PanelRightOpenIcon>
      </a-tooltip>
    </div>
    <div class="right-card" v-show="xRightSquareShow">

      <a-card size="small" title="" style="height: 97%;">

        <a-tabs v-model:activeKey="activeKey" type="card" style="position: absolute;top: 0;left: 0; ">
          <a-tab-pane key="1">
            <template #tab>
              <div style="line-height: 35px;font-size: 17px;display: flex;align-items: center;justify-content: center;">
                <LandPlotIcon :size="25"></LandPlotIcon>
                &nbsp;区域核验
              </div>
            </template>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <div style="line-height: 35px;font-size: 17px;display: flex;align-items: center;justify-content: center;">
                <LucideSquareMousePointer :size="25"></LucideSquareMousePointer>
                &nbsp;地块核验
              </div>
            </template>
          </a-tab-pane>


        </a-tabs>
        <a-tooltip placement="left">
          <template #title>
            <span>隐藏统计栏</span>
          </template>


          <X style="float: right;cursor: pointer;" color="#999" @click="xRightSquareShow = false"></X>
        </a-tooltip>


        <!--区域核验-->
        <div v-show="activeKey == '1'"
          style="position: absolute;top: 50px;left: 0; height: calc(100% - 70px);width: 100%;padding: 10px;">

          <div style="width: 100%;height: 300px;">
            <div class="headerbg">

              <MapPinned :size="24" style="margin-bottom: -5px;"></MapPinned> {{ header ? header : '试点区县' }}


              <table style="position: absolute;right: 10px;margin-top: -30px">
                <tr>
                  <!-- <td> <a-button type="link" primary>
                      <div style="display: flex;align-items: center;">
                        <ArrowDownSquareIcon :size="18"></ArrowDownSquareIcon>&nbsp;获取核验报告
                      </div>
                    </a-button>
                  </td> -->
                  <td> <a-button type="link" primary>
                      <div style="display: flex;align-items: center;">
                        <ArrowDownSquareIcon :size="18"></ArrowDownSquareIcon>&nbsp;<a
                          :href="'/data/20241021区域汇总统计.csv'" download>区域核验报表</a>
                      </div>
                    </a-button></td>
                </tr>
              </table>


            </div>
            <a-row :gutter="16">
              <a-col :span="10">

                <table class="tjfx">
                  <tr style="  line-height: 36px;">
                    <th>承保面积：</th>
                    <td>{{ Number(cbmj).toFixed(0) }}亩</td>
                  </tr>
                  <tr style="  line-height: 36px;">
                    <th>遥感面积：</th>
                    <td>{{ Number(ygmj).toFixed(0) }}亩</td>
                  </tr>
                  <tr style="  line-height: 36px;">
                    <th>保险覆盖率：</th>
                    <td>{{ bxfgl }}%</td>
                  </tr>
                  <tr style="  line-height: 36px;">
                    <th>超保乡镇：</th>
                    <td>{{ cbxz }} <a-tag color="error">{{ cbxz_val }}%</a-tag></td>
                  </tr>
                  <tr style="  line-height: 36px;">
                    <th>正常乡镇：</th>
                    <td> {{ zcxz }} <a-tag color="green">{{ zcxz_val }}%</a-tag></td>
                  </tr>
                  <tr style="  line-height: 36px;">
                    <th>不足乡镇：</th>
                    <td> {{ bzxz }} <a-tag color="warning">{{ bzxz_val }}%</a-tag></td>
                  </tr>

                </table>

              </a-col>
              <a-col :span="14">
                <div id="main" style="height:100%;"></div>
              </a-col>
            </a-row>

          </div>

          <div style="width: 100%; height: calc(100% - 300px);">

            <div style="width: 100%;height: 59%;">
              <div class="headerbg">

                <LucideAreaChart :size="24" style="margin-bottom: -5px;"></LucideAreaChart> 区域统计<small>&nbsp;
                  <a-tooltip title="保险覆盖率(承保面积/遥感面积×100%))，承保合格率(非超保和不足面积占比)" :color="orange">
                    <Info :size="16" color="#ccc"></Info>
                  </a-tooltip>
                </small>


                <a-button type="link" primary style="position: absolute;right: 10px;" @click="open = true">
                  <div style="display: flex;align-items: center;">
                    <MoreHorizontal :size="18"></MoreHorizontal>&nbsp;试点区域详情
                  </div>
                </a-button>

              </div>

              <div id="loadEcharts02" style="height:95%;"></div>

            </div>
            <div style="width: 100%;height: 40%;">
              <div class="headerbg">

                <Building2Icon :size="24" style="margin-bottom: -5px;"></Building2Icon> 机构统计<small>&nbsp;
                  <a-tooltip title="合格(大于80%且小于105%)，超保(大于105%)，不足(小于80%)" :color="orange">
                    <Info :size="16" color="#ccc"></Info>
                  </a-tooltip>
                </small>

                <a-button type="link" primary style="position: absolute;right: 10px;">
                  <!-- <div style="display: flex;align-items: center;">
                    <MoreHorizontal :size="18"></MoreHorizontal>&nbsp;更多
                  </div> -->
                </a-button>

              </div>

              <div id="main03" style="height:95%"></div>
            </div>
          </div>
        </div>


        <!--地块核验-->
        <div v-if="activeKey == '2'"
          style="position: absolute;top: 50px;left: 0; height: calc(100% - 70px);width: 100%;padding: 10px;">



          <div style="width: 100%;height: 300px;">
            <div class="headerbg">
              <MapPinned :size="25" style="margin-bottom: -5px;"></MapPinned> {{ header ? header : '试点区县' }}
              <a-tag color="red"> 重点乡镇 </a-tag>
              <!-- <a-button type="link" primary style="position: absolute;right: 10px;">
                <div style="display: flex;align-items: center;">
                  <ArrowDownSquareIcon :size="18"></ArrowDownSquareIcon>&nbsp;获取遥感核验报告
                </div>
              </a-button> -->
              <table style="position: absolute;right: 10px;margin-top: -30px">
                <tr>
                  <td>
                    <!-- <a-button type="link" primary>
                      <div style="display: flex;align-items: center;">
                        <ArrowDownSquareIcon :size="18"></ArrowDownSquareIcon>&nbsp;获取核验报告
                      </div>
                    </a-button> -->
                  </td>
                  <td> <a-button type="link" primary>
                      <div style="display: flex;align-items: center;">
                        <ArrowDownSquareIcon :size="18"></ArrowDownSquareIcon>&nbsp;<a
                          :href="'/data/20241021区域汇总统计.csv'" download>地块核验报表</a>
                      </div>
                    </a-button></td>
                </tr>
              </table>

            </div>


            <a-row :gutter="16">
              <a-col :span="11">
                <table class="tjfx">

                  <tr style="  line-height: 28px;">
                    <th>投保面积</th>
                    <td>{{ tb_area ? Number(tb_area).toFixed(0) : '-' }}亩</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>地块面积</th>
                    <td>{{ dk_area ? Number(dk_area).toFixed(0) : '-' }}亩</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>大户数量</th>
                    <td>{{ dhsl }}</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>有地块大户数</th>
                    <td>{{ ydkdhsl }}</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>地块合格户数</th>
                    <td>{{ dkhghs }}</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>地块面积不符户数</th>
                    <td>{{ dkmjbfs }}</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>地块重叠户数</th>
                    <td>{{ dkcd }}</td>
                  </tr>
                  <tr style="  line-height: 28px;">
                    <th>标的面积不符户数</th>
                    <td>{{ bdmjbfhs }}</td>
                  </tr>

                </table>
              </a-col>
              <a-col :span="13">
                <div id="echartsDK01" style="height:97%;"></div>
              </a-col>
            </a-row>

          </div>
          <div style="width: 100%; height: calc(100% - 300px);">
            <div style="width: 100%;height: 59%;">
              <div class="headerbg">
                <LucideAreaChart :size="25" style="margin-bottom: -5px;"></LucideAreaChart> 地块统计
                <small>&nbsp;
                  <a-tooltip title="大户数量(大于50亩被保险人)，合格大户(地块重叠，标的占比均符合)" :color="orange">
                    <Info :size="16" color="#ccc"></Info>
                  </a-tooltip>
                </small>

                <a-button type="link" primary style="position: absolute;right: 10px;" @click="open = true">
                  <div style="display: flex;align-items: center;">
                    <MoreHorizontal :size="18"></MoreHorizontal>&nbsp;地块详情
                  </div>
                </a-button>

              </div>

              <div id="echartsDK02" style="height:95%;"></div>

            </div>
            <div style="width: 100%;height: 40%;">
              <div class="headerbg">
                <LucideAreaChart :size="25" style="margin-bottom: -5px;"></LucideAreaChart> 机构统计
                <small>&nbsp;
                  <a-tooltip title="大户数量(大于50亩被保险人)，合格大户(地块重叠，标的占比均符合)" :color="orange">
                    <Info :size="16" color="#ccc"></Info>
                  </a-tooltip>
                </small>

                <!-- <a-button type="link" primary style="position: absolute;right: 10px;">
                  <div style="display: flex;align-items: center;">
                    <MoreHorizontal :size="18"></MoreHorizontal>&nbsp;更多
                  </div>
                </a-button> -->

              </div>

              <div id="echartsDK03" style="height:95%"></div>
            </div>


          </div>


        </div>



      </a-card>

    </div>

  </div>


  <!--图例-->

  <div class="tuli">
    <VerificationLegend v-if="activeKey == 2"></VerificationLegend>
    <AreaLegend v-if="activeKey == 1"></AreaLegend>
  </div>

  <!-- <div class="layer" v-if="activeKey == 2">
    <a-card title="图层控制" :hoverable="true" :size="small">
      <template #extra>
        <ChevronDownIcon v-if="layer" style="cursor: pointer;" @click="layer = !layer"></ChevronDownIcon>
        <ChevronUp v-else style="cursor: pointer;" @click="layer = !layer"></ChevronUp>
      </template>
      <div v-if="layer" style="line-height: 30px;">
        <label style="font-size: 16px;">遥感图层</label><br>
        <a-switch v-model:checked="radioValue" checked-children="显示" un-checked-children="关闭" /> 遥感种植分布<br><br>
      
        <p></p>
      </div>
    </a-card>
  </div> -->





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
  /* background-color: #fff; */
  z-index: 100000;

}





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

.tuli {
  position: absolute;
  left: 5px;
  bottom: 20px;
}

.layer {
  position: absolute;
  left: 210px;
  bottom: 20px;
}

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
  right: 0px;
  top: 90px;
  width: 550px;

  z-index: 1000;
  height: calc(100% - 100px);
  padding: 10px;
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



::v-deep .ant-tabs-tab .ant-tabs-tab-btn {
  width: 180px;
  text-align: center;
}


.tjfx th {
  font-size: 15px;
  color: #5a5959;
  text-align: right;

}

.tjfx td {
  font-size: 15px;
  color: #5a5959;


}


::v-deep .ant-divider-with-text {
  margin: 5px 0;
}

.deeff {

  color: #fc8452;
  color: #9a60b4;
  color: #ea7ccc;

  color: #91cc75;
  color: #fac858;
  color: #ee6666;
  color: #73c0de;
  color: #3ba272;
  color: #5470c6;
}


.headerbg {
  background: linear-gradient(0deg, rgba(89, 112, 196, 0.1), rgba(89, 112, 196, 0.01));
  padding: 5px;
  border-bottom: 1px solid #cccccc86;
  color: #5a5959;
  font-size: 18px;
  font-weight: 1000;

}

::v-deep .ant-page-header-heading-title {
  color: aliceblue;
}

::v-deep .ant-page-header-heading-sub-title {
  color: #ccc;
}


.xRightSquareShow {
  position: absolute;
  right: 12px;
  top: 120px;
  cursor: pointer;
  padding: 13px 14px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
  border-radius: 2px;
  color: #fff;
  border: 1px double #99999986;
}

.xSquareShow {
  position: absolute;
  left: 12px;
  top: 120px;
  cursor: pointer;
  padding: 13px 14px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
  border-radius: 2px;
  color: #fff;
  border: 1px double #99999986;
}
</style>
