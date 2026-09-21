// La Capilla — interacciones (sin sistema propio de comentarios: lo renderiza comments.js vía ITM)
(function(){
  var nav = document.getElementById('mainNav');
  var toggle = document.getElementById('navToggle');
  if(toggle && nav){
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
  }

  // Filtro menú
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('.dish-card');
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('active'); });
      chip.classList.add('active');
      var f = chip.getAttribute('data-filter');
      cards.forEach(function(card){
        var cats = (card.getAttribute('data-cat')||'').split(/\s+/);
        var show = (f === 'all') || cats.indexOf(f) !== -1;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Solicitudes locales (perfil del cliente + mini CRM dueño, solo front, sin backend)
  var KEY = 'lacapilla_solicitudes_v1';
  var form = document.getElementById('requestForm');
  var msg = document.getElementById('formMsg');
  var list = document.getElementById('reqList');
  var count = document.getElementById('reqCount');
  var clearBtn = document.getElementById('clearReq');

  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||[]; }catch(e){ return []; } }
  function save(items){ localStorage.setItem(KEY, JSON.stringify(items)); }

  function badge(status){
    var s = (status||'pendiente').toLowerCase();
    return '<span class="badge b-'+s+'">'+s+'</span>';
  }

  function render(){
    var items = load();
    count.textContent = items.length;
    if(!items.length){
      list.innerHTML = '<li>Aún no tienes solicitudes. Envía la primera con el formulario.</li>';
      return;
    }
    list.innerHTML = '';
    items.slice().reverse().forEach(function(it){
      var li = document.createElement('li');
      li.innerHTML =
        '<div class="row"><strong>'+escapeHtml(it.nombre)+'</strong>'+badge(it.estado)+'</div>'+
        '<div>'+escapeHtml(it.fecha)+' · '+escapeHtml(it.hora)+' · '+escapeHtml(String(it.personas))+' pers.</div>'+
        (it.detalle ? '<div class="muted">'+escapeHtml(it.detalle)+'</div>' : '')+
        '<div class="muted small">Tel: '+escapeHtml(it.telefono||'—')+'</div>'+
        '<div class="req-actions" data-id="'+it.id+'">'+
          '<button data-st="aceptada" type="button">Aceptar</button>'+
          '<button data-st="rechazada" type="button">Rechazar</button>'+
          '<button data-st="contestada" type="button">Contestada</button>'+
          '<button data-del="1" type="button">Eliminar</button>'+
        '</div>';
      list.appendChild(li);
    });
  }

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  if(form){
    // fecha mínima hoy
    var fecha = form.querySelector('[name="fecha"]');
    if(fecha){ fecha.min = new Date().toISOString().slice(0,10); }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var nombre = String(data.get('nombre')||'').trim();
      var telefono = String(data.get('telefono')||'').trim();
      var personas = String(data.get('personas')||'2');
      var f = String(data.get('fecha')||'');
      var hora = String(data.get('hora')||'');
      var detalle = String(data.get('detalle')||'').trim();
      if(!nombre || !f || !hora){ msg.textContent = 'Completa nombre, fecha y hora.'; return; }
      var items = load();
      items.push({ id:'r'+Date.now(), nombre:nombre, telefono:telefono, personas:personas, fecha:f, hora:hora, detalle:detalle, estado:'pendiente', creada:new Date().toISOString() });
      save(items); render(); form.reset();
      msg.textContent = 'Solicitud guardada. Te confirmamos por teléfono al 0987654321.';
    });
  }
  if(list){
    list.addEventListener('click', function(e){
      var btn = e.target.closest('button'); if(!btn) return;
      var wrap = e.target.closest('.req-actions'); if(!wrap) return;
      var id = wrap.getAttribute('data-id');
      var items = load();
      if(btn.getAttribute('data-del')){
        save(items.filter(function(x){ return x.id!==id; }));
      }else{
        var st = btn.getAttribute('data-st');
        items = items.map(function(x){ if(x.id===id) x.estado = st; return x; });
        save(items);
      }
      render();
    });
  }
  if(clearBtn){ clearBtn.addEventListener('click', function(){ save([]); render(); }); }

  render();
})();
