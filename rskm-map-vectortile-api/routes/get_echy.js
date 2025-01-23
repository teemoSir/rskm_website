// route query
const sql = (params, query) => {

    let sql = ``;

    switch (params.key) {
        // 区域遥感
        case "echy_sql_qy_ygsl":
            sql = `
            select SUM(rs_area) as rs_area,town,MAX(county) as county,MAX(city) as city from public.procjet_2024_yghy_sense_s2 where 1=1 GROUP  by town,county,city order by city
            `
            break;

        // 承保数量
        case "echy_sql_qy_cbsl":
            sql = `
            select  count("保单号") as bdsl, SUM(投保数量) as tbsl,乡镇 as town,MAX(区县) as county,MAX(地市) as city,version from public.procjet_2024_yghy_baodan_echy  GROUP  by 乡镇,区县,地市,version order by 地市
            `
            break;
        // 参保农户(户次)
        case "echy_sql_qy_cbhc":
            sql = `
            select sum("参保户次") as cbhc,区县 as county,乡镇 as town,地市 as city,version,count("保单号") as cbsl   from public.procjet_2024_yghy_baodan_echymx where 1=1  group by version,区县,乡镇,地市
            `
            break;

        // 保单数量
        case "echy_sql_qy_bdsl":
            sql = `
           	select count("保单号") as bdsl,区县 as county,乡镇 as town,地市 as city,version from public.procjet_2024_yghy_baodan_echy group by version,区县,乡镇,地市 
            `
            break;

        // 超保乡镇
        case "echy_sql_qy_cbxz":
            sql = `
            SELECT 
                COALESCE(a.town, b.town) AS town,
                COALESCE(a.county, b.county) AS county,
                COALESCE(a.city, b.city) AS city,
                COALESCE(a.rs_area, 0) AS rs_area,
                COALESCE(b.tbsl, 0) AS tbsl,
                b.version as version,
                NULLIF(COALESCE(b.tbsl,0),0) / NULLIF(COALESCE(a.rs_area, 0),0) as fgl
            FROM 
                (SELECT 
                    SUM(rs_area) AS rs_area,
                    town,
                    MAX(county) AS county,
                    MAX(city) AS city 
                FROM 
                    public.procjet_2024_yghy_sense_s2 
                GROUP BY 
                    town, county, city) AS a
            FULL OUTER JOIN 
                (SELECT 
                    SUM(投保数量) AS tbsl,
                    乡镇 AS town,
                    MAX(区县) AS county,
                    MAX(地市) AS city,
                    version 
                FROM 
                    public.procjet_2024_yghy_baodan_echy
                GROUP BY 
                    乡镇, 区县, 地市, version) AS b
            ON 
                a.town = b.town AND a.county = b.county AND a.city = b.city
            ORDER BY 
                city;
            `
            break;



        case "echy_sql_dk_zt":
            sql = `
          	
        select 地市 as city,区县 as county,乡镇 as town,version,
                sum(大户户次) as dhhc, 
                sum(投保数量) as tbsl,
                
                sum(合格大户户次) as hgdhhc,
                (select sum(投保数量) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇 and 保单是否合格=1) as hgdhtbsl,
                
                sum(不合格大户户次) as bhgdhhc,
                (select sum(投保数量) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇  and 不合格大户户次>0) as bhgdhtbsl,
                
                 (select sum(有地块的大户户次) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇  and 保单大户是否有地块=1) as ydkdhhc,
                (select sum(地块面积一致的大户户次) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇  and 大户地块面积是否一致=0) as dkmjbhgdhhc,
                (select sum(地块不重叠的大户户次) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇  and 地块是否无重叠=0) as ycddkdhhc,
                
                
                (select sum(作物面积达标的大户户次) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇  and 大户作物面积是否达标=0) as zwmjdbdbdhhc
                from public.procjet_2024_yghy_baodan_echymx a group by 地市,区县,乡镇,version order by 地市
				
	 
            `
            break;
        case "echy_sql_dk_zt02":
            sql = `
             select shi,quxian,xiangzhen,version,
            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen) as dhhc, 
            (select sum(cbsl::double precision) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen) as tbsl,
            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v8 in ('1')) as hgdhhc,
            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v8 in (null,'0','')) as bhgdhhc,
            (select sum(cbsl::double precision) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v8='1') as hgdhtbsl,
            (select sum(cbsl::double precision) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v8 in (null,'0','')) as bhgdhtbsl,

            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v1 in (null,'0','')) as ydkdhhc,
            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v3 in (null,'0','')) as dkmjbhgdhhc,
            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v4 in (null,'0','')) as ycddkdhhc,
            (select count(bdh) from public.procjet_2024_yghy_dahu where version = a.version and xiangzhen= a.xiangzhen and v7 in (null,'0','')) as zwmjdbdbdhhc
            from public.procjet_2024_yghy_dahu a group by shi,quxian,xiangzhen,version order by shi

                `
            break;




        // 镇级
        case "echy_sql_dk_dq_town":
            sql = `
          	
      select 地市 as city,区县 as county,乡镇 as town,version,
 			 count(保单号) as dhbd, 
  			 (select count(保单号) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 乡镇= a.乡镇 and 保单是否合格=1) as hgbd,
                sum(大户户次) as dhhc, 
                sum(合格大户户次) as hgdhhc
                from public.procjet_2024_yghy_baodan_echymx a group by 地市,区县,乡镇,version order by 地市
				
	 
            `
            break;

        // 县级
        case "echy_sql_dk_dq_county":
            sql = `
          	
 				
 select 地市 as city,区县 as county,version,
 			 count(保单号) as dhbd, 
  			 (select count(保单号) from public.procjet_2024_yghy_baodan_echymx where version = a.version and 区县= a.区县 and 保单是否合格=1) as hgbd,
                sum(大户户次) as dhhc, 
                sum(合格大户户次) as hgdhhc
                from public.procjet_2024_yghy_baodan_echymx a group by 地市,区县,version order by 地市
	 
            `
            break;

        // 区域地区
        case "echy_sql_qy_dq_town":
            sql = `
           SELECT 
                COALESCE(a.town, b.town) AS town,
                COALESCE(a.county, b.county) AS county,
                COALESCE(a.city, b.city) AS city,
                COALESCE(a.rs_area, 0) AS rs_area,
                COALESCE(b.tbsl, 0) AS tbsl,
                b.version as version,
                NULLIF(COALESCE(b.tbsl,0),0) / NULLIF(COALESCE(a.rs_area, 0),0) as fgl
            FROM 
                (SELECT 
                    SUM(rs_area) AS rs_area,
                    town,
                    MAX(county) AS county,
                    MAX(city) AS city 
                FROM 
                    public.procjet_2024_yghy_sense_s2 
                GROUP BY 
                    town, county, city) AS a
            FULL OUTER JOIN 
                (SELECT 
                    SUM(投保数量) AS tbsl,
                    乡镇 AS town,
                    MAX(区县) AS county,
                    MAX(地市) AS city,
                    version 
                FROM 
                    public.procjet_2024_yghy_baodan_echy 
                GROUP BY 
                    乡镇, 区县, 地市, version) AS b
            ON 
                a.town = b.town AND a.county = b.county AND a.city = b.city
            ORDER BY 
                town,version desc;
            `
            break;
        // 区域地区
        case "echy_sql_qy_dq_county":
            sql = `
             
            SELECT 
                        COALESCE(a.county, b.county) AS county,
                        COALESCE(a.city, b.city) AS city,
                        COALESCE(a.rs_area, 0) AS rs_area,
                        COALESCE(b.tbsl, 0) AS tbsl,
                        b.version as version,
                        NULLIF(COALESCE(b.tbsl,0),0) / NULLIF(COALESCE(a.rs_area, 0),0) as fgl
                    FROM 
                        (SELECT 
                            SUM(rs_area) AS rs_area,
                        
                            MAX(county) AS county,
                            MAX(city) AS city 
                        FROM 
                            public.procjet_2024_yghy_sense_s2 
                        GROUP BY 
                            county, city) AS a
                    FULL OUTER JOIN 
                        (SELECT 
                            SUM(投保数量) AS tbsl,
                        
                            MAX(区县) AS county,
                            MAX(地市) AS city,
                            version 
                        FROM 
                            public.procjet_2024_yghy_baodan_echy 
                        GROUP BY 
                        区县, 地市, version) AS b
                    ON 
                        a.county = b.county AND a.city = b.city
                    ORDER BY 
                        county,version desc;
            `
            break;
        // 区域机构 镇
        case "echy_sql_qy_jg_tg2":
            sql = `
            				
                            WITH base_query AS (
            SELECT 
                            COALESCE(a.town, b.town) AS town,
                            COALESCE(a.county, b.county) AS county,
                            COALESCE(a.city, b.city) AS city,
                            COALESCE(a.rs_area, 0) AS rs_area,
                            COALESCE(b.tbsl, 0) AS tbsl,
                            b.version as version,
                            b.bxjg as bxjg,
                            NULLIF(COALESCE(b.tbsl,0),0) / NULLIF(COALESCE(a.rs_area, 0),0) as fgl
                        FROM 
                            (SELECT 
                                SUM(rs_area) AS rs_area,
                                town,
                                MAX(county) AS county,
                                MAX(city) AS city 
                            FROM 
                                public.procjet_2024_yghy_sense_s2 
                            GROUP BY 
                                town, county, city) AS a
                        FULL OUTER JOIN 
                            (SELECT 
                                SUM(投保数量) AS tbsl,
                                乡镇 AS town,
                                MAX(区县) AS county,
                                MAX(地市) AS city,
                            MAX(保险机构) as bxjg,
                                version 
                            FROM 
                                public.procjet_2024_yghy_baodan_echy 
                            GROUP BY 
                                乡镇, 区县, 地市, 保险机构,version) AS b
                        ON 
                            a.town = b.town AND a.county = b.county AND a.city = b.city
                        ORDER BY 
                            town,version desc
                            
            )
            SELECT 
          COUNT(CASE WHEN fgl >= 1.05 THEN 1 END) as over_105_count,
                COUNT(CASE WHEN fgl < 1.05 AND fgl >= 0.6 THEN 1 END) as between_06_105_count,
            count(distinct town) as xiangzhen,
                bxjg,
                SUM(rs_area) as total_rs_area,
                SUM(tbsl) as total_tbsl,
                SUM(tbsl) / NULLIF(SUM(rs_area), 0) as bxjg_fgl,
                version
            FROM 
                base_query
            GROUP BY 
                bxjg, version
            ORDER BY 
                bxjg, version DESC;
            `
            break;
        // 区域机构 2
        //         case "echy_sql_qy_jg_tg":
        //             sql = `
        //          select count(distinct xiangzhen),xiangzhen,
        // bxjg,version, sum(v1::double precision) as  tbsl, sum(v5::double precision) as zzsl, sum(v5::double precision)/sum(v1::double precision) as fgl, sum(v1::double precision) - sum(v5::double precision) as cbsl
        // from public.procjet_2024_yghy_hz10_v1v8 a  where v5 <> '' group by bxjg,version,xiangzhen

        //             `
        //             break;

        case "echy_sql_dk_jg_tg":
            sql = `
	 select 保险机构 as bxjg,version,
 			 count(保单号) as dhbd, 
  			 (select count(保单号) from public.procjet_2024_yghy_baodan_echymx where 保险机构 = a.保险机构  and 保单是否合格=1) as hgbd,
                sum(大户户次) as dhhc, 
                sum(合格大户户次) as hgdhhc
                from public.procjet_2024_yghy_baodan_echymx a where 1=1 ${query.where} group by 保险机构,version order by 保险机构
                `
            break
        case "echy_sql_ygjg":
            sql = `
      select  quxian, ygjg from public.procjet_2024_yghy_hz10_county_2 group by quxian,ygjg
                    `
            break


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
    description: '二次核验',
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
        url: '/get_echy/:key',
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
