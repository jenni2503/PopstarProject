using popstarAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace popstarAPI.Controllers
{
    // Route /image
    [ApiController]
    [Route("/image")]
    public class ImageController : ControllerBase
    {
        private DatabaseHandler dbhandler;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<ImageController> _logger;

        public ImageController(IWebHostEnvironment environment, ILogger<ImageController> logger, ILogger<DatabaseHandler> dbLogger)
        {
            _logger = logger;
            _environment = environment;
            dbhandler = new DatabaseHandler("db_popstars.db", dbLogger);

        }

        private void SetReturnHeaders()
        {
            HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");
            HttpContext.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        }

        [HttpPost]
        [ProducesResponseType(typeof(object), 201)]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            _logger.LogInformation("Incomming request");
            SetReturnHeaders();
            try
            {
                var imagePath = Path.Combine(_environment.WebRootPath, "images");
                if (!Directory.Exists(imagePath))
                {
                    Directory.CreateDirectory(imagePath);
                }
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(imagePath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                return Created($"images/{fileName}", new { FileName = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("{fileName}")]
        [ProducesResponseType(typeof(Nullable), 404)]
        [ProducesResponseType(typeof(File), 200, "image/jpg")]
        public IActionResult GetImage(string fileName)
        {
            SetReturnHeaders();
            var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }
            return PhysicalFile(filePath, "image/jpg");
        }

        [HttpPut("{imageName}")]
        [ProducesResponseType(typeof(Nullable), 204)]
        [ProducesResponseType(typeof(Nullable), 404)]
        public async Task<IActionResult> UpdateImage(string imageName, IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest("No file was uploaded.");
                }

                var filePath = Path.Combine(_environment.WebRootPath, "images", imageName);

                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("Image not found.");
                }

                System.IO.File.Delete(filePath);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }


        [HttpDelete("{fileName}")]
        [ProducesResponseType(typeof(Nullable), 204)]
        [ProducesResponseType(typeof(Nullable), 404)]
        public IActionResult DeleteImage(string fileName)
        {
            SetReturnHeaders();
            var filePath = Path.Combine(_environment.WebRootPath, "images", fileName);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }
            System.IO.File.Delete(filePath);
            return NoContent();
        }
    }
}