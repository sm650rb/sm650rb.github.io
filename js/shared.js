/**
 * shared.js — common behavior for all Road Burners pages
 * Requires: Bootstrap 5, #navbar, #backToTop elements
 */
(function () {
  function initScrollSpy() {
    if (document.body.dataset.navPage !== 'index') return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbar .nav-link[href^="#"]:not(.dropdown-toggle)');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }, { passive: true });
  }

  initScrollSpy();

  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  if (navbar || backToTop) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (navbar)    navbar.classList.toggle('scrolled', y > 50);
      if (backToTop) backToTop.classList.toggle('show', y > 300);
    }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 68;
      window.scrollTo({ top, behavior: 'smooth' });
      const collapse = document.getElementById('navbarNav');
      if (collapse && collapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }
    });
  });

  document.querySelectorAll('#navbar .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const collapse = document.getElementById('navbarNav');
      if (collapse && collapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }
    });
  });
})();
