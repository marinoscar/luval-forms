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

        public ContentResult GetAllClient()
        {
            return GetSelectValues("Client");
        }

        public ContentResult GetAllSubServiceLine()
        {
            return GetSelectValues("SubServiceLine");
        }

        public ContentResult GetAllResource()
        {
            return GetSelectValues("Resource");
        }

        public ContentResult GetAllOffering()
        {
            return GetSelectValues("Offering");
        }

        public ContentResult GetRankSelectValues()
        {
            return GetSelectValues("Rank");
        }

        public ContentResult GetAllRanks()
        {
            return DoJson(Repository.Context.Db.ExecuteToDictionaryList("SELECT Id, Name, StandardRank, BillRate, CostRate, StandardBillRate FROM Rank"));
        }

        public ContentResult GetSelectValues(string entityName)
        {
            var vals = Repository.GetAsKeyValue(entityName);
            return DoJson(vals);
        }
    }
}