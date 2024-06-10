using popstarAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System;

namespace popstarAPI.Controllers
{
    [ApiController]
    [Route("/artist")]
    public class ArtistController : ControllerBase
    {
        private DatabaseHandler dbhandler;

        private readonly ILogger<ArtistController> _logger;

        public ArtistController(ILogger<ArtistController> logger, ILogger<DatabaseHandler> dbLogger)
        {
            _logger = logger;
            dbhandler = new DatabaseHandler("db_popstars.db", dbLogger);
        }

        private void SetReturnHeaders()
        {
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            HttpContext.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        }

        [HttpGet("/test")]
        public ActionResult<string> testing()
        {
            SetReturnHeaders();
            return StatusCode(418, "I'm a teapot.");
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(IEnumerable<Artist>), 200)]
        [ProducesResponseType(typeof(Nullable), 404)]
        public ActionResult<Artist> GetArtistById(int id)
        {
            SetReturnHeaders();
            var artist = dbhandler.getById(id);
            if (artist == null)
            {
                return NotFound();
            }
            return Ok(artist);
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<List<Artist>>), 200)]
        public ActionResult<List<Artist>> GetAllArtists()
        {
            SetReturnHeaders();
            return Ok(dbhandler.GetAllArtists());
        }

        [HttpPost]
        [ProducesResponseType(typeof(IEnumerable<Artist>), 201)]
        [ProducesResponseType(typeof(Nullable), 400)]
        public ActionResult<Artist> AddArtist([FromBody] Artist newArtist)
        {
            SetReturnHeaders();
            if (newArtist == null || string.IsNullOrWhiteSpace(newArtist.name) || string.IsNullOrWhiteSpace(newArtist.category))
            {
                return BadRequest("Invalid input data.");
            }

            var artist = dbhandler.AddArtist(newArtist.name, newArtist.category, newArtist.image);
            if (artist == null)
            {
                return BadRequest();
            }
            _logger.LogInformation($"Popstar added with id {artist.id}, {artist}");
            return Created($"Popstar added with id {artist.id}", artist);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Nullable), 204)]
        [ProducesResponseType(typeof(Nullable), 404)]
        public IActionResult UpdateArtist(int id, [FromBody] Artist artist)
        {
            SetReturnHeaders();
            // Validate input data
            if (artist == null || string.IsNullOrWhiteSpace(artist.name) || string.IsNullOrWhiteSpace(artist.category))
            {
                return BadRequest("Invalid input data.");
            }

            if (artist.image == null)
            {
                artist.image = "";
            }

            // Update the artist in the database
            var updated = dbhandler.UpdateById(id, artist);
            if (!updated)
            {
                return NotFound();
            }
            _logger.LogWarning($"Updated artist with id {id}, {artist}");
            return NoContent();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(Nullable), 204)]
        [ProducesResponseType(typeof(Nullable), 404)]
        public IActionResult DeleteArtist(int id)
        {
            // Delete the artist from the database
            var deleted = dbhandler.DeleteById(id);
            if (!deleted)
            {
                return NotFound();
            }
            _logger.LogWarning($"Deleted artist with id {id}");
            return NoContent();
        }
    }
}