﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ImageConvertApi.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace ImageConvertApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public string Get(List<string> urls, string callback)
        {

            Base64Converter base64Converter = new Base64Converter(urls);
            base64Converter.ConvertUrls();
             
            StringBuilder sb = new StringBuilder();
            sb.Append(callback + "(");
            sb.Append(JsonConvert.SerializeObject(base64Converter.base64List));
            sb.Append(");");
        
            return sb.ToString();
        }

   

    }
}
