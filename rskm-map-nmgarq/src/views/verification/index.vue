<script setup>
import * as echarts from "echarts"
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import SDMap from "@/views/map/index.vue";
import Header from "@/components/header/index.vue";
import {
  FoldersIcon,
  Info,
  LucideAreaChart,
  MapPinned,
  MoreHorizontal,
  PanelRightOpenIcon,
  SidebarOpen,
  X,
  Building2Icon,
  CheckCircle2Icon,
  CircleAlertIcon,
  LandPlotIcon,
  LucideSquareMousePointer,
  Download,
  EyeIcon,
  BookMarkedIcon,
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
// import html2canvas from 'html2canvas';
// import StateManager from "@/utils/state_manager";
import { treeLeftData } from "./data"
import { downloadAndReadExcel } from "@/utils/excel.js"

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
      top: '30%',
      right: 'right',
      textStyle: {
        fontSize: 16 // 图例文字大小
      }
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '80%'],

        avoidLabelOverlap: false,
        padAngle: 2,
        itemStyle: {
          borderRadius: 3
        },
        label: {
          show: true,
          //position: 'center',

        },
        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            // /  fontWeight: 'bold'
          }
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
    distance: 1,

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
      return e.value ? Number(e.value).toFixed(0) + '%' : ''
    },
    fontSize: 16,
    // color: 'green',
    // textBorderColor: '#999',
    rich: {
      name: {}
    }
  };

  option = {
    grid: {
      top: '8%',
      left: '10%',  // grid布局设置适当调整避免X轴文字只能部分显示
      right: '5%', // grid布局设置适当调整避免X轴文字只能部分显示
      bottom: '25%',

    },
    color: [
      "#91cc75",
      "#fac858",

      "#ea7ccc",
      "#5470c6",
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '保险覆盖率: {c0}<br />地块重叠率: {c1}',
    },
    legend: {
      // data: [],
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
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 16 // 文字大小
        },
      }

    ],
    xAxis: [
      {

        type: 'category',
        axisTick: { show: false },
        axisLabel: {
          show: true, // 是否显示刻度标签，默认显示
          interval: 0, // 坐标轴刻度标签的显示间隔，在类目轴中有效；默认会采用标签不重叠的策略间隔显示标签；可以设置成0强制显示所有标签；如果设置为1，表示『隔一个标签显示一个标签』，如果值为2，表示隔两个标签显示一个标签，以此类推。
          rotate: -60, // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠；旋转的角度从-90度到90度
          inside: false, // 刻度标签是否朝内，默认朝外
          margin: 6, // 刻度标签与轴线之间的距离
          //  formatter: '{value} Day', // 刻度标签的内容格式器
          fontSize: 14 // 文字大小
        },
        data: yAxis
      }
    ],
    series: [
    ]
  };

  if (!series2) {
    option.legend.data = ['保险覆盖率']
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


  } else {
    option.legend.data = ['保险覆盖率', '地块重叠率']
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
      name: '地块重叠率',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series'
      },
      data: series2
    })


  }


  option && myChart.setOption(option);
}

/**
 * 区域三图
 */
