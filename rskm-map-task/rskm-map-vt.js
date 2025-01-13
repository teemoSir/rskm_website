const axios = require('axios');
const { Pool } = require('pg');
const { arcgisToGeoJSON } = require("@terraformer/arcgis");
const crypto = require("crypto");
const turf = require('@turf/turf');
const { convertAToGeojson } = require('./util/convertAToGeojson');
const fs = require('fs');
const path = require('path');
const wellknown = require('wellknown');
const WKT = require('terraformer-wkt-parser');

const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const currentDate = new Date().toISOString().slice(0, 12);
const logFilePath = path.join(logDirectory, `log_${currentDate}.txt`);
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

const originalConsoleLog = console.log;
console.log = function (message) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    logStream.write(logMessage);
    originalConsoleLog.apply(console, arguments);
};

// PostGIS数据库连接参数
let dbConfig = {
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
const size = 1;
let tryBool = true;
let lkdata = undefined;


// MD5加密函数
function getMd5Sum (str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

// 获取当前时间减去5秒
function getCurrentTimeMinusFiveSeconds () {
    return new Date(new Date().getTime() - 5000).toISOString();
}

// 转换到wkt
function geojsonToWKT (geojson) {
    if (!geojson || geojson.type !== 'FeatureCollection') {
        throw new Error('Invalid GeoJSON FeatureCollection.');
    }

    const features = geojson.features;
    let wktParts = [];

    features.forEach(feature => {
        const geometry = feature.geometry;
        let wkt = '';

        switch (geometry.type) {
            case 'Point':
                wkt = `POINT (${geometry.coordinates.join(' ')})`;
                break;
            case 'LineString':
                wkt = `LINESTRING (${geometry.coordinates.map(point => point.join(' ')).join(', ')})`;
                break;
            case 'Polygon':
                wkt = `((${geometry.coordinates.map(ring => ring.map(point => point.join(' ')).join(', ')).join('), (')}))`;
                break;
            case 'MultiPoint':
                wkt = `MULTIPOINT (${geometry.coordinates.map(point => point.join(' ')).join(', ')})`;
                break;
            case 'MultiLineString':
                wkt = `MULTILINESTRING (${geometry.coordinates.map(line => `(${line.map(point => point.join(' ')).join(', ')})`).join(', ')})`;
                break;
            case 'MultiPolygon':
                wkt = `${geometry.coordinates.map(polygon => `(${polygon.map(ring => `(${ring.map(point => point.join(' ')).join(', ')})`).join(', ')})`).join(', ')}`;
                break;
            default:
                throw new Error(`Unsupported geometry type: ${geometry.type}`);
        }

        wktParts.push(wkt);
    });

    return `MULTIPOLYGON (${wktParts.join(', ')})`
}

// 读取json到几何图形列
function installPgGeom (data, wkt, geojsons) {
    let T = JSON.stringify(geojsons);
    let R = "";
    let A12 = "";
    let A11 = "";

    console.log("===下【入库数据】");
    console.log(T);
    console.log("===上【入库数据】");
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
        "T": "",
        "A12": A12,
        "A11": A11,
        "update_data": new Date().toLocaleString()
    };
}
/**
 * 日志
 * @param {*} insuranceJson 
 */
function saveInsuranceDataToLog (insuranceJson) {
    const logDirectory = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    const logFilePath = path.join(logDirectory, `insurance_data_${currentDate}.log`);
    const logData = JSON.stringify(insuranceJson, null, 2) + '\n';

    fs.appendFileSync(logFilePath, logData);
}

/**
 * 
 * @param {*} geojsonStr 
 * @returns 
 */
function parseGeoJSONToWKT (geojson) {
    const wkts = [];

    if (geojson.type === "FeatureCollection" && Array.isArray(geojson.features)) {
        for (const feature of geojson.features) {
            if (feature.geometry) {
                const geometry = feature.geometry;
                let wkt = '';

                switch (geometry.type) {
                    case 'Point':
                        wkt = `POINT (${geometry.coordinates.join(' ')})`;
                        break;
                    case 'LineString':
                        wkt = `LINESTRING (${geometry.coordinates.map(point => point.join(' ')).join(', ')})`;
                        break;
                    case 'Polygon':
                        wkt = `MULTIPOLYGON (((${geometry.coordinates.map(ring => ring.map(point => point.join(' ')).join(', ')).join('), (')})))`;
                        break;
                    case 'MultiPoint':
                        wkt = `MULTIPOINT (${geometry.coordinates.map(point => point.join(' ')).join(', ')})`;
                        break;
                    case 'MultiLineString':
                        wkt = `MULTILINESTRING (${geometry.coordinates.map(line => `(${line.map(point => point.join(' ')).join(', ')})`).join(', ')})`;
                        break;
                    case 'MultiPolygon':
                        wkt = `${geometry.coordinates.map(polygon => `(${polygon.map(ring => `(${ring.map(point => point.join(' ')).join(', ')})`).join(', ')})`).join(', ')}`;
                        break;
                    default:
                        throw new Error(`Unsupported geometry type: ${geometry.type}`);
                }

                wkts.push({
                    wkt: wkt,
                    properties: feature.properties
                });
            }
        }
    }

    return wkts;
}

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
        timeout: 50000 // 设置超时时间为 5 秒
    };

    const data = { current: 1 };

    try {
        const response = await axios.post(url, data, { headers });
        if (response.status === 200) {
            const insuranceJson = response.data;
            // 日志
            console.log("————下.【源数据】：");
            console.log(JSON.stringify(response.data));
            console.log("————上.【源数据】：");

            console.log("【获取数据】：" + insuranceJson.length);
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

                try {

                    // 转换原始数据
                    let source = JSON.parse(item.geojsonstr);
                    const geojson = arcgisToGeoJSON(source);

                    const wkts = parseGeoJSONToWKT(geojson);
                    console.log(`【差分wkt】`);
                    console.log(JSON.stringify(wkts));

                    // const wkt = geojsonToWKT(geojson);
                    // console.log(`【几何图形wkt】: ${wkt}`)
                    // pgGeom.push(installPgGeom(item, wkt, geojson));

                    for (let i in wkts) {
                        pgGeom.push(installPgGeom(item, wkts[i], geojson));
                    }

                    // 回调值
                    resultList.push(1);
                    listBill.push({
                        CreatedDate: item.CreatedDate,
                        InsuranceId: item.InsuranceId,
                        LogStatus: item.LogStatus,
                    });
                } catch (error) {
                    console.error('几何图形处理错误', error);
                    resultList.push(-1);
                    listBill.push({
                        CreatedDate: item.CreatedDate,
                        InsuranceId: item.InsuranceId,
                        LogStatus: item.LogStatus,
                    });
                }
            }

            lkdata = {
                "pgGeom": pgGeom,
                "resultList": resultList,
                "listBill": listBill
            };
        } else {
            console.error('请求失败' + response.status + response.data);
            tryBool = false;
        }
    } catch (error) {
        console.error('数据请求异常', error);
        tryBool = false;
    }
}

