using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace web.Controllers
{
    public class RankController : BaseController<RankRepository>
    {

        public RankController():base(new RankRepository())
        {

        }
        // GET: Rank
        public ActionResult Index()
        {
            return View();
        }
    }
}