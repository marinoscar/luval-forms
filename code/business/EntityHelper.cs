using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
            var types = item.AllKeys.Where(i => i.StartsWith("_") && i != "Id" && !i.StartsWith("-") && !i.Contains("[") && !i.Contains("]")).ToList();
            foreach(var typ in types)
            {
                var keyName = typ.Remove(0, 1);
                switch (Convert.ToString(item[typ]).ToLowerInvariant())
                {
                    case "number":
                        dic[keyName] = ToNumber(item[keyName]);
                        break;
                    case "range":
                        dic[keyName] = ToNumber(item[keyName]);
                        break;
                    case "date":
                        dic[keyName] = ToDate(item[keyName]);
                        break;
                    case "time":
                        dic[keyName] = ToDate(item[keyName]);
                        break;
                    case "datetime-local":
                        dic[keyName] = ToDate(item[keyName]);
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

        private static decimal? ToNumber(object item)
        {
            if (item == null || string.IsNullOrWhiteSpace(Convert.ToString(item))) return null;
            return Convert.ToDecimal(item);
        }

        private static DateTime? ToDate(object item)
        {
            if (item == null || string.IsNullOrWhiteSpace(Convert.ToString(item))) return null;
            DateTime d;
            var res = DateTime.TryParse(Convert.ToString(item), out d);

            if (res) return d;
            else return null;
        }

        public static List<Dictionary<string, object>> ToDictionaryList(NameValueCollection item)
        {
            var result = new List<Dictionary<string, object>>();
            var keys = item.AllKeys.Where(i => !i.StartsWith("-") && i.Contains("[") && i.Contains("]")).ToList();
            var allKeys = string.Join(",", keys);
            var indexStrings = Regex.Matches(allKeys, @"\[[0-9]*\]").Cast<Match>()
                .Select(i => i.Value).Distinct().ToList();
            var indexMatches = indexStrings.Select(i => Convert.ToInt32(i.Replace("[", "").Replace("]", ""))).OrderBy(i => i).ToList();
            foreach(var index in indexMatches)
            {
                var dic = new Dictionary<string, object>();
                var indexString = string.Format("[{0}]", index);
                var dicKeys = keys.Where(i => i.Contains(indexString)).ToList();
                foreach(var key in dicKeys)
                {
                    dic[key.Replace(indexString, "")] = item[key];
                }
                result.Add(dic);
            }
            return result;
        }
    }
}
