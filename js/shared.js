/**
 * shared.js — common behavior for all Road Burners pages
 * Requires: Bootstrap 5, #navbar, #backToTop elements
 */
(function () {
  const navbar    = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  // Navbar shadow + back-to-top visibility on scroll
  if (navbar || backToTop) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (navbar)    navbar.classList.toggle('scrolled', y > 50);
      if (backToTop) backToTop.classList.toggle('show', y > 300);
    }, { passive: true });
  }

  // Smooth scroll for in-page anchor links (accounts for fixed navbar)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 68;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile nav if open
      const collapse = document.getElementById('navbarNav');
      if (collapse && collapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }
    });
  });
})();
