document.addEventListener('DOMContentLoaded', function() {
  function isValidEmail(email) {
    const re = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com)$/;
    return re.test(String(email).toLowerCase());
  }

  function isValidPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  }

  function isValidPhoneNumber(phoneNumber) {
    const re = /^\d{10}$/;
    return re.test(phoneNumber);
  }

  const loginInfo = localStorage.getItem('loginInfo');
  const userInfo = localStorage.getItem('userInfo');

  console.log('loginInfo:', loginInfo);
  console.log('userInfo:', userInfo);

  const user = loginInfo ? JSON.parse(loginInfo) : (userInfo ? JSON.parse(userInfo) : null);

  if (user) {
    document.getElementById('firstName').value = user.firstName || '';
    document.getElementById('lastName').value = user.lastName || '';
    document.getElementById('emailAddress').value = user.emailAddress || '';
    document.getElementById('password').value = user.password || '';
    document.getElementById('phoneNumber').value = user.phoneNumber || '';
  }

  document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const password = document.getElementById('password').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const isActive = true; 

    if (!isValidEmail(emailAddress)) {
      alert('Geçersiz email adresi. Sadece gmail.com, outlook.com ve hotmail.com adreslerini kabul ediyoruz.');
      return;
    }

    if (!isValidPassword(password)) {
      alert('Şifre en az 8 karakter uzunluğunda, büyük harf, küçük harf ve rakam içermelidir.');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      alert('Geçersiz telefon numarası.');
      return;
    }

    const updatedUser = { firstName, lastName, emailAddress, password, phoneNumber, isActive };

    try {
      const response = await fetch('https://localhost:44334/api/User/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = 'Başarılı bir şekilde güncellendi.';
        successMessage.style.display = 'block';

        localStorage.setItem('loginInfo', JSON.stringify(updatedUser));
        
        window.location.href = '../notepage/note.html';
      } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Güncelleme işlemi başarısız oldu: ' + (await response.text());
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      const errorMessage = document.getElementById('error-message');
      errorMessage.textContent = 'Güncelleme işlemi başarısız oldu: ' + error.message;
      errorMessage.style.display = 'block';
    }
  });
});
