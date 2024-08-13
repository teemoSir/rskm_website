
/**
 * 判断根据ArcGIS的Geometry，获取转换成GeoJSON应该被赋予的类型
 * @param {Object} geometry
 * @returns
 */
const getGeometryType = (geometry) => {
    let _geometryType = ''
    // 对于rings，只返回一个大类型Polygon，后续会根据rings的具体情况，再去设置细分类型
    if (geometry && geometry.rings) {
        _geometryType = 'Polygon'
    }
    if (geometry && geometry.paths) {
        _geometryType = geometry.paths && geometry.paths.length > 1 ? 'MultiLineString' : 'LineString'
    }
    if (geometry && geometry.points) {
        _geometryType = 'MultiPoint'
    }
    if (geometry && (Array.isArray(geometry) || (geometry.x && geometry.y))) {
        _geometryType = 'Point'
    }
    return _geometryType
}

/**
 * 判断图形顺时针、逆时针的方向
 * @param {*} coordArr
 [
  [[x,y],[x,y]], // 一个面
  [[x,y],[x,y]]  // 一个面
 ]
 * @returns
 * handType: 返回的顺序和数组地块的顺序一一对应,true：为顺时针，false：逆时针
 * trueCount：返回true的总数，用于判断是否多面
 */
const checkPolygonCoordsHand = (coordArr) => {
    let handType = []
    let trueCount = 0;

    coordArr.forEach((cods) => {
        let type = 0
        // 多边形x坐标最大值的坐标点序号，这个点一定是多边形的凸点
        let maxIndex = 0
        let coords = cods.concat()
        // 坐标中头尾相同点坐标，相同的则去掉左后一个点
        if (coords[0][0] === coords[coords.length - 1][0] && coords[0][1] === coords[coords.length - 1][1]) {
            coords.splice(coords.length - 1, 1)
        }
        coords.forEach((cod, index2) => {
            // 取第一个出现的最大x坐标的序号
            if (cod[0] > coords[maxIndex][0]) {
                maxIndex = index2
            }
        })

        if (maxIndex === 0) {
            // 最大的x坐标点等于多边形坐标点集数组的第一个点则取最后一个点为p1，下一个点为p3，本身为p2
            type = (coords[maxIndex][0] - coords[coords.length - 1][0]) * (coords[maxIndex + 1][1] - coords[maxIndex][1]) - (coords[maxIndex][1] - coords[coords.length - 1][1]) * (coords[maxIndex + 1][0] - coords[maxIndex][0])
        } else if (maxIndex < coords.length - 1) {
            // 最大的x坐标点等于多边形坐标点集数组的中间某个点则取前一个点为p1，下一个点为p3，本身为p2
            type = (coords[maxIndex][0] - coords[maxIndex - 1][0]) * (coords[maxIndex + 1][1] - coords[maxIndex][1]) - (coords[maxIndex][1] - coords[maxIndex - 1][1]) * (coords[maxIndex + 1][0] - coords[maxIndex][0])
        } else {
            // 最大的x坐标点等于多边形坐标点集数组的最后一个点则往前取第一个点为p1，下一个点为p3，本身为p2
            type = (coords[maxIndex][0] - coords[maxIndex - 1][0]) * (coords[0][1] - coords[maxIndex][1]) - (coords[maxIndex][1] - coords[maxIndex - 1][1]) * (coords[0][0] - coords[maxIndex][0])
        }

        // 大于 0，图形路径走向为逆时针；小于 0，图形路径走向为顺时针
        if (type < 0) {
            trueCount++
        }
        handType.push(type < 0)
    })
    return {
        trueCount: trueCount,
        handType: handType,
    }
}

/**
 * ArcGIS类型的Feature转GeoJSON
 * @param {*} features
 * @returns
 */
const convertAToGeojson = (data) => {
    let features = data.features || [];
    let _geoJsonFeatures = []
    // 将返回的数据转化成GeoJSON格式
    // console.log("=======1=======")
    // console.log(features.length)
    // console.log("=======2=======")
    if (features.length) {

        features.map((feature) => {

            let _geojsonFeature = {
                type: 'Feature',
                properties: feature.attributes ? feature.attributes : {},
            }
            if (feature.geometry) {

                // 判断空间类型
                let _geometryType = getGeometryType(feature.geometry)
                let _handObj
                // 对于Polygon类型的，进一步根据图形的顺、逆值，进行类型细分
                if (_geometryType == 'Polygon') {
                    _handObj = checkPolygonCoordsHand(feature.geometry.rings)
                    // 如果顺、逆时针数组里，存在多个顺时针，即true的数量大于1，则表明多面
                    _geometryType = _handObj.trueCount > 1 ? 'MultiPolygon' : 'Polygon'
                }
                _geojsonFeature.geometry = {
                    type: _geometryType,
                    coordinates: [],
                }

                switch (_geometryType) {

                    case 'MultiPolygon':
                        let _rings = []
                        let startIndex = 0
                        let interval = 0
                        for (let i = 0, len = _handObj.handType.length; i < len; i++) {
                            if (i == 0 && _handObj.handType[i] == true) {
                                startIndex = 0
                                interval++
                            }
                            if (i >= 1 && _handObj.handType[i] == false) {
                                interval++
                            }
                            // 截取true---下一个true之间的数组，[true, false, false, true] => [true, false, false)
                            if (i >= 1 && _handObj.handType[i] == true) {
                                let tempArr = feature.geometry.rings.slice(startIndex, i)
                                _rings.push(tempArr)
                                startIndex = i
                                interval = 0
                            }
                            // 在数组最后一位时，需要对其顺逆时针进行判断，true则截取当前值； false则截取起始位置直至最后
                            if (i == _handObj.handType.length - 1) {
                                if (_handObj.handType[i] == true) {
                                    _rings.push(feature.geometry.rings.slice(i))
                                } else {
                                    _rings.push(feature.geometry.rings.slice(startIndex))
                                }
                            }
                        }
                        _geojsonFeature.geometry.coordinates = _rings
                 
                        break
                    case 'Polygon':
                        _geojsonFeature.geometry.coordinates = feature.geometry.rings
                        break
                    case 'MultiLineString':
                        let _paths = []
                        feature.geometry.paths.map((path) => {
                            _paths.push(path)
                        })
                        _geojsonFeature.geometry.coordinates = _paths
                        break
                    case 'LineString':
                        _geojsonFeature.geometry.coordinates = feature.geometry.paths[0]
                        break
                    case 'MultiPoint':
                        _geojsonFeature.geometry.coordinates = feature.geometry.points
                        break
                    case 'Point':
                        _geojsonFeature.geometry.coordinates = [feature.geometry.x, feature.geometry.y]
                        break
                }
            }
            _geoJsonFeatures.push(_geojsonFeature)
        })
    }
    return {
        type: 'FeatureCollection',
        features: _geoJsonFeatures,
    }
}

module.exports = { convertAToGeojson }