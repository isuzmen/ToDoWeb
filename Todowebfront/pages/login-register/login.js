AOS.init();

function isValidEmail(email) {
  const re = /^[^\s@]+@(gmail\.com|hotmail\.com|outlook\.com)$/;
  return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); 

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!isValidEmail(email)) {
    alert("Geçersiz email adresi. Sadece gmail.com, hotmail.com ve outlook.com alan adlarını kabul ediyoruz.");
    return;
  }
  if (!isValidPassword(password)) {
    alert("Şifre en az 8 karakter uzunluğunda olmalı ve bir büyük harf, bir küçük harf ve bir sayı içermelidir.");
    return;
  }

  const formData = {
    EmailAddress: email,
    PassWord: password
  };
  
  const url = "https://localhost:44334/api/User/Login";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if (response.ok) {

      localStorage.setItem('loginInfo', JSON.stringify(formData));

      gsap.to(".container", { duration: 1, opacity: 0, onComplete: () => {
        window.location.href = '../notepage/note.html';
      }});
    } else if (response.status === 401) {
      alert("Şifre veya email yanlış");
    } else if (response.status === 404) {
      alert("Kullanıcı bulunamadı. Lütfen önce kayıt olun.");
    } else {
      alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
    alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
  });
});