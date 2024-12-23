

import ApiService from "../utils/ajax";


const host = `http://localhost:4000`;
// const host = `api`;

const mapbox = {
    key: "pk.eyJ1IjoibHV3ZW5qdW4iLCJhIjoiY2xpODV0c2s2MWV5YjNrcmJneTJ5OHljcyJ9.STONixPRitDkS9dxJSSbHw"
}


const apiService = new ApiService(host);
const api = {
    rskm_pt_insure_com: apiService.get(`/v1/list_json/rskm_pt_insure_com`),
    rskm_pt_insure_type: apiService.get(`/v1/list_json/rskm_pt_insure_type`),
    admin_2022_province: apiService.get(`/v1/bbox/admin_2022_province?geom_column=geom&srid=4326&filter=name='{name}'`),
    // procjet_wxsd_dk_xiaomai: apiService.get(`/v1/list_tj`),
    procjet_wxsd_dk_xiaomai_v1: (where) => {
        return apiService.get(`/v1/list_tj_v1/${where}`)
    },
    procjet_wxsd_dk_xiaomai_bbox: (where) => {
        return apiService.get(`/v1/bbox/procjet_wxsd_dk_xiaomai?geom_column=geom&srid=4326&filter=${where}`)
    }
}

const config = {


    // 服务器取图地址
    procjet_wxsd_dk_xiaomai: {
        name: 'procjet_wxsd_dk_xiaomai',
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/procjet_wxsd_dk_xiaomai/{z}/{x}/{y}?geom_column=geom&columns=gid,baodanhao,jigou,time,shuliang,dishi,quxian,xiangzhen,cun,qibao,zhongbao,r,t,a12,a11,a21,a22,cn,ln,tc,gli,gln,gla,ga,pp,calca12,orgcode,insbillno,zb,area_mi,bili,ct`
            ],
            minzoom: 7,
            maxzoom: 14
        }
    },
    procjet_2024_wxsd: {
        name: 'procjet_2024_wxsd',
        tile: {
            type: "vector",
            tiles: [
                `${host}/v1/mvt/procjet_2024_wxsd/{z}/{x}/{y}?geom_column=geom&columns=city,county,province,area_mi,village,town,area_mu,gid`
            ],
            minzoom: 7,
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
            minzoom: 7.0,
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
