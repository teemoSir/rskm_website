UPDATE public.rskm_pt
SET area_mi = ST_Area(geom::geography) where  geom_valid =true

ST_Area(geom::geography)* 111319.490793225 * 111319.490793225

UPDATE public.rskm_pt
SET area_mu =ROUND((area_mi/666.667)::numeric,2)


select  ST_IsValid(geom) as tf,* from  public.rskm_pt