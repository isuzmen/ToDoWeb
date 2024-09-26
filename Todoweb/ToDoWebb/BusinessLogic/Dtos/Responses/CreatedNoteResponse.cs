using Entities.Concrete;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.Dtos.Responses
{
    public class CreatedNoteResponse : Note
    {
        public int Id { get; set; }
        public string Baslik { get; set; }
        public string? Icerik { get; set; }
        public bool? Yapildimi { get; set; }
        public DateTime NotTarihi { get; set; }
        public TimeOnly Saat { get; set; }
        public int? Oncelik { get; set; }
    }
}
