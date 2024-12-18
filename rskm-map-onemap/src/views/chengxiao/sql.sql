
SELECT sum( "投保数量")
	FROM public.procjet_2024_yghy_baodan_echymx where version ='2024年_玉米_第一次_0913';
	
	SELECT sum( cbsl::NUMERIC)
	FROM public.procjet_2024_yghy_hz10_excel
	
		SELECT sum( cbsl::NUMERIC)
	FROM public.procjet_2024_yghy_hz10_excel_2
	
	
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
				
				
				
-- 	CREATE TABLE public.procjet_2024_yghy_dahu AS
-- SELECT bdh, bbxrmc, bbxrzjh, bbxrdh, xianzhong,  bxjg, shi, shi_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, v1, v2, v3, v4, v5, v6, v7, v8,
--     '2024年_玉米_第一次_0913' as version
-- FROM 
--     public.procjet_2024_yghy_hz10_excel
-- UNION ALL
-- SELECT  bdh, bbxrmc, bbxrzjh, bbxrdh, xianzhong, bxjg, shi, shi_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, v1, v2, v3, v4, v5, v6, v7, v8,
--     '2024年_玉米_第二次_1125' as version
-- FROM 
--     public.procjet_2024_yghy_hz10_excel_2;
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



select sum(cbsl::double precision) from public.procjet_2024_yghy_dahu where version = '2024年_玉米_第一次_0913'

UNION ALL

select sum(cbsl::double precision) from public.procjet_2024_yghy_dahu where version = '2024年_玉米_第二次_1125'

select count(bdh) from public.procjet_2024_yghy_dahu where  version = '2024年_玉米_第一次_0913' and v1 in (null,'0','')
UNION ALL
select count(bdh) from public.procjet_2024_yghy_dahu where  version = '2024年_玉米_第二次_1125' and v1  in ('0')

