const axios = require('axios');
const { Pool } = require('pg');
const { arcgisToGeoJSON } = require("@terraformer/arcgis")
const crypto = require("crypto")
const turf = require('@turf/turf');
const { convertAToGeojson } = require('./util/convertAToGeojson')


// PostGIS数据库连接参数
const dbConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    database: 'postgres',
    port: 5432,
};

// 定义要请求的URL
const url = 'http://124.128.248.214:85/api/transfer';
const action2 = "/api/syncinsurance/syncinsdataresult";
const apiKey = 'nxptyzt';
const privateKey = '46AA1572-L767-5783-F2A8-2A28F7240702';
const size = 30;
let tryBool = true;
let lkdata = undefined;



// 批量获取数据
async function getInsData () {


    lkdata = undefined;
    tryBool = true;
    let listBill = [];
    let resultList = [];
    let pgGeom = [];
    const now = new Date();
    const fourSecondsAgo = new Date(now.getTime() - 4 * 1000);
    const timet = fourSecondsAgo.toLocaleString();

    console.log('-----------------------------------发起数据请求----------------------------------');
    // POST请求
    const headers = {
        'Content-Type': 'application/json',
        'ApiKey': apiKey,
        'Sign': getMd5Sum(`apikey=${apiKey}&time=${timet}&key=${privateKey}`),
        'Time': timet,
        'Action': '/api/syncinsurance/getinsdata/' + size,
        'User-Agent': 'Mozilla/5.0 (Linux, Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.109 Safari/537.36',
        timeout: 5000 // 设置超时时间为 5 秒
    };
    // console.log(headers)

    const data = { current: 1 };


    const response = await axios.post(url, data, { headers });
    if (response.status === 200) {
        const insuranceJson = response.data;
        // console.log(insuranceJson.length)
        for (const item of insuranceJson) {

            // 是否需要同步 1 同步，-1直接删除
            if (Number(item.updateornot) != 1 || !item.geojsonstr) {

                resultList.push(-1);
                listBill.push({
                    CreatedDate: item.CreatedDate,
                    InsuranceId: item.InsuranceId,
                    LogStatus: item.LogStatus,
                });
                continue;
            }

            // 将ESRI JSON转换为Python字典
            const esriJson = JSON.parse(item.geojsonstr);

            // 将ESRI JSON转换为GeoJSON
            //const geojsons = arcgisToGeoJSON(esriJson);

            let goboll = true;
            for (let i in esriJson.features) {
                let bool = undefined;
                var multiPoly = undefined;
                try {
                    //  console.log(esriJson.features[i].geometry.rings)
                    multiPoly = turf.multiPolygon([esriJson.features[i].geometry.rings]);
                    bool = turf.booleanValid(multiPoly);
                } catch (error) {
                    goboll = false;
                }

                if (!bool) {
                    goboll = false;
                }

            }

            console.log("【is Polygon ：" + goboll)
            //   console.log(resultList)

            if (!goboll) {
                resultList.push(-1);
                listBill.push({
                    CreatedDate: item.CreatedDate,
                    InsuranceId: item.InsuranceId,
                    LogStatus: item.LogStatus,
                });
                continue
            }

            const geojsons = convertAToGeojson(esriJson)
            //    console.log("【esriJson】:" + JSON.stringify(esriJson))
            //   console.log(" ")
            console.log("【geojson】:" + JSON.stringify(geojsons))

            let wkt = geojsonToWKT(geojsons)
            //  console.log(" ")
            console.log("【wkt】:" + wkt)


            resultList.push(1);
            listBill.push({
                CreatedDate: item.CreatedDate,
                InsuranceId: item.InsuranceId,
                LogStatus: item.LogStatus,
            });

            // 准备组织全数据提交
            pgGeom.push(installPgGeom(item, wkt, geojsons));



        }

        lkdata = {
            "pgGeom": pgGeom,
            "resultList": resultList,
            "listBill": listBill
        }


    } else {
        console.error('请求失败' + response.status + response.data);
        tryBool = false
    }

    delete response;
    delete insuranceJson;
    delete headers;
}


/**
 * 转换到wkt
 * @param {*} geojson 
 * @returns 
 */
