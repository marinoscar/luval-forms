using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class SqlDataContext : DataContext
    {
        public SqlDataContext() : this(new SqlDatabase())
        {

        }

        public SqlDataContext(string connString): this(new SqlDatabase(connString))
        {

        }

        public SqlDataContext(SqlDatabase db):base(db, new SqlDialectProvider())
        {

        }
    }
}
