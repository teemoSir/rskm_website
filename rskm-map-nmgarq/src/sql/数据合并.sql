
	
	
	INSERT INTO public.procjet_2024_yghy_shandon (gid, geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao)
(SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_donge
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_gaoqing
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_guanxian
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_haiyang
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_hentai
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_jiyang
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_laiwu
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_wenshang
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_wuli
UNION ALL
SELECT id,geom, bdh, bbxrmc, bbxrzjh, bbxrdh, xianlei, xianzhong, bxjg, shi, shidm, quxian, quxiandm, zhen, zhendm, cun, cundm, youxiao FROM public.yghy_zhaoyuan)



-- 创建主键
 select * from public.procjet_2024_yghy_shandon limit 100
 
 ALTER TABLE public.procjet_2024_yghy_shandon
ADD COLUMN id SERIAL PRIMARY KEY;


-- 合并统计表
INSERT INTO public.procjet_2024_yghy_chj ( "number", bdh, name, sfz, telphone, type, type_xl, bxjg, city, city_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, dw, bxqj, bdscsj, bdxgsj, v1, v2, v3, v4, v5, v6, v7, v8)
(SELECT  "number", bdh, name, sfz, telphone, type, type_xl, bxjg, city, city_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, dw, bxqj, bdscsj, bdxgsj, v1, v2, v3, v4, v5, v6, v7, v8 FROM public.procjet_2024_yghy_chj_hengtai
UNION ALL
SELECT  "number", bdh, name, sfz, telphone, type, type_xl, bxjg, city, city_code, quxian, quxian_code, xiangzhen, xiangzhen_code, cun, cun_code, cbsl, dw, bxqj, bdscsj, bdxgsj, v1, v2, v3, v4, v5, v6, v7, v8 FROM public.procjet_2024_yghy_chj_jiyang
 )


 select * from admin_2024_county where name='莱芜区'  order by c_xzqdm
 
 
 select * from admin_2022_county where name='莱芜区' 
 
 

     UPDATE public.procjet_2024_yghy_shandon t1
SET ct = (
    SELECT SUM(1)
    FROM public.procjet_2024_yghy_shandon t2
    WHERE t1.gid!= t2.gid AND ST_Intersects(t1.geom, t2.geom)
);



select 
'东阿县' as 区域,
count(distinct bdh) as 保单总数,
count(gid) as 地块总数,
SUM(area_mu::numeric) as 地块面积,
(select count(distinct bdh) from public.procjet_2024_yghy_shandon where quxian='东阿县' and ct>1) as 冲突保单,
(select count(gid) from public.procjet_2024_yghy_shandon where quxian='东阿县' and ct>1) as 冲突地块
from public.procjet_2024_yghy_shandon where  quxian='东阿县' 




--地块统计
SELECT 
(select sum(cbsl::numeric) from public.procjet_2024_yghy_chj where cbsl not in (''))  as tb_area,
(select sum(v1::numeric) from public.procjet_2024_yghy_chj where v1 not in ('')) as dk_area,
(select count(name) from public.procjet_2024_yghy_chj where name not in ('')) as dhsl ,
(select count(name) from public.procjet_2024_yghy_chj where name not in ('') and v1 not in ('')) as ydkdhsl,
(select count(name) from public.procjet_2024_yghy_chj where  v8 in ('1')) as dkhghs,
(select count(name) from public.procjet_2024_yghy_chj where  v3 not in ('1')) as dkmjbfs,
(select count(name) from public.procjet_2024_yghy_chj where  v4 not in ('1')) as dkcd,
(select count(name) from public.procjet_2024_yghy_chj where  v7 not in ('1')) as bdmjbfhs
;


UPDATE public.procjet_2024_yghy_hz10_county AS a
SET v7 = b.v7  -- 替换为你想要更新的值
FROM public.procjet_2024_yghy_hz10_excel AS b
WHERE a.bdh = b.bdh AND a.bbxrmc = b.name;  -- 连接条件


-- 查询坐标不规范图形
  SELECT count(gid)
FROM public.rskm_pt
WHERE ST_SRID(geom) = 4326 
  AND EXISTS (
      SELECT 1
      FROM ST_DumpPoints(geom) AS point
      WHERE ST_X(point.geom) < -180 
         OR ST_X(point.geom) > 180 
         OR ST_Y(point.geom) < -90 
         OR ST_Y(point.geom) > 90
  )  


  