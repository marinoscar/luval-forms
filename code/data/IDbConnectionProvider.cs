using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace data
{
    public interface IDbConnectionProvider : IDisposable
    {
        IDbConnection Connection { get; }
        IDbTransaction BeginTransaction();
        IDbTransaction BeginTransaction(IsolationLevel isolationLevel);

        bool IsTransactionActive { get; }
        void Commit();
        void Rollback();

        void OpenConnection();
        void CloseConnection();

    }
}
