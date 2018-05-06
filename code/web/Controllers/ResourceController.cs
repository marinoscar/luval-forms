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
        }

        public ContentResult GetAllRanks()
        {
            var ranks = Repository.GetAllRanks();
            return DoJson(ranks);
        }
    }
}