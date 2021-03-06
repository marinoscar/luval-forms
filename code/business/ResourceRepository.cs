﻿using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class ResourceRepository: EntityRepository
    {
        public ResourceRepository(): base("Resource")
        {

        }

        public override List<Record> GetAll()
        {
            var sql = @"
                SELECT Resource.Id,Resource.Name,Resource.LastName,Resource.Email,Resource.GPN,
                Resource.StartDate,Resource.RankId,Rank.Name As RankName 
                FROM Resource INNER JOIN Rank ON Resource.RankId = Rank.Id";
            return this.Context.Db.ExecuteToRecordList(sql);
        }

        public List<Record> GetAllRanks()
        {
            var sql = @"SELECT Id As value, Name as text FROM Rank";
            return this.Context.Db.ExecuteToRecordList(sql);
        }
    }
}
