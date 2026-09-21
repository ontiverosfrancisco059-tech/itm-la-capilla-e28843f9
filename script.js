// La Capilla — interacciones base. No implementa login ni comentarios propios:
// eso lo renderiza https://itm-void-excepcional.pages.dev/comments.js
(function(){
  var toggle=document.getElementById('navToggle');
  var list=document.getElementById('navList');
  if(toggle&&list){
    toggle.addEventListener('click',function(){
      var open=list.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
    list.addEventListener('click',function(e){
      if(e.target.tagName==='A'){list.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
    });
  }
  // Filtro de menú
  var chips=document.querySelectorAll('.chip');
  var dishes=document.querySelectorAll('.dish');
  chips.forEach(function(c){
    c.addEventListener('click',function(){
      chips.forEach(function(x){x.classList.remove('active')});
      c.classList.add('active');
      var f=c.getAttribute('data-filter');
      dishes.forEach(function(d){
        d.style.display=(f==='all'||d.getAttribute('data-cat')===f)?'':'none';
      });
    });
  });
  // Lightbox galería
  var lb=document.getElementById('lightbox'),img=document.getElementById('lbImg'),close=document.getElementById('lbClose');
  document.querySelectorAll('.gal').forEach(function(b){
    b.addEventListener('click',function(){
      img.src=b.getAttribute('data-full');
      img.alt=b.querySelector('img').alt;
      lb.hidden=false;
    });
  });
  if(close)close.addEventListener('click',function(){lb.hidden=true;img.src='';});
  if(lb)lb.addEventListener('click',function(e){if(e.target===lb){lb.hidden=true;img.src='';}});
})();
