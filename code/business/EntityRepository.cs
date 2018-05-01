using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class EntityRepository: RepositoryBase
    {

        protected string EntityName { get; private set; }


        public EntityRepository(string entityName): this(entityName, new SqlDataContext())
        {

        }

        public EntityRepository(string entityName, DataContext context) : this(entityName,context, UserResolver.GetUserId)
        {

        }

        public EntityRepository(string entityName, DataContext context, Func<string> userResolver) : base(context, userResolver)
        {
            EntityName = entityName;
        }

        public override List<Dictionary<string, object>> GetAll()
        {
            return GetAll(EntityName);
        }

        public override Dictionary<string, object> GetById(int id)
        {
            return GetById(EntityName, id);
        }
    }
}
