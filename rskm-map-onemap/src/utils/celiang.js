import * as turf from "@turf/turf";
const getCeliang = (feature) => {
    let res = {};
    let coordinates = feature.geometry.coordinates;
    //   console.log(coordinates)
    switch (feature.geometry.type) {
        case "Point":
            const elevation = map.queryTerrainElevation(coordinates);
            res = {
                a: "经度:" + Number(coordinates[0]).toFixed(6),
                b: "纬度:" + Number(coordinates[1]).toFixed(7)

            }

            if (elevation) {
                res.c = "海拔:" + elevation.toFixed(2) + "米"
            }
            break;
        case "LineString":
            const line = turf.lineString(coordinates);
            const distance = turf.length(line, { units: 'kilometers' });
            res = {
                //  a: "起：" + Number(coordinates[0][0]).toFixed(6) + "," + Number(coordinates[0][1]).toFixed(7)+"\n终：" + Number(coordinates[coordinates.length - 1][0]).toFixed(6) + "," + Number(coordinates[coordinates.length - 1][1]).toFixed(7),
                //a: "长度(km)：" + Number(distance).toFixed(2) ,
                a: "长度：" + Number(distance * 1000).toFixed(2) + "米"
            }
            break;
        case "Polygon":
            const polygon = turf.polygon(coordinates);
            const area = turf.area(polygon);
            res = {
                //  a: "起：" + Number(coordinates[0][0]).toFixed(6) + "," + Number(coordinates[0][1]).toFixed(7)+"\n终：" + Number(coordinates[coordinates.length - 1][0]).toFixed(6) + "," + Number(coordinates[coordinates.length - 1][1]).toFixed(7),
                //a: "长度(km)：" + Number(distance).toFixed(2) ,
                a: "面积",
                b: Number(area).toFixed(2) + "平方米 \n" + Number(area / 666.667).toFixed(2) + "亩"
            }
            break;

        default:
            break;
    }

    return { "compute": res, "coordinates": coordinates };
};


export default getCeliang