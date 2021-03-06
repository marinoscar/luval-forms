﻿using business;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using Newtonsoft.Json;
using web.Helpers;
using System.Collections.Specialized;
using data;

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
        /// Action to render the list
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Index()
        {
            ViewBag.Title = string.Format("{0} List", Repository.EntityName);
            return View();
        }

        /// <summary>
        /// Basic view to show the form
        /// </summary>
        /// <returns></returns>
        public virtual ActionResult Create()
        {
            ViewBag.Title = string.Format("Create {0}", Repository.EntityName);
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
                var record = EntityHelper.ToRecord(collection);
                Repository.Insert(Repository.CreateEntity(record));
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ErrorHelper.Handle(ex, "Failed to create the record");
                return Redirect("/");
            }
        }

        /// <summary>
        /// Basic view to edit the form
        /// </summary>
        /// <param name="id">The id of the entity</param>
        public ActionResult Edit(int id)
        {
            ViewBag.Title = string.Format("Edit {0}", Repository.EntityName);
            ViewBag.Id = id;
            return View();
        }

        // POST: Model/Edit/5
        [HttpPost]
        public virtual ActionResult Edit(FormCollection collection)
        {
            try
            {
                var record = EntityHelper.ToRecord(collection);
                Repository.Update(Repository.CreateEntity(record));
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ErrorHelper.Handle(ex, "Failed to update the record");
                return Redirect("/");
            }
        }

        [HttpPost]
        public ActionResult Delete(int id)
        {
            try
            {
                var record = new Record() { { "Id", id } };
                Repository.Delete(Repository.CreateEntity(record));
                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                ErrorHelper.Handle(ex, "Failed to delete the record");
                return Redirect("/");
            }
        }


        public virtual ContentResult ListAll()
        {
            return DoJson(Repository.GetAll());
        }

        public virtual ContentResult GetEntity(int id)
        {
            var item = Repository.GetById(id);
            return DoJson(item);
        }

        protected ContentResult DoJson(object data)
        {
            var json = JsonConvert.SerializeObject(data);
            return Content(json, "application/json");
        }
    }
}