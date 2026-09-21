// La Capilla — interacciones locales (sin sistema propio de comentarios).
// Los comentarios, login Google, perfil, estrellas y moderación los renderiza comments.js (contrato ITM).
(function () {
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navMenu.classList.remove('open'); });
    });
  }

  // Tabs del menú
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var id = btn.getAttribute('data-tab');
      document.querySelectorAll('.menu-panel').forEach(function (p) {
        var show = p.id === id;
        p.classList.toggle('active', show);
        if (show) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
      });
    });
  });

  // Lightbox galería
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var closeBtn = document.getElementById('lightboxClose');
  function closeLB() { if (lightbox) { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); } }
  document.querySelectorAll('.g-item').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = b.getAttribute('data-full');
      if (lightboxImg) lightboxImg.src = src;
      if (lightbox) { lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); }
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeLB);
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLB(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLB(); });

  // Reveal on scroll
  var els = document.querySelectorAll('.dish-card, .menu-panels, .split-media, .g-item, .visit-card, .how-box, .widget-box');
  els.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('visible'); });
  }
})();
