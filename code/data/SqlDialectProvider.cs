using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class SqlDialectProvider : IDialectProvider
    {
        public SqlDialectProvider()
        {
        }

        public IEnumerable<string> GetInsert(Entity entity)
        {
            var items = new List<string>();
            foreach(var item in entity.Items)
            {
                items.Add(GetInsert(entity, item));
            }
            return items;
        }

        public IEnumerable<string> GetUpdate(Entity entity)
        {
            var items = new List<string>();
            foreach (var item in entity.Items)
            {
                items.Add(GetUpdate(entity, item));
            }
            return items;
        }

        public IEnumerable<string> GetDelete(Entity entity)
        {
            var items = new List<string>();
            foreach (var item in entity.Items)
            {
                items.Add(GetDelete(entity, item));
            }
            return items;
        }

        private string GetDelete(Entity entity, Dictionary<string, object> item)
        {
            return string.Format("DELETE FROM {0} WHERE {1}", GetTableName(entity), GetPkWhereStatement(entity, item));
        }

        private string GetInsert(Entity entity, Dictionary<string, object> item)
        {
            var cols = GetColumnsForInsert(entity, item);
            var colNames = string.Join(",",cols.Select(i => "[{0}]".Fi(i)));
            var values = item.Where(i => cols.Contains(i.Key)).Select(i => i.Value).ToList();
            var sqlValues = string.Join(",", values.Select(i => i.ToSql()));
            return string.Format("INSERT INTO {0} ({1}) VALUES({2})", GetTableName(entity), colNames, sqlValues);
        }

        private string GetUpdate(Entity entity, Dictionary<string, object> item)
        {
            var cols = item.Keys.Where(i => i != entity.PrimaryKeyName && i != entity.IdentityColumnName).ToList();
            var values = item.Where(i => cols.Contains(i.Key)).ToList();
            var sqlValues = values.Select(i => string.Format("[{0}] = {1}", i.Key, i.Value.ToSql()));
            return string.Format("UPDATE {0} SET {1} WHERE {2}", GetTableName(entity), sqlValues, GetPkWhereStatement(entity, item));
        }

        private List<string> GetColumnsForInsert(Entity entity, Dictionary<string, object> item)
        {
            return item.Keys.Where(i => i != entity.IdentityColumnName).ToList();
        }

        private string GetPkWhereStatement(Entity entity, Dictionary<string, object> item)
        {
            return string.Format("{0} = {1}", GetTableName(entity), item[entity.PrimaryKeyName].ToSql());
        }

        private string GetTableName(Entity entity)
        {
            return string.Format("[{0}]", entity.Name);
        }
    }
}
