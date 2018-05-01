using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class SqlDialectProvider
    {

        private Entity _entity;



        public SqlDialectProvider(Entity entity)
        {

        }

        public IEnumerable<string> GetInsert()
        {
            var items = new List<string>();
            foreach(var item in _entity.Items)
            {
                items.Add(GetInsert(item));
            }
            return items;
        }

        public IEnumerable<string> GetUpdate()
        {
            var items = new List<string>();
            foreach (var item in _entity.Items)
            {
                items.Add(GetUpdate(item));
            }
            return items;
        }

        private string GetDelete(Dictionary<string, object> item)
        {
            return string.Format("DELETE FROM {0} WHERE {1}", GetTableName(), GetPkWhereStatement(item));
        }

        private string GetInsert(Dictionary<string, object> item)
        {
            var cols = GetColumnsForInsert(item);
            var colNames = string.Join(",",cols.Select(i => "[{0}]".Fi(i)));
            var values = item.Where(i => cols.Contains(i.Key)).Select(i => i.Value).ToList();
            var sqlValues = string.Join(",", values.Select(i => i.ToSql()));
            return string.Format("INSERT INTO {0} ({1}) VALUES({2})", GetTableName(), colNames, sqlValues);
        }

        private string GetUpdate(Dictionary<string, object> item)
        {
            var cols = item.Keys.Where(i => i != _entity.PrimaryKeyName && i != _entity.IdentityColumnName).ToList();
            var values = item.Where(i => cols.Contains(i.Key)).ToList();
            var sqlValues = values.Select(i => string.Format("[{0}] = {1}", i.Key, i.Value.ToSql()));
            return string.Format("UPDATE {0} SET {1} WHERE {2}", GetTableName(), sqlValues, GetPkWhereStatement(item));
        }

        private List<string> GetColumnsForInsert(Dictionary<string, object> item)
        {
            return item.Keys.Where(i => i != _entity.IdentityColumnName).ToList();
        }

        private string GetPkWhereStatement(Dictionary<string, object> item)
        {
            return string.Format("{0} = {1}", GetTableName(), item[_entity.PrimaryKeyName].ToSql());
        }

        private string GetTableName()
        {
            return string.Format("[{0}]", _entity.Name);
        }
    }
}