const loadEcharts03 = (yAxis, series1) => {



  var chartDom = document.getElementById('main03');
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
    distance: 1,

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
      return e.value ? Number(e.value).toFixed(0) + '%' : ''
    },
    fontSize: 16,
    // color: 'green',
    // textBorderColor: '#999',
    rich: {
      name: {}
    }
  };

  option = {
    grid: {
      top: '8%',
      left: '10%',  // grid布局设置适当调整避免X轴文字只能部分显示
      right: '5%', // grid布局设置适当调整避免X轴文字只能部分显示
      bottom: '25%',

    },
    color: [
      "#91cc75",
      "#fac858",
      "#ea7ccc",
      "#5470c6",
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (a) => {

        let hyjg = '';
        if (Number(a[0].data.value) < 30) {
          hyjg = '不足';
        } else if (Number(a[0].data.value) > 90) {
          hyjg = '超保';
        } else {
          hyjg = '合格';
          console.log(a)
        }
        return `保险覆盖率: ${a[0].data.value} %<br />核验结果: ${hyjg} `
      },
    },
    legend: {
      // data: [],
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
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          fontSize: 16 // 文字大小
        },
      }

    ],
    xAxis: [
      {

        type: 'category',
        axisTick: { show: false },
        axisLabel: {
          show: true, // 是否显示刻度标签，默认显示
          interval: 0, // 坐标轴刻度标签的显示间隔，在类目轴中有效；默认会采用标签不重叠的策略间隔显示标签；可以设置成0强制显示所有标签；如果设置为1，表示『隔一个标签显示一个标签』，如果值为2，表示隔两个标签显示一个标签，以此类推。
          rotate: -60, // 刻度标签旋转的角度，在类目轴的类目标签显示不下的时候可以通过旋转防止标签之间重叠；旋转的角度从-90度到90度
          inside: false, // 刻度标签是否朝内，默认朝外
          margin: 6, // 刻度标签与轴线之间的距离
          //  formatter: '{value} Day', // 刻度标签的内容格式器
          fontSize: 14 // 文字大小
        },
        data: yAxis,
      }
    ],
    series: [
    ]
  };


  //option.legend.data = ['承保覆盖率','asasdfas']
  option.series = [];
  option.series.push({
    //  name: '承保覆盖率',
    type: 'bar',
    barGap: 0,
    label: labelOption,
    emphasis: {
      focus: 'series'
    },
    data: series1
  })








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
    fontSize: 16,
    rich: {
      name: {}
    }
  };

  const grid = {
    left: 130,
    right: 30,
    top: 30,
    bottom: 50
  };
  option = {
    grid,
    color: [

      // "#ea7ccc",
      "#5470c6",
      //  "#73c0de",

      // "#fc8452",
      // "#9a60b4",
      "#3ba272",
      // "#ee6666",
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['合格大户', '大户数量'],
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
        name: '合格大户',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: hgdhValues
      }, {

        name: '大户数量',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: dhValues
      }

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
    bottom: 60
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
      data: ['合格数量', '大户数量'],
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
        name: '合格数量',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series'
        },
        data: data1
      },
      {
        name: '大户数量',
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
// baodanhao, jigou, "time", shuliang, baofei, xianzhong, dishi, quxian, xiangzhen, cun, qibao, zhongbao, rings, dkmj, cdmj, cdmjzb, cd, bdmj, bdzb, pass, sfz, bbxrmc, geom)
const columns = [
  {
    title: '保单号',
    dataIndex: 'baodanhao',
    key: 'baodanhao',
  },
  {
    title: '被保险人',
    dataIndex: 'bbxrmc',
    key: 'bbxrmc',
  },
  {
    title: '机构',
    dataIndex: 'jigou',
    key: 'jigou',
  },
  {
    title: '位置',
    dataIndex: 'dishi',
    key: 'dishi',
  },
  {
    title: '重叠',
    dataIndex: 'cd',
    key: 'cd',
  },
  // {
  //   title: '重叠面积',
  //   dataIndex: 'xiangzhen',
  //   key: 'xiangzhen',
  // },
  // {
  //   title: '村',
  //   dataIndex: 'cun',
  //   key: 'cun',
  // },
  {
    title: '起保',
    dataIndex: 'qibao',
    key: 'qibao',
  },
  {
    title: '终保',
    dataIndex: 'zhongbao',
    key: 'zhongbao',
  },
  {
    title: '遥感种植面积(亩)',
    dataIndex: 'bdmj',
    key: 'bdmj',
  },
  {
    title: '地块面积(亩)',
    dataIndex: 'dkmj',
    key: 'dkmj',
  },
  {
    title: '承保面积(亩)',
    dataIndex: 'shuliang',
    key: 'shuliang',
  },
  {
    title: '保险覆盖率',
    dataIndex: 'bdzb',
    key: 'bdzb',
  },
  {
    title: '是否一致',
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
        dataIndex: 'type',
        key: 'type',
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





/**
 * 加载数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const addTownByName = async (name) => {

  // clearGeomAll()


  let features = await api.get_table_by_filter(
    "china_wgs84_all",
    `and town_name in (${name}) and county_name in ('阿荣旗') GROUP BY town_name`,
    `ST_AsGeoJSON(ST_Union(geom)) as json,town_name`
  );

  // window.countylayer = [];
  let tfs = []
  console.log(features)
  features.forEach(feature => {
    let p = {
      town_name: feature.town_name,
      coverage: 0,
    }


    let hzBaseData = [
      { name: '阿荣旗林业局', mj: 8593, ygmj: 63957, fgl: 13.44, zt: '保障不足' },
      { name: '查巴奇鄂温克民族乡', mj: 98874, ygmj: 69895, fgl: 141.46, zt: '涉嫌超保' },
      { name: '得力其尔鄂温克民族乡', mj: 88061, ygmj: 97760, fgl: 90.08, zt: '涉嫌超保' },
      { name: '复兴镇', mj: 122110, ygmj: 140513, fgl: 86.90, zt: '正常' },
      { name: '霍尔奇镇', mj: 181851, ygmj: 239687, fgl: 75.87, zt: '正常' },
      { name: '六合镇', mj: 130997, ygmj: 224923, fgl: 58.24, zt: '正常' },
      { name: '那吉镇', mj: 7074, ygmj: 4660, fgl: 151.82, zt: '涉嫌超保' },
      { name: '三岔河镇', mj: 111598, ygmj: 153936, fgl: 72.50, zt: '正常' },
      { name: '向阳峪镇', mj: 110639, ygmj: 252189, fgl: 43.87, zt: '正常' },
      { name: '新发朝鲜民族乡', mj: 37209, ygmj: 62535, fgl: 59.50, zt: '正常' },
      { name: '兴安镇', mj: 153499, ygmj: 204302, fgl: 75.13, zt: '正常' },
      { name: '亚东镇', mj: 185965, ygmj: 184654, fgl: 100.71, zt: '涉嫌超保' },
      { name: '音河达斡尔鄂温克民族乡', mj: 68871, ygmj: 101572, fgl: 67.81, zt: '正常' },

    ]

    // 计算是否超保
    let hzBaseDataClone = hzBaseData.filter(item => item.name == p.town_name);
    console.log(hzBaseDataClone)
    p.rs = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.ygmj), 0);
    p.area = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.mj), 0);
    p.coverage = (p.area && p.rs) ? (p.area / p.rs * 100) : 0;

    //console.log(p)

    tfs.push({
      type: "Feature",
      geometry: JSON.parse(feature.json),
      properties: p
    })
  })



  let feature = features[0].json;
  let properties = {
    town_name: features[0].town_name,
    gid: 'GEOM' + (Math.random() * 10000000).toFixed(0)
  };

  drawGeomsOne(feature, properties);
  let bbox = getCoordinatesAndBbox(JSON.parse(feature));
  map.fitBounds(bbox, {
    padding: { top: 100, left: 600, right: 600, bottom: 100 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });



};


// 获取所有坐标并计算边界框
const getCoordinatesAndBbox = (features) => {
  let lng = [];
  let lat = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  // 遍历 GeoJSON 的 features
  [features].forEach(feature => {
    if (feature) {
      // 获取当前几何体的坐标
      const coords = [];
      if (feature.type === 'Polygon') {
        feature.coordinates[0].map(coord => {
          coords.push(coord)
        });
      } else if (feature.type === 'MultiPolygon') {
        feature.coordinates.forEach(polygon => {
          polygon[0].map(coord => {
            coords.push(coord)
          });
        });
      }

      coords.forEach(coord => {
        lng.push(coord[0]);
        lat.push(coord[1]);
      });
      // 更新边界框
      minX = Math.min(...lng);
      minY = Math.min(...lat);
      maxX = Math.max(...lng);
      maxY = Math.max(...lat);
    }
  });

  return [minX, minY, maxX, maxY]
}




/**
 * 加载视野
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const fitTownByName = async (name) => {

  // clearGeomAll()


  let features = await api.get_table_by_filter(
    "china_wgs84_all",
    `and town_name in (${name}) and county_name in ('阿荣旗') GROUP BY town_name`,
    `ST_AsGeoJSON(ST_Union(geom)) as json,town_name`
  );

  // window.countylayer = [];
  let tfs = []
  // console.log(features)
  // features.forEach(feature => {

  //   tfs.push({
  //     type: "Feature",
  //     geometry: JSON.parse(feature.json),

  //   })
  // })



  // if (activeKey.value == 1) {
  //   let feature = features[0].json;
  //   let properties = {
  //     town_name: features[0].town_name,
  //     gid: 'GEOM' + (Math.random() * 10000000).toFixed(0)
  //   };

  //   drawGeomsOne(feature, properties);


  // } else {
  //   drawGeomsLine(tfs)
  // }

  map.fitBounds(turf.bbox(JSON.parse(features[0].json)), {
    padding: { top: 100, left: 600, right: 600, bottom: 100 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
};




/**
 * 移除地图上的行政区边界图层
 */
const clearGeomOne = () => {
  map.getLayer("clickDrawGeomText") && map.removeLayer("clickDrawGeomText");
  map.getLayer("clickDrawGeomFillOut") && map.removeLayer("clickDrawGeomFillOut");
  map.getLayer("clickDrawGeomFill") && map.removeLayer("clickDrawGeomFill");
  map.getSource("clickDrawGeom") && map.removeSource("clickDrawGeom");

};


/**
 * 移除地图上的行政区边界图层
 */
const clearGeomAll = () => {
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
const drawGeomsOne = (data, property) => {



  clearGeomOne()
  // 判定颜色
  let color = "#fff"
  //添加图层
  map.addSource("clickDrawGeom", {
    type: "geojson",
    // lineMetrics: true, // 线渐变必须条件
    data: {
      "type": "Feature",
      "geometry": JSON.parse(data),
      "properties": property
    },
  });

  map.addLayer({
    id: "clickDrawGeomFillOut",
    type: "line",
    source: "clickDrawGeom",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color,
      "line-width": 10.5,
      "line-opacity": 0.6,

    },
  });






};

/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const drawGeoms = (data) => {



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
      "fill-opacity": 0.4,

      'fill-color': [
        'case',
        ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
        'rgba(248,200,94,1)',
        ['>', ['get', 'coverage'], 105],
        'RGB(236,102,103)',
        ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
        'RGB(144,204,120)',
        '#ccc',
      ],
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

      'line-color': '#fff',
      "line-width": 1.5,
      "line-opacity": 0.7,
    },
  });

  map.addLayer({
    id: "textLayer",
    type: "symbol",
    source: "adminGeom",
    layout: {
      "text-field": "{town_name}",
      "text-size": 18,
    },
    paint: {

      'text-color': '#fff',
      "text-halo-color": "#000",
      "text-halo-width": 1.5,
      "text-halo-blur": 0.8, // 文字轮廓模糊度
    },
  });







};


