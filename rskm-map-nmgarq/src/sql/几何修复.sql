select '无棣县处理后' as 结果, sum(ST_Area(geom::geography))/666.667 as 亩,sum(ST_Area(geom::geography)) as 平方 from public.wudi_county 
UNION ALL
select '无棣县处理前' as 结果, sum(ST_Area(geom::geography))/666.667 as 亩,sum(ST_Area(geom::geography)) as 平方 from public.wudi_county_old 
UNION ALL
select '东阿县处理后' as 结果, sum(ST_Area(geom::geography))/666.667 as 亩,sum(ST_Area(geom::geography)) as 平方 from public.donge_county 
UNION ALL
select '东阿县处理前' as 结果, sum(ST_Area(geom::geography))/666.667 as 亩,sum(ST_Area(geom::geography)) as 平方 from public.donge_county_old 
UNION ALL
select '冠县处理后' as 结果, sum(ST_Area(geom::geography))/666.667 as 亩,sum(ST_Area(geom::geography)) as 平方 from public.guanxian_county 
UNION ALL
select '冠县处理后' as 结果, sum(ST_Area(geom::geography))/666.667 as 亩,sum(ST_Area(geom::geography)) as 平方 from public.guanxian_county_old 


UPDATE public.guanxian_county 
SET geom = ST_MakeValid(geom)  -- 使用 ST_MakeValid 修复无效的几何对象
WHERE  ST_IsValid(geom)=false;     -- 只更新无效的几何对象


select '无棣县' as 区域,sum(ST_Area(geom::geography))/666.667 as 面积（亩）, count(gid) as 图斑总数,(select count(gid) from public.wudi_county_old  where ST_IsValid(geom) =true)  as 几何正常（图斑）,
(select count(gid) from public.wudi_county_old  where ST_IsValid(geom) =false)  as 几何错误（图斑） from public.wudi_county_old 
UNION ALL
select '东阿县' as 区域,sum(ST_Area(geom::geography))/666.667 as 面积（亩）, count(gid) as 图斑总数,(select count(gid) from public.donge_county_old  where ST_IsValid(geom) =true)  as 几何正常（图斑）,
(select count(gid) from public.donge_county_old  where ST_IsValid(geom) =false)  as 几何错误（图斑） from public.donge_county_old
UNION ALL
select '冠县' as 区域,sum(ST_Area(geom::geography))/666.667 as 面积（亩）, count(gid) as 图斑总数,(select count(gid) from public.guanxian_county_old  where ST_IsValid(geom) =true)  as 几何正常（图斑）,
(select count(gid) from public.guanxian_county_old  where ST_IsValid(geom) =false)  as 几何错误（图斑） from public.guanxian_county_old 
