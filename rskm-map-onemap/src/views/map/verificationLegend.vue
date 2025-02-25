<script setup>
import { ref, computed, watch, onMounted, nextTick, reactive, defineProps } from "vue";
import { message } from "ant-design-vue";
import {
    ChevronUp,
    ChevronDownIcon
} from "lucide-vue-next";

/**
 * 图例
 */
let legends = [


    {
        key: 0,
        title: "种植分布",
        isShow: ref(false),
        type: "polygon",
        outlineColor: "RGB(112,131,194)",
        fillColor: "RGBA(112,131,194,0.7)",
        outlineWidth: 3,
        order: "遥感图层"
    },

    {
        key: 1,
        title: "合格",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "yellow",
        fillColor: "RGB(144,204,120)",
        outlineWidth: 0,
        order: "地块核验"
    },
    {
        key: 2,
        title: "不合格",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "orange",
        fillColor: "RGB(236,102,103)",
        outlineWidth: 0,
        order: "地块核验"
    },

    {
        key: 9,
        title: "一致",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGBA(236,102,103,0)",
        fillColor: "RGB(255,242,0)",
        outlineWidth: 0,
        order: "地块面积核验"
    },
    {
        key: 10,
        title: "不一致",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGBA(236,102,103,0)",
        fillColor: "blue",
        outlineWidth: 0,
        order: "地块面积核验"
    },


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

    {
        key: 13,
        title: "达标",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGBA(236,102,103,0)",
        fillColor: "RGB(255,242,0)",
        outlineWidth: 0,
        order: "标的差异率核验"
    },
    {
        key: 14,
        title: "不达标",
        isShow: ref(true),
        type: "polygon",
        outlineColor: "RGBA(236,102,103,0)",
        fillColor: "blue",
        outlineWidth: 0,
        order: "标的差异率核验"
    },


    // {
    //     key: 3,
    //     title: "国寿财",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGB(76,127,217)",
    //     fillColor: "RGBA(43,128,251,0.0)",
    //     outlineWidth: 5,
    //     order: "保险机构"
    // },

    // {
    //     key: 4,
    //     title: "太平",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGB(147,138,87)",
    //     fillColor: "RGBA(43,128,251,0.0)",
    //     outlineWidth: 5,
    //     order: "保险机构"
    // },

    // {
    //     key: 5,
    //     title: "人保",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "#000",
    //     fillColor: "RGBA(43,128,251,0.0)",
    //     outlineWidth: 5,
    //     order: "保险机构"
    // },
    // {
    //     key: 6,
    //     title: "太保",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGB(126,72,225)",
    //     fillColor: "RGBA(43,128,251,0.0)",
    //     outlineWidth: 5,
    //     order: "保险机构"
    // },
    // {
    //     key: 7,
    //     title: "中华",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGB(250,131,86)",
    //     fillColor: "RGBA(43,128,251,0.0)",
    //     outlineWidth: 5,
    //     order: "保险机构"
    // },
    // {
    //     key: 8,
    //     title: "安华",
    //     isShow: ref(false),
    //     type: "polygon",
    //     outlineColor: "RGB(233,124,203)",
    //     fillColor: "RGBA(43,128,251,0.0)",
    //     outlineWidth: 5,
    //     order: "保险机构"
    // },

];

const tuli = ref(true);


/**
 * 图例
 */
const state = reactive({
    checked0: false,
    checked1: true,
    checked2: true,
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


    if (!state.checked1 && !state.checked2) {
        let newFilter = [
            "all",
            ["==", "1", "2"],
        ];
        hgdks.forEach((gd) => {
            window[props.core || 'map'].setFilter(gd, newFilter);
        });
    } else if (state.checked1 && state.checked2) {
        hgdks.forEach((gd) => {
            window[props.core || 'map'].setFilter(gd, null);
        });
    }
    else if (state.checked1 && !state.checked2) {
        let newFilter = [
            "all",
            ["==", ['get', "v8"], '1'],
        ];
        hgdks.forEach((gd) => {
            window[props.core || 'map'].setFilter(gd, newFilter);
        });
    } else if (!state.checked1 && state.checked2) {
        let newFilter = [
            "all",
            ["!=", ['get', "v8"], '1'],
        ];
        hgdks.forEach((gd) => {
            window[props.core || 'map'].setFilter(gd, newFilter);
        });
    }

    // if (!state.checked2) {
    //   state2.radioValuev9
    // }



    if (state.checked2 || state.checked1) {
        state2.radioValuev9 = false;
        state2.radioValuev10 = false;
        state2.radioValuev11 = false;
        state2.radioValuev12 = false;
        state2.radioValuev13 = false;
        state2.radioValuev14 = false;
    }



    message.success("图层已更新", 1);
});


