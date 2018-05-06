using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class PipelineRepository: EntityRepository
    {
        public PipelineRepository() : base("Pipeline")
        {

        }

        public List<Dictionary<string, object>> GetList()
        {
            var sql = @"
SELECT
    Pipe.Id,
    Pipe.Name,
    Client.Name As Client,
    SSL.Name As SubServiceLine,
    Pipe.ApprovalDate,
    Offering.Name As Offering,
    Pipe.WinProbability,
    Pipe.Total
FROM Pipeline As Pipe
    INNER JOIN Client ON Pipe.ClientId = Client.Id
    INNER JOIN SubServiceLine As SSL ON Pipe.SubServiceLineId = SSL.Id
    INNER JOIN Offering On Pipe.OfferingId = Offering.Id
ORDER BY Pipe.UtcUpdatedOn DESC
";
            return Context.Db.ExecuteToDictionaryList(sql);
        }

        public List<Dictionary<string, object>> GetAsKeyValue(string entity)
        {
            var sql = string.Format("SELECT Id as value, Name as text FROM {0}", entity);
            return Context.Db.ExecuteToDictionaryList(sql);
        }
    }
}
