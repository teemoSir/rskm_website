const bboxFromGeojsonPolygon = (geometry) => {
    // 确保传入的是多边形
    if (geometry.type !== 'Polygon') {
        throw new Error("提供的GeoJSON对象不是一个多边形。");
    }

    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;

    // 遍历多边形的每个环
    geometry.coordinates.forEach(ring => {
        ring.forEach(point => {
            // 更新最小和最大坐标
            minLon = Math.min(minLon, point[0]);
            minLat = Math.min(minLat, point[1]);
            maxLon = Math.max(maxLon, point[0]);
            maxLat = Math.max(maxLat, point[1]);
        });
    });

    return [minLon, minLat, maxLon, maxLat];
}


export default bboxFromGeojsonPolygon