watch(state2, () => {
    if (state2.radioValuev9 || state2.radioValuev10) {
        state2.radioValuev11 = false;
        state2.radioValuev12 = false;
        state2.radioValuev13 = false;
        state2.radioValuev14 = false;
    }

    if (state2.radioValuev11 || state2.radioValuev12) {
        state2.radioValuev9 = false;
        state2.radioValuev10 = false;
        state2.radioValuev13 = false;
        state2.radioValuev14 = false;
    }

    if (state2.radioValuev13 || state2.radioValuev14) {
        state2.radioValuev11 = false;
        state2.radioValuev12 = false;
        state2.radioValuev9 = false;
        state2.radioValuev10 = false;
    }

    if (!state2.radioValuev9 &&
        !state2.radioValuev10 &&
        !state2.radioValuev11 &&
        !state2.radioValuev12 &&
        !state2.radioValuev13 &&
        !state2.radioValuev14) {
        state.checked2 = true;
        state.checked1 = true;
    } else if (state2.radioValuev9 ||
        state2.radioValuev10 ||
        state2.radioValuev11 ||
        state2.radioValuev12 ||
        state2.radioValuev13 ||
        state2.radioValuev14) {
        state.checked2 = false;
        state.checked1 = false;

    }





    /**
     * 地块面积核验
     */
    let v3 = [
        'case',
        ["==", ['get', "v3"], '1'],
        'yellow',
        ["!=", ['get', "v3"], '1'],
        'blue',
        '#ccc'
    ]

    if (state2.radioValuev9 && state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v3);
            window[props.core || 'map'].setFilter("rskm_pt", null);

        }, 200)
    } else if (!state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color',
                [
                    'case',
                    ["==", ['get', "v8"], '1'],
                    'RGB(158,224,132)',
                    ["==", ['get', "v8"], '0'],
                    'RGB(253,112,113)',
                    'RGB(248,200,94)'
                ]
            );
            window[props.core || 'map'].setFilter("rskm_pt", null);
        }, 200)
    } else if (state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v3);
            window[props.core || 'map'].setFilter("rskm_pt", [
                "all",
                ["==", ['get', "v3"], '1'],
            ]);
        }, 200)
    } else if (!state2.radioValuev9 && state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setFilter("rskm_pt", [
                "all",
                ["!=", ['get', "v3"], '1'],
            ]);
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v3);
        }, 200)
    }


    /**
     * 地块重叠核验
     */

    let v4 = [
        'case',
        ["==", ['get', "v4"], '1'],
        'yellow',
        ["!=", ['get', "v4"], '1'],
        'blue',
        '#ccc'
    ]
    if (state2.radioValuev11 && state2.radioValuev12 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v4);
            window[props.core || 'map'].setFilter("rskm_pt", null);
        }, 200)
    } else if (!state2.radioValuev11 && !state2.radioValuev12 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color',
                [
                    'case',
                    ["==", ['get', "v8"], '1'],
                    'RGB(158,224,132)',
                    ["==", ['get', "v8"], '0'],
                    'RGB(253,112,113)',
                    'RGB(248,200,94)'
                ]
            );
            window[props.core || 'map'].setFilter("rskm_pt", null);
        }, 200)
    } else if (state2.radioValuev11 && !state2.radioValuev12 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v4);
            window[props.core || 'map'].setFilter("rskm_pt", [
                "all",
                ["==", ['get', "v4"], '1'],
            ]);
        }, 200)
    } else if (!state2.radioValuev11 && state2.radioValuev12 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev13 && !state2.radioValuev14) {
        setTimeout(() => {
            window[props.core || 'map'].setFilter("rskm_pt", [
                "all",
                ["!=", ['get', "v4"], '1'],
            ]);
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v4);
        }, 200)
    }



    /**
   * 地块差异率核验
   */
    let v7 = [
        'case',
        ["==", ['get', "v7"], '1'],
        'yellow',
        ["!=", ['get', "v7"], '1'],
        'blue',
        '#ccc'
    ]

    if (state2.radioValuev13 && state2.radioValuev14 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v7);
            window[props.core || 'map'].setFilter("rskm_pt", null);
        }, 200)
    } else if (!state2.radioValuev13 && !state2.radioValuev14 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color',
                [
                    'case',
                    ["==", ['get', "v8"], '1'],
                    'RGB(158,224,132)',
                    ["==", ['get', "v8"], '0'],
                    'RGB(253,112,113)',
                    'RGB(248,200,94)'
                ]
            );
            window[props.core || 'map'].setFilter("rskm_pt", null);
        }, 200)
    } else if (state2.radioValuev13 && !state2.radioValuev14 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12) {
        setTimeout(() => {
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v7);
            window[props.core || 'map'].setFilter("rskm_pt", [
                "all",
                ["==", ['get', "v7"], '1'],
            ]);
        }, 200)
    } else if (!state2.radioValuev13 && state2.radioValuev14 && !state2.radioValuev9 && !state2.radioValuev10 && !state2.radioValuev11 && !state2.radioValuev12) {
        setTimeout(() => {
            window[props.core || 'map'].setFilter("rskm_pt", [
                "all",
                ["!=", ['get', "v7"], '1'],
            ]);
            window[props.core || 'map'].setPaintProperty('rskm_pt', 'fill-color', v7);
        }, 200)
    }


})



