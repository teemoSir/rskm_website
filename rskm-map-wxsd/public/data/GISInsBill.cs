using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace AIS.Model.Models.SyncInsGraphData
{
    public class GISInsBill
    {
        /// <summary>
        /// 保单号
        /// </summary>
        public string insurancenum { get; set; }
        /// <summary>
        /// 行政区划code：如果保单投保区域为地市以下，则该属性为区县代码，否则为保单投保区域代码；2024-06-28后对接的一张图可以忽略改属性
        /// </summary>
        public string areacode { get; set; }--
        /// <summary>
        /// 保险代码
        /// </summary>
        public string insurancetarget { get; set; }
        /// <summary>
        /// 承保数量
        /// </summary>
        public string insuredquantity { get; set; }
        /// <summary>
        /// 空间字符串
        /// </summary>
        public string geojsonstr { get; set; }
        /// <summary>
        /// 修改参数 1：新增/修改，-1：删除；一张图判断逻辑，1需要根据是否有保单号来判断 -1需要删除(已退保)
        /// </summary>
        public int updateornot { get; set; }
        /// <summary>
        /// 保险公司Id
        /// </summary>
        public string insurcompanycode { get; set; }

        /// <summary>
        /// 被保险人名称
        /// </summary>
        public string insured { get; set; }

   
        /// <summary>
        /// 起保日期
        /// </summary>
        public DateTime EffectStartDate { get; set; }
        /// <summary>
        /// 截止日期
        /// </summary>
        public DateTime EffectEndDate { get; set; }
        /// <summary>
        /// 保单的投保区域代码
        /// </summary>
        public string RegionCode { get; set; }

        /// <summary>
        /// 一张图处理结果；1成功 -1失败
        /// </summary>
        public int HandleStatus { get; set; }

        /// <summary>
        /// 地块数据保存时间
        /// <para>一张图同步后需把该字段值原样返回</para>
        /// </summary>
        public DateTime CreatedDate { get; set; }
        /// <summary>
        /// 保单Id
        /// <para>一张图同步后需把该字段值原样返回</para>
        /// </summary>        
        public string InsuranceId { get; set; }
        /// <summary>
        /// null未同步过，0待重新同步
        /// <para>一张图同步后需把该字段值原样返回</para>
        /// </summary>
        public int? LogStatus { get; set; }
    }
}
