using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace web.Helpers
{
    public static class ErrorHelper
    {

        public static ActionResult Handle()
        {
            return Handle(null, 500, "Unable to complete request");
        }

        public static ActionResult Handle(Exception ex)
        {
            return Handle(ex, 500, "Unable to complete request");
        }

        public static ActionResult Handle(string message)
        {
            return Handle(null, 500, message);
        }

        public static void Handle(Exception ex, string message)
        {
            var code = Guid.NewGuid();
            throw new InvalidOperationException(string.Format("Reference Code: {0}\n{1}", code, message), ex);
        }

        public static ActionResult Handle(Exception ex, int status, string message)
        {
            var code = Guid.NewGuid();
            return new HttpStatusCodeResult(status, string.Format("Reference Code: {0}\n{1}",code, message));
        }
    }
}