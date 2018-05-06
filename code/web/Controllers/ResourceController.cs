using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace web.Controllers
{
    public class ResourceController : BaseController<ResourceRepository>
    {
        public ResourceController() : base(new ResourceRepository())
        {
            ViewBag.ModelName = "resourceModel";
            ViewBag.ListModelName = "resourceList";
        }

        public ContentResult GetAllRanks()
        {
            var ranks = Repository.GetAllRanks();
            return DoJson(ranks);
        }
    }
}