// 切换图层可见性函数
const toggleLayerVisibility = (layerId, isVisible) => {
    if (isVisible) {
        window[props.core || 'map'].setLayoutProperty(layerId, "visibility", "visible");
    } else {
        window[props.core || 'map'].setLayoutProperty(layerId, "visibility", "none");
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
        window[props.core || 'map'].setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'visible');
        window[props.core || 'map'].setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'visible');
    } else {
        window[props.core || 'map'].setLayoutProperty('procjet_2024_yghy_sense_outline', 'visibility', 'none');
        window[props.core || 'map'].setLayoutProperty('procjet_2024_yghy_sense', 'visibility', 'none');
    }
})


/**
 * 控制是否显示
 */
const dkRadioDisabled = ref(true);

const props = defineProps({
    core: String,
})

</script>

<template>

    <a-card title="图例" :bordered="false" class="win">

        <template #extra>
            <div style="display: flex;align-items: center;">
                <ChevronDownIcon v-if="tuli" style="cursor: pointer;" @click="tuli = !tuli" color="#fff">
                </ChevronDownIcon>
                <ChevronUp v-else style="cursor: pointer;" @click="tuli = !tuli" color="#fff"></ChevronUp>
            </div>
        </template>

        <div v-if="tuli" style="width: 180px;">
            <!--保险机构-->
            <a-row style="display: flex; align-items: center; line-height: 30px">
                <!-- <a-col :span="24" >
                    <div class="legendTitle">保险机构</div>
                </a-col> -->
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
                            <td style="text-align: center;color: #fff;"> {{ tar.title }}
                            </td>
                        </tr>
                    </table>
                </a-col>

            </a-row>

            <!--遥感图层-->
            <a-row v-for="tar in legends.filter(le => le.order == '遥感图层')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '遥感图层')[0].key">
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

                <a-col :span="17" style="font-size: 12px;color: #fff;">
                    {{ tar.title }}

                    <div style="position: absolute; right: 10px; bottom: 0">
                        <a-switch v-if="tar.key == 0" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="radioValue" />
                    </div>
                </a-col>
                <a-col :span="24" style="font-size: 12px;color: #fff;">
                </a-col>
            </a-row>

            <!--地块是否合格-->
            <a-row v-for="tar in legends.filter(le => le.order == '地块核验')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">

                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '地块核验')[0].key">
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

                <a-col :span="17" style="font-size: 12px;color: #fff;">
                    {{ tar.title }}

                    <div style="position: absolute; right: 10px; bottom: 0">
                        <a-switch v-if="tar.key == 1" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state.checked1" />
                        <a-switch v-if="tar.key == 2" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state.checked2" />

                    </div>


                </a-col>

            </a-row>

            <!--地块与承保面积不一致-->
            <a-row v-for="tar in legends.filter(le => le.order == '地块面积核验')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">

                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '地块面积核验')[0].key">
                    <div class="legendTitle">{{ tar.order }}</div>
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

                <a-col :span="17" style="font-size: 12px;color: #fff;">
                    {{ tar.title }}
                    <div style="position: absolute; right: 10px; bottom: 0">

                        <a-switch v-if="tar.key == 9" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev9" />
                        <a-switch v-if="tar.key == 10" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev10" />
                    </div>
                </a-col>
            </a-row>

            <!--地块重叠-->
            <a-row v-for="tar in legends.filter(le => le.order == '地块重叠核验')" :key="tar.key"
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

                <a-col :span="17" style="font-size: 12px;color: #fff;">
                    {{ tar.title }}
                    <div style="position: absolute; right: 10px; bottom: 0">
                        <a-switch v-if="tar.key == 11" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev11" />
                        <a-switch v-if="tar.key == 12" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev12" />
                    </div>
                </a-col>
            </a-row>

            <!--标的面积差异率不达标-->
            <a-row v-for="tar in legends.filter(le => le.order == '标的差异率核验')" :key="tar.key"
                style="display: flex; align-items: center; line-height: 30px">
                <a-col :span="24" v-if="tar.key == legends.filter(le => le.order == '标的差异率核验')[0].key">
                    <div class="legendTitle">{{ tar.order }}</div>
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

                <a-col :span="17" style="font-size: 12px;color: #fff;">
                    {{ tar.title }}
                    <div style="position: absolute; right: 10px; bottom: 0">
                        <a-switch v-if="tar.key == 13" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev13" />
                        <a-switch v-if="tar.key == 14" checked-children="显示" un-checked-children="隐藏"
                            v-model:checked="state2.radioValuev14" />
                    </div>
                </a-col>
            </a-row>


        </div>
    </a-card>
</template>

<style scoped>
.legendTitle {
    font-size: 14px;
    color: #fff;
    width: 100%;


}

.win {
    background-color: transparent;
    background: linear-gradient(to bottom, rgba(251, 250, 250, 0.93), rgba(204, 204, 204, 0.898));
}




:deep(.ant-card-head) {
    border-bottom: 0;
    font-family: FZZongYi-M05;
    font-weight: normal;
}

:deep(.ant-card-body) {
    padding: 0px 15px 15px 15px;
    border-top: 1px solid #cccccc46;
}

:deep(.ant-card-head-title) {
    color: #fff;
}
</style>
