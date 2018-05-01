using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json;

namespace web.Controllers
{
    public class BaseController<T> : Controller where T : EntityRepository
    {

        public T Repository { get; private set; }

        public BaseController(T repository)
        {
            Repository = repository;
        }

        public virtual ContentResult ListAll()
        {
            return DoJson(Repository.GetAll());
        }

        public ContentResult DoJson(object data)
        {
            var json = JsonConvert.SerializeObject(data);
            return Content(json, "application/json");
        }
    }
}