
BEGIN

    -- 执行逻辑几何验证
    	UPDATE rskm_pt AS d SET geom_valid = ST_IsValid(d.geom) WHERE d.gid = NEW.gid;
	-- 执行逻辑填充省
      UPDATE rskm_pt AS d 
      SET province = a.name
      FROM admin_2022_province AS a
      WHERE ST_Within(d.geom, a.geom)
      AND d.gid = NEW.gid;
    -- 执行逻辑填充市
		UPDATE rskm_pt AS d 
		SET city = a.name
		FROM admin_2022_city AS a
		WHERE ST_Within(d.geom, a.geom)
		AND d.gid = NEW.gid;
    -- 执行逻辑填充县
		UPDATE rskm_pt AS d 
		SET ad_code = a.county_code,county = a.name
		FROM admin_2022_county AS a
		WHERE ST_Within(d.geom, a.geom)
		AND d.gid = NEW.gid;
    -- 执行逻辑更新镇
              	UPDATE rskm_pt AS d 
            SET town=a.t_xzqmc
            FROM admin_2024_village AS a
            WHERE ST_Within(d.geom, a.geom)
            AND d.gid = NEW.gid;
    -- 执行逻辑更新村
               	UPDATE rskm_pt AS d 
             SET ad_code = a.f_xzqhdm,village=a.name
             FROM admin_2024_village AS a
             WHERE ST_Within(d.geom, a.geom)
             AND d.gid = NEW.gid;
    -- 执行逻辑填充几何平米
		UPDATE rskm_pt AS d SET area_mi =ROUND(ST_Area(d.geom::geography)::numeric,2) WHERE geom_valid=true and  d.gid = NEW.gid;
        
    -- 执行逻辑填充亩
		UPDATE rskm_pt AS d SET area_mu =ROUND((area_mi/666.667)::numeric,2) WHERE geom_valid=true and d.gid = NEW.gid;
        
    -- 新增 险种名称
       update public.rskm_pt AS d  set i_type_name =
       (select xzname from public.rskm_pt_insure_type  where codenum =  d.insurancetarget) 	WHERE d.gid = NEW.gid;


    -- 新增公司名称
       update public.rskm_pt AS d  set i_com_name =
       (select insurcompanyname from public.rskm_pt_insure_com  where insurcompanycode =  d.insurcompany_code) 	WHERE d.gid = NEW.gid;
    
    RAISE NOTICE '行政更新ID: %', NEW.gid;
    RETURN NEW;
END;
