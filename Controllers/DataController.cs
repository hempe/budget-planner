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

    [Route("api/data")]
    [Authorize]
    public class DataController : Controller {
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;
        private readonly StoreOption storageOptions;
        public DataController(UserManager<User> userManager, TableStore tableStore, IOptions<StoreOption> storageOptions) {
            this.userManager = userManager;
            this.tableStore = tableStore;
            this.storageOptions = storageOptions.Value;
        }

        [HttpGet("profile")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> GetProfile() {
            var value = await this.tableStore.GetAsync(new Profile { UserId = this.UserId });
            return this.Ok(value?.Data ?? new object());
        }

        [HttpGet("profile/image")]
        public async Task<IActionResult> GetProfileImageUri() {
            var blob = this.GetBlobReference(this.UserId);
            if (await blob.ExistsAsync())
                return this.Ok(new { Uri = blob.Uri });
            return this.NoContent();
        }

        [HttpPost("profile")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> SetProfile([FromBody] object data) {
            await this.tableStore.AddOrUpdateAsync(new Profile { UserId = this.UserId, Data = data });
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

        private string UserId { get => this.userManager.GetUserId(this.User); }

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