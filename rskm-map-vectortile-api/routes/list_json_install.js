// route query
const sql = (params, body) => {
    const columns = Object.keys(body.data).join(", ");
    const values = Object.values(body.data).map(value => `'${value}'`).join(", ");
    return `INSERT INTO ${params.table} (${columns}) VALUES (${values})`
}

// route schema
const schema = {
    description: '使用POST方式插入数据到指定的表中。',
    tags: ['meta'],
    summary: 'insert json data',
    params: {
        table: {
            type: 'string',
            description: '要插入数据的表名。'
        }
    },
    body: {
        type: 'object',
        properties: {
            data: {
                type: 'object',
                description: '要插入的数据对象，键值对形式。'
            }
        },
        required: ['data']
    }
}

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'POST',
        url: '/list_json_install/:table',
        schema: schema,
        handler: function (request, reply) {
            fastify.pg.connect(onConnect)

            function onConnect (err, client, release) {
                if (err) {
                    request.log.error(err)
                    return reply.code(500).send({ error: "数据库连接错误。" })
                }

                client.query(
                    sql(request.params, request.body),
                    function onResult (err, result) {
                        release()
                        if (err) {
                            request.log.error(err)
                            return reply.code(500).send({ error: "SQL执行错误。" })
                        }
                        if (result.rowCount > 0) {
                            reply.send({ success: true, message: "添加成功。" })
                        } else {
                            reply.send({ success: false, message: "没有行被更新。" })
                        }
                    }
                )
            }
        }
    })
    next()
}

module.exports.autoPrefix = '/v1'
