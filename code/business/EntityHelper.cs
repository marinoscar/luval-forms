using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public static class EntityHelper
    {
        public static Dictionary<string, object> ToDictionary(NameValueCollection item)
        {
            var dic = new Dictionary<string, object>();
            if (item.AllKeys.Contains("Id"))
                dic["Id"] = Convert.ToDecimal(item["Id"]);
            var types = item.AllKeys.Where(i => i.StartsWith("_") && i != "Id").ToList();
            foreach(var typ in types)
            {
                var keyName = typ.Remove(0, 1);
                switch (Convert.ToString(item[typ]).ToLowerInvariant())
                {
                    case "number":
                        dic[keyName] = Convert.ToDecimal(item[keyName]);
                        break;
                    case "range":
                        dic[keyName] = Convert.ToDecimal(item[keyName]);
                        break;
                    case "date":
                        dic[keyName] = Convert.ToDateTime(item[keyName]);
                        break;
                    case "time":
                        dic[keyName] = Convert.ToDateTime(item[keyName]);
                        break;
                    case "datetime-local":
                        dic[keyName] = Convert.ToDateTime(item[keyName]);
                        break;
                    case "checkbox":
                        if(!item.AllKeys.Contains(keyName) || item[keyName] == null || string.IsNullOrWhiteSpace(Convert.ToString(item[keyName])))
                            dic[keyName] = false;
                        else
                            dic[keyName] = true;
                        break;
                    default:
                        dic[keyName] = Convert.ToString(item[keyName]);
                        break;
                }
            }
            return dic;
        }
    }
}
