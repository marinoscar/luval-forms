﻿using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json;
using web.Helpers;

namespace web.Controllers
{
    public class BaseController<T> : Controller where T : EntityRepository
    {

        public T Repository { get; private set; }

        public BaseController(T repository)
        {
            Repository = repository;
        }

        /// <summary>
        /// Basic view to show the form
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Create()
        {
            return View();
        }

        /// <summary>
        /// Action to save the data
        /// </summary>
        /// <param name="collection">The data to pass from the form</param>
        /// <returns></returns>
        [HttpPost]
        public virtual ActionResult Create(FormCollection collection)
        {
            try
            {
                var record = EntityHelper.ToDictionary(collection);
                Repository.Insert(Repository.CreateEntity(record));
                return RedirectToAction("Index");
            }
            catch(Exception ex) 
            {
                ErrorHelper.Handle(ex,"Failed to create the record");
                return Redirect("/");
            }
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