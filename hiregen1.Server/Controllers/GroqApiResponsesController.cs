using hiregen1.Server.Data;
using hiregen1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace hiregen1.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroqApiResponsesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<GroqApiResponsesController> _logger;

        public GroqApiResponsesController(ApplicationDbContext context, ILogger<GroqApiResponsesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> PostMission([FromBody] Mission mission)
        {
            if (mission == null)
            {
                return BadRequest("Mission data is null.");
            }

            // Handle StartDate based on StartImmediately
            if (mission.StartImmediately)
            {
                mission.StartDate = null; // Clear StartDate if starting immediately
            }

            // Convert RequiredExpertises array to JSON string
            if (mission.RequiredExpertises != null)
            {
                // Assuming RequiredExpertises is already a comma-separated string from frontend
                // If it's an array, it needs to be serialized. For now, assuming string.
                // If frontend sends as array, it will be deserialized by model binding.
                // If it's a string, it's fine.
            }

            mission.Timestamp = DateTime.UtcNow; // Ensure timestamp is set on server side

            _context.Missions.Add(mission);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Mission saved: Title='{mission.Title}', Country='{mission.Country}'");

            return CreatedAtAction(nameof(GetMission), new { id = mission.Id }, mission);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMission(int id, [FromBody] Mission mission)
        {
            // Temporarily remove ID mismatch check for debugging
            // if (id != mission.Id)
            // {
            //     return BadRequest("Mission ID mismatch.");
            // }

            // Ensure the ID from the route is used for the entity to be updated
            mission.Id = id; 
            _context.Entry(mission).State = EntityState.Modified;

            try
            {
                // Handle StartDate based on StartImmediately for updates
                if (mission.StartImmediately)
                {
                    mission.StartDate = null; // Clear StartDate if starting immediately
                }

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Missions.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            _logger.LogInformation($"Mission updated: Id='{mission.Id}', Title='{mission.Title}'");

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Mission>> GetMission(int id)
        {
            var mission = await _context.Missions.FindAsync(id);

            if (mission == null)
            {
                return NotFound();
            }

            return mission;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Mission>>> GetMissions()
        {
            return await _context.Missions.ToListAsync();
        }

        [HttpDelete("DeleteMission/{id}")] // More explicit route
        public async Task<IActionResult> DeleteMission(int id)
        {
            var mission = await _context.Missions.FindAsync(id);
            if (mission == null)
            {
                return NotFound();
            }

            _context.Missions.Remove(mission);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Mission deleted: Id='{id}'");

            return NoContent();
        }
    }
}
