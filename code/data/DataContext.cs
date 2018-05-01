using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class DataContext
    {
        public DataContext(Database database)
        {
            Db = database;
        }

        public Database Db { get; private set; }

        public void Insert(Entity entity)
        {

        }

        public void Delete(Entity entity)
        {

        }

    }
}