/**
 * 在地图上显示行政区边界
 * @param {string} data - GeoJSON格式的边界数据
 */
const drawGeomsLine = (data) => {
  map.addSource("adminGeomLine", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: data
    },
  });


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
      "line-width": 5.5,
      "line-opacity": 0.4,
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
    // if (activeKey.value == 1) {
    //   addEventArea(e)
    // } else {
    //   addEventDk(e)
    // }
    addEventArea(e)
  });

  map.on("click", "rskm_pt", async (e) => {
    // if (activeKey.value == 1) {
    //   addEventArea(e)
    // } else {
    //   addEventDk(e)
    // }
    addEventDk(e)
  });
})

const addEventArea = async (e) => {


  popup && popup.setHTML(undefined);
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

  map.flyTo({
    center: e.lngLat,
    speed: 1,
    curve: 1,
    easing(t) {
      return t;
    },
  });
  popupbig.setLngLat(e.lngLat).setHTML(text).addTo(map);
  //window.tgid = feature.properties.gid;
}


const addEventDk = async (e) => {


  popup && popup.setHTML("");
  popup && popup.setLngLat([0, 0]);

  map.getCanvas().style.cursor = "pointer";
  const feature = e.features[0];
  let text = await setPopup(feature.properties);

  map.setFilter("Highlight_DK_Line_Click", [
    "all",
    // ["in", "bbxrmc", feature.properties.bbxrmc],
    ["in", "baodanhao", feature.properties.baodanhao],
  ]);

  map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");
  map.fitBounds(turf.bbox(feature), {
    padding: { top: 200, left: 600, right: 600, bottom: 200 },
    linear: true,
    // easing: (t) => {
    //   return t * (1 - t);
    // },
  });
  // fitBox(feature);
  // map.flyTo({
  //   center: e.lngLat,
  //   // zoom: 7.5,
  //   speed: 1,
  //   curve: 1,
  //   easing(t) {
  //     return t;
  //   },
  // });
  popupbig.setLngLat(e.lngLat).setHTML(text).addTo(map);
  //window.tgid = feature.properties.gid;
}





/**
 * 设置弹出窗口内容
 * @async
 * @function
 * @param {Object} data - 要素数据
 * @returns {Promise<string|boolean>} 弹出窗口内容或如果未找到要素则返回 false
 */
