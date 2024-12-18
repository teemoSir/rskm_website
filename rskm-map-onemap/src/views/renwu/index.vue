<script setup>

import { ref, computed, watch, onMounted, nextTick, h, reactive, toRaw } from "vue";
import { api } from "@/config/api.js";
import { message } from "ant-design-vue";
import SDMap from "@/views/map/index.vue";
import Header from "@/components/header/index.vue";
import {
    Play,
    Download,
    Satellite,
    Trash2, SquarePlay, LucidePanelsTopBottom, Building2Icon, Plus, X
} from "lucide-vue-next";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

import StateManager from "@/utils/state_manager";

import {
    addLayersYghy, popup, popupbig
} from "@/views/map/map.js";



// 设置语言
dayjs.locale('zh-cn');


// 路由
const router = useRouter();

const formState = reactive({
    name: '',
    delivery: true,
    type: ['区域', '地块'],
    resource: '1',
    desc: '',
    date: [dayjs('2024/06/26'), dayjs('2024/11/26')],
    area: [],
    county: []
});

/**
 * 提交任务表单
 */
const onSubmit = async () => {
    // 处理市级到县级
    let newArea = [];
    formState.area.forEach((c) => {
        if (c.length == 1) {
            areaList.value.filter((a) => a.city_name == c).forEach((b) => {
                newArea.push(b.county_name)
            })
        } else {
            let cc = c.concat();
            newArea.push(cc.pop())
        }
    })
    formState.county = newArea;

    // console.log('submit!', toRaw(formState));

    if (formState.start_time || formState.end_time || formState.county.length <= 0) {
        message.warn("承保期间与区域必填");
        return
    }

    let result = await api.install_table('public.rskm_pt_task', {
        data_source: '1',
        status: 0,
        start_time: formState.date[0],
        end_time: formState.date[1],
        redme: formState.desc,
        county: formState.county,
        task_name: `${formState.county[0]}等${formState.county.length}个区县_${formState.type.join("_")}`,
        data_source: formState.resource,
        messages: '任务建立完成，待开始',
    })

    if (result.success) {
        message.success('创建成功！');
        loadTasks()
        addTaskModel.value = false;
        rect()
    } else {
        message.error('创建异常!');
    }

};



const labelCol = {
    style: {
        width: '150px',
    },
};
const wrapperCol = {
    span: 14,
};


const menu = ref('a');

/**
 * 获取数据
 * 
 * 3:删除 ,0：未完成, 1：进行中,2：已完成
 */
const taskList = ref([])
/**
 * 获取原始数据
 * 
 * 3:删除 ,0：未完成, 1：进行中,2：已完成
 */
const taskListSource = ref([])

/**
 * 区域数据
 */
const areaList = ref([])

/**
 * 远端数据获取
 */
const loadTasks = async () => {

    let re = (Math.random() * 1000).toFixed(0);
    let data01 = await api.get_table_by_filter("public.rskm_pt_task", `and status <> '3' and ${re}=${re}  ORDER BY gid Desc `,
        "gid,redme,task_name, data_source, status, progress, messages,ST_AsGeoJSON(ST_Simplify(region,0.01)) as region, start_time, script, result_table_name, created_at, updated_at, end_time,county")
    if (data01.length > 0) {
        taskListSource.value = data01;
        taskList.value = data01;
    }



}

/**
 * 远端数据获取
 */
const loadTreeArea = async () => {
    let data02 = await api.get_table_by_filter("public.admin_2022_county",
        "and province_code=370000 group by county_name,county_code order by city_code asc",
        "MAX(city_name) as city_name,MAX(city_code) as city_code, county_name,county_code")
    if (data02.length > 0) {
        areaList.value = data02;

        let citys = [];
        data02.forEach((city) => {
            citys.push(city.city_name)
        })

        options.value = [];
        [...new Set(citys)].forEach((c) => {
            let char = []
            data02.filter((dd) => dd.city_name == c).forEach((county) => {
                char.push({
                    label: county.county_name,
                    value: county.county_name,
                })
            })
            options.value.push({
                label: c,
                value: c,
                children: char,
            })
        })
        //  console.log(options)
    }
}

