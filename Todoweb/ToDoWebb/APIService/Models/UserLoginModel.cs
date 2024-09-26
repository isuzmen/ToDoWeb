using Entities.Concrete;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace APIService.Models
{
    public class UserLoginModel
    {
       
        [Required]
        [EmailAddress]
        public string emailAddress { get; set; }
        [Required]
        [PasswordPropertyText]
        public string password { get; set; }
    }
}
