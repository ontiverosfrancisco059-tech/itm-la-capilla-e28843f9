// La Capilla — interacciones estáticas (sin dependencias de build)
// comments.js gestiona login Google, perfil, estrellas y comentarios. Aquí solo UI del sitio.

(function () {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mobileNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Resaltado de sección activa
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = ['historia', 'menu', 'local', 'galeria', 'visitanos', 'resenas']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href')] = l; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var link = map['#' + e.target.id];
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { obs.observe(s); });
  }

  // Año dinámico si se agrega [data-year]
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
