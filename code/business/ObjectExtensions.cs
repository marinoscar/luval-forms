using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public static class ObjectExtensions
    {
        public static string ToSql(this object o)
        {
            return SqlFormatter.Format(null, o);
        }

        public static bool IsNullOrDbNull(this object o)
        {
            return null == o || Convert.IsDBNull(o);
        }
    }
}
