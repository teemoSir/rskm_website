UPDATE public.rskm_pt
SET area_mi = ST_Area(geom::geography) where  geom_valid =true

ST_Area(geom::geography)* 111319.490793225 * 111319.490793225

UPDATE public.rskm_pt
SET area_mu =ROUND((area_mi/666.667)::numeric,2)


select  ST_IsValid(geom) as tf,* from  public.rskm_pt




 
 -- 新增 险种名称
 update public.rskm_pt  set i_type_name =
 (select xzname from public.rskm_pt_insure_type  where codenum =  public.rskm_pt.insurancetarget)
 
 
  -- 新增公司名称
 update public.rskm_pt  set i_com_name =
 (select insurcompanyname from public.rskm_pt_insure_com  where insurcompanycode =  public.rskm_pt.insurcompany_code)



 ALTER TABLE public.rskm_pt
ADD COLUMN geom GEOMETRY(MultiPolygon, 4326) DEFAULT NULL;

--delete from public.rskm_pt where geom is null
 