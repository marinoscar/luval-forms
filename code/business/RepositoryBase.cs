using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class RepositoryBase
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
            Context.Insert(entity);
        }

        public virtual void Delete(Entity entity)
        {
            Context.Delete(entity);
        }

        private void PrepareForInsert(Dictionary<string, object> item)
        {
            item["UtcCreatedOn"] = DateTime.UtcNow;
            item["CreatedBy"] = _resolveUser();
            PrepareForUpdate(item);
            
        }

        private void PrepareForUpdate(Dictionary<string, object> item)
        {
            item["UtcUpdatedOn"] = DateTime.UtcNow;
            item["UpdatedBy"] = _resolveUser();
        }
    }
}
