using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;
/*using SixLabors.Shapes;*/

namespace BudgetPlanner.Controllers {

    public class DevelopmentElement {
        public string Group { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int? Start { get; set; }
        public int? End { get; set; }
        public decimal Value { get; set; }
        public string SubType { get; set; }
        public string Id { get; set; }
    }

    [Route("api/data")]
    [Authorize]
    public class DataController : BaseController {
        private readonly StoreOption storageOptions;
        public DataController(UserManager<User> userManager, TableStore tableStore, IOptions<StoreOption> storageOptions) : base(userManager, tableStore) {
            this.storageOptions = storageOptions.Value;
        }

        [HttpGet("profile")]
        [ProducesResponseType(typeof(ProfileData), 200)]
        public async Task<IActionResult> GetProfile() {
            var value = await this.TableStore.GetAsync(new Profile { UserId = this.UserId });
            return this.Ok(value?.Data ?? new ProfileData());
        }

        [HttpGet("profile/image")]
        public async Task<IActionResult> GetProfileImageUri() {
            var blob = this.GetBlobReference(this.UserId);
            if (await blob.ExistsAsync())
                return this.Ok(new { Uri = blob.Uri });
            return this.NoContent();
        }

        [HttpPost("profile")]
        [ProducesResponseType(typeof(ProfileData), 200)]
        public async Task<IActionResult> SetProfile([FromBody] ProfileData data) {
            await this.TableStore.AddOrUpdateAsync(new Profile { UserId = this.UserId, Data = data });
            return this.Ok(data);
        }

        [HttpPost]
        [HttpPut]
        [Route("profile/upload")]
        public async Task<IActionResult> UploadFile() {
            var boundary = GetBoundary(Request.ContentType);

            if (boundary == null) {
                if (await UploadFileToStorage(Request.Body, this.UserId.ToString())) {
                    return this.Ok();
                }
                return this.BadRequest();
            }

            var reader = new MultipartReader(boundary, Request.Body, 80 * 1024);
            MultipartSection section;

            using(Stream stream = new MemoryStream()) {
                while ((section = await reader.ReadNextSectionAsync()) != null) {
                    var contentDispo = section.GetContentDispositionHeader();

                    if (contentDispo.IsFileDisposition()) {
                        var fileSection = section.AsFileSection();
                        var bufferSize = 32 * 1024;
                        byte[] buffer = new byte[bufferSize];

                        if (stream.Position != 0)
                            return BadRequest("Only one file is accepted per request.");

                        await fileSection.FileStream.CopyToAsync(stream);
                    } else if (contentDispo.IsFormDisposition()) {
                        return BadRequest("Only one file is accepted per request.");
                    } else {
                        return BadRequest("Malformatted message body.");
                    }
                }

                if (stream == null)
                    return BadRequest("No file submitted.");

                stream.Seek(0, SeekOrigin.Begin);
                if (await UploadFileToStorage(stream, this.UserId.ToString())) {
                    return this.Ok();
                }
                return this.BadRequest();
            }

        }

        [HttpGet("development")]
        [ProducesResponseType(typeof(DevelopmentElement[]), 200)]
        public async Task<IActionResult> GetDevelopment() {
            var all = new List<DevelopmentElement>();
            var budgets = await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } });
            if (budgets != null) {
                all.AddRange(budgets
                    .Where(b => b.Data != null)
                    .SelectMany(b => b.Data.Positive.Select(x => new DevelopmentElement {
                        Group = b.Name,
                            Name = x.Name,
                            Value = x.Elements == null ? 0 : x.Elements.Sum(y => y.Value * y.Frequency),
                            Start = b.Data.StartYear,
                            End = b.Data.EndYear,
                            Type = "budgets",
                            SubType = "positive",
                            Id = b.Id
                    }))
                    .ToList());

                all.AddRange(budgets
                    .Where(b => b.Data != null)
                    .SelectMany(b => b.Data.Negative.Select(x => new DevelopmentElement {
                        Group = b.Name,
                            Name = x.Name,
                            Value = -(x.Elements == null ? 0 : x.Elements.Sum(y => y.Value * y.Frequency)),
                            Start = b.Data.StartYear,
                            End = b.Data.EndYear,
                            Type = "budgets",
                            SubType = "negative",
                            Id = b.Id
                    }))
                    .ToList());
            }

