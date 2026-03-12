// ---- Scroll-triggered fade-in animations ----
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

  // ---- Navbar scroll effect ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ---- Mobile menu toggle ----
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  toggle.addEventListener('click', () => {
    mobile.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobile.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
