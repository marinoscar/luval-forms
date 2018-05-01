using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class Database
    {
        private readonly int CommandTimeoutInSeconds = 90;

        public IDbConnectionProvider ConnectionProvider { get; private set; }

        public Database(IDbConnectionProvider connectionProvider)
        {
            ConnectionProvider = connectionProvider;
        }



        public object WithConnection(Func<IDbConnection, object> doSomething)
        {
            object result = null;
            try
            {
                ConnectionProvider.OpenConnection();
                result = doSomething(ConnectionProvider.Connection);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Unable to work with connection", ex);
            }
            finally
            {
                ConnectionProvider.CloseConnection();
            }
            return result;
        }


        public int ExecuteNonQuery(string sqlStatement)
        {
            return ExecuteNonQuery(sqlStatement, null);
        }

        public int ExecuteNonQuery(string sqlStatement, IEnumerable<IDbDataParameter> parameters)
        {
            return (int)WithCommand(sqlStatement, parameters, command => command.ExecuteNonQuery());
        }

        public T ExecuteScalar<T>(string query)
        {
            return ExecuteScalar<T>(query, null);
        }

        public T ExecuteScalar<T>(string query, IEnumerable<IDbDataParameter> parameters)
        {
            return (T)WithCommand(query, parameters, command =>
            {
                var result = command.ExecuteScalar();
                if (Convert.DBNull == result)
                {
                    throw new InvalidCastException(("Attempt to execute sql query '{0}' and obtain a scalar of type '{1}' "
                        + "returned an unexpected NULL from the database.").Fi(query, typeof(T).FullName));
                }

                if (null == result)
                {
                    throw new InvalidCastException(("Attempt to execute sql query '{0}' and obtain a scalar of type '{1}' "
                        + "returned zero rows.").Fi(query, typeof(T).FullName));
                }

                result = Convert.ChangeType(result, typeof(T));
                return result;
            });
        }

        public T ExecuteScalarOr<T>(string query, T defaultOnFailure)
        {
            return ExecuteScalarOr<T>(query, null, defaultOnFailure);
        }

        public T ExecuteScalarOr<T>(string query, IEnumerable<IDbDataParameter> parameters, T defaultOnFailure)
        {
            bool success;
            var result = TryExecuteScalar<T>(query, parameters, out success);
            return success ? result : defaultOnFailure;
        }

        public T TryExecuteScalar<T>(string query, out bool gotData)
        {
            return TryExecuteScalar<T>(query, null, out gotData);
        }

        public T TryExecuteScalar<T>(string query, IEnumerable<IDbDataParameter> parameters, out bool gotData)
        {
            var closureGotData = false;
            var result = (T)WithCommand(query, parameters, command =>
            {
                var returnedValue = command.ExecuteScalar();
                if (Convert.IsDBNull(returnedValue) || null == returnedValue)
                {
                    return default(T);
                }
                closureGotData = true;
                return returnedValue;
            });

            gotData = closureGotData;
            return result;
        }

        public void WhileReading(string query, Action<IDataReader> doSomething)
        {
            WhileReading(query, null, doSomething);
        }

        public void WhileReading(string query, IEnumerable<IDbDataParameter> parameters, Action<IDataReader> doSomething)
        {
            WithDataReader(query, CommandBehavior.Default, parameters, r =>
            {
                while (r.Read())
                {
                    doSomething(r);
                }

                return null;
            });
        }


        public List<Dictionary<string, object>> ExecuteToDictionaryList(string query)
        {
            return ExecuteToDictionaryList(query, null);
        }

        public List<Dictionary<string, object>> ExecuteToDictionaryList(string query, IEnumerable<IDbDataParameter> parameters)
        {
            var list = new List<Dictionary<string, object>>();
            WhileReading(query, parameters, r => list.Add(r.ToDictionary()));
            return list;
        }
        public object WithDataReader(string query, Func<IDataReader, object> doSomething)
        {
            return WithDataReader(query, CommandBehavior.Default, doSomething);
        }

        public object WithDataReader(string query, CommandBehavior behavior, Func<IDataReader, object> doSomething)
        {
            return WithDataReader(query, behavior, null, doSomething);
        }

        public object WithDataReader(string query, CommandBehavior behavior, IEnumerable<IDbDataParameter> parameters, Func<IDataReader, object> doSomething)
        {
            return WithCommand(query, parameters, command =>
            {
                using (var r = command.ExecuteReader(behavior))
                {
                    return doSomething(r);
                }
            });
        }


        #region With Command
        public object WithCommand(string sqlStatement, Func<IDbCommand, object> doSomething)
        {
            return WithCommand(sqlStatement, CommandType.Text, null, null, doSomething);
        }


        public object WithCommand(string sqlStatement, IDbTransaction transaction, Func<IDbCommand, object> doSomething)
        {
            return WithCommand(sqlStatement, CommandType.Text, null, transaction, doSomething);
        }

        public object WithCommand(string sqlStatement, IEnumerable<IDbDataParameter> parameters, Func<IDbCommand, object> doSomething)
        {
            return WithCommand(sqlStatement, CommandType.Text, parameters, doSomething);
        }

        public object WithCommand(string sqlStatement, CommandType type, IEnumerable<IDbDataParameter> parameters, Func<IDbCommand, object> doSomething)
        {
            return WithCommand(sqlStatement, type, parameters, null, doSomething);
        }

        public object WithCommand(string sqlStatement, CommandType type, IDbTransaction transaction, Func<IDbCommand, object> doSomething)
        {
            return WithCommand(sqlStatement, type, null, transaction, doSomething);
        }

        public object WithCommand(string sqlStatement, CommandType type, IEnumerable<IDbDataParameter> parameters, IDbTransaction transaction, Func<IDbCommand, object> doSomething)
        {

            return WithConnection(conn =>
            {
                var cmd = conn.CreateCommand();
                cmd.CommandText = sqlStatement;
                cmd.CommandType = type;
                cmd.Connection = conn;
                cmd.Transaction = ConnectionProvider.BeginTransaction();
                cmd.CommandTimeout = CommandTimeoutInSeconds;
                if (parameters != null && parameters.Any())
                    parameters.ToList().ForEach(p => cmd.Parameters.Add(p));
                object result = null;
                try
                {
                    result = doSomething(cmd);
                }
                catch (Exception ex)
                {
                    if (cmd.Transaction != null)
                    {

                        cmd.Transaction.Rollback();
                    }
                    throw new InvalidOperationException("Unable to execute statement {0}".Fi(sqlStatement), ex);
                }
                return result;
            });
        } 
        #endregion
    }
}
