<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive } from "vue";
import { message } from "ant-design-vue";
import {
    ChevronUp,
    ChevronDownIcon
} from "lucide-vue-next";

/**
 * 图例
 */
let legends = [


    // {
    //   key: 0,
    //   title: "遥感种植分布图",
    //   isShow: ref(false),
    //   type: "polygon",
    //   outlineColor: "RGB(112,131,194)",
    //   fillColor: "RGBA(112,131,194,0.7)",
    //   outlineWidth: 3,
    //   order: "遥感图层"
    // },

    {
        key: 1,
        title: "基本一致",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "yellow",
        fillColor: "RGB(144,204,120)",
        outlineWidth: 0,
        order: "地块核验(标的物占比)"
    },
    {
        key: 2,
        title: "有所差异",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "orange",
        fillColor: "RGB(246,200,100)",
        outlineWidth: 0,
        order: "地块核验(标的物占比)"
    },
    {
        key: 3,
        title: "显著差异",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "orange",
        fillColor: "RGB(236,102,103)",
        outlineWidth: 0,
        order: "地块核验(标的物占比)"
    },

    {
        key: 4,
        title: "非常严重",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "orange",
        fillColor: "RGB(126,39,40)",
        outlineWidth: 0,
        order: "地块核验(标的物占比)"
    },


    // {
    //   key: 9,
    //   title: "一致",
    //   isShow: ref(true),
    //   type: "polygon",
    //   outlineColor: "RGBA(236,102,103,0)",
    //   fillColor: "RGB(255,242,0)",
    //   outlineWidth: 0,
    //   order: "地块面积核验"
    // },
    // {
    //   key: 10,
    //   title: "不一致",
    //   isShow: ref(true),
    //   type: "polygon",
    //   outlineColor: "RGBA(236,102,103,0)",
    //   fillColor: "blue",
    //   outlineWidth: 0,
    //   order: "地块面积核验"
    // },


    {
        key: 11,
        title: "无重叠",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGBA(236,102,103,0)",
        fillColor: "RGB(255,242,0)",
        outlineWidth: 0,
        order: "地块重叠核验"
    },
    {
        key: 12,
        title: "有重叠",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGBA(236,102,103,0)",
        fillColor: "blue",
        outlineWidth: 0,
        order: "地块重叠核验"
    },

    // {
    //   key: 13,
    //   title: "达标",
    //   isShow: ref(true),
    //   type: "polygon",
    //   outlineColor: "RGBA(236,102,103,0)",
    //   fillColor: "RGB(255,242,0)",
    //   outlineWidth: 0,
    //   order: "标的差异率核验"
    // },
    // {
    //   key: 14,
    //   title: "不达标",
    //   isShow: ref(true),
    //   type: "polygon",
    //   outlineColor: "RGBA(236,102,103,0)",
    //   fillColor: "blue",
    //   outlineWidth: 0,
    //   order: "标的差异率核验"
    // },


    {
        key: 3,
        title: "国寿财",
        isShow: ref(false),
        type: "polygon",
        outlineColor: "#000",
        fillColor: "RGBA(43,128,251,0.0)",
        outlineWidth: 5,
        order: "保险机构"
    },

    // {
    //   key: 4,
    //   title: "太平",
    //   isShow: ref(false),
    //   type: "polygon",
    //   outlineColor: "RGB(147,138,87)",
    //   fillColor: "RGBA(43,128,251,0.0)",
    //   outlineWidth: 5,
    //   order: "保险机构"
    // },

    // {
    //   key: 5,
    //   title: "人保",
    //   isShow: ref(false),
    //   type: "polygon",
    //   outlineColor: "#000",
    //   fillColor: "RGBA(43,128,251,0.0)",
    //   outlineWidth: 5,
    //   order: "保险机构"
    // },
    {
        key: 6,
        title: "太保",
        isShow: ref(false),
        type: "polygon",
        outlineColor: "blue",
        fillColor: "RGBA(43,128,251,0.0)",
        outlineWidth: 5,
        order: "保险机构"
    },
    // {
    //   key: 7,
    //   title: "中华",
    //   isShow: ref(false),
    //   type: "polygon",
    //   outlineColor: "RGB(250,131,86)",
    //   fillColor: "RGBA(43,128,251,0.0)",
    //   outlineWidth: 5,
    //   order: "保险机构"
    // },
    // {
    //   key: 8,
    //   title: "安华",
    //   isShow: ref(false),
    //   type: "polygon",
    //   outlineColor: "RGB(233,124,203)",
    //   fillColor: "RGBA(43,128,251,0.0)",
    //   outlineWidth: 5,
    //   order: "保险机构"
    // },

];

