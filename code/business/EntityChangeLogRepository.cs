using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class EntityChangeLogRepository : EntityRepository
    {
        public EntityChangeLogRepository() : this(new SqlDataContext())
        {

        }

        public EntityChangeLogRepository(DataContext context) : base("EntityChangeLog", context)
        {

        }

        public void AddPipelineInsertLog(int id)
        {
            AddInsertLog("Pipeline", id);
        }

        public void AddPipelineUpdateLog(int id, Record before, Record after)
        {
            AddInsertLog("Pipeline", id);
        }

        public void AddUpdatetLog(string entityName, int id, Record before, Record after)
        {
            AddEntity(entityName, id, "Update", "Record updated");
        }

        public void AddInsertLog(string entityName, int id)
        {
            AddEntity(entityName, id, "Insert", "Record created");
        }
        public void AddEntity(string entityName, int id, string type, string details)
        {
            Insert(this.CreateEntity(Record.FromDictionary(new Dictionary<string, object>() {
                {"ReferenceId", id },{"Name", entityName },{"Type", type },
                {"Details", details },
            })));
        }

    }
}
