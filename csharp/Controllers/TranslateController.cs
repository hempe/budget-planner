using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Services.I18n;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BudgetPlanner.Controllers {

    [Route("api/i18n")]
    public class TranslateController : Controller {
        public TranslateController() { }

        [HttpGet("{lang}")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> Get([FromServices] TranslationService translationService, [FromRoute] string lang) {
            var translations = await translationService.GetTranslationsAsync(lang) ?? new object();
            return this.Ok(translations);
        }

        [HttpGet("{lang}/{key}")]
        [ProducesResponseType(typeof(string), 200)]
        public async Task<IActionResult> Translate([FromServices] TranslationService translationService, [FromRoute] string lang, [FromRoute] string key) {
            return this.Ok(await translationService.TranslateAsync(lang, key));
        }
    }
}