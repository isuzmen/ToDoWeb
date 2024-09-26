using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        [EmailAddress]
        public string emailAddress { get; set; }
        public string password { get; set; }
        public string phoneNumber { get; set; }
        public bool isActive { get; set; }
    }
}
