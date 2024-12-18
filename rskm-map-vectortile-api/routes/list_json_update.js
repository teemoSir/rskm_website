// route query
const sql = (params, query) => {
    return ` update ${params.table} set ${query.set ? query.set : ""} where 1=1 ${query.filter ? query.filter : ""}
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
            description: 'where sql 条件and 起头'
        },
        set: {
            type: 'string',
            description: '更新要素，必填'
        },
    }
}

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/list_json_update/:table',
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
                        if (err) {
                            request.log.error(err)
                            return reply.code(500).send({ error: "SQL execution error." })
                        }
                        if (result.rowCount > 0) {
                            reply.send({ success: true, message: "Update successful." })
                        } else {
                            reply.send({ success: false, message: "No rows updated." })
                        }
                    }
                )
            }
        }
    })
    next()
}

module.exports.autoPrefix = '/v1'
