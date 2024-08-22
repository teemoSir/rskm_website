// route query
const sql = (params, query) => {

    if (query.page <= 0) {
        query.page = 1
    }
    if (query.size > 50) {
        query.size = 50
    }

    let filter = ""
    if (query.year) {
        filter += ` and EXTRACT(YEAR FROM TO_DATE(start_date, 'YYYY-MM-DD'))=' ${query.year}' `
    }
    if (query.filter) {
        filter += ` ` + query.filter
    }


    let str = `select * from  ___get_paged_data('${params.table}',$$${ filter }$$,${query.page},${query.size} )`

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
        },
        filter: {
            type: 'string',
            description: '筛选条件',
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
