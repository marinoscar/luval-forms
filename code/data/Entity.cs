using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public class Entity
    {
        public Entity()
        {
            Items = new List<Record>(25);
            IdentityColumnName = "Id";
            PrimaryKeyName = IdentityColumnName;
        }
        public string Name { get; set; }
        public string IdentityColumnName { get; set; }
        public string PrimaryKeyName { get; set; }
        public List<Record> Items { get; set; }
    }
}
