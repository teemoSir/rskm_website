// route query
const sql = (params, query) => {
    return ` SELECT * FROM ${params.table} where 1=1 ${query.filter ? query.filter : ""}
    `
}

// route schema
const schema = {
    description: 'Returns a list of columns in the specified table.',
    tags: ['meta'],
    summary: 'list json columns',
    params: {
        table: {
            type: 'string',
            description: 'The name of the table or view to query.'
        }
    },
    querystring: {
        filter: {
            type: 'string',
            description: 'where sql 条件以and 起头'
        },
    }
}

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/list_json/:table',
        schema: schema,
        handler: function (request, reply) {
            fastify.pg.connect(onConnect)

            function onConnect (err, client, release) {
                if (err) {
                    request.log.error(err)
                    return reply.code(500).send({ error: "Database connection error." })
                }

                client.query(
                    sql(request.params, request.query),
                    function onResult (err, result) {
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
