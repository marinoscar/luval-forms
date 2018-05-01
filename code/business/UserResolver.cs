using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public static class UserResolver
    {
        private static Func<string> _resolve;

        public static string GetUserId()
        {
            if (_resolve == null) return "not found";
            return _resolve();
        }

        public static void Initialize(Func<string> resolver)
        {
            _resolve = resolver;
        }
    }
}