            var revenue = await this.TableStore.GetAsync(new Revenue { UserId = this.UserId });
            if (revenue?.Data != null) {
                all.AddRange(
                    revenue.Data.Positive.SelectMany(x => x.Elements.Select(y => new {
                        Name = x.Name,
                            Value = y.Value,
                            Year = y.Year,
                    })).GroupBy(x =>(x.Name, x.Year))
                    .Select(x => new DevelopmentElement {
                        Group = nameof(Revenue),
                            Name = x.Key.Name,
                            Start = x.Key.Year,
                            End = x.Key.Year,
                            Value = x.Sum(y => y.Value),
                            Type = "revenue",
                            SubType = "positive"
                    }));

                all.AddRange(
                    revenue.Data.Negative.SelectMany(x => x.Elements.Select(y => new {
                        Name = x.Name,
                            Value = -y.Value,
                            Year = y.Year,
                    })).GroupBy(x =>(x.Name, x.Year))
                    .Select(x => new DevelopmentElement {
                        Group = nameof(Revenue),
                            Name = x.Key.Name,
                            Start = x.Key.Year,
                            End = x.Key.Year,
                            Value = x.Sum(y => y.Value),
                            Type = "revenue",
                            SubType = "negative"
                    }));
            }

            var assets = await this.TableStore.GetAsync(new Asset { UserId = this.UserId });
            if (assets?.Data != null) {
                all.AddRange(
                    assets.Data.Positive.SelectMany(x => x.Elements.Select(y => new {
                        Name = x.Name, Value = y.Value,
                    })).GroupBy(x => x.Name)
                    .Select(x => new DevelopmentElement {
                        Group = nameof(Asset),
                            Name = x.Key,
                            Value = x.Sum(y => y.Value),
                            Type = "assets",
                            SubType = "positive"
                    }));
                all.AddRange(
                    assets.Data.Negative.SelectMany(x => x.Elements.Select(y => new {
                        Name = x.Name, Value = -y.Value,
                    })).GroupBy(x => x.Name)
                    .Select(x => new DevelopmentElement {
                        Group = nameof(Asset),
                            Name = x.Key,
                            Value = x.Sum(y => y.Value),
                            Type = "assets",
                            SubType = "negativ"
                    }));
            }

            return this.Ok(all);
        }

        private CloudBlockBlob GetBlobReference(string fileName) {
            var storageAccount = CloudStorageAccount.Parse(this.storageOptions.ConnectionString);

            // Create the blob client.
            var blobClient = storageAccount.CreateCloudBlobClient();

            // Get reference to the blob container by passing the name by reading the value from the configuration (appsettings.json)
            var container = blobClient.GetContainerReference(storageOptions.ImageContainer);

            // Get the reference to the block blob from the container
            var blockBlob = container.GetBlockBlobReference(fileName);
            return blockBlob;
        }

        private async Task<bool> UploadFileToStorage(Stream fileStream, string fileName) {

            using(var stream = new MemoryStream())
            using(var image = Image.Load(fileStream))
            using(Image<Rgba32> cropped = image.Clone(x => x.Resize(new ResizeOptions {
                Size = new Size(200, 200),
                    Mode = ResizeMode.Crop
            }))) {
                cropped.Save(stream, new PngEncoder());
                stream.Position = 0;
                var blockBlob = GetBlobReference(fileName);
                await blockBlob.UploadFromStreamAsync(stream);
                return await Task.FromResult(true);
            }
        }
        private static string GetBoundary(string contentType) {
            if (contentType == null)
                return null;
            //throw new ArgumentNullException(nameof(contentType));

            var elements = contentType.Split(' ');
            var element = elements.FirstOrDefault(entry => entry.StartsWith("boundary="));
            if (element == null)
                return null;

            var boundary = element.Substring("boundary=".Length);

            var segment = HeaderUtilities.RemoveQuotes(boundary);
            boundary = segment.HasValue ? segment.Value : string.Empty;
            return boundary;
        }
    }
}