/**
 * 删除任务
 */
const onDelete = async (data) => {
    console.log(data)
    //update_table_by_filter
    let result = await api.update_table_by_filter("public.rskm_pt_task", `and gid=${data.gid}`, "status='3'")

    if (result.success) {
        message.success('删除成功！');
        loadTasks()
    } else {
        message.warn('删除异常!');
    }
    // console.log(deleteStatus.value)
}

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
 * 显示范围到视野
 */
const goMapView = (task) => {

    let feature = task.region;
    let properties = {

    };

    drawGeomsOne(feature, properties);

    let bbox = getCoordinatesAndBbox(JSON.parse(feature));
    map.fitBounds(bbox, {
        padding: { top: 200, left: 200, right: 200, bottom: 100 },
        linear: true,
        // easing: (t) => {
        //   return t * (1 - t);
        // },
    });

}


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
 * 移除地图上的行政区边界图层
 */
const clearGeomOne = () => {
    map.getLayer("clickDrawGeomText") && map.removeLayer("clickDrawGeomText");
    map.getLayer("clickDrawGeomFillOut") && map.removeLayer("clickDrawGeomFillOut");
    map.getLayer("clickDrawGeomFill") && map.removeLayer("clickDrawGeomFill");
    map.getSource("clickDrawGeom") && map.removeSource("clickDrawGeom");
};


/**
 * 创建容器框
 */
const addTaskModel = ref(false);

/**
 * 筛选菜单
 */
const listStatus = ref(undefined)

/**
 * 筛选菜单方法
 */
const setListStatus = (val = undefined) => {
    listStatus.value = val;
    if (val || val == 0) {
        taskList.value = taskListSource.value.filter(task => task.status == listStatus.value)
    } else {
        taskList.value = taskListSource.value;
    }
}

/**
 * 重置
 */
const rect = () => {
    formState.desc = "";
    formState.area = [];
}

/**
 * 区域参数
 */
const options = ref([]);




// update public.rskm_pt_task set region=(
// select ST_Union(geom) from public.china_wgs84_town where county_name  in ('济阳区','莱芜区','桓台县','高青县','海阳市','招远市','汶上县','冠县','东阿县','无棣县')
// ) where gid=1
// --    ALTER TABLE public.rskm_pt_task
// --    ALTER COLUMN region TYPE Geometry(MultiPolygon, 4326)


