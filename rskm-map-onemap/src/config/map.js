

import ApiService from "../utils/ajax";
import StateManager from "@/utils/state_manager";
const host = import.meta.env.VITE_API_BASE_URL;
import dayjs from "dayjs";

const mapbox = {
    key: "pk.eyJ1IjoibHV3ZW5qdW4iLCJhIjoiY2xpODV0c2s2MWV5YjNrcmJneTJ5OHljcyJ9.STONixPRitDkS9dxJSSbHw"
}


let year = dayjs(String(StateManager.get("rskm_pt_year") || new Date().getFullYear())).format('YYYY');//dayjs(StateManager.get("rskm_pt_year"), "YYYY") || new Date().getFullYear()
const apiService = new ApiService();
const api = {
    rskm_pt_insure_com: apiService.get(`/v1/list_json/rskm_pt_insure_com`),
    rskm_pt_insure_type: apiService.get(`/v1/list_json/rskm_pt_insure_type`),
    /**
     * 根据filter获取详细
     * @param {*} table 
     * @param {*} filter 
     * @returns 
     */
    get_insure_by_filter: (table, filter, col = "") => {
        return apiService.get(`/v1/list_json/${table}?filter=${filter}&col=${col}`)
    },
    /**
     * 根据查年份分页数据
     * @param {*} table 
     * @param {*} page 
     * @param {*} size 
     * @returns 
     */
    get_table_pagesize: (table, page, size, filter = "") => {
        return apiService.get(`/v1/list_pagesize/${table}?page=${page}&size=${size}&year=${year}`)
    },
    /**
    * 根据查年份数据总和
    * @param {*} table 
    * @param {*} page 
    * @param {*} size 
    * @returns 
    */
    get_table_count: (table, filter = "") => {
        return apiService.get(`/v1/list_get_count/${table}?filter=and EXTRACT(YEAR FROM TO_DATE(start_date, 'YYYY-MM-DD'))='${year}'`)
    }
}

const config = {


    // 服务器取图地址
    rskm_pt: {
        name: 'rskm_pt',
        tile: {
            type: "vector",
            tiles: [
                // `${host}/v1/mvt/rskm_pt/{z}/{x}/{y}?geom_column=geom&columns=insurancenum,city,county,province,area_mi,village,town,insurance_id,insurcompany_code,gid,insured_quantity,end_date,start_date,insurancetarget`,
                // `${host}/v1/mvt/rskm_pt/{z}/{x}/{y}?geom_column=geom&columns=insurancenum,county,area_mi,village,town,insurcompany_code,gid,insured_quantity,end_date,start_date,insurancetarget&filter=SUBSTRING(start_date FROM 1 FOR 4)='${year}'`,
                `${host}/v1/mvt/rskm_pt/{z}/{x}/{y}?geom_column=geom&columns=gid,area_mi,insurcompany_code&filter=SUBSTRING(start_date FROM 1 FOR 4)='${year}'`,
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
                `${host}/v1/mvt/admin_2022_province/{z}/{x}/{y}?geom_column=geom&columns=name`,
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
            minzoom: 7.5,
            maxzoom: 12.99

        }
    },
    admin_2024_county: {
        name: "admin_2024_county",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2024_county/{z}/{x}/{y}?geom_column=geom&columns=name`,
            ]
            , minzoom: 9,
            maxzoom: 14

        }
    },
    admin_2024_town: {
        name: "admin_2024_town",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2024_town/{z}/{x}/{y}?geom_column=geom&columns=t_xzqmc`,
            ]
            , minzoom: 10,
            maxzoom: 13

        }
    },
    admin_2024_village: {
        name: "admin_2024_village",
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/admin_2024_village/{z}/{x}/{y}?geom_column=geom&columns=name,t_xzqmc`,
            ]
            , minzoom: 12.5,
            maxzoom: 14

        }
    },


    // world_china_province: {
    //     name: "world_china_province",
    //     tile: {
    //         type: "vector",
    //         tiles: [
    //             `${host}/v1/mvt/world_china_province/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_province/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_province/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_province/{z}/{x}/{y}?geom_column=geom&columns=NAME`
    //         ],
    //         minzoom: 2,
    //         maxzoom: 15.99

    //     }
    // },
    // world_china_city: {
    //     name: "world_china_city",
    //     tile: {
    //         type: "vector",
    //         tiles: [
    //             `${host}/v1/mvt/world_china_city/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_city/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_city/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_city/{z}/{x}/{y}?geom_column=geom&columns=NAME`
    //         ],
    //         minzoom: 6,
    //         maxzoom: 7.49

    //     }
    // },
    // world_china_county: {
    //     name: "world_china_county",
    //     tile: {
    //         type: "vector",
    //         tiles: [
    //             `${host}/v1/mvt/world_china_county/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_county/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_county/{z}/{x}/{y}?geom_column=geom&columns=NAME`,
    //             `${host}/v1/mvt/world_china_county/{z}/{x}/{y}?geom_column=geom&columns=NAME`
    //         ]
    //         , minzoom: 7.5,
    //         maxzoom: 20

    //     }
    // },
}

export { config, mapbox, api }
