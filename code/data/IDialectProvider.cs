using System.Collections.Generic;

namespace data
{
    public interface IDialectProvider
    {
        IEnumerable<string> GetDelete(Entity entity);
        IEnumerable<string> GetInsert(Entity entity);
        IEnumerable<string> GetUpdate(Entity entity);
    }
}