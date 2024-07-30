// route query
const sql = (params) => {

    let sql = ``;

    let arr = ["国寿财", "人保", "国元", "平安山东", "中华", "泰山", "安华"]
    // let arr = removeWhitespace(params.where).split(",");

    let where = ``;
    let assr = [];
    if (params.where.indexOf("惠民县") > -1) assr.push("'惠民县'")
    else if (params.where.indexOf("巨野县") > -1) assr.push("'巨野县'")
    else if (params.where.indexOf("阳谷县") > -1) assr.push("'阳谷县'")
    else if (params.where.indexOf("商河县") > -1) assr.push("'商河县'")
    else if (params.where.indexOf("齐河县") > -1) assr.push("'齐河县'")

    if (params.where && assr.length > 0) {
        where = ` and quxian IN(${assr.join(",")}) `;
    }

    


    for (let i in arr) {
        sql += `select 
            '${arr[i]}' as bxjg,
            count(distinct baodanhao) as bdzs,
            count(gid) as dksl,
            SUM(area_mi/666.667) as dkzmj ,
            (select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='${arr[i]}' and bili >=80  ${where} ) as hegedikuaishuliang ,
              (select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='${arr[i]}' and bili >=80  ${where} ) as hgdkslzb,
             (select SUM(area_mi/666.667) from public.procjet_wxsd_dk_xiaomai where jigou='${arr[i]}' and bili >=80  ${where} ) as hgdkmjzb
            from public.procjet_wxsd_dk_xiaomai where  jigou='${arr[i]}'  ${where} 
            
            UNION
         `;
    }

    sql += ` 
            select 
            '合计' as bxjg,
            count(distinct baodanhao) as bdzs,
            count(gid) as dksl,
            SUM(area_mi/666.667) as dkzmj ,
            (select count(*) from public.procjet_wxsd_dk_xiaomai where  bili >=80  ${where} ) as hegedikuaishuliang ,
             (select count(*) from public.procjet_wxsd_dk_xiaomai where  bili >=80  ${where} ) as hgdkslzb,
             (select SUM(area_mi/666.667) from public.procjet_wxsd_dk_xiaomai where   bili >=80  ${where} ) as hgdkmjzb
            from public.procjet_wxsd_dk_xiaomai where 1=1  ${where} 
            
    `;


    return sql;
}

const removeWhitespace = (str) => {
    return str.replace(/\\s+/g, '');
}

// route schema
const schema = {
    description: '统计分析-统计合格占比',
    tags: ['meta'],
    summary: 'list json columns',
    params: {
        where: {
            type: 'string',
            description: '行政区域'
        },
        // address: {
        //     type: 'string',
        //     description: '行政名称'
        // }
    }
}

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/list_tj_v1/:where',
        schema: schema,
        handler: function (request, reply) {
            fastify.pg.connect(onConnect)

            function onConnect (err, client, release) {
                if (err) {
                    request.log.error(err)
                    return reply.code(500).send({ error: "Database connection error." })
                }

                client.query(
                    sql(request.params),
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
