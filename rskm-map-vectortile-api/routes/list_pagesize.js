// route query
const sql = (params, query) => {

    if (query.page <= 0) {
        query.page = 1
    }
    if (query.size > 50) {
        query.size = 50
    }

    //let str = ` SELECT * FROM ___get_paged_data('${params.table}', ${query.page}, ${query.size});`

    let str = ``
    if (query.year) {
        str = `select * from  ___get_paged_data_v2('${params.table}', $$and EXTRACT(YEAR FROM TO_DATE(start_date, 'YYYY-MM-DD'))=' ${query.year}'$$,${query.page} , ${query.size} )`
    }
    else {
        str = ` SELECT * FROM ___get_paged_data('${params.table}', ${query.page}, ${query.size});`
    }

    return str
}

// route schema
const schema = {
    description: '返回查询的列表',
    tags: ['meta'],
    summary: 'list json columns',
    params: {
        table: {
            type: 'string',
            description: '表名'
        }

    },
    querystring: {
        page: {
            type: 'integer',
            description: '页码，默认为1',
            default: 1
        },
        size: {
            type: 'integer',
            description: '每页数据条数，默认为10',
            default: 10
        },
        year: {
            type: 'integer',
            description: '数据年份，加入年份条件',
        }
    }
}

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/list_pagesize/:table',
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
