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
            res.ForEach(i =>
            {
                if (!ObjectExtensions.IsNullOrDbNull(i["ApprovalDate"]))
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

        public void CreatePipeLine(Record record, List<Record> resources)
        {
            var log = new EntityChangeLogRepository(Context);
            var comment = ExtractComment(record);
            UpdateTotals(record, resources);
            Context.Db.WithTransaction(db =>
            {
                Insert(CreateEntity(record));
                var id = db.ExecuteScalarOr<decimal>(string.Format("SELECT IDENT_CURRENT('{0}')", EntityName), default(decimal));
                resources.ForEach(i =>
                {
                    i["PipelineId"] = id;
                    if (i.ContainsKey("RankIdText"))
                        i.Remove("RankIdText");
                });
                Insert(new Entity()
                {
                    Name = "PipelineResource",
                    Items = new List<Record>(resources)
                });
                log.AddPipelineInsertLog(Convert.ToInt32(id));
                return null;
            });
        }

        public void EditPipeLine(Record record, List<Record> resources)
        {
            var log = new EntityChangeLogRepository(Context);
            var comment = ExtractComment(record);
            var id = Convert.ToInt32(record["Id"]);
            var sql = "DELETE FROM PipelineResource WHERE PipelineId = {0}".Fi(id);
            UpdateTotals(record, resources);
            Context.Db.WithTransaction(db =>
            {
                Update(CreateEntity(record));
                resources.ForEach(i =>
                {
                    if (i.ContainsKey("RankIdText"))
                        i.Remove("RankIdText");
                });
                db.ExecuteNonQuery(sql);
                Insert(new Entity()
                {
                    Name = "PipelineResource",
                    Items = new List<Record>(resources)
                });
                log.AddPipelineUpdateLog(Convert.ToInt32(id), record, record);
                return null;
            });
        }

        private string ExtractComment(Record record)
        {
            var res = default(string);
            if (record.ContainsKey("Comment"))
            {
                res = Convert.ToString(record["Comment"]);
                record.Remove("Comment");
            }
            return res;
        }

        private void UpdateTotals(Dictionary<string, object> record, List<Record> resources)
        {
            var ranks = (new RankRepository()).GetAll();
            var total = default(decimal);
            var cost = default(decimal);
            var rates = default(decimal);
            var hours = default(decimal);
            var rankHours = new Dictionary<string, decimal>()
            {
                { "Staff", default(decimal) }, { "Senior", default(decimal) }, { "Manager", default(decimal) },
                { "Senior Manager", default(decimal) }, { "Executive Director", default(decimal) }, { "Partner", default(decimal) }
            };
            foreach (var r in resources)
            {
                var rank = ranks.Single(i => (int)i["Id"] == (int)r["RankId"]);
                total += Convert.ToDecimal(r["HourlyRate"]) * Convert.ToDecimal(r["Hours"]);
                cost += Convert.ToDecimal(rank["CostRate"]) * Convert.ToDecimal(r["Hours"]);
                rates += Convert.ToDecimal(rank["StandardBillRate"]) * Convert.ToDecimal(r["Hours"]);
                hours += Convert.ToDecimal(r["Hours"]);
                rankHours[rank["StandardRank"].ToString()] = rankHours[rank["StandardRank"].ToString()] + Convert.ToDecimal(r["Hours"]);
            }
            record["BlendedRate"] = (total / hours);
            record["Total"] = total;
            record["ERP"] = (total / rates) * 100;
            record["Margin"] = ((1 - (cost / total)) * 100);
            record["TotalHours"] = hours;
            record["TotalHoursStaff"] = rankHours.Where(i => i.Key == "Staff").Sum(i => i.Value);
            record["TotalHoursSenior"] = rankHours.Where(i => i.Key == "Senior").Sum(i => i.Value);
            record["TotalHoursManager"] = rankHours.Where(i => i.Key == "Manager").Sum(i => i.Value);
            record["TotalHoursSeniorManager"] = rankHours.Where(i => i.Key == "Senior Manager").Sum(i => i.Value);
            record["TotalHoursSeniorPartner"] = rankHours.Where(i => i.Key == "Partner" || i.Key == "Executive Director").Sum(i => i.Value);
        }

        public Record GetComplexEntity(int id)
        {
            var entity = GetById(id);
            entity["-ResourceArray"] = GetResources(id);
            return entity;
        }

        public List<Record> GetResources(int id)
        {
            var sql = @"
SELECT
	ROW_NUMBER() OVER(ORDER BY Res.Id ASC) As [-RowId],
	Res.Id,
	Res.RankId,
	[Rank].[Name] As RankIdText,
	[Rank].[Name] As [-RankId-Text],
	Res.PipelineId,
	Res.HourlyRate,
	Res.[Hours]
FROM PipelineResource As Res
INNER JOIN [Rank] ON Res.RankId = [Rank].Id
WHERE Res.PipelineId = {0}
".FormatSql(id);
            return Context.Db.ExecuteToRecordList(sql);
        }
    }
}
