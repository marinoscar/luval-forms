using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class DbConnectionProvider : IDbConnectionProvider
    {

        private IDbConnection _connection;
        private IDbTransaction _transaction;
        private bool _isTransactionActive;

        public DbConnectionProvider(IDbConnection connection)
        {
            _connection = connection;
        }

        public IDbConnection Connection => _connection;

        public IDbTransaction BeginTransaction()
        {
            return BeginTransaction(IsolationLevel.ReadCommitted);
        }

        public IDbTransaction BeginTransaction(IsolationLevel isolationLevel)
        {
            OpenConnection();
            if (_transaction == null)
            {
                _transaction = _connection.BeginTransaction(isolationLevel);
                _isTransactionActive = true;
            }
            return _transaction;
        }

        public void OpenConnection()
        {
            if (_connection.State != ConnectionState.Closed) return;
            _connection.Open();
        }

        public void CloseConnection()
        {
            if (_connection.State == ConnectionState.Closed) return;
            _connection.Close();
        }

        public void Commit()
        {
            if (_transaction == null) return;
            _transaction.Commit();
            _isTransactionActive = false;
            _transaction.Dispose();
            _transaction = null;
            CloseConnection();
        }

        public void Dispose()
        {
            if (_transaction != null && _isTransactionActive)
                _transaction.Commit();
            if (_transaction != null)
                _transaction.Dispose();
            _transaction = null;
            if (_connection != null && _connection.State == ConnectionState.Open)
                _connection.Close();
            if (_connection != null)
                _connection.Dispose();
            _connection = null;
        }

        public void Rollback()
        {
            if (_transaction == null) return;
            _transaction.Rollback();
            _isTransactionActive = false;
            _transaction.Dispose();
            _transaction = null;
            CloseConnection();
        }
    }
}
