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
                `${host}/v1/mvt/rskm_pt/{z}/{x}/{y}?geom_column=geom&columns=gid,area_mu,insurcompany_code,i_com_name,i_type_name,insurancenum,county,city,village,town,insurancetarget,region_code,ad_code&filter=SUBSTRING(start_date FROM 1 FOR 4)='${year}'`,
            ],
            minzoom: 4,
            maxzoom: 14
        }
    },
    procjet_2024_yghy_hz4country: {
        name: 'procjet_2024_yghy_hz4country',
        tile: {
            type: "vector",
            tiles: [
                //gid, geom, objectid, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao, dkmj, dkcdl, bdmj, dkbcd, shape_leng, shape_area
                `${host}/v1/mvt/procjet_2024_yghy_hz4country/{z}/{x}/{y}?geom_column=geom&columns=gid,bdh,bbxrmc,bbxrzjh,bbxrdh,xianlei,xianzhong,bxjg,shi,shidm,quxian,quxiandm,zhen,zhendm,cun,cundm,youxiao,dkmj,dkcdl,bdmj,dkbcd,cbsl,bxqj,v1,v2,v3,v4,v5,v6,v7,v8`,
            ],
            minzoom: 4,
            maxzoom: 14
        }
    },
    procjet_2024_yghy_sense: {
        name: 'procjet_2024_yghy_sense',
        tile: {
            type: "vector",
            tiles: [
                //gid, geom, objectid, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao, dkmj, dkcdl, bdmj, dkbcd, shape_leng, shape_area
                `${host}/v1/mvt/procjet_2024_yghy_sense/{z}/{x}/{y}?geom_column=geom&columns=`,
            ],
            minzoom: 4,
            maxzoom: 14
        }
    },

    
    wpoi: {
        name: "world_poi",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/world_poi/{z}/{x}/{y}?geom_column=geom&columns=name_chn,priority`,
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
                `${host}/v1/mvt/admin_2022_city/{z}/{x}/{y}?geom_column=geom&columns=name`,
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
                `${host}/v1/mvt/admin_2022_county/{z}/{x}/{y}?geom_column=geom&columns=name,county_code`,
            ],
            minzoom: 9,
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
    }
};

export { config, mapbox };
