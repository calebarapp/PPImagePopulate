using Microsoft.AspNetCore.Hosting.Server;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ImageConvertApi.Model
{
    public class Base64Converter 
    {
        public Base64Converter(List<string> urlList)
        {
            this.urlList = urlList;
        }

        private List<string> urlList { get; set; }
        public List<string> base64List { get; set; }

        // Performs fetch and coversion for each url in the url
        public void ConvertUrls()
        {
            List<string> tempBase64List = new List<string>();
            for(int i = 0; i < this.urlList.Count; i++)
            {
                try
                {
                    tempBase64List.Add(ConvertImageURLToBase64(urlList[i]));
                } catch { } // if operation fails, skip to next iteration.
            }
            base64List = tempBase64List;
        }

        // Gets image from url then converts it to base64. 
        private string ConvertImageURLToBase64(string url)
        {
            //Get Image from url then convert to base64.
            string decodedUrl = HttpUtility.UrlDecode(url);
            Byte[] image = this.GetImage(decodedUrl);
            string convertedImage = Convert.ToBase64String(image, 0, image.Length);

            //create string from converted image.
            StringBuilder _sb = new StringBuilder();
            _sb.Append(convertedImage);
            return _sb.ToString();
        }

        private byte[] GetImage(string url)
        {
            Stream stream = null;
            byte[] image;
            try
            {
                // Gets image from Url
                WebProxy myProxy = new WebProxy();
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                HttpWebResponse response = (HttpWebResponse)req.GetResponse();
                stream = response.GetResponseStream();

                using (BinaryReader br = new BinaryReader(stream))
                {
                    int len = (int)(response.ContentLength);
                    image = br.ReadBytes(len);
                    br.Close();
                }
                stream.Close();
                response.Close();
            }
            catch
            {
                image = null;
            }

            return (image);
        }
    }
}
