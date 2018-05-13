using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class PipelineRepository : EntityRepository
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
            var res = Context.Db.ExecuteToDictionaryList(sql);
            //Format values
            res.ForEach(i => {
                if(!ObjectExtensions.IsNullOrDbNull(i["ApprovalDate"]))
                    i["ApprovalDate"] = Convert.ToDateTime(i["ApprovalDate"]).ToString("MMM, dd yyyy");
                if (!ObjectExtensions.IsNullOrDbNull(i["Total"]))
                    i["Total"] = Convert.ToDecimal(i["Total"]).ToString("N2");
            });
            return res;
        }

        public List<Dictionary<string, object>> GetAsKeyValue(string entity)
        {
            var sql = string.Format("SELECT Id as value, Name as text FROM {0}", entity);
            return Context.Db.ExecuteToDictionaryList(sql);
        }

        public void CreatePipeLine(Dictionary<string, object> record, List<Dictionary<string, object>> resources)
        {
            var log = new EntityChangeLogRepository(Context);
            UpdateTotal(record, resources);
            Context.Db.WithTransaction(db =>
            {
                Insert(CreateEntity(record));
                var id = db.ExecuteScalarOr<decimal>(string.Format("SELECT IDENT_CURRENT('{0}')", EntityName), default(decimal));
                resources.ForEach(i =>
                {
                    i["PipelineId"] = id;
                    if(i.ContainsKey("RankIdText"))
                        i.Remove("RankIdText");
                });
                Insert(new Entity()
                {
                    Name = "PipelineResource",
                    Items = new List<Dictionary<string, object>>(resources)
                });
                log.AddPipelineInsertLog(Convert.ToInt32(id));
                return null;
            });
        }

        private void UpdateTotal(Dictionary<string, object>  record, List<Dictionary<string, object>> resources)
        {
            var total = default(decimal);
            foreach(var r in resources)
            {
                total += Convert.ToDecimal(r["HourlyRate"]) * Convert.ToDecimal(r["Hours"]);
            }
            record["Total"] = total;
        }
    }
}
