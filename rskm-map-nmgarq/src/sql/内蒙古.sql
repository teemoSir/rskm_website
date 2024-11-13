-- 	gid, bdh, jigou, xiangzhen, cun, qibao, zhongbao, dkmj, cdmj, dkcdl, bdmj, bdzb
	
	
	  select 
                count(distinct bdh) as 保单数量,
                count(gid) as 地块数量,
                SUM(dkmj::numeric) as 地块面积,
				SUM(bdmj::numeric) as 标的面积
--                 (select count(distinct bdh) from public.procjet_2024_nmgarq_excel where xiangzhen='那吉镇' ) as 重叠保单,
--                 (select count(gid) from public.procjet_2024_nmgarq_excel where xiangzhen='那吉镇' ) as 重叠地块
                from public.procjet_2024_nmgarq_excel where  xiangzhen='那吉镇' 
				
				
				
				
				
-- 				delete from public.procjet_2024_nmgarq_excel where bdh isnull
-- 				select count(gid) from public.procjet_2024_nmgarq_excel where bdh isnull