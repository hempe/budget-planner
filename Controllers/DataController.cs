using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BudgetPlanner.Controllers {
    [Route("api/data")]
    [Authorize]
    public class DataController : Controller {
        private readonly UserManager<User> userManager;

        public DataController(UserManager<User> userManager) {
            this.userManager = userManager;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile([FromServices] Services.ProfileStore profileStore) {
            var value = await profileStore.GetProfileAsync(this.userManager.GetUserId(this.User));
            if (string.IsNullOrWhiteSpace(value))
                return this.Ok(new object());
            try {
                return this.Ok(JsonConvert.DeserializeObject(value));
            } catch {
                return this.Ok(new object());
            }
        }

        [HttpPost("profile")]
        public async Task<IActionResult> SetProfile([FromServices] Services.ProfileStore profileStore, [FromBody] object profile) {
            await profileStore.SaveProfileAsync(this.userManager.GetUserId(this.User), JsonConvert.SerializeObject(profile));
            return this.Ok(profile);
        }

        public class WeatherForecast {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF {
                get {
                    return 32 + (int) (TemperatureC / 0.5556);
                }
            }
        }
    }
}