onMounted(() => {
    loadTasks()
    loadTreeArea();
})

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

        <div class="left-card">
            <table>
                <tr>
                    <td>
                        <div>
                            <Building2Icon :size="30"></Building2Icon><br>
                            核验
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div>
                            <LucidePanelsTopBottom :size="30"></LucidePanelsTopBottom><br>
                            任务
                        </div>
                    </td>
                </tr>
            </table>

            <!--后-->
            <div class="left-card-task">
                <div style="display: flex; align-items: center;padding: 5px;border-bottom: 1px solid #ccc;">
                    <!-- <LandmarkIcon :size="20"></LandmarkIcon>  -->
                    <Satellite :size="20" color="RGB(50,119,252)" />
                    <span style="font-size: 18px;padding-left: 10px;">遥感核验任务管理</span>
                </div>
                <!-- 3:删除 ,0：未完成, 1：进行中,2：已完成 -->
                <a-space-compact block style="margin-top: 10px;">

                    <a-button :type="listStatus == undefined ? 'primary' : 'default'" style="width: 25%;"
                        @click="setListStatus()">全部</a-button>

                    <a-button :type="listStatus == 2 ? 'primary' : 'default'" style="width: 25%;"
                        @click="setListStatus(2)">已完成</a-button>

                    <a-button :type="listStatus == 1 ? 'primary' : 'default'" style="width: 25%;"
                        @click="setListStatus(1)">进行中</a-button>

                    <a-button :type="listStatus == 0 ? 'primary' : 'default'" style="width: 25%;"
                        @click="setListStatus(0)">未完成</a-button>


                </a-space-compact>
                <a-input-search placeholder="任务名称" enter-button style="margin-top: 10px;" />

                <div style="margin-top: 10px;background-color: #fff;">
                    <div
                        style="background-color: RGB(50,119,252);padding: 7px 10px;color: RGB(245,248,255);font-size: 15px;border-top-left-radius: 4px;border-top-right-radius: 4px;">
                        核验任务

                        <a-tooltip title="创建新任务">
                            <div style="float: right;display: flex;align-items: center;cursor: pointer;"
                                @click="addTaskModel = !addTaskModel">
                                <Plus :size="18"></Plus> 创建
                            </div>
                        </a-tooltip>
                    </div>
                    <div style=" max-height: 600px;overflow-y:scroll;">

                        <a-empty v-if="taskList.length == 0" description="暂无数据" />
                        <div v-for="tl in taskList" :key="tl.gid" class="card">
                            <div
                                style="background-color: RGB(230,230,228);padding: 4px 5px;font-size: 15px;line-height: 25px;border-bottom: 1px solid #ccc; ">
                                {{ tl.task_name }}


                                <a-popconfirm title="确定删除此任务？" ok-text="确认删除" cancel-text="否" @confirm="onDelete(tl)">
                                    <Trash2 :size="20" style="float: right;cursor: pointer;" color="#999">
                                    </Trash2>
                                </a-popconfirm>
                            </div>
                            <table style="font-size: 13px;width: 100%;cursor: pointer;" @click="goMapView(tl)">
                                <a-tooltip :title="tl.county" color="blue" placement="right">
                                    <tr style="line-height: 20px;">
                                        <td style="width: 60px;padding-left: 5px;">核验区域</td>
                                        <td colspan="3" style="text-align: right;"> {{ String(tl.county).substring(0, 8)
                                            }}...
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </a-tooltip>
                                <tr style="line-height: 20px;">
                                    <td style="width: 60px;padding-left: 5px;">保险期间</td>
                                    <td colspan="3" style="text-align: right;"> {{
                                        dayjs(tl.start_time).format('YYYY-MM-DD')
                                        }}至{{
                                            dayjs(tl.start_time).format('YYYY-MM-DD') }}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style="line-height: 20px;">
                                    <td style="width: 60px;padding-left: 5px;">核验来源</td>
                                    <td colspan="3" style="text-align: right;">
                                        第{{ tl.data_source }}次遥感种植成果
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr style="line-height: 20px;">
                                    <td style="width: 60px;padding-left: 5px;">进度</td>

                                    <td>{{ tl.progress ? tl.progress : 0 }}%</td>
                                    <td>
                                        <SquarePlay v-if="tl.status == 0" color="RGB(95,178,71)" />

                                    </td>
                                    <td style="text-align: right;">
                                        <a-tag color="#f50" v-if="tl.status == 0">待开始</a-tag>
                                        <a-tag color="#108ee9" v-if="tl.status == 1">进行中</a-tag>
                                        <a-tag color="#87d068" v-if="tl.status == 2">已完成</a-tag>
                                        <a-tag color="yellow" v-if="tl.status == 4">失败</a-tag>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>


                </div>

            </div>
            <div class="left-card-add" v-if="addTaskModel">
                <div style="display: flex; align-items: center;padding: 5px;border-bottom: 1px solid #ccc;">
                    <!-- <LandmarkIcon :size="20"></LandmarkIcon>  -->
                    <Satellite :size="20" color="RGB(50,119,252)" />
                    <span style="font-size: 18px;padding-left: 10px;">创建任务</span>
                    <X :size="20" style="cursor: pointer;position: absolute;right: 10px;" color="#999"
                        @click="addTaskModel = false">
                    </X>
                </div>

                <div style="padding: 10px 5px;">
                    <a-form-item label="核验方式">
                        <a-checkbox-group v-model:value="formState.type">
                            <a-checkbox value="区域" name="type">区域核验</a-checkbox>
                            <a-checkbox value="地块" name="type">地块核验</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="核验期间">
                        <a-range-picker v-model:value="formState.date" :locale="locale" />
                        <!-- <a-input v-model:value="formState.name" /> -->
                    </a-form-item>
                    <a-form-item label="核验区域">
                        <!-- <a-input v-model:value="formState.name" /> -->

                        <a-cascader v-model:value="formState.area" style="width: 100%" multiple
                            max-tag-count="responsive" :showSearch="true" :options="options"
                            placeholder="请选择"></a-cascader>

                        <!-- {{ formState.area }} -->
                    </a-form-item>
                    <!-- <a-form-item label="立即执行">
                    <a-switch v-model:checked="formState.delivery" />
                </a-form-item> -->

                    <a-form-item label="核验来源">
                        <a-radio-group v-model:value="formState.resource">
                            <a-radio value="1">第一次种植分布</a-radio>
                            <a-radio value="2">第二次种植分布</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item label="任务描述">
                        <a-textarea v-model:value="formState.desc" />
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                        <a-button style="margin-left: 10px" @click="addTaskModel = false">取消</a-button>
                        <a-button style="margin-left: 10px" @click="rect">重置</a-button>
                        <a-button type="primary" @click="onSubmit"
                            style="margin-left: 20px;width: 100px;">创建任务</a-button>
                    </a-form-item>
                </div>
                <a-alert message="区域为必填项，请至少选择一个" banner closable />
            </div>
        </div>

        <!-- 中间 -->
        <div class="center-card">


            <!--右侧统计栏-->


            <div class="right-card">



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
    background: linear-gradient(to bottom, rgba(251, 251, 251, 9), rgba(243, 241, 241, 0.6));
    /* background-color: #fff; */
    z-index: 100000;

}

