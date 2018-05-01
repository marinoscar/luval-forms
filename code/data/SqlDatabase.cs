using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class SqlDatabase : Database
    {
        public SqlDatabase() : this(ConfigurationManager.ConnectionStrings[0].ConnectionString)
        {

        }

        public SqlDatabase(string connectionString) : base(new DbConnectionProvider(new SqlConnection(connectionString)))
        {

        }
    }
}
