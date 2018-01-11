using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;

namespace BudgetPlanner.Controllers {

    [Route("api/profile")]
    [Authorize]
    public class ProfileController : BaseController {
        private readonly StoreOption storageOptions;
        public ProfileController(UserManager<User> userManager, TableStore tableStore, IOptions<StoreOption> storageOptions) : base(userManager, tableStore) {
            this.storageOptions = storageOptions.Value;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(ProfileData), 200)]
        public async Task<IActionResult> GetProfile() {
            var value = await this.TableStore.GetAsync(new Tables.Profile { UserId = this.UserId });
            return this.Ok(value?.Data ?? new ProfileData());
        }

        [HttpGet("image")]
        public async Task<IActionResult> GetProfileImageUri() {
            var blob = this.GetBlobReference(this.UserId);
            if (await blob.ExistsAsync())
                return this.Ok(new { Uri = blob.Uri });
            return this.NoContent();
        }

        [HttpPost("")]
        [ProducesResponseType(typeof(ProfileData), 200)]
        public async Task<IActionResult> SetProfile([FromBody] ProfileData data) {
            await this.TableStore.AddOrUpdateAsync(new Tables.Profile { UserId = this.UserId, Data = data });
            return this.Ok(data);
        }

        [HttpPost]
        [HttpPut]
        [Route("upload")]
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