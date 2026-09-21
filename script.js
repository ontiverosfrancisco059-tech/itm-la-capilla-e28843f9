// La Capilla — interacciones estáticas (sin sistema propio de comentarios).
(function(){
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  if(btn && nav){
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
    });
  }
  // Filtros de carta
  var tabs = document.querySelectorAll('.tab');
  var dishes = document.querySelectorAll('.dish');
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      tabs.forEach(function(x){ x.classList.remove('active'); });
      t.classList.add('active');
      var cat = t.getAttribute('data-tab');
      dishes.forEach(function(d){
        d.style.display = (cat === 'todos' || d.getAttribute('data-cat') === cat) ? '' : 'none';
      });
    });
  });
  // Reveal on scroll
  var els = document.querySelectorAll('.dish,.ph,.gallery figure,.widget-card,.hero-card');
  els.forEach(function(el){ el.classList.add('reveal'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } });
    },{threshold:.12});
    els.forEach(function(el){ io.observe(el); });
  } else {
    els.forEach(function(el){ el.classList.add('visible'); });
  }
  var y = document.getElementById('year');
  if(y){ y.textContent = String(new Date().getFullYear()); }
  // Nota: login Google, perfil, estrellas y comentarios los renderiza comments.js (contrato ITM).
})();