const tuli = ref(true);


/**
 * 图例
 */
const state = reactive({
    // checked0: false,
    checked1: true,
    checked2: true,
    checked3: true,
    checked4: true,
});

/**
 * 图例
 */
const state2 = reactive({
    radioValuev9: false,
    radioValuev10: false,
    radioValuev11: false,
    radioValuev12: false,
    radioValuev13: false,
    radioValuev14: false,
});



message.config({
    top: `200px`,
    //   duration: 2,
    maxCount: 2,
    rtl: true,
    prefixCls: "提示",
});

watch(state, () => {

    //保单地块
    let hgdks = [
        "rskm_pt_outline",
        "rskm_pt",
        "rskm_pt_name",
        "rskm_pt_name_1",
    ];


    if (!state.checked1 && !state.checked2 && !state.checked3 && !state.checked4) {

        hgdks.forEach((gd) => {
            map.setFilter(gd, [
                "all",
                ["==", "1", "2"],
            ]);
        });
    } else if (state.checked1 && state.checked2 && state.checked3 && state.checked4) {
        hgdks.forEach((gd) => {
            map.setFilter(gd, null);
        });
    } else {
        let newFilter = [
            "any"
        ];
        if (state.checked1) {
            console.log("number")
            newFilter.push(["all",
                ["<", ['get', "bdzb"], 5]
            ])

        }

        if (state.checked2) {
            newFilter.push(["all",
                [">=", ['get', "bdzb"], 5],
                ["<", ['get', "bdzb"], 20]
            ])

        }

        if (state.checked3) {
            newFilter.push(["all",
                [">=", ['get', "bdzb"], 20],
                ["<", ['get', "bdzb"], 50]
            ])

        }

        if (state.checked4) {
            newFilter.push([
                "all",
                [">=", ['get', "bdzb"], 50],
            ])

        }

        hgdks.forEach((gd) => {
            map.setFilter(gd, newFilter);
        });
    }





    message.success("图层已更新", 1);
});


watch(state2, () => {



    if (
        !state2.radioValuev11 &&
        !state2.radioValuev12) {
        state.checked2 = true;
        state.checked1 = true;
        state.checked3 = true;
        state.checked4 = true;
    } else if (

        state2.radioValuev11 ||
        state2.radioValuev12) {
        state.checked2 = false;
        state.checked1 = false;
        state.checked3 = false;
        state.checked4 = false;

    }








    /**
     * 地块重叠核验
     */

    let v4 = [
        'case',
        ["==", ['get', "cd"], 0],
        'yellow',
        ["!=", ['get', "cd"], 0],
        'blue',
        '#ccc'
    ];


    if (state2.radioValuev11 && state2.radioValuev12) {
        setTimeout(() => {
            map.setPaintProperty('rskm_pt', 'fill-color', v4);
            map.setFilter("rskm_pt", null);
        }, 200)
    } else if (!state2.radioValuev11 && !state2.radioValuev12) {
        setTimeout(() => {
            map.setPaintProperty('rskm_pt', 'fill-color',
                [
                    'case',
                    ["<", ['get', "bdzb"], 5],
                    'RGB(144,204,123)',
                    ["all",
                        [">=", ['get', "bdzb"], 5],
                        ["<", ['get', "bdzb"], 20]
                    ],
                    'RGB(246,200,100)',
                    ["all",
                        [">=", ['get', "bdzb"], 20],
                        ["<", ['get', "bdzb"], 50]
                    ],
                    'RGB(234,102,104)',
                    'RGB(125,39,41)'
                ]
            );
            map.setFilter("rskm_pt", null);
        }, 200)
    } else if (state2.radioValuev11 && !state2.radioValuev12) {
        setTimeout(() => {
            map.setPaintProperty('rskm_pt', 'fill-color', v4);
            map.setFilter("rskm_pt", [
                "all",
                ["==", ['get', "cd"], 0],
            ]);
        }, 200)
    } else if (!state2.radioValuev11 && state2.radioValuev12) {
        setTimeout(() => {
            map.setFilter("rskm_pt", [
                "all",
                ["==", ['get', "cd"], 1],
            ]);
            map.setPaintProperty('rskm_pt', 'fill-color', v4);
        }, 200)
    }



})



// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {
    if (isVisible) {
        map.setLayoutProperty(layerId, "visibility", "visible");
    } else {
        map.setLayoutProperty(layerId, "visibility", "none");
    }
};

/**
 * 图层控制
 */
const radioValue = ref(false);

/**
 * 遥感图层
 */
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
 * 控制是否显示
 */
const dkRadioDisabled = ref(true);

</script>

<template>

    <a-card title="图例" :bordered="false">
        <template #extra>
            <ChevronDownIcon v-if="tuli" style="cursor: pointer;" @click="tuli = !tuli"></ChevronDownIcon>
            <ChevronUp v-else style="cursor: pointer;" @click="tuli = !tuli"></ChevronUp>
        </template>

        <div v-if="tuli" style="width: 390px;">
            <!--保险机构-->
            <a-row style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="24">
                    <div class="legendTitle">保险机构</div>
                </a-col>
                <a-col :span="12" v-for="tar in legends.filter(le => le.order == '保险机构')" :key="tar.key">

                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 10px;"></td>
                            <td>
                                <div v-if="tar.type == 'polygon'" :style="{
                                    background: tar.fillColor,
                                    border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
                                    width: '35px',
                                    height: '20px',
                                }"></div>
                                <div v-if="tar.type == 'line-dotted'" :style="{
                                    borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
                                    width: '35px',
                                    height: '0px',
                                    paddingTop: '3.5px',
                                }"></div>

                                <div v-if="tar.type == 'line'" :style="{
                                    borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
                                    width: '35px',
                                    height: '0px',
                                    paddingTop: '3.5px',
                                }"></div>
                            </td>
                            <td style="text-align: center;"> {{ tar.title }}
                            </td>
                        </tr>
                    </table>
                </a-col>

            </a-row>

            <!--遥感图层-->

            <!--地块是否合格-->


            <a-row>
                <a-col :span="24">
                    <div class="legendTitle">地块核验(标的物占比)</div>
                </a-col>
                <a-col :span="12" v-for="tar in legends.filter(le => le.order == '地块核验(标的物占比)')" :key="tar.key">
                    <table>
                        <tr style="line-height: 30px;">
                            <td>
                                <div v-if="tar.type == 'polygon'" :style="{
                                    background: tar.fillColor,
                                    border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
                                    width: '35px',
                                    height: '20px',
                                }"></div>
                                <div v-if="tar.type == 'line-dotted'" :style="{
                                    borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
                                    width: '35px',
                                    height: '0px',
                                    paddingTop: '3.5px',
                                }"></div>

                                <div v-if="tar.type == 'line'" :style="{
                                    borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
                                    width: '35px',
                                    height: '0px',
                                    paddingTop: '3.5px',
                                }"></div>
                            </td>
                            <td>
                                {{ tar.title }}
                            </td>

                            <td>
                                <div style="position: absolute; right: 10px; bottom: 0">
                                    <a-switch v-if="tar.key == 1" checked-children="显示" un-checked-children="隐藏"
                                        v-model:checked="state.checked1" />
                                    <a-switch v-if="tar.key == 2" checked-children="显示" un-checked-children="隐藏"
                                        v-model:checked="state.checked2" />
                                    <a-switch v-if="tar.key == 3" checked-children="显示" un-checked-children="隐藏"
                                        v-model:checked="state.checked3" />
                                    <a-switch v-if="tar.key == 4" checked-children="显示" un-checked-children="隐藏"
                                        v-model:checked="state.checked4" />
                                </div>
                            </td>
                        </tr>
                    </table>




                </a-col>
            </a-row>



            <!--地块重叠-->
            <!-- <a-row v-for="tar in legends.filter(le => le.order == '地块重叠核验')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">

                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '地块重叠核验')[0].key">
                    <div class="legendTitle">{{
                        tar.order }}</div>
                </a-col>
                <a-col :span="1"></a-col>
                <a-col :span="6">
                    <div v-if="tar.type == 'polygon'" :style="{
                        background: tar.fillColor,
                        border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
                        width: '35px',
                        height: '20px',
                    }"></div>
                    <div v-if="tar.type == 'line-dotted'" :style="{
                        borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
                        width: '35px',
                        height: '0px',
                        paddingTop: '3.5px',
                    }"></div>

                    <div v-if="tar.type == 'line'" :style="{
                        borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
                        width: '35px',
                        height: '0px',
                        paddingTop: '3.5px',
                    }"></div>
                </a-col>

                <a-col :span="17" style="font-size: 15px;">
                    {{ tar.title }}
                    <div style="position: absolute; right: 10px; bottom: 0">
                        <a-switch v-if="tar.key == 11" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev11" />
                        <a-switch v-if="tar.key == 12" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev12" />
                    </div>
                </a-col>
            </a-row> -->
            <a-row>
                <a-col :span="24">
                    <div class="legendTitle">地块核验(标的物占比)</div>
                </a-col>
                <a-col :span="12" v-for="tar in legends.filter(le => le.order == '地块重叠核验')" :key="tar.key">

                    <table>
                        <tr style="line-height: 30px;">
                            <td>
                                <div v-if="tar.type == 'polygon'" :style="{
                                    background: tar.fillColor,
                                    border: `${tar.outlineWidth}px solid ${tar.outlineColor}`,
                                    width: '35px',
                                    height: '20px',
                                }"></div>
                                <div v-if="tar.type == 'line-dotted'" :style="{
                                    borderBottom: `${tar.outlineWidth}px dashed ${tar.fillColor}`,
                                    width: '35px',
                                    height: '0px',
                                    paddingTop: '3.5px',
                                }"></div>

                                <div v-if="tar.type == 'line'" :style="{
                                    borderBottom: `${tar.outlineWidth}px solid ${tar.fillColor}`,
                                    width: '35px',
                                    height: '0px',
                                    paddingTop: '3.5px',
                                }"></div>
                            </td>

                            <td>
                                {{ tar.title }}
                            </td>

                            <td>
                                <div style="position: absolute; right: 10px; bottom: 0">
                                    <a-switch v-if="tar.key == 11" checked-children="显示" un-checked-children="隐藏"
                                        v-model:checked="state2.radioValuev11" />
                                    <a-switch v-if="tar.key == 12" checked-children="显示" un-checked-children="隐藏"
                                        v-model:checked="state2.radioValuev12" />
                                </div>
                            </td>
                        </tr>
                    </table>
                </a-col>
            </a-row>



        </div>
    </a-card>
</template>

<style scoped>
.legendTitle {
    font-size: 16px;
    padding-top: 10px;

}

::v-deep .ant-card-body {
    padding: 0 20px 20px 20px;
}
</style>
