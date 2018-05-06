using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace web.Controllers
{
    public class SectorController : BaseController<SectorRepository>
    {
        public SectorController():base(new SectorRepository())
        {
            ViewBag.ModelName = "sectorModel";
            ViewBag.ListModelName = "sectorList";
        }
    }
}