function geojsonToWKT (geojson) {
    if (!geojson || geojson.type !== 'FeatureCollection') {
        throw new Error('Invalid GeoJSON FeatureCollection.');
    }

    const features = geojson.features;
    let wktParts = [];

    features.forEach(feature => {
        const geometry = feature.geometry;
        if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
            let polygonWKT = geometry.type === 'Polygon' ? 'POLYGON' : 'MULTIPOLYGON';
            let coords = geometry.coordinates.map(ring => {
                return `(${ring.map(point => point.join(' ')).join(', ')})`;
            });


            if (geometry.type === 'Polygon') {
                // Single Polygon, wrap it in a MultiPolygon structure
                polygonWKT = `(${coords.join(', ')})`;
            } else {
                // MultiPolygon, join all parts
                //  coords = coords.join(', ');
                polygonWKT = `(${coords.join(', ')})`;
            }

            wktParts.push(polygonWKT);
        }
    });

    delete features;
    delete geojson;
    return `MULTIPOLYGON (${wktParts.length > 0 ? wktParts.join(', ') : ''})`;
}
/**
 *  读取json到几何图形列
 * @param {*} data 
 * @param {*} wkt 
 */
function installPgGeom (data, wkt, geojsons) {
    let T = JSON.stringify(geojsons);
    let R = "";
    let A12 = "";
    let A11 = "";

    console.log("【入库数据】：" + data["insurancenum"] + "," + data["insured"] + "," + data["insuredquantity"] + "," + data["insured"])

    return {
        "wkt_geom": wkt,
        "insurancenum": data["insurancenum"],
        "insurcompanycode": data["insurcompanycode"],
        "insured": data["insured"],
        "EffectStartDate": data["EffectStartDate"],
        "EffectEndDate": data["EffectEndDate"],
        "RegionCode": data["RegionCode"],
        "InsuranceId": data["InsuranceId"],
        "CreatedDate": data["CreatedDate"],
        "insurancetarget": data["insurancetarget"],
        "insuredquantity": data["insuredquantity"],
        "srid": data["updateornot"],
        "R": R,
        "T": T,
        "A12": A12,
        "A11": A11,
        "update_data": new Date().toLocaleString()
    }

}


// {
//     insurancenum: '201105211492023000121',
//     areacode: '370983000000',
//     insurancetarget: '131',
//     insuredquantity: '170.0000',
//     starttime: '2023/04/29',
//     endtime: '2023/07/31',
//     geojsonstr: '{"UId":"183709830162230426111135002","geometryType":"esriGeometryPolygon","spatialReference":{"wkid":4326},"fields":[{"name":"R","alias":"recognizees","type":"esriFieldTypeString"},{"name":"T","alias":"type Of Insurancee","type":"esriFieldTypeString"},{"name":"A11","alias":"project area In Sqm","type":"esriFieldTypeString"},{"name":"A12","alias":"project area In Mu","type":"esriFieldTypeString"},{"name":"A21","alias":"surface area In Sqm","type":"esriFieldTypeString"},{"name":"A22","alias":"surface area In Mu","type":"esriFieldTypeString"},{"name":"GD","alias":"degree","type":"esriFieldTypeString"},{"name":"PP","alias":"PlantProportion","type":"esriFieldTypeString"},{"name":"GLI","alias":"graph land id","type":"esriFieldTypeString"},{"name":"GLN","alias":"graph land NO","type":"esriFieldTypeString"},{"name":"GLA","alias":"graph land alias","type":"esriFieldTypeString"},{"name":"GA","alias":"graph alias","type":"esriFieldTypeString"},{"name":"RGN","alias":"graph right dkbm","type":"esriFieldTypeString"}],"features":[{"UId":"230426111224554:18370983_162","attributes":{"R":"马铃薯(春)","T":"","A12":"118.77","A11":"0.0796","A21":"0.0796","A22":"118.77","GD":"","CN":[],"LN":null,"TC":"131","GLI":"","GLN":"","GLA":"","GA":"","RGN":"","RGC":0,"PP":null,"CalcA12":"118.77"},"geometry":{"rings":[[[116.534569574028,36.170811841522664],[116.53466383982018,36.17322740244801],[116.53773940719279,36.17327847929677],[116.53779832331297,36.172064807222085],[116.53785723943307,36.17201767432599],[116.53785723943307,36.17073330290715],[116.534569574028,36.170811841522664],[116.534569574028,36.170811841522664]]],"points":null,"spatialReference":{"wkid":4326}}},{"UId":"230426111240668:18370983_162","attributes":{"R":"马铃薯(春)","T":"","A12":"51.90","A11":"0.0348","A21":"0.0348","A22":"51.90","GD":"","CN":[],"LN":null,"TC":"131","GLI":"","GLN":"","GLA":"","GA":"","RGN":"","RGC":0,"PP":null,"CalcA12":"51.90"},"geometry":{"rings":[[[116.53592479069275,36.17062725389091],[116.53572447588431,36.16799959493311],[116.53717381243959,36.16798781170907],[116.53707954664733,36.170686170011045],[116.53592479069275,36.17062725389091],[116.53592479069275,36.17062725389091]]],"points":null,"spatialReference":{"wkid":4326}}}]}',
//     updateornot: 1,
//     insurcompanycode: '572aa49d-0013-4bdc-b6bf-8f9803f053b2',
//     insured: '山东省泰安市肥城市石横镇后衡鱼一村9户',
//     insureid: '202304280206564367581G185',
//     CreatedDate: '2023-04-28T02:06:56.437',
//     InsuranceId: '202304280206564367581G185',
//     LogStatus: null,
//     EffectStartDate: '2023-04-29T00:00:00',
//     EffectEndDate: '2023-07-31T00:00:00',
//     RegionCode: '370983106206'
//   }


