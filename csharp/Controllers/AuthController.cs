using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Flurl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers {

    public class RegisterDto {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginDto {
        public string Email { get; set; }
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }

    [Route(".auth")]
    public class AuthController : BaseController {
        private readonly SignInManager<User> signInManager;
        public AuthController(UserManager<User> userManager, TableStore tableStore, SignInManager<User> signInManager) : base(userManager, tableStore) {
            this.signInManager = signInManager;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> Index() {
            var schemes = await this.signInManager.GetExternalAuthenticationSchemesAsync();
            var loginProviders = schemes.Select(x => new { x.Name, x.DisplayName }).ToList();
            return this.Ok(loginProviders);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model) {
            if (this.User.Identity.IsAuthenticated)
                return this.BadRequest("Already signed in");

            var user = new User() { Email = model.Email, UserName = model.Email };
            var created = await this.UserManager.CreateAsync(user, model.Password);
            if (created.Succeeded) {
                await this.signInManager.SignInAsync(user, isPersistent: false);
                return this.Ok();
            }

            return this.BadRequest(new {
                Email = created.Errors.Where(e => e.Code.ToLower().Contains("email")).Select(x => x.Code).ToList(),
                    Password = created.Errors.Where(e => e.Code.ToLower().Contains("password")).Select(x => x.Code).ToList(),
            });
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model) {
            if (this.User.Identity.IsAuthenticated)
                return this.BadRequest("Already signed in");

            // lockoutOnFailure: true
            var result = await this.signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
            if (result.Succeeded) {
                return this.Ok();
            }
            if (result.RequiresTwoFactor) {
                return this.BadRequest("Two factor not supported");
            }
            if (result.IsLockedOut) {
                return this.BadRequest("Lockout");
            } else {
                return this.BadRequest("Invalid login attempt.");
            }
        }

        [AllowAnonymous, Route("error/{code}"), HttpGet, HttpDelete, HttpPost, HttpPut, HttpPatch]
        public IActionResult accessdenied([FromRoute] int code) {
            return this.StatusCode(code);
        }

        [AllowAnonymous]
        [HttpGet("self")]
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

        [Authorize]
        [HttpGet("iframe")]
        public IActionResult IFrame() => this.View("~/Views/iframe.html");

        [AllowAnonymous]
        [HttpGet("signin/{provider}")]
        public async Task<IActionResult> ExternalLogin([FromRoute] string provider, [FromQuery] string returnUrl = null) {
            var schemes = await this.signInManager.GetExternalAuthenticationSchemesAsync();
            var schema = schemes.Where(x => string.Equals(provider, x.Name, StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            var url = "/.auth/signin/callback".SetQueryParam("returnUrl", returnUrl);
            var properties = this.signInManager.ConfigureExternalAuthenticationProperties(schema.Name, url);
            return Challenge(properties, schema.Name);
        }

        [AllowAnonymous]
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

                var created = await this.UserManager.CreateAsync(user);
                if (created.Succeeded) {
                    created = await this.UserManager.AddLoginAsync(user, info);
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