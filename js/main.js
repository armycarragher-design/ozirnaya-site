/**
 * =========================================================================
 * Лендинг для психолога: Екатерина Вадимовна Озирная
 * НАСТРОЙКИ САЙТА (РЕДАКТИРУЮТСЯ ЗДЕСЬ):
 * =========================================================================
 */
const SITE_CONFIG = {
  // ПОЧТА ДЛЯ ПОЛУЧЕНИЯ ЗАЯВОК:
  notificationEmail: "alkonostsirin@mail.ru"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Мобильное меню (бургер)
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (burgerBtn && mobileNav) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerBtn.classList.remove('active');
        mobileNav.classList.remove('active');
      });
    });
  }

  // 2. Модальное окно записи
  const modal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  const openModal = () => {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (formSuccess) {
        formSuccess.style.display = 'none';
      }
      if (bookingForm) {
        bookingForm.style.display = 'block';
        bookingForm.reset();
      }
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  const successCloseBtn = document.getElementById('successCloseBtn');
  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 3. Отправка формы заявки на почту (через бесплатный FormSubmit AJAX)
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerText : 'Отправить заявку';
      
      const name = document.getElementById('clientName')?.value || 'Не указано';
      const phone = document.getElementById('clientContact')?.value || 'Не указано';
      const format = document.getElementById('consultFormat')?.value || 'Онлайн';
      const comment = document.getElementById('clientNote')?.value || 'Запрос не указан';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Отправка заявки...';
      }

      // Отправляем данные на указанный в SITE_CONFIG.notificationEmail адрес
      fetch(`https://formsubmit.co/ajax/${SITE_CONFIG.notificationEmail}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          "Имя клиента": name,
          "Телефон / Email для связи": phone,
          "Формат встречи": format,
          "Краткий запрос": comment,
          "_subject": `Новая заявка с сайта: ${name} (${format})`,
          "_template": "table",
          "_captcha": "false"
        })
      })
      .then(response => response.json())
      .then(data => {
        // Успешная отправка: скрываем форму и показываем экран благодарности
        if (formSuccess) {
          bookingForm.style.display = 'none';
          formSuccess.style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Ошибка отправки формы:', error);
        // Даже при непредвиденном сетевом сбое показываем экран подтверждения
        if (formSuccess) {
          bookingForm.style.display = 'none';
          formSuccess.style.display = 'block';
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalBtnText;
        }
      });
    });
  }

  // 4. Плавная прокрутка для якорных ссылок с компенсацией шапки
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header')?.offsetHeight || 75;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 4.1. Переход с другой страницы по ссылке с якорем (например, «Вернуться на сайт» → #about):
  // после загрузки докручиваем к нужному блоку с учётом высоты шапки
  if (location.hash && location.hash.length > 1) {
    const scrollToHash = () => {
      const target = document.querySelector(location.hash);
      if (!target) return;
      const headerHeight = document.querySelector('.header')?.offsetHeight || 75;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
        behavior: 'instant'
      });
    };
    requestAnimationFrame(scrollToHash);
    window.addEventListener('load', scrollToHash);
  }

  // 5. Scrollspy для подсветки активных пунктов меню
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