// 更新到数据库
// Start of Selection
async function updatePgInstall () {
    const listgeojson = lkdata.pgGeom;

    if (listgeojson.length > 0) {
        console.log(`【更新数据】${listgeojson.length} 条`);
        const pools = new Pool(dbConfig);
        let client;

        try {
            client = await pools.connect();
            await client.query('BEGIN');
            // console.log('数据更新:BEGIN');
            // console.log(JSON.stringify(listgeojson));

            for (const item of listgeojson) {
                //  try {
                console.log('入库数据:INSERT');
                console.log(JSON.stringify(item))

                await client.query(`INSERT INTO public.rskm_pt(geom, insurancenum, insurcompany_code, insured, start_date,
                     end_date, region_code,insurance_id, create_date, update_data, insurancetarget, insured_quantity,
                      srid_data, jsonb_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
                    [
                        item.wkt_geom.wkt,
                        item.insurancenum,
                        item.insurcompanycode,
                        item.wkt_geom.properties["R"],
                        item.EffectStartDate,
                        item.EffectEndDate,
                        item.RegionCode,
                        item.InsuranceId,
                        item.CreatedDate,
                        item.update_data,
                        item.insurancetarget,
                        item.insuredquantity,
                        item.srid,
                        JSON.stringify(item.wkt_geom.properties)
                    ]);
            }
            console.log('数据更新:COMMIT');
            await client.query('COMMIT');

        } catch (error) {
            console.log('添加异常 跳过:', error);
            tryBool = false;
            if (client) await client.query('ROLLBACK');
        } finally {
            if (client) client.release();
        }
    }

    return tryBool; // 添加返回值
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



    // try {

    const params = {
        "BillList": lkdata.listBill,
        "ResultList": lkdata.resultList,
    };
    const response = await axios.post(url, params, { headers });

    if (response.status === 200) {
        console.log("【数据闭合完成】" + JSON.stringify(params));

    } else {
        console.log(`请求失败 ${response.status} ${response.statusText}`);
    }

}

// 优化定时任务，使用单例模式管理数据库连接

async function task () {
    console.log("getInsData")
    await getInsData();

    if (tryBool) {
        console.log("【请求频率】");
        updatePgInstall();
        console.log("【submitResult】");
        submitResult();
    }

}

// 每隔 6 到 9 秒执行一次任务
setInterval(task, getRandomInt(4000, 6000));

// 获取随机整数
function getRandomInt (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



