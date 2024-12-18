update  public.china_wgs84_town a set  province= (
select province from public.admin_2022_city b where a.city_name =b.name
)

update  public.china_wgs84_town a set  province_code= (
select province_code from public.admin_2022_city b where a.city_name =b.name
)


update  public.china_wgs84_all a set  province= (
select province from public.admin_2022_city b where a.city_name =b.name
)

update  public.china_wgs84_all a set  province_code= (
select province_code from public.admin_2022_city b where a.city_name =b.name
)
