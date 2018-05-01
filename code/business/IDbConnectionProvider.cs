using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public interface IDbConnectionProvider : IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction BeginTransaction();
        IDbTransaction BeginTransaction(IsolationLevel isolationLevel);
        void Commit();
        void Rollback();

        void OpenConnection();
        void CloseConnection();

    }
}
