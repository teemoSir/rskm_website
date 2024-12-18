 
 
 --添加新节点
		 CREATE TABLE new_spatial_data AS
		SELECT *
		FROM spatial_data
		WHERE timestamp BETWEEN '2023-01-01 00:00:00' AND '2023-12-31 23:59:59';
 
 	
		--清洗验证数据
		UPDATE public.rskm_pt_source_node_20241125 
		SET geom = ST_MakeValid(geom)  -- 使用 ST_MakeValid 修复无效的几何对象
		WHERE  ST_IsValid(geom) =false


		--查询正确数据
		select count(gid) from  public.rskm_pt_source_node_20241125 WHERE  ST_IsValid(geom) 

		--清理异常数据
		--delete  from  public.rskm_pt_source_node_20241125 where not ST_IsValid(geom) 

		-- 执行逻辑填充市
        UPDATE public.rskm_pt_source_node_20241125 AS d 
		SET city = a.name
		FROM admin_2022_city AS a
		WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province in('山东省') and d.city isnull
		
		
		  -- 执行逻辑填充县
		UPDATE public.rskm_pt_source_node_20241125 AS d 
		SET ad_code = a.county_code,county = a.county_name
		FROM admin_2022_county AS a
		WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province_name in('山东省') and d.county isnull
        
        -- 执行逻辑更新镇
--         UPDATE public.rskm_pt_source_node_20241125 AS d 
--         SET town=a.town_name
--         FROM china_wgs84_town AS a
--       	WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province in('山东省') and d.town isnull
        
        -- 执行逻辑更新村
--         UPDATE public.rskm_pt_source_node_20241125 AS d 
--         SET village=a.name
--         FROM china_wgs84_all AS a
--        	WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province in('山东省') and d.village isnull
		
		
		
	
	
	   CREATE OR REPLACE FUNCTION ____rskm_pt_monitored_function(source_table_name Text,task_id INTEGER,start_time Text,end_time Text,tablename Text) RETURNS VOID AS $$
   DECLARE
       total_steps INTEGER := 100;  -- 假设总共有100个步骤
       current_step INTEGER := 0;
   BEGIN
       -- 初始化进度
	   select FORMAT('')
     	UPDATE public.rskm_pt_task SET progress = 0, messages = '进行中', status=1 where gid = task_id;
		-----------------------------
		 --添加新节点
		 CREATE TABLE tablename AS
		SELECT *
		FROM public.rskm_pt
		WHERE start_date BETWEEN start_time AND end_time;
		
		CREATE INDEX index_name ON tablename (gid);

		CREATE INDEX idx_spatial_gist ON tablename USING gist (geom);
		
		UPDATE public.rskm_pt_task SET progress = 8, messages = '节点表备份完成' where gid = task_id;
		-----------------------------
		--清洗验证数据
		UPDATE tablename 
		SET geom = ST_MakeValid(geom) 
		WHERE NOT ST_IsValid(geom) ;
		
		--清理异常数据
		delete  from  tablename where not ST_IsValid(geom) ;
		UPDATE public.rskm_pt_task SET progress = 10, messages = '数据验证完成' where gid = task_id;
		-----------------------------
		 -- 执行逻辑填充市
        UPDATE tablename AS d 
		SET city = a.name
		FROM admin_2022_city AS a
		WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province in('山东省') and d.city isnull;
		
		  -- 执行逻辑填充县
		UPDATE tablename AS d 
		SET ad_code = a.county_code,county = a.county_name
		FROM admin_2022_county AS a
		WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province_name in('山东省') and d.county isnull;
        
        -- 执行逻辑更新镇
         UPDATE tablename AS d 
         SET town=a.town_name
         FROM china_wgs84_town AS a
       	WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province in('山东省') and d.town isnull;
        
        -- 执行逻辑更新村
         UPDATE tablename AS d 
         SET village=a.name
         FROM china_wgs84_all AS a
        	WHERE (ST_Contains(a.geom, d.geom) or ST_Area(ST_Intersection(a.geom, d.geom)) >= 0.8 * ST_Area(d.geom)) and a.province in('山东省') and d.village isnull;
			UPDATE public.rskm_pt_task SET progress = 10, messages = '地理编码更新完成' where gid = task_id;
		-----------------------------
       -- 完成后更新状态
       UPDATE public.rskm_pt_task SET messages = '已完成',progress = 100, status=2 WHERE gid = task_id;
   EXCEPTION
       WHEN OTHERS THEN
           -- 处理异常并更新状态
           UPDATE public.rskm_pt_task
           SET status = 4
           WHERE gid =task_id;
           RAISE;
   END;
   $$ LANGUAGE plpgsql;
   
   
   
select ____rskm_pt_monitored_function('public.procjet_2024_yghy_sense',2,'2023-01-01','2024-10-15','public.rskm_pt_n_1')







