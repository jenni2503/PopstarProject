namespace popstarAPI.Models
{
    public class Artist
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? category { get; set; }
        public string? image { get; set; }

        public Artist()
        {

        }

        public Artist(int id, string name, string category, string image)
        {
            this.id = id;
            this.name = name;
            this.category = category;
            this.image = image;
        }

        public Artist(string name, string category, string image)
        {
            this.name = name;
            this.category = category;
            this.image = image;
        }

        public override string? ToString()
        {
            return base.ToString() + id + " : " + name + " : " + category + " : " + image;
        }
    }
}