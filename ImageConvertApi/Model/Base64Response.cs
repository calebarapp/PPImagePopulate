using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace ImageConvertApi.Model
{
    public class Base64Converter 
    {
        public Base64Converter(List<string> urlList)
        {
            this.urlList = urlList;
        }

        public List<string> urlList { get; set; }
        public List<string> base64List { get; set; }


        // Performs fetch and coversion for each url in the url
        public void ConvertUrls()
        {
            List<string> tempBase64List = new List<string>();
            for(int i = 0; i < this.urlList.Count; i++)
            {

                tempBase64List.Add(ConvertImageURLToBase64(urlList[i]));
            }
            base64List = tempBase64List;
        }

        // Gets image from url then converts it to base64. 
        private string ConvertImageURLToBase64(string url)
        {
            StringBuilder _sb = new StringBuilder();
            Byte[] _byte = this.GetImage(url);

            _sb.Append(Convert.ToBase64String(_byte, 0, _byte.Length));

            return _sb.ToString();
        }

        private byte[] GetImage(string url)
        {
            Stream stream = null;
            byte[] buf;

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
                    buf = br.ReadBytes(len);
                    br.Close();
                }

                stream.Close();
                response.Close();
            }
            catch (Exception exp)
            {
                buf = null;
            }

            return (buf);
        }
    }
}
