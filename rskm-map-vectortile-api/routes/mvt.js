// route query
const sql = (params, query) => {


    // let simplify = getSimplify(params.table, params.z)
    let lyz = 0.00000001;
    if (params.z <= 7) {
        lyz = 100;
    } else if (params.z > 7 && params.z < 9.99) {
        lyz = 50;
    } else if (params.z > 9.99 && params.z < 12.99) {
        lyz = 10;
    }
    return `
    WITH mvtgeom as (
      SELECT
        ST_AsMVTGeom (
        ST_Simplify(ST_Transform(${query.geom_column}, 3857),${lyz}) ,
          ST_TileEnvelope(${params.z}, ${params.x}, ${params.y})
        ) as geom
        ${query.columns ? `, ${query.columns}` : ''}
        ${query.id_column ? `, ${query.id_column}` : ''}
      FROM
        ${params.table},
        (SELECT ST_SRID(${query.geom_column}) AS srid FROM ${params.table} WHERE ${query.geom_column} IS NOT NULL LIMIT 1) a
      WHERE
        ST_Intersects(
          ${query.geom_column},
          ST_Transform(
            ST_TileEnvelope(${params.z}, ${params.x}, ${params.y}),
            srid
          )
        )

        -- 移除坐标异常
        AND EXISTS (
            SELECT 1
            FROM ST_DumpPoints(geom) AS point
            WHERE ST_X(point.geom) < -180 
                OR ST_X(point.geom) > 180 
                OR ST_Y(point.geom) < -90 
                OR ST_Y(point.geom) > 90
        )

        -- Optional Filter
        ${query.filter ? ` AND ${query.filter}` : ''}
    )
    SELECT ST_AsMVT(mvtgeom.*, '${params.table}', 4096, 'geom' ${query.id_column ? `, '${query.id_column}'` : ''
        }) AS mvt from mvtgeom;
  `
}

// route schema
const schema = {
    description:
        '将表作为Mapbox Vector Tile（MVT）返回。返回的图层名称是表的名称。',
    tags: ['feature'],
    summary: 'return MVT',
    params: {
        table: {
            type: 'string',
            description: '表或视图的名称。'
        },
        z: {
            type: 'integer',
            description: 'Z value of ZXY tile.'
        },
        x: {
            type: 'integer',
            description: 'X value of ZXY tile.'
        },
        y: {
            type: 'integer',
            description: 'Y value of ZXY tile.'
        }
    },
    querystring: {
        geom_column: {
            type: 'string',
            description: '表的可选几何图形列。默认为geom。',
            default: 'geom'
        },
        columns: {
            type: 'string',
            description:
                '随MVT返回的可选列。默认为无列。'
        },
        id_column: {
            type: 'string',
            description:
                '要与Mapbox GL要素状态一起使用的可选id列名。此列必须是整数或转换为整数的字符串。'
        },
        filter: {
            type: 'string',
            description: 'SQL WHERE语句的可选筛选器参数。'
        }
    }
}

// const getSimplify = ((type, zoom) => {
//     let jhv2 = 0;
//     // if (type == "rskm_pt") {
//     //     if (Number(zoom) < 7) {
//     //         jhv2 = 5500;
//     //     }
//     //     else if (Number(zoom) < 8) {
//     //         jhv2 = 4500;
//     //     }
//     //     else if (Number(zoom) < 10) {
//     //         jhv2 = 3500;
//     //     }
//     //     else if (Number(zoom) < 12) {
//     //         jhv2 = 1000;
//     //     }
//     //     else {
//     //         jhv2 = 0;
//     //     }
//     // }



//     return jhv2;
// })

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/mvt/:table/:z/:x/:y',
        schema: schema,
        handler: function (request, reply) {
            fastify.pg.connect(onConnect)

            function onConnect(err, client, release) {
                if (err) {
                    request.log.error(err)
                    return reply.code(500).send({ error: "Database connection error." })
                }

                client.query(sql(request.params, request.query), function onResult(
                    err,
                    result
                ) {
                    release()
                    if (err) {
                        reply.send(err)
                    } else {
                        const mvt = result.rows[0].mvt
                        if (mvt.length === 0) {
                            reply.code(204).send()
                        }
                        reply.header('Content-Type', 'application/x-protobuf').send(mvt)
                    }
                })
            }
        }
    })
    next()
}

module.exports.autoPrefix = '/v1'
