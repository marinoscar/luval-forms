using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class RankRepository : RepositoryBase
    {
        public RankRepository() : base(new SqlDataContext())
        {

        }

        public List<Dictionary<string, object>> GetRanks()
        {
            var sql = "SELECT Id, Rank, ClientBillRate, BillRate, CostRate from Rank";
            return Context.Db.ExecuteToDictionaryList(sql);
        }
    }
}
