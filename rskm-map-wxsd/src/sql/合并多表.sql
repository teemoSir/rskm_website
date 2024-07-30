INSERT INTO public.procjet_2024_wxsd ( objectid, class,geom)
SELECT objectid, class, geom FROM public.procjet_wxsd_huimin
UNION ALL
SELECT objectid, class, geom FROM public.procjet_wxsd_juye
UNION ALL
SELECT objectid, class, geom FROM public.procjet_wxsd_yanggu
UNION ALL
SELECT objectid, class, geom FROM public.procjet_wxsd_qihe
UNION ALL
SELECT objectid, class, geom FROM public.procjet_wxsd_shanghe



	-- 执行逻辑填充省
	UPDATE procjet_2024_wxsd AS d 
	SET province = a.name
	FROM admin_2022_province AS a
	WHERE ST_Within(d.geom, a.geom)

	
	
--    -- 执行逻辑填充市
		UPDATE procjet_2024_wxsd AS d 
		SET city = a.name
		FROM admin_2022_city AS a
		WHERE ST_Within(d.geom, a.geom)
		
--    -- 执行逻辑填充县
		UPDATE procjet_2024_wxsd AS d 
		SET county = a.name
		FROM admin_2022_county AS a
		WHERE ST_Within(d.geom, a.geom)
	
--     -- 执行逻辑更新镇
              	UPDATE procjet_2024_wxsd AS d 
            SET town=a.t_xzqmc
            FROM admin_2024_village AS a
            WHERE ST_Within(d.geom, a.geom)
          
--                -- 执行逻辑更新村
               	UPDATE procjet_2024_wxsd AS d 
             SET village=a.name,town=a.t_xzqmc
             FROM admin_2024_village AS a
             WHERE ST_Within(d.geom, a.geom)
           
--               -- 执行逻辑填充几何平米
		UPDATE procjet_2024_wxsd AS d SET area_mu =ST_Area(d.geom,false)/666.667	
		
		UPDATE procjet_2024_wxsd AS d SET area_mi =ST_Area(d.geom,false)
			UPDATE public.procjet_wxsd_dk_xiaomai AS d SET area_mu =ST_Area(d.geom,false)/666.667	
			
			UPDATE procjet_2024_wxsd
SET area_mu = ROUND(area_mu::numeric, 2)
WHERE your_condition;

	--多表占比更新
	UPDATE public.procjet_wxsd_dk_xiaomai
SET zb = (
    SELECT SUM(ST_Area(ST_Intersection(public.procjet_2024_wxsd.geom, public.procjet_wxsd_dk_xiaomai.geom),false))
    FROM public.procjet_2024_wxsd
    WHERE ST_Intersects(public.procjet_2024_wxsd.geom, public.procjet_wxsd_dk_xiaomai.geom)
);





--2024年7月19日14:27:24


--耕地面积减去非交集面积
	UPDATE public.procjet_wxsd_dk_xiaomai
SET zb = (
    SELECT  SUM(ST_Area(public.procjet_2024_wxsd.geom)* 111319.490793225 * 111319.490793225)- SUM(ST_Area(ST_Difference(public.procjet_2024_wxsd.geom, public.procjet_wxsd_dk_xiaomai.geom))* 111319.490793225 * 111319.490793225)
    FROM public.procjet_2024_wxsd
    WHERE ST_Intersects(public.procjet_2024_wxsd.geom, public.procjet_wxsd_dk_xiaomai.geom) 
) 

UPDATE public.procjet_wxsd_dk_xiaomai
SET area_mi =(ST_Area(geom)* 111319.490793225 * 111319.490793225)


UPDATE public.procjet_wxsd_dk_xiaomai
SET bili = zb/area_mi*100


UPDATE public.procjet_wxsd_dk_xiaomai
SET bili = ROUND(bili::numeric, 2)
 

--获取费交集面积
UPDATE public.procjet_wxsd_dk_xiaomai
SET zbb = (
    SELECT SUM(ST_Area(ST_Difference(public.procjet_2024_wxsd.geom, public.procjet_wxsd_dk_xiaomai.geom) )* 111319.490793225 * 111319.490793225)
    FROM public.procjet_2024_wxsd
    WHERE ST_Intersects(public.procjet_2024_wxsd.geom, public.procjet_wxsd_dk_xiaomai.geom)
);





	
	
	--检查地块图形是否有效
	SELECT 
	*,
    ST_IsValid(geom) AS is_valid,
    ST_GeometryType(geom) AS geometry_type
FROM 
    public.procjet_2024_wxsd where ST_IsValid(geom) =false;
	
	--检查保单图形是否有效
	SELECT 
	*,
    ST_IsValid(geom) AS is_valid,
    ST_GeometryType(geom) AS geometry_type
FROM 
    public.procjet_wxsd_dk_xiaomai where ST_IsValid(geom) =false;
	
	--检测是否闭合多边形
	SELECT 
    ST_IsClosed(geom) AS is_closed
FROM 
     public.procjet_2024_wxsd where ST_IsClosed(geom)=false;
	--检测是否闭合多边形
	SELECT 
    ST_IsClosed(geom) AS is_closed
FROM 
     public.procjet_wxsd_dk_xiaomai where ST_IsClosed(geom)=false;



     UPDATE public.procjet_wxsd_dk_xiaomai t1
SET ct = (
    SELECT SUM(1)
    FROM public.procjet_wxsd_dk_xiaomai t2
    WHERE t1.gid!= t2.gid AND ST_Intersects(t1.geom, t2.geom)
);



select 
'国寿财' as 机构,
count(distinct baodanhao) as 保单总数,
count(gid) as 地块数量,
SUM(distinct shuliang::numeric) as 承保面积,
SUM(area_mi/666.667) as 地块面积 ,
(select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80) as 合格地块数量（块） ,
((select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80)/count(gid)::numeric)*100 as 合格地块数量占比, 
((select SUM(area_mi/666.667) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80)/SUM(area_mi/666.667)::numeric)*100 as 合格地块面积占比
from public.procjet_wxsd_dk_xiaomai where  jigou='国寿财' 



select 
'国寿财' as a11,
count(distinct baodanhao) as a12,
count(gid) as a13,
SUM(distinct shuliang::numeric) as a14,
SUM(area_mi/666.667) as a15 ,
(select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80) as a16 ,
((select count(*) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80)/count(gid)::numeric)*100 as a17, 
((select SUM(area_mi/666.667) from public.procjet_wxsd_dk_xiaomai where jigou='国寿财' and bili >=80)/SUM(area_mi/666.667)::numeric)*100 as a18
from public.procjet_wxsd_dk_xiaomai where  jigou='国寿财' 
	 
	 
	 

	
	


