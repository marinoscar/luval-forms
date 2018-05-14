using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class EntityRepository : RepositoryBase
    {

        public string EntityName { get; private set; }


        public EntityRepository(string entityName) : this(entityName, new SqlDataContext())
        {

        }

        public EntityRepository(string entityName, DataContext context) : this(entityName, context, UserResolver.GetUserId)
        {

        }

        public EntityRepository(string entityName, DataContext context, Func<string> userResolver) : base(context, userResolver)
        {
            EntityName = entityName;
        }

        public override List<Record> GetAll()
        {
            return GetAll(EntityName);
        }

        public override Record GetById(int id)
        {
            return GetById(EntityName, id);
        }

        public Entity CreateEntity(Record item)
        {
            return CreateEntity(new[] { item });
        }

        public Entity CreateEntity(IEnumerable<Record> items)
        {
            return new Entity()
            {
                Name = EntityName,
                IdentityColumnName = "Id",
                PrimaryKeyName = "Id",
                Items = new List<Record>(items)
            };
        }
    }
}
