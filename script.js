// La Capilla — interacciones estáticas. No implementa login/comentarios propios (lo hace comments.js ITM).
(function(){
  var toggle = document.getElementById('menuToggle');
  var mobile = document.getElementById('mobileNav');
  if(toggle && mobile){
    toggle.addEventListener('click', function(){
      var open = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobile.classList.remove('open'); });
    });
  }

  // Filtro menú
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('#menuGrid .card[data-cat]');
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('active'); });
      chip.classList.add('active');
      var f = chip.getAttribute('data-filter');
      cards.forEach(function(card){
        var cats = (card.getAttribute('data-cat')||'').split(' ');
        if(f === 'all' || cats.indexOf(f) !== -1){ card.classList.remove('hide'); }
        else { card.classList.add('hide'); }
      });
    });
  });

  // Formulario reserva -> mensaje listo para teléfono (no backend, no publica nada)
  var form = document.getElementById('reserveForm');
  var out = document.getElementById('reserveOut');
  if(form){
    // fecha mínima hoy
    var dia = form.querySelector('input[name="dia"]');
    if(dia){ dia.min = new Date().toISOString().slice(0,10); }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = new FormData(form);
      var txt = 'Hola La Capilla, soy ' + (d.get('nombre')||'') +
        '. Quisiera mesa para ' + (d.get('personas')||'') +
        ' el ' + (d.get('dia')||'') + ' a las ' + (d.get('hora')||'') +
        '. Llamo al 0987654321. Gracias.';
      if(out){ out.textContent = txt; }
    });
  }

  // Suavizar anclas en navegadores viejos (mejora menor)
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length > 1){
        var t = document.querySelector(id);
        if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });
})();
