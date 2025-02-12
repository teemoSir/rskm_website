// route query
const sql = (params, query) => {

    let sql = ``;

    switch (params.key) {
        case "yghy_sql_1":
            sql = `
            select 
                count(distinct bdh) as bdh_count,
                count(gid) as dk_count,
                SUM(area_mu::numeric) as area_count,
                (select count(distinct bdh) from public.procjet_2024_yghy_shandon where quxian='${query.where}' and ct>1) as ct_bd,
                (select count(gid) from public.procjet_2024_yghy_shandon where quxian='${query.where}' and ct>1) as ct_dk
                from public.procjet_2024_yghy_shandon where  quxian='${query.where}' 
        `
            break;
        case "yghy_sql_2":

            sql = `
                select 
                    count(distinct bdh) as bdh_count,
                    count(gid) as dk_count,
                    SUM(area_mu::numeric) as area_count,
                    (select count(distinct bdh) from public.procjet_2024_yghy_shandon where  ct>1) as ct_bd,
                    (select count(gid) from public.procjet_2024_yghy_shandon where ct>1) as ct_dk
                    from public.procjet_2024_yghy_shandon 
            `

            break;
        case "yghy_sql_3":

            sql = `
            SELECT 
                    (select sum(cbsl::numeric) from public.procjet_2024_yghy_hz10_excel where cbsl not in ('') ${query.where})  as tb_area,
                    (select sum(v1::numeric) from public.procjet_2024_yghy_hz10_excel where v1 not in ('') ${query.where}) as dk_area,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where bbxrmc not in ('') ${query.where}) as dhsl ,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where bbxrmc not in ('') and v1 not in ('') ${query.where}) as ydkdhsl,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v8 in ('1') ${query.where}) as dkhghs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v8 in ('0') ${query.where}) as dkbhghs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v3 not in ('1') ${query.where}) as dkmjbfs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v4 not in ('1') ${query.where}) as dkcd,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v7 not in ('1') ${query.where}) as bdmjbfhs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where bbxrmc not in ('') and v1 in ('') ${query.where}) as wdkdhsl 
                    ;
            `
            break;

        case "yghy_sql_33":

            sql = `
            SELECT 
                    (select sum(cbsl::numeric) from public.procjet_2024_yghy_hz10_excel_2 where cbsl not in ('') ${query.where})  as tb_area,
                    (select sum(v1::numeric) from public.procjet_2024_yghy_hz10_excel_2 where v1 not in ('') ${query.where}) as dk_area,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where bbxrmc not in ('') ${query.where}) as dhsl ,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where bbxrmc not in ('') and v1 not in ('') ${query.where}) as ydkdhsl,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v8 in ('1') ${query.where}) as dkhghs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v8 in ('0') ${query.where}) as dkbhghs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v3 not in ('1') ${query.where}) as dkmjbfs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v4 not in ('1') ${query.where}) as dkcd,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v7 not in ('1') ${query.where}) as bdmjbfhs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where bbxrmc not in ('') and v1 in ('') ${query.where}) as wdkdhsl 
                    ;
            `
            break;
        case "yghy_sql_4":
            let county = ['东阿县', '济阳区', '莱芜区', '桓台县', '高青县', '海阳市', '招远市', '汶上县', '冠县', '无棣县'];

            for (let i = 0; i < county.length; i++) {
                let countyName = county[i];
                sql += `
                SELECT 
                    '${countyName}' as county,
                    (select sum(cbsl::numeric) from public.procjet_2024_yghy_hz10_excel where cbsl not in ('') and quxian='${countyName}')  as tb_area,
                    (select sum(v1::numeric) from public.procjet_2024_yghy_hz10_excel where v1 not in ('') and quxian='${countyName}') as dk_area,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where bbxrmc not in ('') and quxian='${countyName}') as dhsl ,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where bbxrmc not in ('') and v1 not in ('') and quxian='${countyName}') as ydkdhsl,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v8 in ('1') and quxian='${countyName}') as dkhghs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v8 in ('0') and quxian='${countyName}') as dkbhghs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v3 not in ('1') and quxian='${countyName}') as dkmjbfs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v4 not in ('1') and quxian='${countyName}') as dkcd,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where  v7 not in ('1') and quxian='${countyName}') as bdmjbfhs,
                    (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel where bbxrmc not in ('') and v1 in ('') and quxian='${countyName}') as wdkdhsl 
                `;

                if (i < county.length - 1) {
                    sql += `UNION ALL `
                }


            }


            break;

        case "yghy_sql_44":
            let county2 = ['东阿县', '济阳区', '莱芜区', '桓台县', '高青县', '海阳市', '招远市', '汶上县', '冠县', '无棣县'];

            for (let i = 0; i < county2.length; i++) {
                let countyName = county2[i];
                sql += `
                    SELECT 
                        '${countyName}' as county,
                        (select sum(cbsl::numeric) from public.procjet_2024_yghy_hz10_excel_2 where cbsl not in ('') and quxian='${countyName}')  as tb_area,
                        (select sum(v1::numeric) from public.procjet_2024_yghy_hz10_excel_2 where v1 not in ('') and quxian='${countyName}') as dk_area,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where bbxrmc not in ('') and quxian='${countyName}') as dhsl ,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where bbxrmc not in ('') and v1 not in ('') and quxian='${countyName}') as ydkdhsl,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v8 in ('1') and quxian='${countyName}') as dkhghs,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v8 in ('0') and quxian='${countyName}') as dkbhghs,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v3 not in ('1') and quxian='${countyName}') as dkmjbfs,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v4 not in ('1') and quxian='${countyName}') as dkcd,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where  v7 not in ('1') and quxian='${countyName}') as bdmjbfhs,
                        (select count(bbxrmc) from public.procjet_2024_yghy_hz10_excel_2 where bbxrmc not in ('') and v1 in ('') and quxian='${countyName}') as wdkdhsl 
                    `;

                if (i < county2.length - 1) {
                    sql += `UNION ALL `
                }


            }


            break;


        case "yghy_sql_5":
            sql = `
            SELECT 
                    xiangzhen,
                count(bbxrmc) AS dhsl,
                    count(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
                FROM 
                    public.procjet_2024_yghy_hz10_excel
                WHERE 1=1   ${query.where} 
                GROUP BY 
                    xiangzhen
                ORDER BY 
                    xiangzhen;
            `

            break

        case "yghy_sql_55":
            sql = `
                SELECT 
                        xiangzhen,
                    count(bbxrmc) AS dhsl,
                        count(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
                    FROM 
                        public.procjet_2024_yghy_hz10_excel_2
                    WHERE 1=1   ${query.where} 
                    GROUP BY 
                        xiangzhen
                    ORDER BY 
                        xiangzhen;
                `

            break

        case "yghy_sql_6":
            sql = `
                
                SELECT 
                    bxjg,
                count(bbxrmc) AS dhsl,
                    count(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
                FROM 
                    public.procjet_2024_yghy_hz10_excel
                WHERE  1=1   ${query.where} 
                GROUP BY 
                    bxjg
                ORDER BY 
                    bxjg;
                `
            break

        case "yghy_sql_66":
            sql = `
                    
                    SELECT 
                        bxjg,
                    count(bbxrmc) AS dhsl,
                        count(CASE WHEN v8 = '1' THEN 1 END) AS dkhghs
                    FROM 
                        public.procjet_2024_yghy_hz10_excel_2
                    WHERE  1=1   ${query.where} 
                    GROUP BY 
                        bxjg
                    ORDER BY 
                        bxjg;
                    `
            break


        case "yghy_sql_7":

            sql = `
            select
            '太保' as name ,
            (select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='太保' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !='') as zc,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='太保' and (v2::numeric)<=80  and v2 !='') as bz,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='太保' and (v2::numeric)>=105  and v2 !='') as cb
         

            UNION ALL
            select
            '国寿财' as name ,
            (select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='国寿财' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !='') as zc,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='国寿财' and (v2::numeric)<=80  and v2 !='') as bz,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='国寿财' and (v2::numeric)>=105  and v2 !='') as cb

            UNION ALL
            select
            '人保' as name ,
            (select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='人保' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !='') as zc,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='人保' and (v2::numeric)<=80  and v2 !='') as bz,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='人保' and (v2::numeric)>=105  and v2 !='') as cb

            UNION ALL
            select
            '中华' as name ,
            (select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='中华' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !='') as zc,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='中华' and (v2::numeric)<=80  and v2 !='') as bz,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='中华' and (v2::numeric)>=105  and v2 !='') as cb

            UNION ALL
            select
            '安华' as name ,
            (select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='安华' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !='') as zc,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='安华' and (v2::numeric)<=80  and v2 !='') as bz,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='安华' and (v2::numeric)>=105  and v2 !='') as cb


            UNION ALL
            select
            '太平' as name ,
            (select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='太平' and (v2::numeric)>80  and (v2::numeric)<105  and v2 !='') as zc,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='太平' and (v2::numeric)<=80  and v2 !='') as bz,
            ( select count(distinct bdh) from public.procjet_2024_yghy_hz10_excel where bxjg='太平' and (v2::numeric)>=105  and v2 !='') as cb

        `
            break;

        default:
            break;
    }


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
        url: '/list_any/:key',
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
