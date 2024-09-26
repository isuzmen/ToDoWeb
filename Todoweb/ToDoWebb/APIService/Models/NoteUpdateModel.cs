namespace APIService.Models
{
    public class NoteUpdateModel
    {
        public string baslik { get; set; }
        public string? icerik { get; set; }
        public bool yapildimi { get; set; }
        public int? oncelik { get; set; } //0 : az öncelikli , 1 normal , 2 önemli
        public DateTime notTarihi { get; set; }
    }
}
