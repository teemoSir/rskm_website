// route query
const sql = (params, query) => {
    let sqljb = ``;

    switch (params.key) {
        case "nmgarq_sql_1":
            // 定义乡镇名称数组
            let town = [
                '那吉镇', '阿荣旗农牧业局', '向阳峪镇', '兴安镇', 
                '三岔河镇', '得力其尔鄂温克民族乡', '音河达斡尔鄂温克民族乡', 
                '阿荣旗林业局', '查巴奇鄂温克民族乡', '新发朝鲜民族乡', 
                '霍尔奇镇', '亚东镇', '六合镇', '复兴镇'
            ];

            // 为每个乡镇生成 SQL 查询
            town.forEach(townName => {
                sqljb += `
                SELECT 
                    '${townName}' as name,
                    COUNT(DISTINCT bdh) as bdsl,
                    COUNT(gid) as dksl,
                    SUM(dkmj::numeric) as dkmj,
                    SUM(bdmj::numeric) as bdmj,
                    (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel WHERE xiangzhen='${townName}' AND cdmj>0) as cdbd,
                    (SELECT COUNT(gid) FROM public.procjet_2024_nmgarq_excel WHERE xiangzhen='${townName}' AND cdmj>0) as cddk,
                    (SELECT SUM(dkcdl::numeric)/COUNT(gid) FROM public.procjet_2024_nmgarq_excel WHERE xiangzhen='${townName}') as dkcdl
                FROM public.procjet_2024_nmgarq_excel 
                WHERE xiangzhen='${townName}'
                UNION ALL
                `;
            });

            // 添加总计查询
            sqljb += `
            SELECT 
                '总计' as name,
                COUNT(DISTINCT bdh) as bdsl,
                COUNT(gid) as dksl,
                SUM(dkmj::numeric) as dkmj,
                SUM(bdmj::numeric) as bdmj,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel WHERE cdmj>0) as cdbd,
                (SELECT COUNT(gid) FROM public.procjet_2024_nmgarq_excel WHERE cdmj>0) as cddk,
                (SELECT SUM(dkcdl::numeric)/COUNT(gid) FROM public.procjet_2024_nmgarq_excel) as dkcdl
            FROM public.procjet_2024_nmgarq_excel 
            `;
            break;

        case "nmgarq_sql_2":
            // 统计村和乡镇的面积比例
            sqljb += `
            SELECT 
                xiangzhen,  -- 乡镇字段
                cun,
                SUM(bdmj::numeric) / SUM(dkmj::numeric) * 100 as fgl,
                SUM(dkcdl::numeric) / COUNT(gid) as cdl
            FROM 
                public.procjet_2024_nmgarq_excel 
            GROUP BY 
                cun, xiangzhen 
            ORDER BY 
                xiangzhen;
            `;
            break;

        case "nmgarq_sql_3":
            // 统计乡镇的面积比例
            sqljb += `
            SELECT 
                xiangzhen,  -- 乡镇字段
                SUM(bdmj::numeric) / SUM(dkmj::numeric) * 100 as fgl,
                SUM(dkcdl::numeric) / COUNT(gid) as cdl
            FROM 
                public.procjet_2024_nmgarq_excel 
            GROUP BY 
                xiangzhen 
            ORDER BY 
                xiangzhen;
            `;
            break;

        case "yghy_sql_area_bxjg":
            // 统计不同区域的合格数量
            sqljb = `
            SELECT 
                bxjg,
                COUNT(name) AS dhsl,
                COUNT(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
            FROM 
                public.procjet_2024_nmgarq_excel_dhdk
            WHERE 1=1 ${query.where} 
            GROUP BY 
                bxjg
            ORDER BY 
                bxjg;
            `;
            break;

        case "yghy_sql_6":
            // 统计不同区域的合格数量
            sqljb = `
            SELECT 
                bxjg,
                COUNT(name) AS dhsl,
                COUNT(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
            FROM 
                public.procjet_2024_nmgarq_excel_dhdk
            WHERE 1=1 ${query.where} 
            GROUP BY 
                bxjg
            ORDER BY 
                bxjg;
            `;
            break;

        case "yghy_sql_3":
            // 统计不同指标的总和
            sqljb = `
            SELECT 
                (SELECT SUM(cbsl) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE 1=1 ${query.where}) as tb_area,
                (SELECT SUM(v1) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE 1=1 ${query.where}) as dk_area,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE 1=1 ${query.where}) as dhsl,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE 1=1 ${query.where}) as ydkdhsl,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v8 IN (1) ${query.where}) as dkhghs,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v8 IN (0) ${query.where}) as dkbhghs,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v3 NOT IN (1) ${query.where}) as dkmjbfs,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v4 NOT IN (1) ${query.where}) as dkcd,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v7 NOT IN (1) ${query.where}) as bdmjbfhs,
                (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE 1=1 ${query.where}) as wdkdhsl;
            `;
            break;

        case "yghy_sql_4":
            // 定义县级名称数组
            let county = [
                '那吉镇', '阿荣旗农牧业局', '向阳峪镇', '兴安镇', 
                '三岔河镇', '得力其尔鄂温克民族乡', '音河达斡尔鄂温克民族乡', 
                '阿荣旗林业局', '查巴奇鄂温克民族乡', '新发朝鲜民族乡', 
                '霍尔奇镇', '亚东镇', '六合镇', '复兴镇'
            ];

            // 为每个县生成 SQL 查询
            for (let i = 0; i < county.length; i++) {
                let countyName = county[i];
                sqljb += `
                SELECT 
                    '${countyName}' as county,
                    (SELECT SUM(cbsl) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE xiangzhen IN ('${countyName}')) as tb_area,
                    (SELECT SUM(v1) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE xiangzhen IN ('${countyName}')) as dk_area,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE xiangzhen IN ('${countyName}')) as dhsl,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE xiangzhen IN ('${countyName}')) as ydkdhsl,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v8 IN (1) AND xiangzhen IN ('${countyName}')) as dkhghs,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v8 IN (0) AND xiangzhen IN ('${countyName}')) as dkbhghs,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v3 NOT IN (1) AND xiangzhen IN ('${countyName}')) as dkmjbfs,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v4 NOT IN (1) AND xiangzhen IN ('${countyName}')) as dkcd,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE v7 NOT IN (1) AND xiangzhen IN ('${countyName}')) as bdmjbfhs,
                    (SELECT COUNT(name) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE xiangzhen IN ('${countyName}')) as wdkdhsl
                `;

                if (i < county.length - 1) {
                    sqljb += `UNION ALL `;
                }
            }
            break;

        case "nmgarq_sql_7":
            // 统计不同保险机构的合格数量
            sqljb = `
            SELECT
                '太保' as name,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='太保' AND (v2::numeric) > 80 AND (v2::numeric) < 105 AND v2 != '') as zc,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='太保' AND (v2::numeric) <= 80 AND v2 != '') as bz,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='太保' AND (v2::numeric) >= 105 AND v2 != '') as cb
            UNION ALL
            SELECT
                '国寿财' as name,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='国寿财' AND (v2::numeric) > 80 AND (v2::numeric) < 105 AND v2 != '') as zc,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='国寿财' AND (v2::numeric) <= 80 AND v2 != '') as bz,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='国寿财' AND (v2::numeric) >= 105 AND v2 != '') as cb
            UNION ALL
            SELECT
                '人保' as name,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='人保' AND (v2::numeric) > 80 AND (v2::numeric) < 105 AND v2 != '') as zc,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='人保' AND (v2::numeric) <= 80 AND v2 != '') as bz,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='人保' AND (v2::numeric) >= 105 AND v2 != '') as cb
            UNION ALL
            SELECT
                '中华' as name,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='中华' AND (v2::numeric) > 80 AND (v2::numeric) < 105 AND v2 != '') as zc,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='中华' AND (v2::numeric) <= 80 AND v2 != '') as bz,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='中华' AND (v2::numeric) >= 105 AND v2 != '') as cb
            UNION ALL
            SELECT
                '安华' as name,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='安华' AND (v2::numeric) > 80 AND (v2::numeric) < 105 AND v2 != '') as zc,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='安华' AND (v2::numeric) <= 80 AND v2 != '') as bz,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='安华' AND (v2::numeric) >= 105 AND v2 != '') as cb
            UNION ALL
            SELECT
                '太平' as name,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='太平' AND (v2::numeric) > 80 AND (v2::numeric) < 105 AND v2 != '') as zc,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='太平' AND (v2::numeric) <= 80 AND v2 != '') as bz,
                (SELECT COUNT(DISTINCT bdh) FROM public.procjet_2024_nmgarq_excel_dhdk WHERE bxjg='太平' AND (v2::numeric) >= 105 AND v2 != '') as cb
            `;
            break;

        case "nmgarq_sql_8":
            // 统计村的合格数量
            sqljb = `
            SELECT 
                cun as xiangzhen,
                COUNT(name) AS dhsl,
                COUNT(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
            FROM 
                public.procjet_2024_nmgarq_excel_dhdk
            WHERE 1=1 ${query.where} 
            GROUP BY 
                cun
            ORDER BY 
                cun;
            `;
            break;

        default:
            break;
    }

    return sqljb;
}

// 移除字符串中的多余空格
const removeWhitespace = (str) => {
    return str.replace(/\\s+/g, '');
}

// route schema
const schema = {
    description: '统计分析-统计合格占比',
    tags: ['meta'],
    summary: 'list json columns',
    params: {
        key: {
            type: 'string',
            description: '汇总表键值'
        }
    },
    querystring: {
        where: {
            type: 'string',
            description: '条件',
            default: ""
        }
    }
}

// create route
module.exports = function (fastify, opts, next) {
    fastify.route({
        method: 'GET',
        url: '/list_nmgarq/:key',
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

module.exports.autoPrefix = '/v1';
