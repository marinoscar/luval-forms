using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace web.Controllers
{
    public class PipelineController : BaseController<PipelineRepository>
    {
        public PipelineController() : base(new PipelineRepository())
        {
            ViewBag.ModelName = "pipelineModel";
            ViewBag.ListModelName = "pipelineList";
        }

        public override ContentResult ListAll()
        {
            var data = Repository.GetList();
            return DoJson(data);
        }
    }
}