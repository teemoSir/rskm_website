
-- 测试转换镇
INSERT INTO public.china_wgs84_town(
	geom, area_code, city_name, city_code, county_name, county_code, town_name, town_code)
	(select ST_Multi(ST_Union(geom)) as geom , MAX(area_code) as area_code,MAX( city_name) as city_name, MAX(city_code) as city_code,MAX( county_name) as county_name,MAX( county_code) as county_code,
	 MAX(town_name) as town_name, MAX(town_code) as town_code from public.china_wgs84_all  GROUP BY town_code limit 100
	);
	
	
	--正式 
	INSERT INTO public.china_wgs84_town(
	geom, area_code, city_name, city_code, county_name, county_code, town_name, town_code)
	(select ST_Multi(ST_Union(geom)) as geom , MAX(area_code) as area_code,MAX( city_name) as city_name, MAX(city_code) as city_code,MAX( county_name) as county_name,MAX( county_code) as county_code,
	 MAX(town_name) as town_name, MAX(town_code) as town_code from public.china_wgs84_all  GROUP BY town_code 
	);
	