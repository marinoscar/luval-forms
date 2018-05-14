using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class Record : Dictionary<string, object>
    {
        public Record()
        {

        }

        protected Record(IDictionary<string, object> dic) : base(dic)
        {

        }

        public static Record FromDictionary(IDictionary<string, object> dictionary)
        {
            return new Record(dictionary);
        }

        public bool IsDBNull(string key)
        {
            return DBNull.Value.Equals(this[key]);
        }

        public T ConvertOr<T>(string key, T defaultValue)
        {
            if (IsDBNull(key)) return defaultValue;
            var val = default(T);
            try
            {
                val = (T)System.Convert.ChangeType(this[key], typeof(T));
            }
            catch
            {
                val = defaultValue;
            }
            return val;
        }

        public T Convert<T>(string key)
        {
            return ConvertOr<T>(key, default(T));
        }
    }
}
