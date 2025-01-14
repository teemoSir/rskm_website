const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Bing Maps 瓦片 URL 模板
const BING_TILE_URL = 'https://ecn.t{s}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=1';

// 瓦片下载函数
const tilesDirectory = '/absolute/path/to/gogogo';

async function downloadTile (s, z, x, y) {
    const quadkey = getQuadKey(x, y, z);
    const url = BING_TILE_URL.replace('{s}', s).replace('{quadkey}', quadkey);
    const tilePath = path.join(tilesDirectory, `${z}`, `${x}`, `${y}.jpeg`);

    // 创建目录
    fs.mkdirSync(path.dirname(tilePath), { recursive: true });

    try {
        await new Promise(resolve => setTimeout(resolve, 100)); // 等待 100 毫秒
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        fs.writeFileSync(tilePath, response.data);
        console.log(`Downloaded tile: ${tilePath}`);
    } catch (error) {
        console.error(`Error downloading tile ${tilePath}:`, error.message);
    }
}

// 生成四叉树键
function getQuadKey (x, y, z) {
    let quadkey = '';
    for (let i = z; i > 0; i--) {
        let digit = 0;
        const mask = 1 << (i - 1);
        if ((x & mask) !== 0) digit += 1;
        if ((y & mask) !== 0) digit += 2;
        quadkey += digit.toString();
    }
    return quadkey;
}

// 爬取瓦片
async function downloadTiles (z, xStart, xEnd, yStart, yEnd) {
    const subdomains = ['0', '1', '2']; // Bing 的子域
    const configDir = path.join(__dirname, 'bingMapConfig');
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    let downloadRecord = {};

    // 读取下载记录并监测json中是否有有效对象
    const recordFilePath = path.join(configDir, `download_record_level_${z}.json`);
    if (fs.existsSync(recordFilePath)) {
        const recordData = fs.readFileSync(recordFilePath, 'utf-8');
        try {
            const parsedData = JSON.parse(recordData);
            if (typeof parsedData === 'object' && parsedData !== null) {
                downloadRecord = parsedData;
            } else {
                console.warn(`无效的JSON对象: ${recordFilePath}`);
            }
        } catch (error) {
            console.error(`解析JSON文件时出错: ${recordFilePath}`, error.message);
        }
    }

    const totalTiles = (xEnd - xStart + 1) * (yEnd - yStart + 1) * subdomains.length;
    let downloadedTiles = 0;

    for (let x = xStart; x <= xEnd; x++) {
        for (let y = yStart; y <= yEnd; y++) {
            for (const s of subdomains) {
                const tileKey = `${z}_${x}_${y}_${s}`;
                if (!downloadRecord[tileKey]) {
                    await downloadTile(s, z, x, y);
                    downloadRecord[tileKey] = true;
                    fs.writeFileSync(recordFilePath, JSON.stringify(downloadRecord, null, 2));
                }
                downloadedTiles++;
                console.log(`下载进度: ${((downloadedTiles / totalTiles) * 100).toFixed(2)}% (${downloadedTiles}/${totalTiles})`);
            }
        }
    }
}

// 主函数
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    (async () => {
        const zoomLevel = 20; // 设置缩放级别
        const maxIndex = Math.pow(2, zoomLevel) - 1; // 根据缩放级别计算最大索引值
        const xStart = 0; // 设置 x 范围
        const xEnd = maxIndex;   // 设置 x 范围
        const yStart = 0; // 设置 y 范围
        const yEnd = maxIndex;   // 设置 y 范围

        const numThreads = 4; // 设置线程数量
        const xRange = Math.ceil((xEnd - xStart + 1) / numThreads);

        const promises = [];
        for (let i = 0; i < numThreads; i++) {
            const xStartThread = xStart + i * xRange;
            const xEndThread = Math.min(xStart + (i + 1) * xRange - 1, xEnd);

            promises.push(new Promise((resolve, reject) => {
                const worker = new Worker(__filename, {
                    workerData: { zoomLevel, xStartThread, xEndThread, yStart, yEnd }
                });

                worker.on('message', resolve);
                worker.on('error', reject);
                worker.on('exit', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });
            }));
        }

        await Promise.all(promises);
        console.log('所有瓦片下载完成');
    })();
} else {
    const { zoomLevel, xStartThread, xEndThread, yStart, yEnd } = workerData;
    downloadTiles(zoomLevel, xStartThread, xEndThread, yStart, yEnd).then(() => {
        parentPort.postMessage('完成');
    }).catch((error) => {
        parentPort.postMessage(`错误: ${error.message}`);
    });
}