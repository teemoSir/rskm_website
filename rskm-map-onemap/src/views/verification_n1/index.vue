<script setup>
import * as echarts from "echarts"
import { ref, computed, watch, onMounted, nextTick, reactive, h } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import SDMap from "@/views/map/index.vue";
import Header from "@/components/header/index.vue";
import {
    FoldersIcon,
    PanelRightOpenIcon,
    SidebarOpen,
    X,
    CheckCircle2Icon,
    CircleAlertIcon,
    LandPlotIcon,
    LucideSquareMousePointer,
    AlignVerticalDistributeCenter,
    MapPinned
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import html2canvas from 'html2canvas';
import StateManager from "@/utils/state_manager";
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
        show: false,
        distance: app.config.distance,
        formatter: function (e) {
            return e.value ? Number(e.value).toFixed(0) : ''
        },
        fontSize: 10,
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
            bottom: '15%',

        },
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
                    fontSize: 14 // 文字大小
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
                    margin: 2, // 刻度标签与轴线之间的距离
                    //  formatter: '{value} Day', // 刻度标签的内容格式器
                    fontSize: 14 // 文字大小
                },
                data: yAxis
            }
        ],
        series: [
        ]
    };

    series2 = null;
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
        option.legend.data = ['保险覆盖率', '承保合格率']
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
        bottom: 50
    };
    const series = [
        '合格', '不足', '超保'
    ].map((name, sid) => {
        return {
            name,
            type: 'bar',
            stack: 'total',
            barWidth: '60%',

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
        //  formatter: '{c}%',
        // formatter: '{c}',
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

            //  "#73c0de",

            // "#fc8452",
            // "#9a60b4",
            "#3ba272",
            "#5470c6",
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
            },
            {

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
            "#3ba272",
            //"#5470c6",
            "#73c0de",
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


    // if (name == "'济阳区'") {
    //     name = "'济阳县'"
    // }

    // if (name == "'莱芜区'") {
    //     name = "'莱芜市'"
    // }

    // let features = await api.get_table_by_filter(
    //     "admin_2024_town",
    //     `and (f_xzqhmc in (${name}) or c_xzqmc in (${name})) `,
    //     `ST_AsGeoJSON(ST_Simplify(geom,0.0001)) as json,c_xzqdm,c_xzqmc,f_xzqhmc,f_xzqhdm,gid,t_xzqmc,p_xzqmc,t_xzqdm`
    // );

    let features = await api.get_table_by_filter(
        "china_wgs84_town",
        `and county_name in (${name}) `,
        `ST_AsGeoJSON(ST_Simplify(geom,0.0001)) as json,city_name,city_code,county_code,county_name,gid,province_code,town_code,province,town_name`
    );

    window.countylayer = [];
    let ps = []
    //console.log(features)
    features.forEach(feature => {

        let p = {
            city_name: feature.city_name,
            city_code: feature.city_code,
            county_name: feature.county_name,
            county_code: feature.county_code,
            gid: feature.gid,
            town_code: feature.town_code,
            town_name: feature.town_name,
            province: feature.province,
            province_code: feature.province_code,
        }


        // 计算是否超保
        let hzBaseDataClone = hzBaseData.filter(item => item.town == p.town_name);

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
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
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
                "text-field": "{town_name}",
                "text-size": 18,
            },
            paint: {
                "text-halo-blur": 1,
                'text-color': [
                    'case',
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
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
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
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

                'text-color': [
                    'case',
                    ['all', ['<', ['get', 'coverage'], 60], ['>', ['get', 'coverage'], 0]],
                    'rgba(248,200,94,1)',
                    ['>', ['get', 'coverage'], 105],
                    'RGB(236,102,103)',
                    ['all', ['<', ['get', 'coverage'], 105], ['>', ['get', 'coverage'], 60]],
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
                'line-color': 'red',
                "line-width": 5.5,
                "line-opacity": 0.8,
            },
        });

        map.addLayer({
            id: "adminGeomOutLabel",
            type: "symbol",
            source: "adminGeom",
            layout: {
                "text-field": "{town_name}",
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


    clearPopup()

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
        easing (t) {
            return t;
        },
    });
    popupbig.setLngLat(e.lngLat).setHTML(text).addTo(map);
    //window.tgid = feature.properties.gid;
}

const clearPopup = () => {
    popup && popup.setHTML("");
    popup && popup.setLngLat([0, 0]);
    popupbig && popupbig.setHTML(undefined);
    popupbig && popupbig.setLngLat([0, 0]);
}

const addEventDk = async (e) => {


    clearPopup()

    map.getCanvas().style.cursor = "pointer";
    const feature = e.features[0];
    let text = await setPopup(feature.properties);

    map.setFilter("Highlight_DK_Line_Click", [
        "all",
        ["in", "bbxrmc", feature.properties.bbxrmc],
        ["in", "bdh", feature.properties.bdh],
    ]);

    map.setLayoutProperty("Highlight_DK_Line_Click", "visibility", "visible");

    // fitBox(feature);
    map.flyTo({
        center: e.lngLat,
        // zoom: 7.5,
        speed: 1,
        curve: 1,
        easing (t) {
            return t;
        },
    });
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
    let data = await api.get_table_by_filter("procjet_2024_yghy_hz10_excel", `and bdh in('${info.bdh}') and bbxrmc in ('${info.bbxrmc}') `,
        ` gid, bdh, bbxrmc, bbxrzjh, bbxrdh, xianzhong, type_xl, bxjg_code, bxjg, shi, shi_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, bxqj, bdscsj, bdxgsj, v1, v2, v3, v4, v5, v6, v7, v8`);

    let successData = data[0] || {};
    let meginfo = {}

    meginfo.bdh = info.bdh || "";
    meginfo.province_city_county_town_village =
        (info.shi || "") +
        (info.quxian || "") +
        (info.zhen || "") +
        (info.cun || "");
    meginfo.bbxrmc = info.bbxrmc || "";
    meginfo.youxiao = info.youxiao || "";
    meginfo.bxjg = info.bxjg || "";
    meginfo.xianzhong = info.xianzhong || "";
    meginfo.bbxrzjh = info.bbxrzjh || "";
    meginfo.bbxrdh = info.bbxrdh || "";
    meginfo.bxqj = successData.bxqj.replace(/年|月|日/g, "/");

    meginfo.tbsl = successData.cbsl || 0;
    meginfo.v1 = successData.v1 || 0;
    meginfo.v2 = Number(successData.v2).toFixed(2) || 0;
    meginfo.v3 = successData.v3 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.v4 = successData.v4 == '1' ? "<div style=' color: #fff;background-color: #91cc75;'>通过</div>" : "<div style=' color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.v5 = successData.v5 || 0;
    meginfo.v6 = Number(successData.v6).toFixed(2) || 0;
    meginfo.v7 = successData.v7 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.v8 = successData.v8 == '1' ? "<div style='color: #fff;background-color: #91cc75;'>通过</div>" : "<div style='  color: #fff;background-color: #ee6666;'>未通过</div>";
    meginfo.dkmj = info.dkmj ? Number(info.dkmj).toFixed(1) : 0;

    console.log(meginfo)
    meginfo.bdmj = info.bdmj ? Number(info.bdmj).toFixed(1) : "";
    meginfo.bdzb = (Number(meginfo.bdmj) / Number(meginfo.dkmj) * 100).toFixed(2);
    meginfo.dkcdl = Number(info.dkcdl).toFixed(2) || 0;
    meginfo.cdmj = (Number(meginfo.dkmj) * Number(meginfo.dkcdl)).toFixed(2)

    // ①地块面积合计（亩）	
    // ②地块面积合计/承保数量	
    // ③地块面积是否与承保数量一致？
    // ④是否无地块存在重叠问题？	
    // ⑤地块内玉米种植面积合计（亩）	
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
    <table style="width:100%;letter-spacing: -1px; font-size: 18px;color:#000"  title="区域核验" >
        <tr style="line-height:1.5;"><th style="text-align: left;width:100px;padding-right:5px">核验区域:</th><td >${(data.properties.town_name || data.properties.name)}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: left;padding-right:5px">投保面积:</th><td >${data.properties.area ? Number(data.properties.area).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: left;padding-right:5px">遥感面积:</th><td >${data.properties.rs ? Number(data.properties.rs).toFixed(0) : 0}亩</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: left;padding-right:5px;" >地块与投保面积之比:</th><td>${parseInt(data.properties.coverage)}%</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: left;padding-right:5px;">保险机构:</th><td>${data.properties.bxjg}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: left;padding-right:5px;">遥感机构:</th><td>${data.properties.ygjg}</td><tr>
        <tr style="line-height:1.5;"><th style="text-align: left;;padding-right:5px">是否超保:</th><td >${data.properties.coverage >= 105 ? "超保" : "未超保"}</td><tr>
        </table>`;

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
        `ST_AsGeoJSON(ST_Simplify(geom,0.1)) as json,city_code,city_name,county_code,gid,name,province_name`
    );

    map.fitBounds(turf.bbox(JSON.parse(features[0].json)), {
        padding: { top: 100, left: 600, right: 600, bottom: 100 },
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
            padding: { top: 100, left: 600, right: 600, bottom: 100 },
            linear: true,
            // easing: (t) => {
            //   return t * (1 - t);
            // },
        });

        // map.setFilter("admin_2024_county", [
        //     "all",
        //     ["==", ['get', "name"], '济阳区'],
        //   ]);
        // map.setPaintProperty('admin_2024_county', 'fill-color',
        //   [
        //     'case',
        //     ["==", ['get', "name"], '高青县'],
        //     'red',
        //     'blue'
        //   ]
        // );
    } else {
        goGeomUn();

        window.countylayer = [];

        let featuresList = [];
        features.map((feature) => {
            let properties = {
                city_code: feature.city_code,
                city_name: feature.city_name,
                county_code: feature.county_code,
                gid: feature.gid,
                name: feature.name,
                province_name: feature.province_name,
                pass: feature.pass,
            }

            // 计算是否超保

            let hzBaseDataClone = hzBaseData.filter(item => item.county === properties.name).filter(item => item.version === 1);
            // console.log(hzBaseData)
            // console.log(hzBaseDataClone)
            properties.rs = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.rs_area), 0);
            properties.area = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.i_area), 0);
            properties.coverage = (properties.area && properties.rs) ? (properties.area / properties.rs * 100) : 0;
            properties.bxjg = [...new Set(hzBaseDataClone.map(item => item.bxjg).filter(item => item !== null))].join(",");
            properties.ygjg = hzBaseDataClone[0] ? hzBaseDataClone[0].ygjg : "";

            countylayer.push(properties)
            //feature && goGeom(feature.json, p)

            featuresList.push({
                type: "Feature",
                geometry: JSON.parse(feature.json),
                properties: properties
            })
        })
        goGeom(featuresList)

        fitCenter()




    }

};

/**
 * 加载县级数据
 * @param {string} code - 市级行政区代码
 * @returns {Promise<void>}
 */
const loadCountyV2 = async (name) => {

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

        // map.setFilter("admin_2024_county", [
        //     "all",
        //     ["==", ['get', "name"], '济阳区'],
        //   ]);
        // map.setPaintProperty('admin_2024_county', 'fill-color',
        //   [
        //     'case',
        //     ["==", ['get', "name"], '高青县'],
        //     'red',
        //     'blue'
        //   ]
        // );
    } else {
        goGeomUn();

        window.countylayer = [];

        let ps = [];
        features.map((feature) => {
            let properties = {
                city_code: feature.city_code,
                city_name: feature.city_name,
                county_code: feature.county_code,
                gid: feature.gid,
                name: feature.name,
                province_name: feature.province_name,
                pass: feature.pass,
            }

            // 计算是否超保
            let hzBaseDataClone = hzBaseData.filter(item => item.county === properties.name).filter(item => item.version === 2);


            properties.rs = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.rs_area), 0);
            properties.area = hzBaseDataClone.reduce((acc, item) => Number(acc) + Number(item.i_area), 0);
            properties.coverage = (properties.area && properties.rs) ? (properties.area / properties.rs * 100) : 0;
            properties.bxjg = [...new Set(hzBaseDataClone.map(item => item.bxjg).filter(item => item !== null))].join(",");
            properties.ygjg = hzBaseDataClone[0].ygjg;

            countylayer.push(properties)
            //feature && goGeom(feature.json, p)

            ps.push({
                type: "Feature",
                geometry: JSON.parse(feature.json),
                properties: properties
            })
        })
        goGeom(ps)
        fitCenter()




    }

};



// 初始化视野
const fitCenter = () => {
    map.flyTo({
        center: [119.207, 36.79],
        zoom: 7.3,
        speed: 1,
        curve: 2,
        easing (t) {
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


const tileH1 = ref(treeLeftData[0].children[0].title)
const tileSmall = ref(treeLeftData[0].children[0].date);

const expandedKeys = ref(['0-0']);
const selectedKeys = ref(['0-0']);


watch(selectedKeys, (e) => {
    console.log(selectedKeys)
    clearPopup()

    switch (selectedKeys.value[0]) {
        case "0":
            tileH1.value = treeLeftData[0].children.filter(item => item.key == "0-0")[0].title;
            tileSmall.value = treeLeftData[0].children.filter(item => item.key == "0-0")[0].date;
            loadLocalData();
            break;
        case "0-0":
            tileH1.value = treeLeftData[0].children.filter(item => item.key == "0-0")[0].title;
            tileSmall.value = treeLeftData[0].children.filter(item => item.key == "0-0")[0].date;
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
        case "0-1":

            tileH1.value = treeLeftData[0].children.filter(item => item.key == "0-1")[0].title;
            tileSmall.value = treeLeftData[0].children.filter(item => item.key == "0-1")[0].date;

            loadLocalDataV2();
            break;
        case "0-1-0":
            loadLocalDataV2("济阳区");
            break;
        case "0-1-1":
            loadLocalDataV2("莱芜区");
            break;
        case "0-1-2":
            loadLocalDataV2("桓台县");
            break;
        case "0-1-3":
            loadLocalDataV2("高青县");
            break;
        case "0-1-4":
            loadLocalDataV2("海阳市");
            break;
        case "0-1-5":
            loadLocalDataV2("招远市");
            break;
        case "0-1-6":
            loadLocalDataV2("汶上县");
            break;
        case "0-1-7":
            loadLocalDataV2("冠县");
            break;
        case "0-1-8":
            loadLocalDataV2("东阿县");
            break;
        case "0-1-9":
            loadLocalDataV2("无棣县");
            break;
        default:
            break;
    }

    setTimeout(() => {
        reloadEChats()
    }, 500)

})






/**
 * 右侧默认菜单
 */
const activeKey = ref('1');

watch(activeKey, () => {
    header.value = "";
    selectedKeys.value = ['0-0'];
    setTimeout(() => {
        loadLocalData()
        if (activeKey.value == 2) {
            // 地块统计图
            reloadEChats()
        } else {
            removeLayerDk()
        }
    }, 500)
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



const loadDataRight = async (filter) => {

    // 地块第二个柱状图
    if (!header.value) {
        await getAnalysisEchars2("yghy_sql_4")
        await getAnalysisEchars4('yghy_sql_6')
    } else {
        // 图表三统计
        await getAnalysisEchars3('yghy_sql_5', `and quxian in ('${filter}')`);
        await getAnalysisEchars4('yghy_sql_6', `and quxian in ('${filter}')`);
    }
    // 地块概况及饼图查询
    !filter && await getAnalysisDK("yghy_sql_3")
    filter && await getAnalysisDK("yghy_sql_3", `and quxian in ('${filter}')`)
}

const loadDataRightV2 = async (filter) => {

    // 地块第二个柱状图
    if (!header.value) {
        await getAnalysisEchars2("yghy_sql_44")
        await getAnalysisEchars4('yghy_sql_66')
    } else {
        // 图表三统计
        await getAnalysisEchars3('yghy_sql_55', `and quxian in ('${filter}')`);
        await getAnalysisEchars4('yghy_sql_66', `and quxian in ('${filter}')`);
    }
    // 地块概况及饼图查询
    !filter && await getAnalysisDK("yghy_sql_33")
    filter && await getAnalysisDK("yghy_sql_33", `and quxian in ('${filter}')`)
}




const loadLayers = (filter) => {
    if (!filter) {
        loadCounty("'东阿县','济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','无棣县'");
    } else {
        loadCounty("'" + filter + "'");
        (activeKey.value == 1) && loadTown("'" + filter + "'");
    }
}



const loadLayersV2 = (filter) => {
    if (!filter) {
        loadCountyV2("'东阿县','济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','无棣县'");
    } else {
        loadCountyV2("'" + filter + "'");
        (activeKey.value == 1) && loadTown("'" + filter + "'");
    }
}

/**
 * 初始化图表
 * @param filter 
 */
const loadLocalData = (filter) => {
    header.value = filter;
    //console.log(filter)
    loadDataRight(filter)

    goGeomUn()

    activeKey.value == 1 ? loadLayers(header.value) : (loadLayerDk(), !header.value ? fitCenter() : (loadCountyFit(`'${header.value}'`), loadTown(`'${header.value}'`)));


    // 初始化
    [cbmj, ygmj, bxfgl, cbxz, cbxz_val, zcxz, zcxz_val, bzxz, bzxz_val].forEach(ref => ref.value = 0);


    // console.log(hzBaseData, hzBaseData.length, filter)
    if (!hzBaseData) return false;


    let hzBaseDataClone;
    if (header.value) {
        hzBaseDataClone = hzBaseData.filter(item => item.county == header.value).filter(item => item.version == 1);
    } else {
        hzBaseDataClone = hzBaseData.filter(item => item.version == 1);;
    }
    // console.log(hzBaseDataClone)

    let i_coverage = 0;
    for (const hz in hzBaseDataClone) {
        cbmj.value += Number(hzBaseDataClone[hz].i_area || 0);
        ygmj.value += Number(hzBaseDataClone[hz].rs_area || 0);
        i_coverage += Number(hzBaseDataClone[hz].i_coverage || 0);
        cbxz.value += Number(hzBaseDataClone[hz].i_coverage || 0) > 1.05 ? 1 : 0;
        zcxz.value += (Number(hzBaseDataClone[hz].i_coverage || 0) <= 1.05 && Number(hzBaseDataClone[hz].i_coverage || 0) > 0.60) ? 1 : 0;
        bzxz.value += Number(hzBaseDataClone[hz].i_coverage || 0) <= 0.60 ? 1 : 0;
    }
    // 覆盖率
    bxfgl.value = Number(i_coverage * 100 / hzBaseDataClone.length).toFixed(2);

    //超保乡镇
    cbxz_val.value = Number(cbxz.value / hzBaseDataClone.length * 100).toFixed(2);

    //正常乡镇
    zcxz_val.value = Number(zcxz.value / hzBaseDataClone.length * 100).toFixed(2);

    //不足乡镇
    bzxz_val.value = Number(bzxz.value / hzBaseDataClone.length * 100).toFixed(2);



    // 图表一
    let tbdata = [
        { value: Number(cbxz.value), name: '超保' },
        { value: Number(zcxz.value), name: '正常' },
        { value: Number(bzxz.value), name: '不足' },
    ]
    loadEcharts(tbdata)



    loadDataHgl()


    // 图表三
    // console.log(header.value)
    if (!header.value) {
        console.log(header.value)
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
            //  console.log(data)
            // loadEcharts03(bxjg, [zc, bz, cb])
        })


        let data = [
            { name: '安华', zc: 5, bz: 1, cb: 0 },
            { name: '国寿财', zc: 17, bz: 1, cb: 0 },
            { name: '平安山东', zc: 4, bz: 0, cb: 0 },
            { name: '人保', zc: 32, bz: 9, cb: 8 },
            { name: '太保', zc: 19, bz: 6, cb: 0 },
            { name: '太平', zc: 9, bz: 6, cb: 0 },
            { name: '中华', zc: 24, bz: 3, cb: 4 },
        ]

        data.forEach((ca) => {
            if (ca.zc >= 0 && ca.bz >= 0 && ca.cb >= 0) {
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

        // console.log(bxjg, [zc, bz, cb])

    }

}



/**
 * 初始化图表
 * @param filter 
 */
const loadLocalDataV2 = (filter) => {
    header.value = filter;
    loadDataRightV2(filter)

    goGeomUn()


    activeKey.value == 1 ? loadLayers(header.value) : (loadLayerDk(), !header.value ? fitCenter() : (loadCountyFit(`'${header.value}'`), loadTown(`'${header.value}'`)));



    // 初始化
    [cbmj, ygmj, bxfgl, cbxz, cbxz_val, zcxz, zcxz_val, bzxz, bzxz_val].forEach(ref => ref.value = 0);


    // console.log(hzBaseData, hzBaseData.length, filter)
    if (!hzBaseData) return false;


    let hzBaseDataClone;
    if (header.value) {
        hzBaseDataClone = hzBaseData.filter(item => item.county == header.value).filter(item => item.version == 2);
    } else {
        hzBaseDataClone = hzBaseData.filter(item => item.version == 2);;
    }
    // console.log(hzBaseDataClone)

    let i_coverage = 0;
    for (const hz in hzBaseDataClone) {
        cbmj.value += Number(hzBaseDataClone[hz].i_area || 0);
        ygmj.value += Number(hzBaseDataClone[hz].rs_area || 0);
        i_coverage += Number(hzBaseDataClone[hz].i_coverage || 0);
        cbxz.value += Number(hzBaseDataClone[hz].i_coverage || 0) > 1.05 ? 1 : 0;
        zcxz.value += (Number(hzBaseDataClone[hz].i_coverage || 0) <= 1.05 && Number(hzBaseDataClone[hz].i_coverage || 0) > 0.60) ? 1 : 0;
        bzxz.value += Number(hzBaseDataClone[hz].i_coverage || 0) <= 0.60 ? 1 : 0;
    }
    // 覆盖率
    bxfgl.value = Number(i_coverage * 100 / hzBaseDataClone.length).toFixed(2);

    //超保乡镇
    cbxz_val.value = Number(cbxz.value / hzBaseDataClone.length * 100).toFixed(2);

    //正常乡镇
    zcxz_val.value = Number(zcxz.value / hzBaseDataClone.length * 100).toFixed(2);

    //不足乡镇
    bzxz_val.value = Number(bzxz.value / hzBaseDataClone.length * 100).toFixed(2);



    // 图表一
    let tbdata = [
        { value: Number(cbxz.value), name: '超保' },
        { value: Number(zcxz.value), name: '正常' },
        { value: Number(bzxz.value), name: '不足' },
    ]
    loadEcharts(tbdata)



    loadDataHglV2()


    // 图表三
    // console.log(header.value)
    if (!header.value) {
        // console.log(header.value)
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

            //  console.log(data)
        })


        let data = [
            { name: '安华', zc: 5, bz: 1, cb: 0 },
            { name: '国寿财', zc: 17, bz: 1, cb: 0 },
            { name: '平安山东', zc: 4, bz: 0, cb: 0 },
            { name: '人保', zc: 32, bz: 9, cb: 8 },
            { name: '太保', zc: 19, bz: 6, cb: 0 },
            { name: '太平', zc: 9, bz: 6, cb: 0 },
            { name: '中华', zc: 24, bz: 3, cb: 4 },
        ]

        data.forEach((ca) => {
            if (ca.zc >= 0 && ca.bz >= 0 && ca.cb >= 0) {
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

        // console.log(bxjg, [zc, bz, cb])

    }

}



const loadDataHgl = () => {
    // 图表二
    let countys = ['济阳区', '莱芜区', '桓台县', '高青县', '海阳市', '招远市', '汶上县', '冠县', '东阿县', '无棣县'];
    //   console.log(header.value)
    if (!header.value) {
        let fgl = [];
        let hgl = [];
        countys.map((ca) => {
            // 覆盖率
            let sa = hzBaseData.filter(item => item.county == ca)
            let totalIcoverage = sa.reduce((total, item) => total + Number(item.i_coverage || 0), 0);
            fgl.push(Number(totalIcoverage * 100 / sa.length).toFixed(0));

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
        let sa = hzBaseData.filter(item => item.county == header.value)
        sa.forEach((s) => {
            towns.push(s.town)
            fgl.push(s.i_coverage * 100)
            hgl.push(0)

        })

        loadEcharts02(towns, fgl, hgl)
    }
}

const loadDataHglV2 = () => {
    // 图表二
    let countys = ['济阳区', '莱芜区', '桓台县', '高青县', '海阳市', '招远市', '汶上县', '冠县', '东阿县', '无棣县'];
    //  console.log(header.value)
    if (!header.value) {
        let fgl = [];
        let hgl = [];
        countys.map((ca) => {
            // 覆盖率
            let sa = hzBaseData.filter(item => item.county == ca).filter(item => item.version == 2)
            let totalIcoverage = sa.reduce((total, item) => total + Number(item.i_coverage || 0), 0);
            fgl.push(Number(totalIcoverage * 100 / sa.length).toFixed(0));

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
        let sa = hzBaseData.filter(item => item.county == header.value).filter(item => item.version == 2)
        sa.forEach((s) => {
            towns.push(s.town)
            fgl.push(s.i_coverage * 100)
            hgl.push(0)

        })

        loadEcharts02(towns, fgl, hgl)
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
    //console.log(data)

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
    let data = await api.get_table_by_filter("procjet_2024_yghy_area_excel", "", "gid, city, city_code, county, county_code, town, town_code, jg_count, bxjg, fbxjg, i_area, rs_area, i_coverage, hg, pass, ygjg, exprot_date, version, cun, cun_code, type")


    data.length > 0 && (hzBaseData = data);
    dataSource.value = hzBaseData;
    loadDataHgl()
}



// 挂载
onMounted(() => {

    // 装载检索数据
    loadCount();
    loadTabel(1, 10);
    LoadHzBaseData();
    getAnalysisEchars2("yghy_sql_4")
    getAnalysisEchars4('yghy_sql_6')
    getAnalysisDK("yghy_sql_3")

    nextTick(() => {

        setTimeout(() => {
            loadLocalData()
        }, 1000)
        map && loadEvent();
        /**
         * 基础数据加载
         */
        map && map.on("load", () => {

            addLayersYghy()
            loadCounty("'东阿县','济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','无棣县'");
        })

    })
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
            "procjet_2024_yghy_hz10_county",
            ` and bbxrmc like '%25${searchText}%25'`,
            "	gid, ST_AsGeoJSON(geom) as geom,bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao, dkmj, bdmj, layer, cbsl, dkcdl, dkbcd, v8, v3, v4, v7, ygjg");
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
 * 数据总数
 * @param {*} filter 条件
 */
const loadCount = async (filter = "") => {
    const data = await api.get_count("procjet_2024_yghy_hz10_excel", filter);
    pagination.value.total = Number(data[0].count);
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
        <SDMap :MapToolPosition="{ top: '160px', right: '12px' }"></SDMap>
    </div>

    <!-- 页面 -->
    <div class="page">
        <div style="position: absolute;top: 100px;left: 50%; z-index: 1000;margin-left: -275px;">
            <h1 style="font-family: 'FZZongYi-M05'; text-align: center;color: #fff;">
                <span style="text-shadow: 2px 2px 2px #000;">{{ tileH1 }} </span>
                <a-tag color="#108ee9">{{ tileSmall }}截止</a-tag>
            </h1>
        </div>

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
                <a-table :columns="columnsDk" :data-source="dataSourceDk" bordered size="middle"
                    :pagination="pagination">
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
                            {{ record.v2 ? record.v2 + ' %' : '' }}
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

        <a-modal v-model:open="lockDownOpen" width="90%" title="" :footer="null">
            <div v-html="lockDownHtml" class="lockDownHtml"></div>
        </a-modal>

        <!-- 左侧菜单栏 -->

        <div class="xSquareShow" v-show="!xSquareShow" @click="xSquareShow = true">
            <a-tooltip placement="right">
                <template #title>
                    <span>显示菜单</span>
                </template>
                <SidebarOpen :size="18" color="#ccc"></SidebarOpen>
            </a-tooltip>

        </div>
        <div class="left-card" v-show="xSquareShow">

            <a-row :gutter="16">
                <a-col :span="24">
                    <a-card size="small" title="">


                        <p style="border-bottom: 1px solid #ccc;">
                            <label style="font-size: 16px;font-weight: 1000;">
                                <FoldersIcon style="margin-bottom: -5px;"></FoldersIcon>
                                <span
                                    style="font-family: FZZongYi-M05;font-weight: normal;padding-left: 5px;">遥感核验</span>

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
                                <label style="font-weight: 600;">查询：</label>
                                <a-auto-complete :allowClear="true" v-model:value="valueSearch" :options="options"
                                    style="width: 180px;" @select="onSelect" @search="onSearch" placeholder="请输入大户名称">

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
                        </div>

                        <a-directory-tree v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys"
                            show-icon show-line default-expand-all :tree-data="treeLeftData">

                            <template #icon="{ key, selected, dataRef }">
                                <template v-if="dataRef.isPass === true && key != '0-0'">

                                    <div style="float: left;margin-left: 100px;;width: 100px;">
                                        <a-tooltip placement="right">
                                            <template #title>{{ dataRef.title }}完成核验</template>
                                            <CheckCircle2Icon color="green" :size="16"></CheckCircle2Icon>
                                        </a-tooltip>
                                    </div>
                                </template>
                                <template v-if="dataRef.isPass === false && key != '0-0'">

                                    <div style="float: left;margin-left: 100px;width: 100px;">

                                        <a-tooltip placement="right">
                                            <template #title>{{ dataRef.title }}暂未完成</template>
                                            <CircleAlertIcon color="red" :size="16"></CircleAlertIcon>
                                        </a-tooltip>
                                    </div>
                                </template>
                            </template>


                        </a-directory-tree>


                        <!-- <a-alert message="提示：2024年9月30日截止" type="success" show-icon /> -->
                    </a-card>
                </a-col>


            </a-row>



        </div>

        <!-- 中间 -->
        <div class="center-card">
        </div>


        <!--右侧统计栏-->

        <div class="xRightSquareShow" @click="xRightSquareShow = true">
            <a-tooltip placement="left">
                <template #title>
                    <span>显示统计栏</span>
                </template>
                <PanelRightOpenIcon :size="18" color="#ccc"></PanelRightOpenIcon>
            </a-tooltip>
        </div>
        <div class="right-card" v-show="xRightSquareShow">
            <a-tooltip placement="left">
                <template #title>
                    <span>隐藏统计栏</span>
                </template>
                <X style="float: right;cursor: pointer;z-index: 10000;position: absolute;right: 25px;top: 25px;"
                    color="#999" @click="xRightSquareShow = false">
                </X>
            </a-tooltip>

            <a-card size="small" title="" style="border: 0; height: 48px;">

                <a-tabs v-model:activeKey="activeKey" style="position: absolute;top: 0;left: 0; z-index: 10000;">
                    <a-tab-pane key="1">
                        <template #tab>
                            <div
                                style="font-size: 1rem;display: flex;align-items: center;justify-content: center;font-family: 'FZZongYi-M05';">
                                <!-- <LandPlotIcon :size="20"></LandPlotIcon> -->
                                区域
                            </div>
                        </template>
                    </a-tab-pane>
                    <a-tab-pane key="2">
                        <template #tab>
                            <div
                                style="font-size: 1rem;display: flex;align-items: center;justify-content: center;font-family: 'FZZongYi-M05';">
                                <!-- <LucideSquareMousePointer :size="20"></LucideSquareMousePointer> -->
                                地块


                            </div>
                        </template>
                    </a-tab-pane>
                </a-tabs>

            </a-card>

            <a-card size="small" title="" style="height: calc(100% - 35px); margin-top: 3px;">
                <!--区域核验-->
                <div v-show="activeKey == '1'"
                    style="position: absolute;top: 0;left: 0; height: calc(100% - 60px);width: 100%;padding:0 10px;">

                    <div style="width: 100%; height: 100%;overflow-y: hidden;overflow-x: hidden;">
                        <div style="width: 100%;height: 260px;">
                            <div class="headerbg">
                                <AlignVerticalDistributeCenter style="margin-bottom: -5px;" />
                                <!-- <MapPinned :size="24" style="margin-bottom: -5px;"></MapPinned> -->

                                {{ header ? header :
                                    '试点区县' }}
                                <table style="position: absolute;right: 10px;margin-top: -30px">
                                    <tr>
                                        <td> <a-button type="link" primary>
                                                <div style="display: flex;align-items: center;">
                                                    <a @click="lockDownExcel('/data/20241029_区域核验汇总_01.xlsx', [0])"
                                                        download>区域核验汇总</a>
                                                </div>
                                            </a-button>

                                            <a :href="'/data/20241029_区域核验汇总_01.xlsx'">
                                                <Download :size="16"></Download>
                                            </a>

                                        </td>
                                        <td> <a-button type="link" primary>
                                                <div style="display: flex;align-items: center;">
                                                    <a @click="lockDownExcel('/data/20241029_区域核验详情_01.xlsx', [0])"
                                                        download>区域核验详情</a>
                                                </div>
                                            </a-button>
                                            <a :href="'/data/20241029_区域核验详情_01.xlsx'">
                                                <Download :size="16"></Download>
                                            </a>
                                        </td>

                                    </tr>

                                </table>
                            </div>
                            <a-row :gutter="16">

                                <a-col :span="8">

                                    <a-statistic title="承保面积" :value="Number(cbmj).toFixed(0) + ' 亩'"
                                        class="demo-class">
                                    </a-statistic>


                                </a-col>
                                <a-col :span="8">
                                    <a-statistic title="遥感面积" :value="Number(ygmj).toFixed(0) + ' 亩'"
                                        class="demo-class">

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
                                            <a-statistic title="正常乡镇" :value="zcxz" class="demo-class">
                                                <template #suffix>
                                                    <a-tag color="#87d068">{{ zcxz_val }}%</a-tag>
                                                </template>
                                            </a-statistic>
                                        </a-col>

                                        <a-col :span="24">
                                            <a-statistic title="超保乡镇" :value="cbxz" class="demo-class">
                                                <template #suffix>
                                                    <a-tag color="#f50">{{ cbxz_val }}%</a-tag>
                                                </template>
                                            </a-statistic>
                                        </a-col>



                                        <a-col :span="24">
                                            <a-statistic title="不足乡镇" :value="bzxz" class="demo-class">
                                                <template #suffix>
                                                    <a-tag color="RGB(248,200,94)">{{ bzxz_val }}%</a-tag>
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

                                    <!-- <LucideAreaChart :size="24" style="margin-bottom: -5px;"></LucideAreaChart> -->
                                    <AlignVerticalDistributeCenter style="margin-bottom: -5px;" /> 区域统计<small>&nbsp;
                                        <a-tooltip title="保险覆盖率(承保面积/遥感面积×100%))，承保合格率(非超保和不足面积占比)" :color="orange">
                                            <Info :size="16" color="#ccc"></Info>
                                        </a-tooltip>
                                    </small>


                                    <a-button type="link" primary style="position: absolute;right: 10px;"
                                        @click="open = true">
                                        <div style="display: flex;align-items: center;">
                                            <MoreHorizontal :size="18"></MoreHorizontal>&nbsp;试点区域详情
                                        </div>
                                    </a-button>

                                </div>

                                <div id="loadEcharts02" style="height:95%;"></div>

                            </div>
                            <div style="width: 100%;height: 45%;">
                                <div class="headerbg">

                                    <!-- <Building2Icon :size="24" style="margin-bottom: -5px;"></Building2Icon> -->
                                    <AlignVerticalDistributeCenter style="margin-bottom: -5px;" /> 机构统计<small>&nbsp;
                                        <a-tooltip title="合格(大于80%且小于105%)，超保(大于105%)，不足(小于80%)" :color="orange">
                                            <Info :size="16" color="#ccc"></Info>
                                        </a-tooltip>
                                    </small>

                                    <a-button type="link" primary style="position: absolute;right: 10px;">

                                    </a-button>

                                </div>

                                <div id="main03" style="height:95%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--地块核验-->
                <div v-if="activeKey == '2'"
                    style="position: absolute;top: 0;left: 0; height: calc(100% - 60px);width: 100%;padding:0 10px;">
                    <div style="width: 100%;height: 300px;">
                        <div class="headerbg">
                            <!-- <MapPinned :size="25" style="margin-bottom: -5px;"></MapPinned> -->
                            <AlignVerticalDistributeCenter style="margin-bottom: -5px;" />
                            {{ header ? header : '试点区县'
                            }}
                            <a-tag color="red"> 重点乡镇 </a-tag>

                            <table style="position: absolute;right: 10px;margin-top: -30px">
                                <tr>
                                    <td>
                                        <a-button type="link" primary>
                                            <div style="display: flex;align-items: center;">
                                                <a @click="lockDownExcel('/data/20241029_地块核验汇总_01.xlsx', [0, 1])"
                                                    download>地块核验汇总</a>

                                            </div>
                                        </a-button> <a :href="'/data/20241029_地块核验汇总_01.xlsx'">
                                            <Download :size="16"></Download>
                                        </a>
                                    </td>
                                    <td> <a-button type="link" primary>
                                            <div style="display: flex;align-items: center;">
                                                <a :href="'/data/20241029_地块核验详情_01.xlsx'" download>地块核验详情</a>

                                            </div>
                                        </a-button> <a :href="'/data/20241029_地块核验详情_01.xlsx'">
                                            <Download :size="16"></Download>
                                        </a></td>
                                </tr>
                            </table>

                        </div>


                        <a-row :gutter="16">
                            <a-col :span="11">
                                <table class="tjfx">

                                    <tr>
                                        <th>投保面积：</th>
                                        <td>{{ tb_area ? Number(tb_area).toFixed(0) : '-' }}亩</td>
                                    </tr>
                                    <tr>
                                        <th>地块面积：</th>
                                        <td>{{ dk_area ? Number(dk_area).toFixed(0) : '-' }}亩</td>
                                    </tr>
                                    <tr>
                                        <th>大户数量：</th>
                                        <td>{{ dhsl }} 户</td>
                                    </tr>
                                    <tr>
                                        <th>有地块大户数：</th>
                                        <td>{{ ydkdhsl }} 户</td>
                                    </tr>
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
                                <!-- <LucideAreaChart :size="20" style="margin-bottom: -5px;"></LucideAreaChart>  -->
                                <AlignVerticalDistributeCenter style="margin-bottom: -5px;" />
                                地块统计
                                <small>&nbsp;
                                    <a-tooltip title="大户数量(大于50亩被保险人)，合格大户(地块重叠，标的占比均符合)" :color="orange">
                                        <Info :size="16" color="#ccc"></Info>
                                    </a-tooltip>
                                </small>

                                <a-button type="link" primary style="position: absolute;right: 10px;"
                                    @click="open = true">
                                    <div style="display: flex;align-items: center;">
                                        <MoreHorizontal :size="15"></MoreHorizontal>&nbsp;地块详情
                                    </div>
                                </a-button>

                            </div>

                            <div id="echartsDK02" style="height:99%;"></div>

                        </div>
                        <div style="width: 100%;height: 40%;">
                            <div class="headerbg">
                                <!-- <LucideAreaChart :size="25" style="margin-bottom: -5px;"></LucideAreaChart>  -->
                                <AlignVerticalDistributeCenter style="margin-bottom: -5px;" />
                                机构统计
                                <small>&nbsp;
                                    <a-tooltip title="大户数量(大于50亩被保险人)，合格大户(地块重叠，标的占比均符合)" :color="orange">
                                        <Info :size="16" color="#ccc"></Info>
                                    </a-tooltip>
                                </small>



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
                <th colspan="10" style="font-size: 18px;text-align: left;padding: 5px;background-color: #fff">保单基本信息
                </th>
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
                <th colspan="10" style="font-size: 18px;text-align: left;padding: 5px;background-color: #fff">大户核验信息
                </th>
            </tr>
            <tr>

                <th>大户地块核验：</th>
                <td>{v8} </td>
            </tr>
            <tr>

                <th>地块面积核验：</th>
                <td>{v3}</td>
            </tr>
            <tr>

                <th>地块重叠核验：</th>
                <td> {v4}</td>
            </tr>
            <tr>

                <th>标的面积核验：</th>
                <td> {v7}</td>
            </tr>
            <tr>
                <th>地块总面积及占比：</th>
                <td>{v1}亩,{v2}%</td>
            </tr>
            <tr>

                <th>地块内标的面积及占比：</th>
                <td>{v5}亩,{v6}%</td>
            </tr>

            <tr>
                <th colspan="10" style="font-size: 18px;text-align: left;padding: 5px;background-color: #fff">当前地块信息
                </th>
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

/* 
:deep(.ant-page-header .ant-page-header-content) {
    margin: 0;
    padding: 0;
    background-color: #48b04c;
} */



:deep(.ant-menu-item svg) {
    width: 15px;
    height: 15px;
}

:deep(.ant-menu-submenu-horizontal svg) {
    width: 15px;
    height: 15px;
}

:deep(.ant-menu-light) {
    background-color: transparent;
    color: #ccc;
}

.tuli {
    position: absolute;
    left: 5px;
    bottom: 30px;
}

.layer {
    position: absolute;
    left: 210px;
    bottom: 20px;
}

.left-card {
    position: absolute;
    width: 270px;
    left: 10px;
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
    height: calc(100% - 130px);
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



:deep(.ant-select-selector) {
    border: 0;
    background-color: transparent;
}

.hovering {
    background-color: rgba(18, 126, 214, 0.058);
    outline: 1.5px solid rgba(18, 126, 214, 0.658);
    border-radius: 2px;
}



:deep(.ant-tabs-tab .ant-tabs-tab-btn) {
    width: 180px;
    text-align: center;
}

.tjfx {
    height: 240px
}


.tjfx th {
    font-size: 16px;
    color: #5a5959bc;
    text-align: left;
    letter-spacing: -1px;


}

.tjfx td {
    font-size: 18px;
    color: #5a5959;
    text-align: right;


}


:deep(.ant-divider-with-text) {
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
    color: rgb(84, 112, 198);
}


.headerbg {
    /* background: linear-gradient(0deg, rgba(84, 112, 196, 0.2), rgba(89, 112, 196, 0.01)); */
    padding: 8px 0 6px 0;
    border-bottom: 1px solid #cccccc86;
    color: #101010c1;
    font-size: 1.2rem;
    font-family: FZZongYi-M05;


}

/* :deep(.ant-page-header-heading-title) {
    color: aliceblue;
}

:deep(.ant-page-header-heading-sub-title) {
    color: #ccc;
} */


.xRightSquareShow {
    position: absolute;
    right: 12px;
    top: 105px;
    cursor: pointer;
    padding: 13px 15px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0.6));
    border-radius: 2px;
    color: #fff;
    border: 1px double #99999986;
}

.xSquareShow {
    position: absolute;
    left: 12px;
    top: 105px;
    cursor: pointer;
    padding: 13px 15px;
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

:deep(.ant-statistic .ant-statistic-title) {
    padding: 0;
    margin: 0;
    color: rgb(93, 91, 91);
    font-size: 16px;
}

:deep(.ant-statistic) {
    padding: 0 10px;
}

:deep(.ant-statistic .ant-statistic-content) {
    font-size: 22px;
    line-height: 30px;
}

:deep(.mapboxgl-popup-content) {
    /* background-color: #f8f5f5b6; */
}
</style>
