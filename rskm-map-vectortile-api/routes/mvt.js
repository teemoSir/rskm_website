// route query
const sql = (params, query) => {



    let lyz = 0.00000001;
    if (params.z <= 7) {
        lyz = 1500;
    } else if (params.z > 7 && params.z < 9.99) {
        lyz = 1000;
    } else if (params.z > 9.99 && params.z < 11.99) {
        lyz = 100;
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

      

        -- Optional Filter
        ${query.filter ? ` AND ${query.filter}` : ''}
    )
    SELECT ST_AsMVT(mvtgeom.*, '${params.table}', 4096, 'geom' ${query.id_column ? `, '${query.id_column}'` : ''
        }) AS mvt from mvtgeom;
  `
}

// -- 移除坐标异常
// AND EXISTS (
//     SELECT 1
//     FROM ST_DumpPoints(geom) AS point
//     WHERE ST_X(point.geom) < -180 
//         OR ST_X(point.geom) > 180 
//         OR ST_Y(point.geom) < -90 
//         OR ST_Y(point.geom) > 90
// )

// route schema  ${simplifys ? (' and area_mu > ' + simplifys) : ''}
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

const simplify = ((type, zoom) => {
    // if (type !== "rskm_pt") return 0;
    // const zoomNumber = Number(zoom);
    // if (zoomNumber < 7) return 5500;
    // if (zoomNumber < 8) return 4500;
    // if (zoomNumber < 10) return 3500;
    // if (zoomNumber < 12) return 1000;
    return 0;
})

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/mvt/:table/:z/:x/:y',
        schema: schema,
        handler: function (request, reply) {
            fastify.pg.connect(onConnect)

            function onConnect (err, client, release) {
                if (err) {
                    request.log.error(err)
                    return reply.code(500).send({ error: "Database connection error." })
                }

                client.query(sql(request.params, request.query), function onResult (
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
