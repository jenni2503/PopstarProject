using Microsoft.Data.Sqlite;
namespace popstarAPI.Models;


public class DatabaseHandler
{
    private string source;
    private readonly ILogger<DatabaseHandler> _logger;
    public DatabaseHandler(string source, ILogger<DatabaseHandler> logger)
    {
        this.source = source;
        _logger = logger;
    }

    private SqliteConnection GetConnection()
    {
        var connection = new SqliteConnection($"Data Source={this.source}");
        connection.Open();
        return connection;
    }

    private SqliteCommand GetCommand(string sql, SqliteConnection connection)
    {
        var command = new SqliteCommand(sql, connection);
        command.CommandTimeout = 30;
        return command;
    }

    public Artist? getById(int id)
    {
        var conn = GetConnection();
        var command = GetCommand(@"
                SELECT id, name, category, image
                FROM artist
                WHERE id = $id
            ", conn);

        var idParam = command.CreateParameter();
        idParam.ParameterName = "$id";
        idParam.Value = id;
        command.Parameters.Add(idParam);

        var reader = command.ExecuteReader();

        if (reader.Read())
        {
            try
            {
                int obj_id = int.Parse(reader.GetString(0));
                string obj_name = reader.GetString(1);
                string obj_category = reader.GetString(2);
                string obj_image = reader.GetString(3);
                return new Artist(obj_id, obj_name, obj_category, obj_image);
            }
            catch (Exception e)
            {
                // in case Model og database is changed
                _logger.LogError(e.StackTrace);
            }
            finally
            {
                conn.Close();
            }
        }

        return null;
    }

    public List<Artist> GetAllArtists()
    {
        var conn = GetConnection();
        var command = GetCommand(@"
        SELECT id, name, category, image
        FROM artist
    ", conn);

        var reader = command.ExecuteReader();

        var artists = new List<Artist>();

        while (reader.Read())
        {
            try
            {
                int obj_id = int.Parse(reader.GetString(0));
                string obj_name = reader.GetString(1);
                string obj_category = reader.GetString(2);
                string obj_image = reader.GetString(3);
                var artist = new Artist(obj_id, obj_name, obj_category, obj_image);
                artists.Add(artist);
            }
            catch (Exception e)
            {
                _logger.LogError(e.StackTrace);
            }
        }

        conn.Close();
        return artists;
    }


    // Return true if something was changed
    public bool UpdateById(int id, Artist artist)
    {
        var conn = GetConnection();
        var command = GetCommand(@"
            UPDATE artist
            SET name = $name, category = $category, image = $image
            WHERE id = $id
        ", conn);

        //Safeguard agaisnt sql injection by setting parameters
        var nameParam = command.CreateParameter();
        nameParam.ParameterName = "$name";
        nameParam.Value = artist.name;
        command.Parameters.Add(nameParam);

        var categoryParam = command.CreateParameter();
        categoryParam.ParameterName = "$category";
        categoryParam.Value = artist.category;
        command.Parameters.Add(categoryParam);

        var imageParam = command.CreateParameter();
        imageParam.ParameterName = "$image";
        imageParam.Value = artist.image;
        command.Parameters.Add(imageParam);

        var idParam = command.CreateParameter();
        idParam.ParameterName = "$id";
        idParam.Value = id;
        command.Parameters.Add(idParam);

        var result = command.ExecuteNonQuery();
        conn.Close();
        return result > 0;
    }

    // Return true if something was deleted
    public bool DeleteById(int id)
    {
        var conn = GetConnection();
        var command = GetCommand(@"
            DELETE FROM artist
            WHERE id = $id
        ", conn);

        var idParam = command.CreateParameter();
        idParam.ParameterName = "$id";
        idParam.Value = id;
        command.Parameters.Add(idParam);

        var result = command.ExecuteNonQuery();
        conn.Close();
        return result > 0;
    }

    // return inserted artist if inserted successfully
    public Artist? AddArtist(string name, string category, string? image)
    {
        if (image == null)
        {
            image = "";
        }
        var conn = GetConnection();
        var command = GetCommand(@"
            INSERT INTO artist (name, category, image)
            VALUES ($name, $category, $image);
            SELECT last_insert_rowid();
        ", conn);

        var nameParam = command.CreateParameter();
        nameParam.ParameterName = "$name";
        nameParam.Value = name;
        command.Parameters.Add(nameParam);

        var categoryParam = command.CreateParameter();
        categoryParam.ParameterName = "$category";
        categoryParam.Value = category;
        command.Parameters.Add(categoryParam);

        var imageParam = command.CreateParameter();
        imageParam.ParameterName = "$image";
        imageParam.Value = image;
        command.Parameters.Add(imageParam);

        var reader = command.ExecuteReader();

        if (reader.Read())
        {
            try
            {
                int obj_id = Convert.ToInt32(reader[0]);
                return new Artist(obj_id, name, category, image);
            }
            catch (Exception e)
            {
                _logger.LogError(e.StackTrace);
            }
            finally
            {
                conn.Close();
            }
        }

        return null;
    }

}
