using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class DataContext
    {

        private IDialectProvider _dialect;

        public DataContext(Database database, IDialectProvider dialect)
        {
            Db = database;
            _dialect = dialect;
        }

        public Database Db { get; private set; }

        public void Insert(Entity entity)
        {
            Execute(_dialect.GetInsert(entity));
        }

        public void Delete(Entity entity)
        {
            Execute(_dialect.GetDelete(entity));
        }

        public void Update(Entity entity)
        {
            Execute(_dialect.GetUpdate(entity));
        }

        private void Execute(IEnumerable<string> items)
        {
            foreach(var item in items)
            {
                Db.ExecuteNonQuery(item);
            }
        }

    }
}