.page {
    position: absolute;
    left: 0;
    top: 100px;
    padding: 10px;
}




::v-deep .ant-menu-title-content {
    color: #2c2c2c;
}

::v-deep .ant-menu {
    background-color: transparent;
}


.left-card table div {
    color: rgb(35, 35, 36);
    text-align: center;
    padding: 20px 15px;
    outline: 1px solid #ccc;
    margin-bottom: 5px;
    background: linear-gradient(to bottom, rgba(251, 251, 251, 7), rgba(243, 241, 241, 0.3));
    border-radius: 3px;

}

.left-card table div:hover {
    background-color: RGB(49, 132, 249);
    color: RGB(49, 132, 249);
    cursor: pointer;
}

.left-card-task {

    position: absolute;
    top: 10px;
    left: 85px;

    outline: 1px solid #ccc;
    border-radius: 3px;
    width: 300px;
    background: linear-gradient(to bottom, rgba(251, 251, 251, 1), rgba(243, 241, 241, 0.8));
    padding: 5px;

}


.left-card-add {

    position: absolute;
    top: 10px;
    left: 395px;

    outline: 1px solid #ccc;


    border-radius: 3px;
    width: 600px;
    background: linear-gradient(to bottom, rgba(251, 251, 251, 1), rgba(243, 241, 241, 0.8));
    padding: 5px;
}


.card {
    margin: 10px;
    outline: 1px solid #ccc;
    box-shadow: 3px 2px 3px #2c2c2c38;
}

.card:hover {
    background: linear-gradient(to bottom, #4276f912, #4276f922);
    box-shadow: 3px 2px 10px #2e2e2f;
}
</style>
