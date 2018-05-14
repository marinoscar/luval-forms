using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public abstract class RepositoryBase
    {

        private Func<string> _resolveUser;
        public virtual DataContext Context { get; set; }

        public RepositoryBase(DataContext context) : this(context, UserResolver.GetUserId)
        {

        }

        public RepositoryBase(DataContext context, Func<string> resolveUser)
        {
            Context = context;
            _resolveUser = resolveUser;
        }


        public abstract List<Record> GetAll();

        protected virtual List<Record> GetAll(string entityName)
        {
            var sql = "SELECT * FROM [{0}]".Fi(entityName);
            return Context.Db.ExecuteToRecordList(sql);
        }

        public abstract Record GetById(int id);

        protected virtual Record  GetById(string entityName, int id)
        {
            var sql = "SELECT * FROM [{0}] WHERE Id = {1}".Fi(entityName, id);
            return Context.Db.ExecuteToRecordList(sql).FirstOrDefault();
        }

        public virtual void Insert(Entity entity)
        {
            foreach (var item in entity.Items)
                PrepareForInsert(item);
            Context.Insert(entity);
        }

        public virtual void Update(Entity entity)
        {
            foreach (var item in entity.Items)
                PrepareForUpdate(item);
            Context.Update(entity);
        }

        public virtual void Delete(Entity entity)
        {
            Context.Delete(entity);
        }

        protected virtual void PrepareForInsert(Record item)
        {
            item["UtcCreatedOn"] = DateTime.UtcNow;
            item["CreatedBy"] = _resolveUser();
            PrepareForUpdate(item);
            
        }

        protected virtual void PrepareForUpdate(Record item)
        {
            item["UtcUpdatedOn"] = DateTime.UtcNow;
            item["UpdatedBy"] = _resolveUser();
        }
    }
}
