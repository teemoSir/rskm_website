using ComLib;
using InsDataBusFactory;
using InsDataEntity;
using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Policy;

namespace SimpleTest
{
    internal class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var insList = GetInsuranceGraph();
                Console.WriteLine(insList);
                Console.WriteLine("同步结果");
                var syncResult = SendSyncResult();
                Console.WriteLine(syncResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            Console.ReadLine();
            
        }
        public static string GetInsuranceGraph()
        {
            var action = "/api/syncinsurance/getinsdata/1";
            WebClient wc = new WebClient();
            SetWebClientParams(wc, action);

            var result = wc.UploadString("http://124.128.248.214:85/api/transfer", "{}");
            return result;
        }
        public static string SendSyncResult()
        {
            var action = "/api/syncinsurance/syncinsdataresult";
            WebClient wc = new WebClient();
            SetWebClientParams(wc, action);

            var postObj = new
            {
                BillList = new List<dynamic> { new {
                    CreatedDate = DateTime.Parse("2023-01-01 00:00:13.483"),
                    InsuranceId="202301010000134788956G740",
                    LogStatus=(int?)null
                } },
                ResultList = new List<int> { -1 }
            };
            var postJson = Newtonsoft.Json.JsonConvert.SerializeObject(postObj);
            var result = wc.UploadString("http://124.128.248.214:85/api/transfer", postJson);
            return result;
        }
        public static void SetWebClientParams(WebClient wc,string action)
        {
            var apiKey = "nxptyzt";
            var privateKey = "46AA1572-L767-5783-F2A8-2A28F7240702";
            wc.Headers.Add("Content-Type", "application/json");
            var time = DateTime.Now.AddSeconds(-5).ToString("yyyy-MM-dd HH:mm:ss");
            wc.Headers.Add("ApiKey", apiKey);
            wc.Headers.Add("Time", time);
            wc.Headers.Add("Sign", GetSign(apiKey, time, privateKey));
            wc.Headers.Add("Action", action);
        }
        public static string GetSign(string apiKey, string time, string privateKey)
        {
            var tmpStr = string.Format("apikey={0}&time={1}&key={2}", apiKey, time, privateKey);
            return Md5Helper.MD5Hash(tmpStr);
        }
    }
}
