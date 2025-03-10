import StateManager from "@/utils/state_manager";
import dayjs from "dayjs";

const host = import.meta.env.VITE_API_BASE_URL;

const mapbox = {
    key: "pk.eyJ1IjoibHV3ZW5qdW4iLCJhIjoiY2xpODV0c2s2MWV5YjNrcmJneTJ5OHljcyJ9.STONixPRitDkS9dxJSSbHw"
};

// 获取当前年份或从StateManager获取的年份
let year = dayjs(String(StateManager.get("rskm_pt_year") || new Date().getFullYear())).format('YYYY');

// 服务器取图地址配置
const config = {
    rskm_pt: {
        name: 'rskm_pt',
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/rskm_pt/{z}/{x}/{y}?geom_column=geom&columns=gid,insured,area_mu,insurcompany_code,i_com_name,i_type_name,insurancenum,county,city,village,town,insurancetarget,region_code,ad_code&filter=SUBSTRING(start_date FROM 1 FOR 4)='${year}'`,
            ],
            minzoom: 4,
            maxzoom: 14
        }
    },
    procjet_2024_yghy_hz10_county: {
        name: 'procjet_2024_yghy_hz10_county',
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/pbf/procjet_2024_yghy_hz10_county/{z}/{x}/{y}?geom_column=geom&columns=gid,bdh,bbxrmc,bbxrzjh,bbxrdh,xianlei,xianzhong,bxjg,shi,shidm,quxian,quxiandm,zhen,zhendm,cun,cundm,youxiao,dkmj,dkcdl,bdmj,dkbcd,cbsl,v8,v3,v4,v7,ygjg`,
            ],
            minzoom: 4,
            maxzoom: 14
        }
    },

    procjet_2024_yghy_hz10_county_2: {
        name: 'procjet_2024_yghy_hz10_county_2',
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/pbf/procjet_2024_yghy_hz10_county_2/{z}/{x}/{y}?geom_column=geom&columns=gid,bdh,bbxrmc,bbxrzjh,bbxrdh,xianlei,xianzhong,bxjg,shi,shidm,quxian,quxiandm,zhen,zhendm,cun,cundm,youxiao,dkmj,dkcdl,bdmj,dkbcd,cbsl,v8,v3,v4,v7,ygjg`,
            ],
            minzoom: 4,
            maxzoom: 14
        }
    },
    procjet_2024_yghy_sense: {
        name: 'procjet_2024_yghy_sense',
        tile: {
            type: "vector",
            scheme: 'tms',
            tiles: [
                'http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_sense@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            ],
            minzoom: 3,
            maxzoom: 14
        }
    },

    procjet_2024_yghy_sense_s1: {
        name: 'procjet_2024_yghy_sense_s1',
        tile: {
            type: "vector",
            scheme: 'tms',
            tiles: [
                'http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_sense_s1@EPSG%3A900913@pbf/{z}/{x}/{y}.pbf'
            ],
            minzoom: 3,
            maxzoom: 14
        }
    },

    wpoi: {
        name: "world_poi",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/world_poi/{z}/{x}/{y}?geom_column=geom&columns=name_chn,priority,province_code,province_name`,
            ],
            minzoom: 2,
            maxzoom: 14
        },
    },
    admin_2022_province: {
        name: "admin_2022_province",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2022_province/{z}/{x}/{y}?geom_column=geom&columns=name,first_gid`,
            ],
            minzoom: 2,
            maxzoom: 12.99
        }
    },
    admin_2022_city: {
        name: "admin_2022_city",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2022_city/{z}/{x}/{y}?geom_column=geom&columns=name,province_code,gid`,
            ],
            minzoom: 6,
            maxzoom: 12.99
        }
    },
    admin_2022_county: {
        name: "admin_2022_county",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2022_county/{z}/{x}/{y}?geom_column=geom&columns=name,county_code,gid,county_name`,
            ],
            minzoom: 8,
            maxzoom: 14
        }
    },
    admin_2024_town: {
        name: "admin_2024_town",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2024_town/{z}/{x}/{y}?geom_column=geom&columns=t_xzqmc`,
            ],
            minzoom: 10,
            maxzoom: 13
        }
    },
    admin_2024_village: {
        name: "admin_2024_village",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2024_village/{z}/{x}/{y}?geom_column=geom&columns=name,t_xzqmc`,
            ],
            minzoom: 14,
            maxzoom: 15
        }
    },
    world_china_polygon: {
        name: "world_china_polygon",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/world_china_polygon/{z}/{x}/{y}?geom_column=geom&columns=building,naturals`,
            ],
            minzoom: 30
        }
    },
    china_wgs84_all: {
        name: "china_wgs84_all",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/pbf/china_wgs84_all/{z}/{x}/{y}?geom_column=geom&columns=gid,name,code,town_name,town_code`,
            ],
            minzoom: 9
        }
    },

    // 测绘院长势
    procjet_2024_yghy_yumi_zhangshi_chy: {
        name: "procjet_2024_yghy_yumi_zhangshi_chy",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_yumi_zhangshi@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },

    // 航天信德长势
    procjet_2024_yghy_yumi_zhangshi_htxd: {
        name: "procjet_2024_yghy_yumi_zhangshi_htxd",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Ahtxd_yumi_zhangshi_202408@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },

    // 二十一世纪长势 一次
    procjet_2024_yghy_yumi_zhangshi_esysj_1: {
        name: "procjet_2024_yghy_yumi_zhangshi_esysj_1",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_zhangshi_season_6@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },
    // 二十一世纪长势 二次
    procjet_2024_yghy_yumi_zhangshi_esysj_2: {
        name: "procjet_2024_yghy_yumi_zhangshi_esysj_2",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_zhangshi_season_7@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },
    // 二十一世纪长势 三次
    procjet_2024_yghy_yumi_zhangshi_esysj_3: {
        name: "procjet_2024_yghy_yumi_zhangshi_esysj_3",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_zhangshi_season_8@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },

    // 二十一世纪灾害
    procjet_2024_yghy_zaihai_esysj: {
        name: "procjet_2024_yghy_zaihai_esysj",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_zaihai_esysj@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },

    // 测绘院 灾害

    procjet_2024_yghy_zaihai_chy: {
        name: "procjet_2024_yghy_zaihai_chy",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_zaihai_chy@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },

    //航天信德 灾害


    procjet_2024_yghy_zaihai_htxd: {
        name: "procjet_2024_yghy_zaihai_htxd",
        tile: {
            type: "raster",
            scheme: 'tms',
            tiles: [
                `http://39.102.63.192:3001/mapserver/gwc/service/tms/1.0.0/rskm%3Aprocjet_2024_yghy_zaihai_htxd@EPSG%3A900913@png/{z}/{x}/{y}.png`,
            ],
            minzoom: 6,
            maxzoom: 17
        }
    },


};

export { config, mapbox };
