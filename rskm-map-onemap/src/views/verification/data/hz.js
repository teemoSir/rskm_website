let hzBaseData = [
    { "type": "Feature", "properties": { "id": 1, "number": "1", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "济阳街道", "town_code": "370125001000 ", "type": "玉米", "i_area": "42085.59", "rs_area": "50580.73", "i_coverage": "83.20", "pass": "1", "mz_town_name": "济阳街道", "mz_town_code": "370115001 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 2, "number": "2", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "济北街道", "town_code": "370125002000 ", "type": "玉米", "i_area": "3444.13", "rs_area": "2662.58", "i_coverage": "129.35", "pass": "0", "mz_town_name": "济北街道", "mz_town_code": "370115002 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 3, "number": "3", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "回河镇", "town_code": "370125106000 ", "type": "玉米", "i_area": "55847.9", "rs_area": "65146.75", "i_coverage": "85.73", "pass": "1", "mz_town_name": "回河街道", "mz_town_code": "370115004 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 4, "number": "4", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "垛石镇", "town_code": "370125101000 ", "type": "玉米", "i_area": "145321.12", "rs_area": "159229.81", "i_coverage": "91.27", "pass": "1", "mz_town_name": "垛石街道", "mz_town_code": "370115007 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 5, "number": "5", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "曲堤镇", "town_code": "370125103000 ", "type": "玉米", "i_area": "108131.34", "rs_area": "126331.11", "i_coverage": "85.59", "pass": "1", "mz_town_name": "曲堤街道", "mz_town_code": "370115008 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 6, "number": "6", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "仁风镇", "town_code": "370125104000 ", "type": "玉米", "i_area": "106314.63", "rs_area": "112436.83", "i_coverage": "94.55", "pass": "1", "mz_town_name": "仁风镇", "mz_town_code": "370115103 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 7, "number": "7", "city": "济南市", "city_code": "370100000000 ", "county": "济阳区", "county_code": "370125000000 ", "town": "新市镇", "town_code": "370125109000 ", "type": "玉米", "i_area": "89363.01", "rs_area": "105039.23", "i_coverage": "85.08", "pass": "1", "mz_town_name": "新市镇", "mz_town_code": "370115104 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 8, "number": "8", "city": "济南市", "city_code": "3701", "county": "济阳区", "county_code": "370115", "town": "崔寨街道", "town_code": "370115005 ", "type": "玉米", "i_area": "", "rs_area": "40178.83", "i_coverage": "", "pass": "", "mz_town_name": "崔寨街道", "mz_town_code": "370115005 ", "description": "未提供总量数据" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 9, "number": "9", "city": "济南市", "city_code": "3701", "county": "济阳区", "county_code": "370115", "town": "孙耿街道", "town_code": "370115003 ", "type": "玉米", "i_area": "", "rs_area": "102006.61", "i_coverage": "", "pass": "", "mz_town_name": "孙耿街道", "mz_town_code": "370115003 ", "description": "未提供总量数据" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 10, "number": "10", "city": "济南市", "city_code": "3701", "county": "济阳区", "county_code": "370115", "town": "太平街道", "town_code": "370115006 ", "type": "玉米", "i_area": "", "rs_area": "109636.06", "i_coverage": "", "pass": "", "mz_town_name": "太平街道", "mz_town_code": "370115006 ", "description": "未提供总量数据" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 11, "number": "11", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "凤城街道", "town_code": "371202001000 ", "type": "玉米", "i_area": "618", "rs_area": "1486.67", "i_coverage": "41.57", "pass": "1", "mz_town_name": "凤城街道", "mz_town_code": "370116001 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 12, "number": "12", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "张家洼街道", "town_code": "371202002000 ", "type": "玉米", "i_area": "4449.63", "rs_area": "5379.45", "i_coverage": "82.72", "pass": "1", "mz_town_name": "张家洼街道", "mz_town_code": "370116002 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 13, "number": "13", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "高庄街道", "town_code": "371202003000 ", "type": "玉米", "i_area": "14642.87", "rs_area": "20576.25", "i_coverage": "71.16", "pass": "1", "mz_town_name": "高庄街道", "mz_town_code": "370116003 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 14, "number": "14", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "鹏泉街道办事处", "town_code": "371290001000 ", "type": "玉米", "i_area": "5812.07", "rs_area": "6340.25", "i_coverage": "91.67", "pass": "1", "mz_town_name": "鹏泉街道", "mz_town_code": "370116004 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 15, "number": "15", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "口镇", "town_code": "371202100000 ", "type": "玉米", "i_area": "25803.5", "rs_area": "33731.53", "i_coverage": "76.50", "pass": "1", "mz_town_name": "口镇街道", "mz_town_code": "370116005 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 16, "number": "16", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "羊里镇", "town_code": "371202101000 ", "type": "玉米", "i_area": "36020", "rs_area": "43268.92", "i_coverage": "83.25", "pass": "1", "mz_town_name": "羊里街道", "mz_town_code": "370116006 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 17, "number": "17", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "方下镇", "town_code": "371202102000 ", "type": "玉米", "i_area": "28580.07", "rs_area": "43833.47", "i_coverage": "65.20", "pass": "1", "mz_town_name": "方下街道", "mz_town_code": "370116007 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 18, "number": "18", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "雪野镇", "town_code": "371202106000 ", "type": "玉米", "i_area": "12071.95", "rs_area": "9193.29", "i_coverage": "131.31", "pass": "0", "mz_town_name": "雪野街道", "mz_town_code": "370116008 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 19, "number": "19", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "牛泉镇", "town_code": "371202103000 ", "type": "玉米", "i_area": "24274.94", "rs_area": "42962.37", "i_coverage": "56.50", "pass": "1", "mz_town_name": "牛泉镇", "mz_town_code": "370116103 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 20, "number": "20", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "苗山镇", "town_code": "371202105000 ", "type": "玉米", "i_area": "31193.28", "rs_area": "31688.63", "i_coverage": "98.44", "pass": "1", "mz_town_name": "苗山镇", "mz_town_code": "370116104 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 21, "number": "21", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "大王庄镇", "town_code": "371202107000 ", "type": "玉米", "i_area": "16324.94", "rs_area": "21818.34", "i_coverage": "74.82", "pass": "1", "mz_town_name": "大王庄镇", "mz_town_code": "370116106 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 22, "number": "22", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "寨里镇", "town_code": "371202108000 ", "type": "玉米", "i_area": "29197.66", "rs_area": "44295.36", "i_coverage": "65.92", "pass": "1", "mz_town_name": "寨里镇", "mz_town_code": "370116107 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 23, "number": "23", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "杨庄镇", "town_code": "371202109000 ", "type": "玉米", "i_area": "36709.42", "rs_area": "44975.14", "i_coverage": "81.62", "pass": "1", "mz_town_name": "杨庄镇", "mz_town_code": "370116108 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 24, "number": "24", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "茶业口镇", "town_code": "371202110000 ", "type": "玉米", "i_area": "15970.95", "rs_area": "9597.81", "i_coverage": "166.40", "pass": "0", "mz_town_name": "茶业口镇", "mz_town_code": "370116109 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 25, "number": "25", "city": "济南市", "city_code": "370100000000 ", "county": "莱芜区", "county_code": "371202000000 ", "town": "和庄镇", "town_code": "371202111000 ", "type": "玉米", "i_area": "8746.5", "rs_area": "9153.4", "i_coverage": "95.55", "pass": "1", "mz_town_name": "和庄镇", "mz_town_code": "370116110 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 26, "number": "26", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "田镇街道", "town_code": "370322001000 ", "type": "玉米", "i_area": "50761.04", "rs_area": "55575.22", "i_coverage": "91.34", "pass": "1", "mz_town_name": "田镇街道", "mz_town_code": "370322001 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 27, "number": "27", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "芦湖街道", "town_code": "370322002000 ", "type": "玉米", "i_area": "44090.73", "rs_area": "46472.81", "i_coverage": "94.87", "pass": "1", "mz_town_name": "芦湖街道", "mz_town_code": "370322002 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 28, "number": "28", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "青城镇", "town_code": "370322101000 ", "type": "玉米", "i_area": "58635.89", "rs_area": "71577.12", "i_coverage": "81.92", "pass": "1", "mz_town_name": "青城镇", "mz_town_code": "370322101 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 29, "number": "29", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "高城镇", "town_code": "370322102000 ", "type": "玉米", "i_area": "107096.06", "rs_area": "113639.92", "i_coverage": "94.24", "pass": "1", "mz_town_name": "高城镇", "mz_town_code": "370322102 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 30, "number": "30", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "黑里寨镇", "town_code": "370322103000 ", "type": "玉米", "i_area": "87294.35", "rs_area": "88997.22", "i_coverage": "98.09", "pass": "1", "mz_town_name": "黑里寨镇", "mz_town_code": "370322103 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 31, "number": "31", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "唐坊镇", "town_code": "370322104000 ", "type": "玉米", "i_area": "84829.98", "rs_area": "91324.92", "i_coverage": "92.89", "pass": "1", "mz_town_name": "唐坊镇", "mz_town_code": "370322104 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 32, "number": "32", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "常家镇", "town_code": "370322105000 ", "type": "玉米", "i_area": "62224.34", "rs_area": "61378.6", "i_coverage": "101.38", "pass": "1", "mz_town_name": "常家镇", "mz_town_code": "370322105 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 33, "number": "33", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "花沟镇", "town_code": "370322106000 ", "type": "玉米", "i_area": "108701.85", "rs_area": "112012.59", "i_coverage": "97.04", "pass": "1", "mz_town_name": "花沟镇", "mz_town_code": "370322106 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 34, "number": "34", "city": "淄博市", "city_code": "370300000000 ", "county": "高青县", "county_code": "370322000000 ", "town": "木李镇", "town_code": "370322108000 ", "type": "玉米", "i_area": "61693.25", "rs_area": "66437.12", "i_coverage": "92.86", "pass": "1", "mz_town_name": "木李镇", "mz_town_code": "370322108 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 35, "number": "35", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "索镇街道", "town_code": "370321001000 ", "type": "玉米", "i_area": "23105.41", "rs_area": "47450.93", "i_coverage": "48.69", "pass": "1", "mz_town_name": "索镇街道", "mz_town_code": "370321001 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 36, "number": "36", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "起凤镇", "town_code": "370321101000 ", "type": "玉米", "i_area": "30195.92", "rs_area": "33988.09", "i_coverage": "88.84", "pass": "1", "mz_town_name": "起凤镇", "mz_town_code": "370321101 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 37, "number": "37", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "田庄镇", "town_code": "370321103000 ", "type": "玉米", "i_area": "42496.83", "rs_area": "50359.26", "i_coverage": "84.39", "pass": "1", "mz_town_name": "田庄镇", "mz_town_code": "370321103 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 38, "number": "38", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "荆家镇", "town_code": "370321104000 ", "type": "玉米", "i_area": "26177.63", "rs_area": "53455.14", "i_coverage": "48.97", "pass": "1", "mz_town_name": "荆家镇", "mz_town_code": "370321104 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 39, "number": "39", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "马桥镇", "town_code": "370321105000 ", "type": "玉米", "i_area": "44198.37", "rs_area": "62681.07", "i_coverage": "70.51", "pass": "1", "mz_town_name": "马桥镇", "mz_town_code": "370321105 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 40, "number": "40", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "新城镇", "town_code": "370321107000 ", "type": "玉米", "i_area": "30764.22", "rs_area": "38403.89", "i_coverage": "80.11", "pass": "1", "mz_town_name": "新城镇", "mz_town_code": "370321107 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 41, "number": "41", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "唐山镇", "town_code": "370321109000 ", "type": "玉米", "i_area": "46528.06", "rs_area": "53783.3", "i_coverage": "86.51", "pass": "1", "mz_town_name": "唐山镇", "mz_town_code": "370321109 ", "description": "" }, "geometry": null },
    { "type": "Feature", "properties": { "id": 42, "number": "42", "city": "淄博市", "city_code": "370300000000 ", "county": "桓台县", "county_code": "370321000000 ", "town": "果里镇", "town_code": "370321110000 ", "type": "玉米", "i_area": "34783.58", "rs_area": "51999.58", "i_coverage": "66.89", "pass": "1", "mz_town_name": "果里镇", "mz_town_code": "370321110 ", "description": "" }, "geometry": null },
    //  { "type": "Feature", "properties": { "id": 43, "number": "总计", "city": "", "city_code": "", "county": "", "county_code": "", "town": "", "town_code": "", "type": "", "i_area": "1784501.01", "rs_area": "2341086.2", "i_coverage": "", "pass": "", "mz_town_name": "", "mz_town_code": "", "description": "" }, "geometry": null }


]





let bxjgBaseData = [
    {
        "name": "太保", "zc": 72, "bz": 43, "cb": 28
    },
    {
        "name": "人保", "zc": 448, "bz": 8, "cb": 2
    },
    {
        "name": "国寿财", "zc": 1, "bz": 2, "cb": 1
    },
    {
        "name": "中华", "zc": 1, "bz": 9, "cb": 41
    },
    {
        "name": "安华", "zc": 0, "bz": 0, "cb": 0
    },
    {
        "name": "泰山", "zc": 0, "bz": 0, "cb": 0
    },
    {
        "name": "太平", "zc": 0, "bz": 0, "cb": 0
    },
    {
        "name": "阳光", "zc": 0, "bz": 0, "cb": 0
    },
]




// select count(distinct bdh) from public.procjet_2024_yghy_chj where bxjg='太保' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !=''
// UNION ALL
// select count(id) from public.procjet_2024_yghy_chj where bxjg='太保' and (v2::numeric)<=80  and v2 !=''
// UNION ALL
// select count(id) from public.procjet_2024_yghy_chj where bxjg='太保' and (v2::numeric)>=105  and v2 !=''

export {
    hzBaseData,
    bxjgBaseData
}


