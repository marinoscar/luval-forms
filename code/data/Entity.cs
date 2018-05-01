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
            Items = new List<Dictionary<string, object>>(25);
        }
        public string Name { get; set; }
        public string IdentityColumnName { get; set; }
        public string PrimaryKeyName { get; set; }
        public List<Dictionary<string, object>> Items { get; set; }
    }
}
