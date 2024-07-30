// route query
const sql = (params, query) => {
  return `
  SELECT
    ST_Extent(ST_Transform(${query.geom_column}, ${query.srid})) as bbox

  FROM
    ${params.table}

  -- Optional where filter
  ${query.filter ? `WHERE ${query.filter}` : '' }
  `
}

// route schema
const schema = {
  description: 'Gets the bounding box of a feature(s).',
  tags: ['api'],
  summary: 'minimum bounding rectangle',
  params: {
    table: {
      type: 'string',
      description: '要查询的表或视图的名称。'
    }
  },
  querystring: {
    geom_column: {
      type: 'string',
      description: '表的几何图形列。',
      default: 'geom'
    },
    srid: {
      type: 'integer',
      description: '返回质心的SRID。默认值为<em>4326</em>WGS84 Lat/Lng。',
      default: 4326
    },
    filter: {
      type: 'string',
      description: 'SQL WHERE语句的可选筛选器参数。'
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/bbox/:table',
    schema: schema,
    handler: function (request, reply) {
      fastify.pg.connect(onConnect)

      function onConnect(err, client, release) {
        if (err) {
          request.log.error(err)
          return reply.code(500).send({ error: "Database connection error." })
        }

        client.query(
          sql(request.params, request.query),
          function onResult(err, result) {
            release()
            reply.send(err || result.rows)
          }
        )
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
