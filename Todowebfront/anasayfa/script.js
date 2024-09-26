document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.start-button');
  
    startButton.addEventListener('click', function() {
        window.location.href = '../pages/login-register/loginpage.html';
        Swal.fire({
            icon: 'success',
            title: 'Başlıyoruz!',
            text: 'Notlarınızı almak için giriş yapın veya kaydolun.',
            showConfirmButton: false,
            timer: 2000
        });
    });
  

    const loginButton = document.querySelector('.login-button');
    const registerButton = document.querySelector('.register-button');
  
    loginButton.addEventListener('click', function() {
        window.location.href = '../pages/login-register/loginpage.html';
        Swal.fire({
            icon: 'info',
            title: 'Giriş Yap',
            text: 'Notlarınıza erişmek için giriş yapın.',
            showConfirmButton: false,
            timer: 2000
        });
    });
  
    registerButton.addEventListener('click', function() {
        window.location.href = '../pages/login-register/registerpage.html';
        Swal.fire({
            icon: 'info',
            title: 'Kayıt Ol',
            text: 'Yeni bir hesap oluşturmak için kaydolun.',
            showConfirmButton: false,
            timer: 2000
        });
    });
  

    gsap.from(".navbar", { duration: 1, y: -100, ease: "bounce" });
    gsap.from(".welcome-section", { duration: 1, opacity: 0, delay: 0.5 });
    gsap.from(".about-section", { duration: 1, opacity: 0, delay: 1 });
    gsap.from(".motivation-section", { duration: 1, opacity: 0, delay: 1.5 });
  });
  
  const quotes = [
    {
        text: "Bir işte başarının sırrı, o işi yaparken ne kadar eğlenebildiğindir.",
        author: "Dale Carnegie"
    },
    {
        text: "Hayatta başarılı olmak için önce insanların yüzde 10'u sizi neden başarısız olacağınıza ikna etmeye çalışacak.",
        author: "Mark Twain"
    },
    {
        text: "Sadece bir şeyi yaparak hayatınızı değiştirebilirsiniz, kendinize inanmaya başlayın.",
        author: "Bruce Lee"
    },
    {
        text: "Başarı, başarısızlıktan başarısızlığa hevesinizi kaybetmeden geçme yeteneğidir.",
        author: "Winston Churchill"
    },
    {
        text: "Hayatta en büyük risk, hiç risk almamaktır.",
        author: "Mark Zuckerberg"
    },
    {
        text: "Başarının anahtarı, sürekli çalışmak ve sabırlı olmaktır.",
        author: "Henry Ford"
    },
    {
        text: "Büyük işler başarmak için sadece harekete geçmek yeterlidir.",
        author: "Napoleon Hill"
    },
    {
        text: "Kendi hayallerini inşa etmezsen, başkalarının hayallerini inşa etmek için çalışırsın.",
        author: "Farrah Gray"
    },
    {
        text: "Hayatta en önemli şey, kendinize olan inancınızı kaybetmemektir.",
        author: "Swami Vivekananda"
    },
    {
        text: "Başarının sırrı, hedeften asla sapmamak ve vazgeçmemektir.",
        author: "Steve Jobs"
    }
  ];
  
  let currentIndex = 0;
  
  function updateQuote() {
    gsap.to("#quote-text, #quote-author", { opacity: 0, duration: 0.5, onComplete: function() {
        document.getElementById('quote-text').textContent = quotes[currentIndex].text;
        document.getElementById('quote-author').textContent = "— " + quotes[currentIndex].author;
        gsap.to("#quote-text, #quote-author", { opacity: 1, duration: 0.5 });
        currentIndex = (currentIndex + 1) % quotes.length;
    }});
  }
  setInterval(updateQuote, 3000); 
  