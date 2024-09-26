using APIService.Models;
using BusinessLogic.Abstract;
using BusinessLogic.Concrete;
using DataAccess.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Security.Claims;

namespace APIService.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private IUserDal _userDal;
        private IUserService _userManager;
        private INoteService _noteManager;
        public AccountController(IUserService userManager, IUserDal userDal, INoteService noteManager)
        {
            _userManager = userManager;
            _userDal = userDal;
            _noteManager = noteManager;
        }

        [HttpPut("update/{userId}")]
        public async Task<IActionResult> Edit(int userId, [FromBody] UserRegisterModel model)
        {
            try
            {
                var existingUser = _userManager.GetUserById(userId); // Kullanıcıyı id'ye göre al
                if (existingUser == null)
                {
                    return NotFound();
                }

                existingUser.firstName = model.firstName;
                existingUser.lastName = model.lastName;
                existingUser.emailAddress = model.emailAddress;
                existingUser.password = model.password;
                existingUser.phoneNumber = model.phoneNumber;

                _userManager.Update(existingUser);

                return Ok("Kullanıcı bilgileri güncellendi.");
            }

            catch (DbUpdateException ex)
            {
                // Log the detailed error message
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }

        [HttpGet("getmynotes")]
        public IActionResult MyNotes()
        {
            var notes = _noteManager.GetAllNotes();
            return Ok(notes);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var user = await _userManager.GetCurrentUser();
                if (user == null)
                {
                    return NotFound();
                }

                user.isActive = false;
                _userManager.LogOut(user);

                return Ok(new { message = "Çıkış yapıldı" });
            }
            catch (DbUpdateException ex)
            {
                // Log the detailed error message
                // Örneğin: ILogger loglama aracını kullanarak hata detaylarını loglayabilirsiniz.
                // ILogger loglama işlemi ASP.NET Core'da kullanılabilir.
                // ILogger logger = _loggerFactory.CreateLogger("Logout");
                // logger.LogError(ex, "Logout action failed.");

                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }














    }
}
