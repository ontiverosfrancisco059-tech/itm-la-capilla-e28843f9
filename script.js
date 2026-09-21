(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('.section, .hero');

  // Mobile menu toggle
  navToggle.addEventListener('click', function () {
    navMenu.classList.toggle('open');
    var spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      var spans = navToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // Active link on scroll
  function updateActiveLink() {
    var scrollPos = window.scrollY + 100;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Navbar background on scroll
  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.style.background = 'rgba(15, 15, 15, 0.98)';
    } else {
      navbar.style.background = 'rgba(15, 15, 15, 0.92)';
    }
  }

  // Scroll animations with IntersectionObserver
  var animateElements = document.querySelectorAll(
    '.section-header, .nosotros-text, .nosotros-image, .menu-card, .gallery-item, .contacto-info, .contacto-map, .comments-explainer, .comments-widget'
  );

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  window.addEventListener('scroll', function () {
    updateActiveLink();
    updateNavbar();
  }, { passive: true });

  updateActiveLink();
  updateNavbar();
})();
