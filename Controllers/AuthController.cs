using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using Flurl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
//https://github.com/aspnet/Identity/tree/dev/samples/IdentitySample.Mvc

namespace BudgetPlanner.Controllers {

    [Route(".auth")]
    public class AuthController : Controller {

        private readonly SignInManager<User> signInManager;
        private readonly UserManager<User> userManager;

        public AuthController(SignInManager<User> signInManager, UserManager<User> userManager) {
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Index() {
            var schemes = await this.signInManager.GetExternalAuthenticationSchemesAsync();
            var loginProviders = schemes.Select(x => new { x.Name, x.DisplayName }).ToList();
            return this.Ok(loginProviders);
        }

        [HttpGet("self")]
        [AllowAnonymous]
        public IActionResult UserInfo() {
            if (!this.User.Identity.IsAuthenticated)
                return this.Ok(new {
                    loggedIn = false
                });

            return this.Ok(new {
                loggedIn = true,
                    UserName = this.User.Identity.Name
            });
        }

        [HttpGet("signout")]
        public async Task<IActionResult> SignOut([FromQuery] string returnUrl = null) {
            await this.signInManager.SignOutAsync();
            return this.RedirectToLocal(returnUrl);
        }

        [HttpGet("signin/{provider}")]
        public async Task<IActionResult> ExternalLogin([FromRoute] string provider, [FromQuery] string returnUrl = null) {
            var schemes = await this.signInManager.GetExternalAuthenticationSchemesAsync();
            var schema = schemes.Where(x => string.Equals(provider, x.Name, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            var url = "/.auth/signin/callback".SetQueryParam("returnUrl", returnUrl);
            var properties = this.signInManager.ConfigureExternalAuthenticationProperties(schema.Name, url);
            return Challenge(properties, schema.Name);
        }

        [HttpGet("signin/callback")]
        public async Task<IActionResult> ExternalLoginCallback([FromQuery] string returnUrl = null, [FromQuery] string remoteError = null) {
            if (remoteError != null) {
                ModelState.AddModelError(string.Empty, $"Error from external provider: {remoteError}");
                return this.BadRequest("Error from external provider");
            }
            var info = await this.signInManager.GetExternalLoginInfoAsync();

            if (info == null) {
                return this.BadRequest();
            }
            var claims = info.Principal.Claims.ToList();

            var result = await this.signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: true);
            if (result.Succeeded) {
                await this.signInManager.UpdateExternalAuthenticationTokensAsync(info);
                return this.RedirectToLocal(returnUrl);
            }
            if (result.RequiresTwoFactor) {
                return this.BadRequest("Two factor not supported");
            }
            if (result.IsLockedOut) {
                return this.BadRequest("Lockout");
            } else {

                var email = info.Principal.FindFirstValue(ClaimTypes.Email);
                var user = new User { UserName = email, Email = email, EmailConfirmed = true, };

                var created = await this.userManager.CreateAsync(user);
                if (created.Succeeded) {
                    created = await this.userManager.AddLoginAsync(user, info);
                    if (created.Succeeded) {
                        await this.signInManager.SignInAsync(user, isPersistent: false);
                        //_logger.LogInformation(6, "User created an account using {Name} provider.", info.LoginProvider);
                        await this.signInManager.UpdateExternalAuthenticationTokensAsync(info);
                        return this.RedirectToLocal(returnUrl);
                    }
                }

                return this.BadRequest(created.Errors);
            }
        }
        private IActionResult RedirectToLocal(string returnUrl) {
            if (Url.IsLocalUrl(returnUrl)) {
                return Redirect(returnUrl);
            } else {
                return Redirect("~/");
            }
        }
    }
}