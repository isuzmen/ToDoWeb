using APIService.Models;
using BusinessLogic.Abstract;
using BusinessLogic.Concrete;
using DataAccess.Abstract;
using DataAccess.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using Entities.Concrete;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace APIService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private IUserDal _userDal;
        private IUserService _userManager;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userManager, IUserDal userDal)
        {
            _userManager = userManager;
            _userDal = userDal;
        }

        [HttpPost("create/")]
        public async Task<IActionResult> Create([FromBody] UserRegisterModel model)
        {
            if (model == null)
            {
                return BadRequest("Kullanıcı bulunamadı!");
            }

            // Zorunlu alanların boş olup olmadığını kontrol et
            if (string.IsNullOrWhiteSpace(model.firstName) ||
                string.IsNullOrWhiteSpace(model.lastName) ||
                string.IsNullOrWhiteSpace(model.emailAddress) ||
                string.IsNullOrWhiteSpace(model.phoneNumber) ||
                string.IsNullOrWhiteSpace(model.password))
            {
                return BadRequest("Tüm alanlar zorunludur.");
            }

            // Email adresinin geçerli olup olmadığını kontrol et
            if (!IsValidEmail(model.emailAddress))
            {
                return BadRequest("Geçersiz email adresi. Sadece gmail.com, outlook.com ve hotmail.com adreslerini kabul ediyoruz.");
            }

            // Şifrenin güvenli olup olmadığını kontrol et
            if (!IsValidPassword(model.password))
            {
                return BadRequest("Şifre, en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf ve rakam içermelidir.");
            }

            // Telefon numarasının geçerli olup olmadığını kontrol et
            if (!IsValidPhoneNumber(model.phoneNumber))
            {
                return BadRequest("Geçersiz telefon numarası.");
            }

            try
            {
                var user = new User
                {
                    firstName = model.firstName,
                    lastName = model.lastName,
                    emailAddress = model.emailAddress,
                    phoneNumber = model.phoneNumber,
                    password = model.password,
                    isActive = false
                };

                _userManager.AddUser(user);
                return Ok("Kullanıcı başarıyla eklendi");
            }
            catch (DbUpdateException ex)
            {
                // Log the detailed error message
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }

        private bool IsValidEmail(string email)
        {
            const string pattern = @"^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$";
            return Regex.IsMatch(email, pattern);
        }

        private bool IsValidPassword(string password)
        {
            const string pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$";
            return Regex.IsMatch(password, pattern);
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            const string pattern = @"^\d{10}$";
            return Regex.IsMatch(phoneNumber, pattern);
        }

        public class LoginModel
        {
            public string EmailAddress { get; set; }
            public string PassWord { get; set; }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.EmailAddress) || string.IsNullOrWhiteSpace(model.PassWord))
            {
                return BadRequest("Email ve şifre alanları zorunludur.");
            }

            if (!IsValidEmail(model.EmailAddress))
            {
                return BadRequest("Geçersiz email adresi.");
            }

            if (!IsValidPassword(model.PassWord))
            {
                return BadRequest("Şifre, en az 8 karakter uzunluğunda olmalı ve büyük harf, küçük harf ve rakam içermelidir.");
            }

            var user = await _userManager.GetByMail(model.EmailAddress);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı. Lütfen önce kayıt olun.");
            }

            if (user.password != model.PassWord)
            {
                return Unauthorized(new { message = "Şifre veya email yanlış" });
            }

            // Kullanıcı giriş başarılı, burada gerekli işlemler yapılacak.
            user.isActive = true;
            _userManager.LogIn(user);
            return Ok("Giriş başarılı.");
        }
        


        [HttpPut("update")]
        public async Task<IActionResult> Edit([FromBody] UserRegisterModel model)
        {
            try
            {
                var existingUser = _userDal.GetCurrentUser();
                if (existingUser == null)
                {
                    return NotFound();
                }

                existingUser.firstName = model.firstName;
                existingUser.lastName = model.lastName;
                existingUser.emailAddress = model.emailAddress;
                existingUser.password = model.password;
                existingUser.phoneNumber = model.phoneNumber;

                _userDal.Update(existingUser);

                return Ok("Kullanıcı bilgileri güncellendi.");
            }

            catch (DbUpdateException ex)
            {
                // detaylı error mesajı
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }

        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> Delete(int userId)
        {
            try
            {
                using (DataContext context = new DataContext())
                {
                    var user = context.Users.FirstOrDefault(n => n.Id == userId);
                    if (user != null)
                    {
                        context.Users.Remove(user);
                        context.SaveChanges();
                        return Ok("Kullanıcı silindi.");
                    }
                    else
                    {
                        return NotFound("Kullanıcı bulunamadı.");
                    }
                }
            }
            catch (DbUpdateException ex)
            {
                // Log the detailed error message
                var innerExceptionMessage = ex.InnerException?.Message;
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {innerExceptionMessage}");
            }
        }
    }
}
