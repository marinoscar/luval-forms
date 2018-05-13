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


        public abstract List<Dictionary<string, object>> GetAll();

        protected virtual List<Dictionary<string, object>> GetAll(string entityName)
        {
            var sql = "SELECT * FROM [{0}]".Fi(entityName);
            return Context.Db.ExecuteToDictionaryList(sql);
        }

        public abstract Dictionary<string, object> GetById(int id);

        protected virtual Dictionary<string, object>  GetById(string entityName, int id)
        {
            var sql = "SELECT * FROM [{0}] WHERE Id = {1}".Fi(entityName, id);
            return Context.Db.ExecuteToDictionaryList(sql).FirstOrDefault();
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

        protected virtual void PrepareForInsert(Dictionary<string, object> item)
        {
            item["UtcCreatedOn"] = DateTime.UtcNow;
            item["CreatedBy"] = _resolveUser();
            PrepareForUpdate(item);
            
        }

        protected virtual void PrepareForUpdate(Dictionary<string, object> item)
        {
            item["UtcUpdatedOn"] = DateTime.UtcNow;
            item["UpdatedBy"] = _resolveUser();
        }
    }
}
