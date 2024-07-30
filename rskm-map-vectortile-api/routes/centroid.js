// route query
const sql = (params, query) => {
  return `
  SELECT
    -- Get X and Y of (potentially) geographically transformed geometry
    ST_X(
      ST_Transform(
        ${query.force_on_surface ? 'ST_PointOnSurface' : 'ST_Centroid'}(
          ${query.geom_column}
        ), ${query.srid})
    ) as x,
    ST_Y(
      ST_Transform(
        ${query.force_on_surface ? 'ST_PointOnSurface' : 'ST_Centroid'}(
          ${query.geom_column}
        ), ${query.srid})
    ) as y

  FROM
    ${params.table}

  -- Optional filter
  ${query.filter ? `WHERE ${query.filter}` : ''}

  `
}

// route schema
const schema = {
  description: '获取图形的质心。',
  tags: ['api'],
  summary: 'feature(s) centroids',
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
      description: '返回质心的SRID。',
      default: 4326
    },
    filter: {
      type: 'string',
      description: 'SQL WHERE语句的可选筛选器参数。'
    },
    force_on_surface: {
      type: 'boolean',
      description: 'Set <em>true</em> to force point on surface. The default is <em>false</em>.',
      default: false
    }
  }
}

// create route
module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/centroid/:table',
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
          reply.send(err || result.rows)
        })
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
