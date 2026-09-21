// La Capilla — interacciones locales (sin backend propio de comentarios).
(function(){
  var menuBtn = document.getElementById('menuBtn');
  var mobileNav = document.getElementById('mobileNav');
  if(menuBtn && mobileNav){
    menuBtn.addEventListener('click', function(){
      var open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileNav.classList.remove('open'); });
    });
  }

  // Lightbox simple para galería
  var lb = document.createElement('div');
  lb.className = 'lightbox'; lb.innerHTML = '<img alt="Vista ampliada" />';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(function(img){
    img.addEventListener('click', function(){
      lbImg.src = img.src; lb.classList.add('open');
    });
  });
  lb.addEventListener('click', function(){ lb.classList.remove('open'); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') lb.classList.remove('open'); });

  // Solicitudes de reserva: solo local (el estado real lo confirma el restaurante).
  var KEY = 'lacapilla_solicitudes_v1';
  var form = document.getElementById('reservaForm');
  var status = document.getElementById('reservaStatus');
  var box = document.getElementById('myRequests');
  var list = document.getElementById('myRequestsList');
  function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } }
  function save(a){ localStorage.setItem(KEY, JSON.stringify(a)); }
  function render(){
    var arr = load();
    if(!arr.length){ if(box) box.hidden = true; return; }
    if(box) box.hidden = false;
    if(list) list.innerHTML = arr.slice().reverse().map(function(r){
      return '<li><strong>' + escapeHtml(r.fecha) + ' ' + escapeHtml(r.hora) + '</strong> · ' + escapeHtml(String(r.personas)) + ' pers. · ' + escapeHtml(r.nombre) + ' — <em>pendiente de confirmación</em></li>';
    }).join('');
  }
  function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  // Fecha mínima = hoy
  var fecha = form ? form.querySelector('[name=fecha]') : null;
  if(fecha){ fecha.min = new Date().toISOString().slice(0,10); }
  if(form){
    render();
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = new FormData(form);
      var obj = { nombre: d.get('nombre'), fecha: d.get('fecha'), hora: d.get('hora'), personas: d.get('personas'), telefono: d.get('telefono'), notas: d.get('notas'), creada: new Date().toISOString() };
      if(!obj.nombre || !obj.fecha || !obj.hora || !obj.personas){ status.textContent = 'Completa nombre, fecha, hora y personas.'; return; }
      var arr = load(); arr.push(obj); save(arr); render();
      status.textContent = 'Solicitud guardada en este dispositivo. Ahora guarda tu perfil en Reseñas y espera nuestra confirmación al teléfono.';
      form.reset(); render();
      document.getElementById('resenas').scrollIntoView({behavior:'smooth'});
    });
  }
})();