const setPopup = async (info) => {
  console.log(info)

  if (!info) return false;

  let successData = info;
  let meginfo = {}

  meginfo.bdh = info.baodanhao || "";
  meginfo.province_city_county_town_village =
    (info.dishi || "") +
    (info.quxian || "") +
    (info.xiangzhen || "") +
    (info.cun || "");
  meginfo.bbxrmc = info.bbxrmc || "";
  meginfo.youxiao = info.youxiao || "";
  meginfo.bxjg = info.jigou || "";
  meginfo.xianzhong = info.xianzhong || "";
  meginfo.bbxrzjh = info.bbxrzjh || "";
  meginfo.bbxrdh = info.bbxrdh || "";
  meginfo.bxqj = successData.qibao + '-' + successData.zhongbao || "";

  meginfo.tbsl = successData.shuliang || 0;
  meginfo.v1 = successData.v1 || 0;
  meginfo.v2 = Number(successData.v2).toFixed(2) || 0;
  meginfo.v3 = successData.v3 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
  meginfo.v4 = info.cd == 0 ? "<div style=' color: #fff;background-color: #91cc75;'>通过</div>" : "<div style=' color: #fff;background-color: #ee6666;'>未通过</div>";
  meginfo.v5 = successData.v5 || 0;
  meginfo.v6 = Number(successData.v6).toFixed(2) || 0;
  meginfo.v7 = successData.v7 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
  meginfo.v8 = successData.v8 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
  meginfo.dkmj = info.dkmj ? Number(info.dkmj).toFixed(1) : 0;

  console.log(meginfo)
  meginfo.bdmj = info.bdmj ? Number(info.bdmj).toFixed(1) : "";
  meginfo.bdzb = Number(info.bdzb).toFixed(2);
  meginfo.dkcdl = Number(info.cdmjzb).toFixed(2) || 0;
  meginfo.cdmj = Number(meginfo.dkmj).toFixed(2) || 0;

  // ①地块面积合计（亩）	
  // ②地块面积合计/承保数量	
  // ③地块面积是否与承保数量一致？
  // ④是否无地块存在重叠问题？	
  // ⑤地块内玉米种植面积合计（亩）	1
  // ⑥地块内标的作物面积合计/承保数量	
  // ⑦玉米种植面积差异率是否达标？	
  // ⑧该大户的地块是否合格？

  let text = document.getElementById("text").innerHTML;


  for (let key in meginfo) {
    text = text.replace(`{${key}}`, meginfo[key])
  }

  return text;


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
    <table style="width:100%;border-collapse: collapse;letter-spacing: -1px; font-size: 18px;color:#5a5959"  title="区域核验" >
        <tr style="line-height:1.5;"><th style="text-align: right;width:180px;padding-right:5px">核验区域:</th><td >${data.properties.town_name}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">投保面积:</th><td >${data.properties.area ? Number(data.properties.area).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">遥感面积:</th><td >${data.properties.rs ? Number(data.properties.rs).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;padding-right:5px">地块与投保面积之比:</th><td >${parseInt(data.properties.coverage)}%</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: right;;padding-right:5px">是否超保:</th><td >${data.properties.coverage >= 105 ? "<div style='background-color:RGB(236,102,103);color:#000;padding:2px;border-radius:2px'>超保</div>" : "<div  style='background-color:RGB(147,207,122);color:#000;padding:2px;border-radius:2px'>未超保</div>"}</td><tr>
        </table>`


  return text
}

/**
 * 加载镇数据
 * @param {string} code - 行政区代码
 * @returns {Promise<void>}
 */
const addLayerByTowns = async (name) => {
  //console.log(String(code).substring(0, 4));
  let features = await api.get_table_by_filter(
    "china_wgs84_all",
    `and county_name in (${name}) GROUP BY  town_name`,
    `ST_AsGeoJSON(ST_Simplify(ST_Union(geom),0.001)) as json,town_name `
  );

  clearGeomAll();


  let ps = [];
  features.map((feature) => {
    console.log(feature)
    let p = {
      town_name: feature.town_name,
      gid: 'GEOM' + (Math.random() * 1000000).toFixed(0),
    }

    // let p = {
    //   town_name: feature.town_name,
    //   coverage: 0,
    // }


    let hzBaseData = [
      { name: '阿荣旗林业局', mj: 8593, ygmj: 63957, fgl: 13.44, zt: '保障不足' },
      { name: '查巴奇鄂温克民族乡', mj: 98874, ygmj: 69895, fgl: 141.46, zt: '涉嫌超保' },
      { name: '得力其尔鄂温克民族乡', mj: 88061, ygmj: 97760, fgl: 90.08, zt: '涉嫌超保' },
      { name: '复兴镇', mj: 122110, ygmj: 140513, fgl: 86.90, zt: '正常' },
      { name: '霍尔奇镇', mj: 181851, ygmj: 239687, fgl: 75.87, zt: '正常' },
      { name: '六合镇', mj: 130997, ygmj: 224923, fgl: 58.24, zt: '正常' },
      { name: '那吉镇', mj: 7074, ygmj: 4660, fgl: 151.82, zt: '涉嫌超保' },
      { name: '三岔河镇', mj: 111598, ygmj: 153936, fgl: 72.50, zt: '正常' },
      { name: '向阳峪镇', mj: 110639, ygmj: 252189, fgl: 43.87, zt: '正常' },
      { name: '新发朝鲜民族乡', mj: 37209, ygmj: 62535, fgl: 59.50, zt: '正常' },
      { name: '兴安镇', mj: 153499, ygmj: 204302, fgl: 75.13, zt: '正常' },
      { name: '亚东镇', mj: 185965, ygmj: 184654, fgl: 100.71, zt: '涉嫌超保' },
      { name: '音河达斡尔鄂温克民族乡', mj: 68871, ygmj: 101572, fgl: 67.81, zt: '正常' },

    ]

    // 计算是否超保
    let hzBaseDataClone = hzBaseData.filter(item => item.name == p.town_name);
    console.log(hzBaseDataClone)
    p.rs = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.ygmj), 0);
    p.area = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.mj), 0);
    p.coverage = (p.area && p.rs) ? (p.area / p.rs * 100) : 0;



    ps.push({
      type: "Feature",
      geometry: JSON.parse(feature.json),
      properties: p
    })
  })

  console.log(ps)
  drawGeoms(ps)
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
      padding: { top: 100, left: 600, right: 600, bottom: 100 },
      linear: true,
      // easing: (t) => {
      //   return t * (1 - t);
      // },
    });

  } else {
    clearGeomAll();


    let ps = [];
    console.log(features)
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
      //feature && drawGeoms(feature.json, p)

      ps.push({
        type: "Feature",
        geometry: JSON.parse(feature.json),
        properties: p
      })
    })
    drawGeoms(ps)
    fitCenter()




  }

};


// 初始化视野
const fitCenter = () => {
  map.flyTo({
    center: [123.17, 48.63],
    zoom: 8.5,
    speed: 1,
    curve: 2,
    easing(t) {
      return t;
    },
  });
};

let tongji = {
  bdh_count: ref("-"),
  dk_count: ref("-"),
  area_count: ref("-"),
  ct_bd: ref("-"),
  ct_dk: ref("-")
}




const expandedKeys = ref(['0-0']);
const selectedKeys = ref(['0-0']);


watch(selectedKeys, () => {
  //console.log(selectedKeys.value[0])

  switch (selectedKeys.value[0]) {
    case "0-0":
      loadLocalData();
      break;
    case "0-0-0":
      loadLocalData("那吉镇");
      break;
    case "0-0-1":
      loadLocalData("阿荣旗农牧业局");
      break;
    case "0-0-2":
      loadLocalData("向阳峪镇");
      break;
    case "0-0-3":
      loadLocalData("兴安镇");
      break;
    case "0-0-4":
      loadLocalData("三岔河镇");
      break;
    case "0-0-5":
      loadLocalData("得力其尔鄂温克民族乡");
      break;
    case "0-0-6":
      loadLocalData("音河达斡尔鄂温克民族乡");
      break;
    case "0-0-7":
      loadLocalData("阿荣旗林业局");
      break;
    case "0-0-8":
      loadLocalData("查巴奇鄂温克民族乡");
      break;
    case "0-0-9":
      loadLocalData("新发朝鲜民族乡");
      break;
    case "0-0-10":
      loadLocalData("霍尔奇镇");
      break;
    case "0-0-11":
      loadLocalData("亚东镇");
      break;
    case "0-0-12":
      loadLocalData("六合镇");
      break;
    case "0-0-13":
      loadLocalData("复兴镇");
      break;
    default:
      break;
  }


})

const activeKey = ref('1');

watch(activeKey, () => {
  header.value = "";
  selectedKeys.value = ['0-0'];
  fitCenter()
  clearGeomOne()
  clearGeomAll()

  activeKey.value == 1 && removeDkLayer()
  activeKey.value == 2 && addDkLayer()

  popup && popup.setHTML("");
  popup && popup.setLngLat([0, 0]);

  popupbig && popupbig.setHTML("");
  popupbig && popupbig.setLngLat([0, 0]);

  (activeKey.value == 1) && addLayerByTowns("'阿荣旗'")
  //fitTownByName
})

/**
 * 统计信息
 */

const cbmj = ref(0);
const ygmj = ref(0);
const bxfgl = ref(0);
const cddk = ref(0);
const cddk_val = ref(0);
const zcxz = ref(0);
const zcxz_val = ref(0);
const bzxz = ref(0);
const bzxz_val = ref(0);

/**
 * 获取区域数值
 */
const getArea = async () => {
  if (!procjet_2024_nmgarq_excel) {
    procjet_2024_nmgarq_excel = await api.get_data_tj("nmgarq_sql_1")
  }

  console.log(procjet_2024_nmgarq_excel)

  let initdata = procjet_2024_nmgarq_excel.filter((rows) => rows.name == (header.value ? header.value : '总计'));

  cbmj.value = Number(initdata[0].dkmj);
  ygmj.value = Number(initdata[0].bdmj);
  bxfgl.value = Number(ygmj.value / cbmj.value * 100).toFixed(2)

  zcxz.value = Number(initdata[0].bdsl).toFixed(0);
  bzxz.value = Number(initdata[0].dksl).toFixed(0);
  cddk.value = Number(initdata[0].cddk).toFixed(0);

  cddk_val.value = Number(Number(initdata[0].cddk) / bzxz.value * 100).toFixed(1);


  // 图表一
  let tbdata = [
    { value: cddk.value, name: '重叠' },
    { value: bzxz.value - cddk.value, name: '不重叠' },
  ]
  loadEcharts(tbdata)
}

let nmgarq_sql_2;
let nmgarq_sql_3;
/**
 * 覆盖率合格率
 */
const getFglHgl = async () => {

  let towns = [];
  let fgl = [];
  let hgl = [];
  if (header.value) {
    let data = [];
    if (!nmgarq_sql_3) {
      nmgarq_sql_3 = await api.get_data_tj("nmgarq_sql_2");
    }
    data = nmgarq_sql_3.filter(re => re.xiangzhen == header.value)
    console.log(data)
    data.filter((rows) => {
      towns.push(rows.cun)
      fgl.push(Number(rows.fgl).toFixed(2))
      hgl.push(Number(rows.cdl).toFixed(2))
    });
  } else {
    if (!nmgarq_sql_2) {
      nmgarq_sql_2 = await api.get_data_tj("nmgarq_sql_3")
    }
    nmgarq_sql_2.filter((rows) => {
      towns.push(rows.xiangzhen)
      fgl.push(Number(rows.fgl).toFixed(2))
      hgl.push(Number(rows.cdl).toFixed(2))
    });
  }


  console.log(nmgarq_sql_2)

  loadEcharts02(towns, fgl, hgl)
}


/**
 * 初始化图表
 * @param filter 
 */
const loadLocalData = (filter) => {
  header.value = filter;
  if (!header.value) {
    fitCenter()
  } else {
    addTownByName(`'${header.value}'`);
    (activeKey.value == 2) && fitTownByName(`'${header.value}'`);
  }


  // 右侧重载
  if (activeKey.value == 2) {
    getAnalysisDK("yghy_sql_3");

    header.value && getAnalysisEchars3("nmgarq_sql_8")
    !header.value && getAnalysisEchars2('yghy_sql_4')

    getAnalysisEchars4('yghy_sql_area_bxjg')
    getAnalysisEchars4('yghy_sql_6')
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
const getAnalysisDK = async (key) => {

  let data = await api.get_data_tj(
    key,
    header.value ? `and xiangzhen in ('${header.value}')` : '',
  );
  console.log(data[0])

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

  echartsDK01(wdkdhsl.value, dkhghs.value, dkbhghs.value);

};



let rightEcData = ref([])
/**
 * 图表统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars2 = async (key) => {
  console.log("getAnalysisEchars2")
  let data = await api.get_data_tj(
    key, header.value ? ` and xiangzhen in ('${header.value}')` : '');
  console.log(data)

  if (data) {
    let county = []
    let dhsl = []
    let dkhghs = []
    data.forEach(item => {
      county.push(item.county)
      dhsl.push(Number(item.dhsl))
      dkhghs.push(Number(item.dkhghs))
    });
    rightEcData.value = [county, dkhghs, dhsl];
    console.log(rightEcData.value)
    echartsDK02(...rightEcData.value);
  }
};




/**
 * 区域统计
 * @param key 
 * @param name 
 */
const getAnalysisEchars3 = async (key, where = "") => {

  let data = await api.get_data_tj(
    key,
    header.value ? ` and xiangzhen in('${header.value}')` : ''
  );
  console.log(data)

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

  let data = await api.get_data_tj(key, header.value ? ` and xiangzhen in('${header.value}')` : '');
  console.log(data)

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

let hzBaseData = [];


const getBxjg = () => {


  let data = [
    { name: '阿荣旗林业局', zc: 13.44 },
    { name: '查巴奇鄂温克民族乡', zc: 141.46 },
    { name: '得力其尔鄂温克民族乡', zc: 90.08 },
    { name: '复兴镇', zc: 86.90 },
    { name: '霍尔奇镇', zc: 75.87 },
    { name: '六合镇', zc: 58.24 },
    { name: '那吉屯农场', zc: 0.00 },
    { name: '那吉镇', zc: 151.82 },
    { name: '三岔河镇', zc: 72.50 },
    { name: '向阳峪镇', zc: 43.87 },
    { name: '新发朝鲜民族乡', zc: 59.50 },
    { name: '兴安镇', zc: 75.13 },
    { name: '亚东镇', zc: 100.71 },
    { name: '音河达斡尔鄂温克民族乡', zc: 67.81 },
    { name: '总计', zc: 66.01 }
  ]
  // let data = [
  //   { name: '国寿财', zc: 558969, bz: 2437, cb: 0 },
  //   { name: '太保', zc: 600918, bz: 38418, cb: 0 },
  // ]
  let bxjg = [];
  let zc = [];
  let bz = [];

  data.forEach((ca) => {

    let color = '';
    if (Number(ca.zc) < 30) {
      color = 'RGB(246,200,100)';
    } else if (Number(ca.zc) > 90) {
      color = 'RGB(236,102,103)';
    } else {
      color = 'RGB(157,223,131)';
    }
    zc.push({
      value: ca.zc,
      itemStyle: {
        color: color
      }
    });

    bxjg.push(ca.name)
  });


  loadEcharts03(bxjg, zc)
}



// 挂载
onMounted(() => {

  // 装载检索数据
  loadCount();
  loadTabel(1, 10);

  getAnalysisDK("yghy_sql_3");
  getAnalysisEchars2("yghy_sql_4");
  getAnalysisEchars4('yghy_sql_5');
  getAnalysisEchars4('yghy_sql_6');

  getArea();

  getFglHgl();

  getBxjg();

  /**
   * 基础数据加载
   */
  map && map.on("load", () => {
    addLayersYghy();
    loadEvent();

    //县界
    loadCounty("'阿荣旗'");
    // 镇界
    addLayerByTowns("'阿荣旗'");

    // addRester()
  })
})





/**
 * 地块浮动框
 * @param page 
 * @param size 
 * @param filter 
 */
const loadTabel = async (page, size, filter = "") => {
  let dkList = await api.get_page("procjet_2024_nmgarq_excel_dhdk", page, size, filter);
  console.log(dkList)
  // let arr = []
  // dkList.map((dk) => {
  //   arr.push(dk)
  // })
  dataSourceDk.value = dkList;

  let List = await api.get_page("procjet_2024_nmgarq_area", page, size, filter);
  console.log(List)
  // let arr = []
  // dkList.map((dk) => {
  //   arr.push(dk)
  // })
  dataSource.value = List;
}


/**
 * 隐藏地块图形
 */
const removeDkLayer = () => {
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
const addDkLayer = () => {
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

let procjet_2024_nmgarq_excel;

watch(header, () => {
  getArea()
  getFglHgl()
})


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
 * 获取分页
 */
const paginationArea = ref({
  pageSize: 10, // 每页显示10条数据
  total: 1, // 总数据条数
  responsive: true,
  //pageSizeOptions: false,
  showLessItems: true,
  showTotal: (total, range) => {
    return `${total} 条`;
  },
  onChange: (page) => {
    loadTabel(page, paginationArea.value.pageSize);
  },
});





/**
 * 数据总数
 * @param {*} filter 条件
 */
const loadCount = async (filter = "") => {
  const data = await api.get_count("procjet_2024_nmgarq_excel_dhdk", filter);
  pagination.value.total = Number(data[0].count);
  // console.log(data[0].count)

  const data2 = await api.get_count("procjet_2024_nmgarq_excel", filter);
  paginationArea.value.total = Number(data2[0].count);
  // console.log(data[0].count)
};


const lockDownHtml = ref()

/**
 * excel 下载
 */
const lockDownExcel = async (path, sheet) => {
  let data = await downloadAndReadExcel(path, sheet)
  lockDownHtml.value = data.join("<hr>");

  lockDownOpen.value = true;
}


const lockDownOpen = ref(false)

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
    <a-modal v-model:open="open" :title="activeKey == 1 ? '区域详情' : '大户详情'" @ok="open = !open" width="95%"
      :footer="null">
      <!-- baodanhao, jigou, "time", shuliang, baofei, xianzhong, dishi, quxian, xiangzhen, cun, qibao, zhongbao, rings, dkmj, cdmj, cdmjzb, cd, bdmj, bdzb, pass, sfz, bbxrmc, geom) -->

      <a-table :columns="columns" :data-source="dataSource" v-if="activeKey == 1" bordered size="middle"
        :pagination="paginationArea">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'dishi'">
            {{ record.dishi + record.quxian + record.xiangzhen + record.cun }}
          </template>
          <template v-if="column.key === 'shuliang'">
            {{ record.shuliang ? record.shuliang + ' 亩' : '' }}
          </template>
          <template v-if="column.key === 'dkmj'">
            {{ record.dkmj ? Number(record.dkmj).toFixed(2) + ' 亩' : '' }}
          </template>
          <template v-if="column.key === 'bdmj'">
            {{ record.bdmj ? Number(record.bdmj).toFixed(2) + ' 亩' : '' }}
          </template>
          <template v-if="column.key === 'bdzb'">
            {{ record.bdzb ? Number(record.bdzb).toFixed(2) + ' %' : '' }}
          </template>

          <template v-if="column.key === 'cd'">
            <a-tag color="red"> {{ record.cdmj }}亩</a-tag>
            <a-tag color="blue">{{ record.cdmjzb }}%</a-tag>
            <a-tag color="green" v-if="record.cd"> 重叠</a-tag>
            <a-tag color="red" v-else> 不重叠</a-tag>
          </template>
          <template v-if="column.key === 'pass'">
            <a-tag color="green" v-if="record.pass"> 一致</a-tag>
            <a-tag color="red" v-else> 不一致</a-tag>
          </template>
        </template>
      </a-table>
      <div v-if="activeKey == 2">
        <a-table :columns="columnsDk" :data-source="dataSourceDk" bordered size="middle" :pagination="pagination">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'city'">
              {{ record.quxian + record.xiangzhen + record.cun }}
            </template>
            <template v-if="column.key === 'cbsl'">
              {{ record.cbsl ? record.cbsl + ' 亩' : '' }}
            </template>
            <template v-if="column.key === 'v1'">
              {{ record.v1 ? Number(record.v1).toFixed(2) + ' 亩' : '' }}
            </template>
            <template v-if="column.key === 'v5'">
              {{ record.v5 ? Number(record.v5).toFixed(2) + ' 亩' : '' }}
            </template>
            <template v-if="column.key === 'v2'">
              {{ record.v2 ? Number(record.v2).toFixed(2) + ' %' : '' }}
            </template>
            <template v-if="column.key === 'v6'">
              {{ record.v6 ? Number(record.v6 * 100).toFixed(2) + ' %' : '' }}
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
              保险期间:{{ dayjs(record.bdscsj).format('YYYY/MM/DD') + '-' + dayjs(record.bdxgsj).format('YYYY/MM/DD') }}
            </template>

          </template>
        </a-table>
      </div>
    </a-modal>


    <!-- <a-button type="primary" @click="showModal">Open Modal of 1000px width</a-button> -->
    <a-modal v-model:open="lockDownOpen" width="90%" title="" :footer="null">
      <div v-html="lockDownHtml" class="lockDownHtml"></div>
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

            <!-- <div v-if="activeKey == 2" style="padding: 10px 0px;">
              <a-space>
                <label style="font-weight: 600;">被保险人查询：</label>
                <a-auto-complete :allowClear="true" v-model:value="valueSearch" :options="options" style="width: 290px;"
                  @select="onSelect" @search="onSearch" placeholder="请输入大户名称">

                  <template #option="item">
                    <div style="display: flex; justify-content: space-between">
                      <span>
                        {{ item.value }}

                      </span>


                      <span>{{ item.cun }} </span>


                      <span>{{ item.bbxrzjh }} </span>
                    </div>
                  </template>
                </a-auto-complete>

              </a-space>
            </div> -->

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

      <a-card size="small" title="" style="height: 99%;">

        <a-tabs v-model:activeKey="activeKey" type="card" style="position: absolute;top: 0;left: 0; ">
          <a-tab-pane key="1">
            <template #tab>
              <div style="font-size: 16px;display: flex;align-items: center;justify-content: center;">
                <LandPlotIcon :size="20"></LandPlotIcon>
                &nbsp;区域
              </div>
            </template>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <div style="font-size: 16px;display: flex;align-items: center;justify-content: center;">
                <LucideSquareMousePointer :size="20"></LucideSquareMousePointer>
                &nbsp;地块
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
          style="position: absolute;top: 50px;left: 0; height: calc(100% - 60px);width: 100%;padding:0 10px;">

          <div style="width: 100%; height: 100%;overflow-y: hidden;overflow-x: hidden;">
            <div style="width: 100%;height: 260px;">
              <div class="headerbg">
                <MapPinned :size="24" style="margin-bottom: -5px;"></MapPinned> {{ header ? header : '试点区县' }}
                <table style="position: absolute;right: 10px;margin-top: -30px">
                  <tr>
                    <td> <a-button type="link" primary>
                        <div style="display: flex;align-items: center;">
                          <BookMarkedIcon :size="16"></BookMarkedIcon>&nbsp;<a target="_blank"
                            :href="'/data/2024年阿荣旗玉米承保数据真实性遥感交叉核验报告V1.1.pdf'">查看核验报告</a>
                        </div>
                      </a-button>

                      <!-- <a :href="'/data/20241029_区域核验汇总_01.xlsx'">
                        <Download :size="16"></Download>
                      </a> -->

                    </td>
                    <td> <a-button type="link" primary>
                        <div style="display: flex;align-items: center;">
                          <Download :size="16"></Download>&nbsp; <a :href="'/data/阿荣旗遥感核验_区域数据_20241104.xlsx'"
                            download>下载核验报表</a>
                        </div>
                      </a-button>

                    </td>

                  </tr>

                </table>
              </div>
              <a-row :gutter="16">

                <a-col :span="8">

                  <a-statistic title="地块面积" :value="Number(cbmj).toFixed(0) + ' 亩'" class="demo-class">
                  </a-statistic>


                </a-col>
                <a-col :span="8">
                  <a-statistic title="遥感面积" :value="Number(ygmj).toFixed(0) + ' 亩'" class="demo-class">

                  </a-statistic>
                </a-col>
                <a-col :span="8">
                  <a-statistic title="保险覆盖率" :value="bxfgl" class="demo-class">
                    <template #suffix>
                      %
                    </template>
                  </a-statistic>
                </a-col>

                <a-col :span="6"><a-row :gutter="16">
                    <a-col :span="24">
                      <a-statistic title="保单数量" :value="zcxz + ' '" class="demo-class">
                      </a-statistic>
                    </a-col>

                    <a-col :span="24">
                      <a-statistic title="地块数量" :value="bzxz" class="demo-class">
                        <!-- <template #suffix>
                          <a-tag color="#f50">{{ cbxz_val }}%</a-tag>
                        </template> -->
                      </a-statistic>
                    </a-col>



                    <a-col :span="24">
                      <a-statistic title="重叠地块" :value="cddk + ' '" class="demo-class">
                        <template #suffix>
                          <a-tag color="RGB(248,200,94)">{{ cddk_val }}%</a-tag>
                        </template>
                      </a-statistic>
                    </a-col>


                  </a-row>
                </a-col>

                <a-col :span="18">
                  <div id="main" style="height:100%;"></div>
                </a-col>
              </a-row>

            </div>
            <div style="width: 100%; height: calc(100% - 260px);">
              <div style="width: 100%;height: 55%;">
                <div class="headerbg">

                  <LucideAreaChart :size="24" style="margin-bottom: -5px;"></LucideAreaChart> 区域统计<small>&nbsp;
                    <a-tooltip title="保险覆盖率(承保面积/遥感面积×100%))，承保合格率(非超保和不足面积占比)" :color="orange">
                      <Info :size="16" color="#ccc"></Info>
                    </a-tooltip>
                  </small>


                  <a-button type="link" primary style="position: absolute;right: 10px;" @click="open = true">
                    <div style="display: flex;align-items: center;">
                      <MoreHorizontal :size="18"></MoreHorizontal>&nbsp;区域详情
                    </div>
                  </a-button>

                </div>

                <div id="loadEcharts02" style="height:95%;"></div>

              </div>
              <div style="width: 100%;height: 45%;">
                <div class="headerbg">

                  <Building2Icon :size="24" style="margin-bottom: -5px;"></Building2Icon> 核验结果<small>&nbsp;
                    <a-tooltip title="合格(大于30%且小于90%)，超保(大于90%)，不足(小于30%)" :color="orange">
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
        </div>


        <!--地块核验-->
        <div v-if="activeKey == '2'"
          style="position: absolute;top: 50px;left: 0; height: calc(100% - 60px);width: 100%;padding:0 10px;">
          <div style="width: 100%;height: 300px;">
            <div class="headerbg">
              <MapPinned :size="25" style="margin-bottom: -5px;"></MapPinned> {{ header ? header : '试点区县' }}
              <!-- <a-tag color="red"> 重点乡镇 </a-tag> -->

              <table style="position: absolute;right: 10px;margin-top: -30px">
                <tr>
                  <!-- <td>
                    <a-button type="link" primary>
                      <div style="display: flex;align-items: center;">
                        <a @click="lockDownExcel('/data/20241029_地块核验汇总_01.xlsx', [0, 1])" download>地块核验汇总</a>

                      </div>
                    </a-button> <a :href="'/data/20241029_地块核验汇总_01.xlsx'">
                      <Download :size="16"></Download>
                    </a>
                  </td> -->
                  <td> <a-button type="link" primary>
                      <div style="display: flex;align-items: center;">
                        <Download :size="16"></Download>&nbsp; <a :href="'/data/阿荣旗遥感核验_地块数据_20241104.xlsx'"
                          download>下载核验报表</a>
                      </div>
                    </a-button>

                    <!-- <a :href="'/data/20241029_地块核验详情_01.xlsx'">
                      <Download :size="16"></Download>
                    </a>
                   -->
                  </td>
                </tr>
              </table>

            </div>


            <a-row :gutter="16">
              <a-col :span="11">
                <table class="tjfx">

                  <tr>
                    <th>遥感面积：</th>
                    <td>{{ tb_area ? Number(tb_area).toFixed(0) : '-' }}亩</td>
                  </tr>
                  <tr>
                    <th>地块面积：</th>
                    <td>{{ dk_area ? Number(dk_area).toFixed(0) : '-' }}亩</td>
                  </tr>
                  <tr>
                    <th>保单数量：</th>
                    <td>{{ dhsl }} 户</td>
                  </tr>
                  <!-- <tr>
                    <th>有地块大户数：</th>
                    <td>{{ ydkdhsl }} 户</td>
                  </tr> -->
                  <tr>
                    <th>地块合格户数：</th>
                    <td>{{ dkhghs }} 户</td>
                  </tr>
                  <tr>
                    <th>地块面积不符户数：</th>
                    <td>{{ dkmjbfs }} 户</td>
                  </tr>
                  <tr>
                    <th>地块重叠户数：</th>
                    <td>{{ dkcd }} 户</td>
                  </tr>
                  <tr>
                    <th>标的面积不符户数：</th>
                    <td>{{ bdmjbfhs }} 户</td>
                  </tr>

                </table>
              </a-col>
              <a-col :span="13">
                <div id="echartsDK01" style="height:97%;"></div>
              </a-col>
            </a-row>

          </div>
          <div style="width: 100%; height: calc(100% - 300px);">
            <div style="width: 100%;height: 60%;">
              <div class="headerbg">
                <LucideAreaChart :size="20" style="margin-bottom: -5px;"></LucideAreaChart> 地块统计
                <small>&nbsp;
                  <a-tooltip title="大户数量(大于50亩被保险人)，合格大户(地块重叠，标的占比均符合)" :color="orange">
                    <Info :size="16" color="#ccc"></Info>
                  </a-tooltip>
                </small>

                <a-button type="link" primary style="position: absolute;right: 10px;" @click="open = true">
                  <div style="display: flex;align-items: center;">
                    <MoreHorizontal :size="15"></MoreHorizontal>&nbsp;地块详情
                  </div>
                </a-button>

              </div>

              <div id="echartsDK02" style="height:99%;"></div>

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

              <div id="echartsDK03" style="height:99%"></div>
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


  <div id="text">
    <table class="text">
      <tr>
        <th colspan="10" style="font-size: 18px;text-align: left;padding: 5px;background-color: #fff">保单基本信息</th>
      </tr>
      <tr>

        <th>被保险人：</th>
        <td>{bbxrmc}</td>
      </tr>
      <tr>

        <th>保单号：</th>
        <td>{bdh}</td>
      </tr>
      <tr>

        <th>投保地点：</th>
        <td>{province_city_county_town_village} </td>
      </tr>
      <tr>

        <th>保险机构：</th>
        <td>{bxjg}</td>
      </tr>
      <tr>

        <th>险种名称：</th>
        <td>{xianzhong}</td>
      </tr>
      <tr>

        <th>投保数量：</th>
        <td>{tbsl}亩</td>
      </tr>
      <tr>

        <th>保险期间：</th>
        <td>{bxqj}</td>
      </tr>
      <!-- // ①地块面积合计（亩）	
  // ②地块面积合计/承保数量	
  // ③地块面积是否与承保数量一致？
  // ④是否无地块存在重叠问题？	
  // ⑤地块内玉米种植面积合计（亩）	
  // ⑥地块内标的作物面积合计/承保数量	
  // ⑦玉米种植面积差异率是否达标？	
  // ⑧该大户的地块是否合格？ -->

      <tr>
        <th colspan="10" style="font-size: 18px;text-align: left;padding: 5px;background-color: #fff">大户核验信息</th>
      </tr>
      <!-- <tr>

        <th>大户地块核验：</th>
        <td>{v8} </td>
      </tr> -->
      <!-- <tr>

        <th>地块面积核验：</th>
        <td>{v3}</td>
      </tr> -->
      <tr>

        <th>地块重叠核验：</th>
        <td> {v4}</td>
      </tr>
      <!-- <tr>

        <th>标的面积核验：</th>
        <td> {v7}</td>
      </tr> -->
      <!-- <tr>
        <th>地块总面积及占比：</th>
        <td>{v1}亩,{v2}%</td>
      </tr>
      <tr>

        <th>地块内标的面积及占比：</th>
        <td>{v5}亩,{v6}%</td>
      </tr> -->

      <tr>
        <th colspan="10" style="font-size: 18px;text-align: left;padding: 5px;background-color: #fff">当前地块信息</th>
      </tr>
      <tr>

        <th>地块面积：</th>
        <td>{dkmj}亩</td>
      </tr>
      <tr>

        <th>地块重叠面积及占比：</th>
        <td>{cdmj}亩,{dkcdl}%</td>
      </tr>
      <tr>

        <th>地块内标的面积及占比：</th>
        <td> {bdmj}亩,{bdzb}%</td>
      </tr>

    </table>
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
  top: 120px;
  /* background: linear-gradient(to bottom, rgba(19, 18, 18, 0.39), rgba(3, 11, 85, 0)); */

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

.tjfx {
  height: 240px
}


.tjfx th {
  font-size: 16px;
  color: #5a5959;
  text-align: left;
  letter-spacing: -1px;


}

.tjfx td {
  font-size: 18px;
  color: #5a5959;
  text-align: right;


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



.text th {
  border-collapse: collapse;
  font-size: 17px;
  text-align: right;
  background-color: #eeeded;
  border: 1px solid #99999986;


  letter-spacing: -1px;

  color: #2c2c2c;
}

.text td {
  border-collapse: collapse;
  font-size: 18px;
  text-align: left;
  border: 1px solid #99999986;
  max-width: 220px;
  letter-spacing: -1px;
  color: #2c2c2c;
}

.text {
  width: 400px;
  cursor: pointer;
}


.demo-class {
  border-bottom: 1px dotted rgb(215, 212, 212);
  padding: 0;
}

::v-deep .ant-statistic .ant-statistic-title {
  padding: 0;
  margin: 0;
  color: rgb(93, 91, 91);
  font-size: 16px;
}

::v-deep .ant-statistic {
  padding: 0 10px;
}

::v-deep .ant-statistic .ant-statistic-content {
  font-size: 22px;
  line-height: 30px;
}
</style>
