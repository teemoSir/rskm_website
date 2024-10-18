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

const currentDate = new Date().toISOString().slice(0, 10);
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
function getMd5Sum(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

// 获取当前时间减去5秒
function getCurrentTimeMinusFiveSeconds() {
    return new Date(new Date().getTime() - 5000).toISOString();
}

// 转换到wkt
function geojsonToWKT(geojson) {
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
function installPgGeom(data, wkt, geojsons) {
    let T = JSON.stringify(geojsons);
    let R = "";
    let A12 = "";
    let A11 = "";

    console.log("【入库数据】：" + data["insurancenum"] + "," + data["insured"] + "," + data["insuredquantity"] + "," + data["insured"]);

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
    };
}

// 批量获取数据
async function getInsData() {
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
        timeout: 10000 // 设置超时时间为 5 秒
    };

    const data = { current: 1 };

    try {
        const response = await axios.post(url, data, { headers });
        if (response.status === 200) {
            const insuranceJson = response.data;
            console.log("【获取数据】：" + insuranceJson.length);
            for (const item of insuranceJson) {
                // 数据验证和清理
                // if (!validateItem(item)) {
                //     console.error('数据验证失败', item);
                //     continue;
                // }

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


                    const esriJsonData = JSON.parse(item.geojsonstr);
                    const geojson = arcgisToGeoJSON(esriJsonData);

                    // 使用 turf 清理和简化几何图形
                    //  const cleanedGeojson = turf.cleanCoords(geojson);
                    //   const simplifiedGeojson = turf.simplify(cleanedGeojson, {tolerance: 0.00001, highQuality: true});

                    const wkt = geojsonToWKT(geojson);
                    console.log(`【几何图形wkt】: ${wkt}`)

                    resultList.push(1);
                    listBill.push({
                        CreatedDate: item.CreatedDate,
                        InsuranceId: item.InsuranceId,
                        LogStatus: item.LogStatus,
                    });

                    pgGeom.push(installPgGeom(item, wkt, geojson));
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
async function connPgInstall() {
    const listgeojson = lkdata.pgGeom;

    if (listgeojson && listgeojson.length > 0) {
        console.log(`【更新数据】${listgeojson.length} 条`);
        const pools = new Pool({
            host: 'localhost',
            user: 'postgres',
            password: 'root',
            database: 'postgres',
            port: 5432,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        let client;

        try {
            client = await pools.connect();
            await client.query('BEGIN');
            console.log('数据更新成功:BEGIN');
            console.log(listgeojson)
            for (const item of listgeojson) {
                try {
                    await client.query(`INSERT INTO public.rskm_pt(geom, insurancenum, insurcompany_code, insured, start_date, end_date, region_code,
                        insurance_id, create_date, update_data, insurancetarget, insured_quantity,srid_data,jsonb_data) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
                         $10, $11, $12, $13, $14);`, [
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
                        JSON.stringify(item.T)
                    ]);
                } catch (error) {
                    console.error('数据插入异常:', error);
                    await client.query('ROLLBACK');
                    console.log('数据更新成功:ROLLBACK');
                    tryBool = false;
                    break;
                }
                console.log('数据更新成功:INSERT');
                console.log(item.insurancenum);
            }

            await client.query('COMMIT');
            console.log('数据更新成功:COMMIT');
        } catch (error) {
            console.log('添加异常 跳过:catch');
            if (client) await client.query('ROLLBACK');
            tryBool = false;
            console.log('添加异常 跳过:', error);
        } finally {
            console.log('添加异常 跳过:finally');
            if (client) {
                client.release();
                console.log('数据库连接已释放');
            }
            await pools.end();
            console.log('数据库连接池已关闭');
        }
    } else {
        console.log('没有数据需要更新');
    }
    return tryBool; // 添加返回值
}

// 提交结果
async function submitResult() {
    const timet = getCurrentTimeMinusFiveSeconds();

    // 定义请求头
    const headers = {
        "Content-Type": "application/json",
        "ApiKey": apiKey,
        "Sign": getMd5Sum(`apikey=${apiKey}&time=${timet}&key=${privateKey}`),
        "Time": timet,
        "Action": action2,
    };



    try {

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
    } catch (error) {
        console.error('提交结果异常', error);
    }
}


// 优化定时任务，使用单例模式管理数据库连接

// const pool = new Pool(dbConfig);

async function task() {
    //  const client = await pool.connect();

    await getInsData();
    //  let newDataCount = lkdata.listBill.length;
    // if (newDataCount > 1) {
    //     timeMax = 5;

    // } else {
    //     timeMax = 60;
    // }


    if (tryBool) {
        console.log("【请求频率】");
        await connPgInstall();
        console.log("【submitResult】");
        await submitResult();
    }

}

// 每隔 6 到 9 秒执行一次任务
setInterval(task, getRandomInt(5000, 8000));

// 获取随机整数
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



// // 任务执行函数
// async function task() {
//     try {
//         await getInsData();

//         if (tryBool) {
//             await connPgInstall();
//             await submitResult();
//         }
//     } catch (error) {
//         console.error('任务执行出错:', error);
//     }
// }

// // 每隔 6 到 9 秒执行一次任务
// setInterval(task, getRandomInt(4000, 5000));

// // 获取随机整数
// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }