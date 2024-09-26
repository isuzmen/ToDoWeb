using APIService.Enums;
using Entities.Concrete;
using static APIService.Models.NoteCreateModel;

namespace APIService.Models
{
    public class NoteCreateModel
    {
        public string baslik { get; set; }
        public string? icerik { get; set; }
        public int? oncelik { get; set; } //0 : az öncelikli , 1 normal , 2 önemli
        public DateTime notTarihi { get; set; }

    }
}
