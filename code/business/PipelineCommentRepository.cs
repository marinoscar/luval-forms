using data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace business
{
    public class PipelineCommentRepository : EntityRepository
    {
        public PipelineCommentRepository() : this(new SqlDataContext())
        {

        }

        public PipelineCommentRepository(DataContext context) : base("PipelineComment", context)
        {

        }

        public void AddEntity(int id, string comment)
        {
            Insert(this.CreateEntity(new Dictionary<string, object>() {
                {"PipelineId", id },{"Comment", comment }
            }));
        }
    }
}
