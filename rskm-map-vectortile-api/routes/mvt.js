// route query
const sql = (params, query) => {


    let simplify = getSimplify(params.table, params.z)
    return `
    WITH mvtgeom as (
      SELECT
        ST_AsMVTGeom (
        ${simplify > 1 ? `ST_Simplify(` : ``} ST_Transform(${query.geom_column}, 3857)  ${simplify > 1 ? `, ${simplify})` : ``},
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

const getSimplify = ((type, zoom) => {
    let jhv2 = -1;
    if (type == "rskm_pt") {
        if (Number(zoom) < 8) {
            jhv2 = 800;
        }
    } else if (Number(zoom) < 10) {
        jhv2 = 100;
    }
    else if (Number(zoom) < 12) {
        jhv2 = 0.1;
    }
    else if (Number(zoom) < 14) {
        jhv2 = 0.01;
    }
    else {
        jhv2 = -1;
    }



    return jhv2;
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
