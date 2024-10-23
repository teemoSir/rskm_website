import ApiService from "../utils/ajax";
import StateManager from "@/utils/state_manager";
const host = import.meta.env.VITE_API_BASE_URL;
import dayjs from "dayjs";

// 根据年份获取数据
let year = dayjs(String(StateManager.get("rskm_pt_year") || new Date().getFullYear())).format('YYYY');//dayjs(StateManager.get("rskm_pt_year"), "YYYY") || new Date().getFullYear();
const apiService = new ApiService();

// 接口API
const api = {
    /**
     * 获取公司
     */
    //rskm_pt_insure_com: apiService.get(`/v1/list_json/rskm_pt_insure_com?col=insurcompanycode,insurcompanyname,id`),
    /**
     * 获取险种
     */
    //rskm_pt_insure_type: apiService.get(`/v1/list_json/rskm_pt_insure_type?col=codenum,xzname,id,insurancetype,insurancetypeid`),
    /**
     * 根据filter获取详细
     * @param {*} table 
     * @param {*} filter 
     * @returns 
     */
    get_table_by_filter: (table, filter, col = "") => {
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
        return apiService.get(`/v1/list_pagesize/${table}?page=${page}&size=${size}&year=${year}&filter=${filter}`)
    },
    /**
    * 根据查年份数据总和
    * @param {*} table 
    * @param {*} page 
    * @param {*} size 
    * @returns 
    */
    get_table_count: (table, filter = "") => {
        return apiService.get(`/v1/list_get_count/${table}?filter=and EXTRACT(YEAR FROM TO_DATE(start_date, 'YYYY-MM-DD'))='${year}' ${filter}`)
    },

    /**
     * 统计数据
     * @param {*} where 
     * @param {*} key 
     * @returns 
     */
    get_table_tj: (key, where) => {
        return apiService.get(`/v1/list_any/${key}?where=${where}`)
    },
    /**
        * 根据查年份分页数据
        * @param {*} table 
        * @param {*} page 
        * @param {*} size 
        * @returns 
        */
    get_page: (table, page, size, filter = "and 1=1") => {
        return apiService.get(`/v1/list_page/${table}?page=${page}&size=${size}&filter=${filter}`)
    },

    /**
  * 数据总和
  * @param {*} table 
  * @param {*} page 
  * @param {*} size 
  * @returns 
  */
    get_count: (table, filter = "") => {
        return apiService.get(`/v1/list_get_count/${table}?filter=${filter}`)
    },
}

export {
    api,
    year

}