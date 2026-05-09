/* ===========================
   Y-IN — main.js (Multi-Page)
=========================== */

// ---- Theme Toggle ----
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

function toggleTheme() {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('yinno-theme', next);
}

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

// ---- Header scroll effect ----
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  if (header) header.classList.toggle('scrolled', scrolled);
  if (backToTop) backToTop.classList.toggle('show', scrolled);
});

if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const overlay = document.getElementById('overlay');

function openNav() {
  mobileNav?.classList.add('open');
  mobileNav?.setAttribute('aria-hidden', 'false');
  overlay?.classList.add('show');
  document.body.style.overflow = 'hidden';
  hamburger?.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  mobileNav?.classList.remove('open');
  mobileNav?.setAttribute('aria-hidden', 'true');
  overlay?.classList.remove('show');
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', openNav);
mobileNavClose?.addEventListener('click', closeNav);
overlay?.addEventListener('click', closeNav);
document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', closeNav));

// ---- Hero Image Slideshow ----
(function () {
  const slideshow = document.querySelector('.hero-slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.slide');
  if (slides.length < 2) return;

  let current = 0;
  const KB = ['kenBurns1', 'kenBurns2', 'kenBurns3'];

  // Ken Burns 강제 재시작: inline style로 완전 초기화 후 재적용
  function startKenBurns(slide, idx) {
    const inner = slide.querySelector('.slide-inner');
    inner.style.animation = 'none';
    inner.getBoundingClientRect(); // reflow → 이전 애니메이션 상태 완전 초기화
    inner.style.animation = `${KB[idx % KB.length]} 4500ms ease-out forwards`;
  }

  // 퇴장 슬라이드: 현재 프레임에서 정지
  function freezeKenBurns(slide) {
    const inner = slide.querySelector('.slide-inner');
    inner.style.animationPlayState = 'paused';
  }

  // 대기 슬라이드: 초기화
  function clearKenBurns(slide) {
    const inner = slide.querySelector('.slide-inner');
    inner.style.animation = 'none';
  }

  // 첫 번째 슬라이드 즉시 시작
  startKenBurns(slides[0], 0);

  function goNext() {
    const prev = current;
    current = (current + 1) % slides.length;

    // 퇴장 슬라이드 Ken Burns 프레임 고정
    freezeKenBurns(slides[prev]);

    // 진입 슬라이드 Ken Burns 새로 시작
    startKenBurns(slides[current], current);

    // 슬라이드 클래스 전환
    slides[current].classList.add('is-active');
    slides[prev].classList.remove('is-active');
    slides[prev].classList.add('is-prev');

    // 500ms 후 퇴장 슬라이드를 오른쪽으로 순간이동 (트랜지션 없이)
    setTimeout(() => {
      slides[prev].style.transition = 'none';
      slides[prev].classList.remove('is-prev');
      clearKenBurns(slides[prev]);
      slides[prev].getBoundingClientRect();
      slides[prev].style.transition = '';
    }, 500);
  }

  // 3500ms 표시 + 500ms 전환 = 4000ms 간격
  setInterval(goNext, 4000);
})();

// ---- Desktop Nav Dropdown (JS-based for reliable hover + click) ----
const navDropdowns = document.querySelectorAll('#nav .nav-dropdown');

if (navDropdowns.length) {
  let closeTimer;

  navDropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      // 다른 열린 드롭다운 닫기
      navDropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
      dropdown.classList.add('open');
    });

    dropdown.addEventListener('mouseleave', () => {
      // 200ms 지연: 마우스가 메뉴로 이동할 시간을 줌
      closeTimer = setTimeout(() => dropdown.classList.remove('open'), 200);
    });
  });

  // 드롭다운 메뉴에 마우스 진입 시 닫기 타이머 취소
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    menu.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        navDropdowns.forEach(d => d.classList.remove('open'));
      }, 150);
    });
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', e => {
    if (!e.target.closest('#nav .nav-dropdown')) {
      navDropdowns.forEach(d => d.classList.remove('open'));
    }
  });
}

// ---- Mobile Group Toggle (dropdown sub-menus) ----
document.querySelectorAll('.mobile-group-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    toggle.closest('.mobile-group').classList.toggle('open');
  });
});

// ---- Active nav based on current page ----
const currentFile = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('#nav .nav-dropdown').forEach(group => {
  group.querySelectorAll('.dropdown-menu a').forEach(link => {
    if (link.getAttribute('href') === currentFile) {
      group.classList.add('nav-active');
    }
  });
});

document.querySelectorAll('#nav > a').forEach(link => {
  if (link.getAttribute('href') === currentFile) link.classList.add('nav-active');
});

// ---- Intersection Observer for reveal animations ----
const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- Counter animation ----
const statNums = document.querySelectorAll('.stat-num[data-target]');

if (statNums.length) {
  const counterObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.5 }
  );
  statNums.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const step = target / (1500 / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

// ---- Active nav on scroll (home page only) ----
if (currentFile === 'index.html' || currentFile === '') {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) link.style.color = 'var(--text)';
    });
  });
}

// ---- Contact form ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '전송 중...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '전송 완료 ✓';
      formSuccess?.classList.add('show');
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        formSuccess?.classList.remove('show');
      }, 5000);
    }, 1200);
  });
}

// ---- FAQ Accordion ----
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      openItem.querySelector('.faq-a').hidden = true;
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-a').hidden = false;
    }
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});