/**
 * 更新到数据库
 */
async function connPgInstall () {


    let listgeojson = lkdata.pgGeom;
    //  console.log(lkdata.pgGeom)

    if (listgeojson) {


        console.log(`【更新数据】${listgeojson.length} 条`);


        const pool = new Pool(dbConfig);

        try {
            const client = await pool.connect();
            const sql = `INSERT INTO public.rskm_pt(geom, insurancenum, insurcompany_code, insured, start_date, end_date, region_code,
        insurance_id, create_date, update_data, insurancetarget, insured_quantity,srid_data,jsonb_data)VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
         $10, $11, $12, $13, $14);`;
            //  console.log(sql)
            for (const item of listgeojson) {
                //  console.log('入库内容');
                //  console.log(item);
                //  console.log('');
                await client.query(sql, [
                    item.wkt_geom,
                    item.insurancenum,
                    item.insurcompanycode,
                    item.insured,
                    item.EffectStartDate,
                    item.EffectEndDate,
                    item.RegionCode,
                    item.InsuranceId,
                    item.CreatedDate,
                    item.update_data,
                    item.insurancetarget,
                    item.insuredquantity,
                    item.srid,
                    //`to_jsonb(${item.T})`,
                    JSON.stringify(item.T)
                ]);
            }

            //   console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> +1批次 更新 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

            await client.release();
        } catch (error) {
            tryBool = false
            console.log('添加异常 跳过:', error);

        } finally {
            await pool.end();
        }
    }
}


// MD5加密函数
function getMd5Sum (str) {
    return crypto.createHash('md5').update(str).digest('hex');
}


// 获取当前时间减去5秒
function getCurrentTimeMinusFiveSeconds () {
    return new Date(new Date().getTime() - 5000).toISOString();
}


// 提交结果
async function submitResult () {
    const timet = getCurrentTimeMinusFiveSeconds();


    // 定义请求头
    const headers = {
        "Content-Type": "application/json",
        "ApiKey": apiKey,
        "Sign": getMd5Sum(`apikey=${apiKey}&time=${timet}&key=${privateKey}`),
        "Time": timet,
        "Action": action2,
    };

    const params = {
        "BillList": lkdata.listBill,
        "ResultList": lkdata.resultList,
    };

    // console.log(params)


    // 发送POST请求
    const response = await axios.post(url, params, { headers });

    // 打印响应状态码和内容
    if (response.status === 200) {
        // console.info(response.data);
        console.info("【数据闭合完成】");


    } else {
        console.log(`请求失败 ${response.status} ${response.statusText}`);
    }

    // 清理变量
    // delete timet;
    // delete action;
    delete headers;
    delete response;
    // console.log("【清理】")
    // clearData()


}

function randomDelay (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}







function getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function task () {
    await getInsData()
        .then(() => {
            // 数据处理完成后执行更新操作
            tryBool && connPgInstall();
        })
        .then(() => {
            //提交结果
            tryBool && submitResult();
        })


}

// 每隔 1 秒执行一次任务
setInterval(task, getRandomInt(3000, 9000));