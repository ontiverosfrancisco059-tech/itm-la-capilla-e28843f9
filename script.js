/*** La Capilla — interacciones locales (sin backend propio de comentarios) ***/
(function(){
  var $ = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

  $("#year").textContent = new Date().getFullYear();

  // Nav móvil
  var toggle = $("#menuToggle"), nav = $("#nav");
  toggle.addEventListener("click", function(){
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$("#nav a").forEach(function(a){ a.addEventListener("click", function(){ nav.classList.remove("open"); }); });

  // Filtro menú
  $$(".chip").forEach(function(chip){
    chip.addEventListener("click", function(){
      $$(".chip").forEach(function(c){ c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.getAttribute("data-filter");
      $$(".dish").forEach(function(d){
        d.style.display = (f === "all" || d.getAttribute("data-cat") === f) ? "" : "none";
      });
    });
  });

  // Tabs solicitudes
  $$(".tab").forEach(function(t){
    t.addEventListener("click", function(){
      $$(".tab").forEach(function(x){ x.classList.remove("active"); });
      t.classList.add("active");
      $$(".tab-panel").forEach(function(p){ p.classList.remove("active"); });
      $("#panel-" + t.getAttribute("data-tab")).classList.add("active");
    });
  });

  // Reveal on scroll
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); } });
  }, {threshold:.12});
  $$(".section, .dish, .g-item, .card").forEach(function(el){ el.classList.add("reveal"); io.observe(el); });

  // Lightbox galería
  var lb = document.createElement("div");
  lb.className = "lightbox"; lb.innerHTML = "<img alt='Vista ampliada'>";
  document.body.appendChild(lb);
  var lbImg = $("img", lb);
  lb.addEventListener("click", function(){ lb.classList.remove("open"); });
  $$(".g-item img").forEach(function(img){
    img.addEventListener("click", function(){ lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("open"); });
  });

  /*** Solicitudes locales: perfil cliente + CRM dueño ***/
  var KEY = "lacapilla_solicitudes_v1";
  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } }
  function save(rows){ localStorage.setItem(KEY, JSON.stringify(rows)); }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(m){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]; }); }
  function pill(st){
    var map = {pendiente:"p-pend", aceptada:"p-ok", rechazada:"p-no", contestada:"p-msg"};
    return '<span class="pill ' + (map[st]||"p-pend") + '">' + esc(st) + "</span>";
  }
  function cardHTML(r, crm){
    var html = '<article class="req"><header><div><strong>' + esc(r.nombre) + "</strong> · " + esc(r.tipo) +
      "<br><small>" + esc(r.fecha) + " · " + esc(r.personas) + " personas" + (r.telefono ? " · " + esc(r.telefono) : "") + "</small></div>" + pill(r.estado) + "</header>";
    if(r.mensaje) html += "<p>" + esc(r.mensaje) + "</p>";
    if(r.respuesta) html += '<div class="reply"><strong>Respuesta de La Capilla:</strong> ' + esc(r.respuesta) + "</div>";
    if(crm){
      html += '<div class="actions">' +
        '<button data-act="aceptada" data-id="' + r.id + '">Aceptar</button>' +
        '<button data-act="rechazada" data-id="' + r.id + '">Rechazar</button>' +
        '<input data-reply="' + r.id + '" placeholder="Escribir respuesta…" value="' + esc(r.respuesta||"") + '">' +
        '<button data-act="contestada" data-id="' + r.id + '">Contestar</button>' +
        '<button data-act="del" data-id="' + r.id + '">Eliminar</button></div>';
    }
    return html + "</article>";
  }
  function render(){
    var rows = load().sort(function(a,b){ return b.created - a.created; });
    var q = ($("#mineSearch").value||"").toLowerCase();
    var st = $("#mineState").value;
    var mine = rows.filter(function(r){
      return (!q || r.nombre.toLowerCase().indexOf(q) > -1) && (!st || r.estado === st);
    });
    $("#mineList").innerHTML = mine.length ? mine.map(function(r){ return cardHTML(r,false); }).join("") : '<p class="muted">Aún no hay solicitudes con ese filtro. Crea la primera en la pestaña “Nueva solicitud”.</p>';
    $("#crmList").innerHTML = rows.length ? rows.map(function(r){ return cardHTML(r,true); }).join("") : '<p class="muted">Sin solicitudes por gestionar.</p>';
    var pend = rows.filter(function(r){ return r.estado === "pendiente"; }).length;
    $("#crmCount").textContent = pend + (pend === 1 ? " pendiente" : " pendientes");
  }

  $("#requestForm").addEventListener("submit", function(ev){
    ev.preventDefault();
    var fd = new FormData(ev.target);
    var rows = load();
    rows.push({
      id: "r" + Date.now(),
      nombre: String(fd.get("nombre")||"").trim(),
      telefono: String(fd.get("telefono")||"").trim(),
      fecha: String(fd.get("fecha")||""),
      personas: String(fd.get("personas")||"2"),
      tipo: String(fd.get("tipo")||"Reserva de mesa"),
      mensaje: String(fd.get("mensaje")||"").trim(),
      estado: "pendiente", respuesta: "", created: Date.now()
    });
    save(rows); ev.target.reset();
    var ok = $("#formOk"); ok.hidden = false;
    setTimeout(function(){ ok.hidden = true; }, 4500);
    render();
  });
  ["mineSearch","mineState"].forEach(function(id){ $("#"+id).addEventListener("input", render); });
  $("#clearMine").addEventListener("click", function(){
    var q = ($("#mineSearch").value||"").toLowerCase();
    if(!q){ if(!confirm("¿Borrar todas las solicitudes guardadas en este equipo?")) return; save([]); }
    else { save(load().filter(function(r){ return r.nombre.toLowerCase().indexOf(q) === -1; })); }
    render();
  });
  $("#crmList").addEventListener("click", function(ev){
    var b = ev.target.closest("button[data-act]"); if(!b) return;
    var rows = load();
    var r = rows.filter(function(x){ return x.id === b.getAttribute("data-id"); })[0];
    if(!r) return;
    var act = b.getAttribute("data-act");
    if(act === "del"){ save(rows.filter(function(x){ return x.id !== r.id; })); }
    else {
      if(act === "contestada"){
        var inp = document.querySelector('input[data-reply="' + r.id + '"]');
        r.respuesta = inp ? inp.value.trim() : r.respuesta;
        if(!r.respuesta){ alert("Escribe primero la respuesta para contestar."); return; }
      }
      r.estado = act;
      save(rows);
    }
    render();
  });
  render();
})();
