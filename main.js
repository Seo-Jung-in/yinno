/* ===========================
   Y-INNO — main.js
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

themeToggle.addEventListener('click', toggleTheme);
mobileThemeToggle.addEventListener('click', toggleTheme);

// ---- Header scroll effect ----
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
    backToTop.classList.add('show');
  } else {
    header.classList.remove('scrolled');
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');
const overlay = document.getElementById('overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openNav() {
  mobileNav.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  mobileNav.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openNav);
mobileNavClose.addEventListener('click', closeNav);
overlay.addEventListener('click', closeNav);
mobileLinks.forEach(link => link.addEventListener('click', closeNav));

// ---- Intersection Observer for reveal animations ----
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

// ---- Counter animation ----
const statNums = document.querySelectorAll('.stat-num[data-target]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1500;
  const step = target / (duration / 16);
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

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav a');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--text)';
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ---- Contact form ----
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = '전송 중...';
  btn.disabled = true;

  // Simulate submission (replace with real API call)
  setTimeout(() => {
    btn.textContent = '전송 완료 ✓';
    formSuccess.classList.add('show');
    contactForm.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      formSuccess.classList.remove('show');
    }, 5000);
  }, 1200);
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});
