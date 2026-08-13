/* ==========================================================
   Aljabar — Siap Olimpiade Matematika SMP
   Vanilla JS. No build step. Safe to open as a static file
   or deploy directly to GitHub Pages.
   ========================================================== */
(function(){
"use strict";

/* ---------------- helpers ---------------- */
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }
function fmt(n){
  if (Number.isInteger(n)) return n.toString();
  // show up to 3 decimals, trim trailing zeros
  return (Math.round(n*1000)/1000).toString();
}
function fracLabel(numerator, denominator){
  if (denominator === 0) return "tak terdefinisi";
  var val = numerator/denominator;
  if (Number.isInteger(val)) return fmt(val);
  return fmt(numerator)+"/"+fmt(denominator)+" = "+fmt(Math.round(val*1000)/1000);
}
function typeset(el){
  if (window.MathJax && window.MathJax.typesetPromise){
    window.MathJax.typesetPromise(el ? [el] : undefined).catch(function(){});
  }
}

/* ================================================================
   NAVIGATION
   ================================================================ */
var sectionOrder = ["topic-1","topic-2","topic-3","topic-4","topic-5","topic-6","topic-7"];
var toolInitByTopic = {}; // filled below, called lazily on first activation
var toolInitedOnce = {};

function activateTopic(id){
  $all(".topic").forEach(function(t){ t.classList.toggle("active", t.id === id); });
  $all(".spine-item").forEach(function(b){ b.classList.toggle("active", b.dataset.target === id); });
  $("#main").scrollTo({top:0, behavior:"smooth"});
  window.scrollTo({top:0, behavior:"smooth"});
  if (!toolInitedOnce[id] && toolInitByTopic[id]){
    toolInitByTopic[id]();
    toolInitedOnce[id] = true;
  } else if (toolInitByTopic[id]) {
    // redraw canvas-based tools each time in case size changed
    toolInitByTopic[id](true);
  }
  var spine = $("#spine");
  if (spine.classList.contains("open")){
    spine.classList.remove("open");
    $("#spineToggle").setAttribute("aria-expanded","false");
  }
}

$all(".spine-item").forEach(function(btn){
  btn.addEventListener("click", function(){ activateTopic(btn.dataset.target); });
});

$("#spineToggle").addEventListener("click", function(){
  var spine = $("#spine");
  var open = spine.classList.toggle("open");
  this.setAttribute("aria-expanded", open ? "true" : "false");
});

/* ================================================================
   HERO MINI DEMO — static (a+b)^2 square, gentle draw-in
   ================================================================ */
(function heroSquare(){
  var svg = $("#heroSquare");
  var a=3,b=2,scale=36,pad=10;
  var totalPx = (a+b)*scale;
  svg.setAttribute("viewBox","0 0 "+(totalPx+pad*2)+" "+(totalPx+pad*2));
  function rect(x,y,w,h,fill,label){
    return '<rect x="'+(x+pad)+'" y="'+(y+pad)+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="#16213E" stroke-width="1.5" rx="4"/>' +
      '<text x="'+(x+pad+w/2)+'" y="'+(y+pad+h/2+5)+'" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" fill="#16213E">'+label+'</text>';
  }
  var html = "";
  html += rect(0,0, a*scale, a*scale, "#E3A72C33", "a²");
  html += rect(a*scale,0, b*scale, a*scale, "#2F8F6E33", "ab");
  html += rect(0,a*scale, a*scale, b*scale, "#2F8F6E33", "ab");
  html += rect(a*scale,a*scale, b*scale, b*scale, "#5B57C433", "b²");
  html += '<rect x="'+pad+'" y="'+pad+'" width="'+totalPx+'" height="'+totalPx+'" fill="none" stroke="#16213E" stroke-width="2.5" rx="6"/>';
  svg.innerHTML = html;
})();

/* ================================================================
   TOOL 1 — Square-split proof of (a+b)^2
   ================================================================ */
function drawSquareTool(){
  var a = parseInt($("#sq-a").value,10);
  var b = parseInt($("#sq-b").value,10);
  $("#sq-a-val").textContent = a;
  $("#sq-b-val").textContent = b;

  var svg = $("#squareSvg");
  var scale = 300/(a+b);
  var pad = 10;
  function rect(x,y,w,h,fill,label,fs){
    return '<rect x="'+(x+pad)+'" y="'+(y+pad)+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="#16213E" stroke-width="1.5"/>' +
      '<text x="'+(x+pad+w/2)+'" y="'+(y+pad+h/2+5)+'" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="'+(fs||13)+'" fill="#16213E">'+label+'</text>';
  }
  var W = a*scale, H = a*scale, wB = b*scale;
  var html = "";
  html += rect(0,0, W,H, "#E3A72C40", "a²  ("+a+"×"+a+")", Math.min(15, 220/(a+1)));
  html += rect(W,0, wB,H, "#2F8F6E40", "ab", Math.min(15, 220/(b+1)));
  html += rect(0,H, W,wB, "#2F8F6E40", "ab", Math.min(15, 220/(a+1)));
  html += rect(W,H, wB,wB, "#5B57C440", "b²", Math.min(15, 220/(b+1)));
  html += '<rect x="'+pad+'" y="'+pad+'" width="'+((a+b)*scale)+'" height="'+((a+b)*scale)+'" fill="none" stroke="#16213E" stroke-width="2.5"/>';
  svg.setAttribute("viewBox","0 0 "+((a+b)*scale+pad*2)+" "+((a+b)*scale+pad*2));
  svg.innerHTML = html;

  var a2=a*a, ab2=2*a*b, b2=b*b, total=a2+ab2+b2, direct=(a+b)*(a+b);
  $("#squareReadout").innerHTML =
    '<span class="chip">a² = <b>'+a2+'</b></span>' +
    '<span class="chip">2ab = <b>'+ab2+'</b></span>' +
    '<span class="chip">b² = <b>'+b2+'</b></span>' +
    '<span class="chip">Jumlah area = <b>'+total+'</b></span>' +
    '<span class="chip">(a+b)² dihitung langsung = <b>'+direct+'</b></span>' +
    '<span class="chip" style="background:rgba(47,143,110,.15);color:#1E5E48;">'+(total===direct ? "✓ Cocok — rumus terbukti" : "Selisih!")+'</span>';
}
["sq-a","sq-b"].forEach(function(id){ $("#"+id).addEventListener("input", drawSquareTool); });
toolInitByTopic["topic-1"] = drawSquareTool;

/* ================================================================
   TOOL 2 — Quadratic function grapher
   ================================================================ */
function drawParabola(){
  var a = parseFloat($("#fq-a").value)||0;
  var b = parseFloat($("#fq-b").value)||0;
  var c = parseFloat($("#fq-c").value)||0;
  var canvas = $("#fqCanvas");
  var dpr = window.devicePixelRatio||1;
  var rect = canvas.getBoundingClientRect();
  var W = rect.width || canvas.parentElement.clientWidth || 600;
  var H = 280;
  canvas.width = W*dpr; canvas.height = H*dpr;
  canvas.style.width = "100%"; canvas.style.height = H+"px";
  var ctx = canvas.getContext("2d");
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);

  var xmin=-10, xmax=10;
  var samples=[];
  for (var x=xmin; x<=xmax; x+=0.1){
    samples.push([x, a*x*x+b*x+c]);
  }
  var ys = samples.map(function(p){return p[1];});
  var ymin = Math.min.apply(null, ys.concat([0]));
  var ymax = Math.max.apply(null, ys.concat([0]));
  var pad = (ymax-ymin)*0.12 || 2;
  ymin -= pad; ymax += pad;

  function X(x){ return (x-xmin)/(xmax-xmin)*W; }
  function Y(y){ return H - (y-ymin)/(ymax-ymin)*H; }

  // grid
  ctx.strokeStyle = "#DCE6F0"; ctx.lineWidth=1;
  for (var gx=Math.ceil(xmin); gx<=xmax; gx++){
    ctx.beginPath(); ctx.moveTo(X(gx),0); ctx.lineTo(X(gx),H); ctx.stroke();
  }
  var gyStep = Math.max(1, Math.round((ymax-ymin)/10));
  for (var gy=Math.ceil(ymin/gyStep)*gyStep; gy<=ymax; gy+=gyStep){
    ctx.beginPath(); ctx.moveTo(0,Y(gy)); ctx.lineTo(W,Y(gy)); ctx.stroke();
  }
  // axes
  ctx.strokeStyle = "#16213E"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(0,Y(0)); ctx.lineTo(W,Y(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X(0),0); ctx.lineTo(X(0),H); ctx.stroke();

  // curve
  ctx.strokeStyle = "#5B57C4"; ctx.lineWidth=2.5; ctx.beginPath();
  samples.forEach(function(p,i){
    var sx=X(p[0]), sy=Y(p[1]);
    if (i===0) ctx.moveTo(sx,sy); else ctx.lineTo(sx,sy);
  });
  ctx.stroke();

  var D = b*b-4*a*c;
  var infoRoots = "Tidak memiliki akar real (D < 0)";
  if (a !== 0){
    if (D > 0){
      var r1 = (-b-Math.sqrt(D))/(2*a), r2=(-b+Math.sqrt(D))/(2*a);
      [r1,r2].forEach(function(r){
        ctx.fillStyle="#C1483D";
        ctx.beginPath(); ctx.arc(X(r),Y(0),4.5,0,Math.PI*2); ctx.fill();
      });
      infoRoots = "x = "+fmt(Math.min(r1,r2))+" atau x = "+fmt(Math.max(r1,r2));
    } else if (D === 0){
      var r = -b/(2*a);
      ctx.fillStyle="#C1483D";
      ctx.beginPath(); ctx.arc(X(r),Y(0),4.5,0,Math.PI*2); ctx.fill();
      infoRoots = "x = "+fmt(r)+" (akar kembar)";
    }
  }
  // y-intercept
  ctx.fillStyle="#2F8F6E";
  ctx.beginPath(); ctx.arc(X(0),Y(c),4.5,0,Math.PI*2); ctx.fill();
  // vertex
  var xe = a!==0 ? -b/(2*a) : 0;
  var ye = a!==0 ? -D/(4*a) : 0;
  ctx.fillStyle="#E3A72C";
  ctx.strokeStyle="#16213E"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.arc(X(xe),Y(ye),5.5,0,Math.PI*2); ctx.fill(); ctx.stroke();

  $("#fqReadout").innerHTML =
    '<span class="chip">Diskriminan D = <b>'+fmt(D)+'</b></span>' +
    '<span class="chip">Titik puncak = <b>('+fmt(xe)+', '+fmt(ye)+')</b></span>' +
    '<span class="chip">Titik potong sumbu-y = <b>(0, '+fmt(c)+')</b></span>' +
    '<span class="chip">Akar-akar: <b>'+infoRoots+'</b></span>' +
    '<span class="chip">Terbuka ke <b>'+(a>0?"atas":(a<0?"bawah":"—"))+'</b></span>';
}
$("#fq-draw").addEventListener("click", drawParabola);
["fq-a","fq-b","fq-c"].forEach(function(id){ $("#"+id).addEventListener("change", drawParabola); });
toolInitByTopic["topic-2"] = drawParabola;

/* ================================================================
   TOOL 3 — Balance-scale PLSV solver: ax + b = c
   ================================================================ */
var plState = { step: 0 };
function plSolveSteps(a,b,c){
  var step1Right = c-b; // ax = c-b
  var x = a!==0 ? step1Right/a : null;
  return { step1Right: step1Right, x: x };
}
function drawBalance(){
  var a = parseFloat($("#pl-a").value)||0;
  var b = parseFloat($("#pl-b").value)||0;
  var c = parseFloat($("#pl-c").value)||0;
  var sol = plSolveSteps(a,b,c);
  var svg = $("#balanceSvg");
  var step = plState.step;
  // tilt: step0 tilt by sign/magnitude of b (clamped), later steps reduce toward 0
  var tilt = 0;
  if (step===0) tilt = Math.max(-14, Math.min(14, -b));
  else if (step===1) tilt = Math.max(-8, Math.min(8, (sol.x||0)*0 )); // level-ish after removing b
  else tilt = 0;

  var leftLabel, rightLabel;
  if (step===0){ leftLabel = a+"x + ("+b+")"; rightLabel = ""+c; }
  else if (step===1){ leftLabel = a+"x"; rightLabel = ""+sol.step1Right; }
  else { leftLabel = "x"; rightLabel = a!==0 ? fracLabel(sol.step1Right, a) : "—"; }

  svg.innerHTML =
    '<g transform="translate(160,70) rotate('+tilt+')">' +
      '<rect x="-3" y="-46" width="6" height="46" fill="#16213E"/>' +
      '<rect x="-95" y="-6" width="190" height="6" fill="#16213E"/>' +
      '<line x1="-85" y1="0" x2="-85" y2="34" stroke="#16213E" stroke-width="2.5"/>' +
      '<line x1="85" y1="0" x2="85" y2="34" stroke="#16213E" stroke-width="2.5"/>' +
      '<rect x="-125" y="34" width="80" height="30" rx="7" fill="#E3A72C33" stroke="#16213E" stroke-width="1.5"/>' +
      '<text x="-85" y="54" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="#16213E">'+leftLabel+'</text>' +
      '<rect x="45" y="34" width="80" height="30" rx="7" fill="#2F8F6E33" stroke="#16213E" stroke-width="1.5"/>' +
      '<text x="85" y="54" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="14" fill="#16213E">'+rightLabel+'</text>' +
    '</g>' +
    '<polygon points="160,10 150,26 170,26" fill="#16213E"/>' +
    '<rect x="30" y="170" width="260" height="4" fill="#C7D6E5"/>';

  var stepText = ["Langkah 0 — Persamaan awal","Langkah 1 — Kurangi b dari kedua ruas","Langkah 2 — Bagi kedua ruas dengan a"][step];
  var readout = '<span class="chip">'+stepText+'</span>';
  if (step===0) readout += '<span class="chip">'+a+'x + '+b+' = '+c+'</span>';
  if (step===1) readout += '<span class="chip">'+a+'x = '+sol.step1Right+'</span>';
  if (step===2) readout += '<span class="chip" style="background:rgba(47,143,110,.15);color:#1E5E48;">x = '+ (a!==0 ? fracLabel(sol.step1Right,a) : "tak terdefinisi") +'</span>';
  $("#plReadout").innerHTML = readout;
  $("#pl-step").disabled = (step>=2);
  $("#pl-step").textContent = step>=2 ? "Selesai ✓" : "Langkah Berikutnya →";
}
$("#pl-reset").addEventListener("click", function(){ plState.step=0; drawBalance(); });
$("#pl-step").addEventListener("click", function(){ if (plState.step<2){ plState.step++; drawBalance(); } });
["pl-a","pl-b","pl-c"].forEach(function(id){ $("#"+id).addEventListener("change", function(){ plState.step=0; drawBalance(); }); });
toolInitByTopic["topic-3"] = drawBalance;

/* ================================================================
   TOOL 4 — SPLDV two-line grapher
   ================================================================ */
function drawSPLDV(){
  var a1=parseFloat($("#sp-a1").value)||0, b1=parseFloat($("#sp-b1").value)||0, c1=parseFloat($("#sp-c1").value)||0;
  var a2=parseFloat($("#sp-a2").value)||0, b2=parseFloat($("#sp-b2").value)||0, c2=parseFloat($("#sp-c2").value)||0;
  var canvas = $("#spCanvas");
  var dpr = window.devicePixelRatio||1;
  var rect = canvas.getBoundingClientRect();
  var W = rect.width || canvas.parentElement.clientWidth || 600;
  var H = 280;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width="100%"; canvas.style.height=H+"px";
  var ctx = canvas.getContext("2d");
  ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);

  var xmin=-10,xmax=10,ymin=-10,ymax=10;
  function X(x){ return (x-xmin)/(xmax-xmin)*W; }
  function Y(y){ return H-(y-ymin)/(ymax-ymin)*H; }

  ctx.strokeStyle="#DCE6F0"; ctx.lineWidth=1;
  for (var g=xmin; g<=xmax; g++){ ctx.beginPath(); ctx.moveTo(X(g),0); ctx.lineTo(X(g),H); ctx.stroke(); }
  for (var g2=ymin; g2<=ymax; g2++){ ctx.beginPath(); ctx.moveTo(0,Y(g2)); ctx.lineTo(W,Y(g2)); ctx.stroke(); }
  ctx.strokeStyle="#16213E"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(0,Y(0)); ctx.lineTo(W,Y(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(X(0),0); ctx.lineTo(X(0),H); ctx.stroke();

  function drawLine(a,b,c,color){
    ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.beginPath();
    var started=false;
    if (Math.abs(b) > 1e-9){
      for (var x=xmin; x<=xmax; x+=0.2){
        var y=(c-a*x)/b;
        var sx=X(x), sy=Y(y);
        if (!started){ ctx.moveTo(sx,sy); started=true; } else ctx.lineTo(sx,sy);
      }
    } else if (Math.abs(a) > 1e-9){
      var xv = c/a;
      ctx.moveTo(X(xv),0); ctx.lineTo(X(xv),H);
    }
    ctx.stroke();
  }
  drawLine(a1,b1,c1,"#5B57C4");
  drawLine(a2,b2,c2,"#E3A72C");

  var det = a1*b2-a2*b1;
  var info;
  if (Math.abs(det) < 1e-9){
    info = "Kedua garis sejajar (atau berimpit) — tidak ada solusi tunggal.";
  } else {
    var xs = (c1*b2-c2*b1)/det;
    var ys = (a1*c2-a2*c1)/det;
    ctx.fillStyle="#C1483D"; ctx.strokeStyle="#16213E"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(X(xs),Y(ys),5.5,0,Math.PI*2); ctx.fill(); ctx.stroke();
    info = "Titik potong (solusi): x = "+fmt(Math.round(xs*1000)/1000)+", y = "+fmt(Math.round(ys*1000)/1000);
  }
  $("#spReadout").innerHTML =
    '<span class="chip" style="color:#5B57C4;">Garis 1: '+a1+'x + '+b1+'y = '+c1+'</span>' +
    '<span class="chip" style="color:#B9821A;">Garis 2: '+a2+'x + '+b2+'y = '+c2+'</span>' +
    '<span class="chip"><b>'+info+'</b></span>';
}
$("#sp-draw").addEventListener("click", drawSPLDV);
["sp-a1","sp-b1","sp-c1","sp-a2","sp-b2","sp-c2"].forEach(function(id){ $("#"+id).addEventListener("change", drawSPLDV); });
toolInitByTopic["topic-4"] = drawSPLDV;

/* ================================================================
   TOOL 5 — Inequality number line
   ================================================================ */
function drawNumberline(){
  var a=parseFloat($("#pt-a").value)||0;
  var b=parseFloat($("#pt-b").value)||0;
  var c=parseFloat($("#pt-c").value)||0;
  var op=$("#pt-op").value; // lt, lte, gt, gte  (means ax+b OP c)
  var svg = $("#numlineSvg");

  var boundary = a!==0 ? (c-b)/a : null;
  var flip = a<0;
  var finalOp = op;
  if (flip){
    var map = {lt:"gt", gt:"lt", lte:"gte", gte:"lte"};
    finalOp = map[op];
  }
  var openCircle = (finalOp==="lt" || finalOp==="gt");
  var direction = (finalOp==="lt" || finalOp==="lte") ? "left" : "right";

  var center = boundary===null ? 0 : boundary;
  var span = 6;
  var lo = Math.floor(center-span), hi = Math.ceil(center+span);
  function X(v){ return 30 + (v-lo)/(hi-lo)*360; }

  var ticks = "";
  for (var v=lo; v<=hi; v++){
    ticks += '<line x1="'+X(v)+'" y1="34" x2="'+X(v)+'" y2="42" stroke="#8FA0BE" stroke-width="1.5"/>';
    if (v % Math.ceil((hi-lo)/8 || 1) === 0){
      ticks += '<text x="'+X(v)+'" y="58" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="#3A4A6B">'+v+'</text>';
    }
  }
  var bx = boundary===null ? X(0) : X(boundary);
  var ray = direction==="left"
    ? '<line x1="30" y1="38" x2="'+bx+'" y2="38" stroke="#C1483D" stroke-width="4"/><polygon points="'+(30)+',38 '+(30+10)+',32 '+(30+10)+',44" fill="#C1483D"/>'
    : '<line x1="'+bx+'" y1="38" x2="390" y2="38" stroke="#C1483D" stroke-width="4"/><polygon points="390,38 380,32 380,44" fill="#C1483D"/>';

  svg.innerHTML =
    '<line x1="20" y1="38" x2="400" y2="38" stroke="#C7D6E5" stroke-width="2"/>' +
    ticks + ray +
    '<circle cx="'+bx+'" cy="38" r="7" fill="'+(openCircle?"#fff":"#C1483D")+'" stroke="#C1483D" stroke-width="3"/>';

  var opSym = {lt:"<", lte:"≤", gt:">", gte:"≥"}[finalOp];
  var solText = boundary===null ? "Tidak dapat ditentukan (a = 0)" : ("x "+opSym+" "+fmt(Math.round(boundary*1000)/1000));
  $("#ptReadout").innerHTML =
    '<span class="chip">Bentuk: '+a+'x + ('+b+') '+({lt:"<",lte:"≤",gt:">",gte:"≥"}[op])+' '+c+'</span>' +
    (flip ? '<span class="chip" style="color:#8C332A;">a &lt; 0 → tanda dibalik saat dibagi</span>' : '') +
    '<span class="chip" style="background:rgba(47,143,110,.15);color:#1E5E48;"><b>'+solText+'</b></span>';
}
$("#pt-draw").addEventListener("click", drawNumberline);
["pt-a","pt-b","pt-c","pt-op"].forEach(function(id){ $("#"+id).addEventListener("change", drawNumberline); });
toolInitByTopic["topic-5"] = drawNumberline;

/* ================================================================
   TOOL 6 — Sequence / series bars
   ================================================================ */
function drawBarisan(){
  var type = $("#bd-type").value;
  var a = parseFloat($("#bd-a").value)||0;
  var r = parseFloat($("#bd-r").value)||0;
  var n = parseInt($("#bd-n").value,10);
  $("#bd-n-val").textContent = n;
  $("#bd-r-label").textContent = type==="a" ? "Beda (b)" : "Rasio (r)";

  var terms = [];
  for (var i=1;i<=n;i++){
    terms.push(type==="a" ? a+(i-1)*r : a*Math.pow(r,i-1));
  }
  var maxAbs = Math.max.apply(null, terms.map(Math.abs).concat([1]));
  var container = $("#bdBars");
  container.innerHTML = "";
  terms.forEach(function(t,i){
    var bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = "2px";
    var val = document.createElement("span"); val.className="val"; val.textContent = fmt(Math.round(t*1000)/1000);
    var idx = document.createElement("span"); idx.className="idx"; idx.textContent = "U"+(i+1);
    bar.appendChild(val); bar.appendChild(idx);
    container.appendChild(bar);
    setTimeout(function(){
      var pct = Math.max(4, Math.abs(t)/maxAbs*100);
      bar.style.height = pct+"%";
      if (t<0) bar.style.background = "linear-gradient(180deg, #C1483D, #8C332A)";
    }, 60*i);
  });

  var Sn;
  if (type==="a"){
    Sn = n/2*(2*a+(n-1)*r);
  } else {
    Sn = (r===1) ? a*n : a*(Math.pow(r,n)-1)/(r-1);
  }
  var sumCheck = terms.reduce(function(s,x){return s+x;},0);
  $("#bdReadout").innerHTML =
    '<span class="chip">Rumus suku ke-n: <b>'+(type==="a" ? "Uₙ = a + (n−1)b" : "Uₙ = a · r^(n−1)")+'</b></span>' +
    '<span class="chip">S'+n+' (rumus) = <b>'+fmt(Math.round(Sn*1000)/1000)+'</b></span>' +
    '<span class="chip">S'+n+' (jumlah langsung) = <b>'+fmt(Math.round(sumCheck*1000)/1000)+'</b></span>' +
    (type==="g" && Math.abs(r)<1 ? '<span class="chip">Jika n → ∞, S∞ = a/(1−r) = <b>'+fmt(Math.round((a/(1-r))*1000)/1000)+'</b></span>' : '');
}
$("#bd-draw").addEventListener("click", drawBarisan);
$("#bd-n").addEventListener("input", function(){ $("#bd-n-val").textContent=this.value; });
["bd-type","bd-a","bd-r","bd-n"].forEach(function(id){ $("#"+id).addEventListener("change", drawBarisan); });
toolInitByTopic["topic-6"] = drawBarisan;

/* ================================================================
   TOOL 7 — Statistics calculator
   ================================================================ */
function quartilePosition(sorted, frac){
  var n = sorted.length;
  var pos = frac*(n+1);
  var lo = Math.floor(pos), hi = Math.ceil(pos);
  lo = Math.max(1, Math.min(n, lo));
  hi = Math.max(1, Math.min(n, hi));
  var loVal = sorted[lo-1], hiVal = sorted[hi-1];
  var frac2 = pos-lo;
  return loVal + frac2*(hiVal-loVal);
}
function drawStats(){
  var raw = $("#st-data").value;
  var nums = raw.split(",").map(function(s){return parseFloat(s.trim());}).filter(function(n){return !isNaN(n);});
  if (nums.length===0){ $("#stReadout").innerHTML = '<span class="chip">Masukkan data angka dipisah koma.</span>'; return; }
  var sorted = nums.slice().sort(function(x,y){return x-y;});
  var n = sorted.length;
  var mean = nums.reduce(function(s,x){return s+x;},0)/n;
  var median = n%2===1 ? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2;
  var freq = {};
  sorted.forEach(function(v){ freq[v]=(freq[v]||0)+1; });
  var maxFreq = Math.max.apply(null, Object.values(freq));
  var modes = Object.keys(freq).filter(function(k){return freq[k]===maxFreq;}).map(Number);
  var modeText = maxFreq<=1 ? "Tidak ada modus" : modes.join(", ");
  var range = sorted[n-1]-sorted[0];
  var q1 = quartilePosition(sorted, 0.25);
  var q3 = quartilePosition(sorted, 0.75);
  var iqr = q3-q1;

  var canvas = $("#stCanvas");
  var dpr = window.devicePixelRatio||1;
  var rect = canvas.getBoundingClientRect();
  var W = rect.width || canvas.parentElement.clientWidth || 600;
  var H = 200;
  canvas.width=W*dpr; canvas.height=H*dpr; canvas.style.width="100%"; canvas.style.height=H+"px";
  var ctx = canvas.getContext("2d");
  ctx.setTransform(1,0,0,1,0,0); ctx.scale(dpr,dpr);
  ctx.clearRect(0,0,W,H);

  var xmin=sorted[0], xmax=sorted[n-1];
  if (xmin===xmax){ xmin-=1; xmax+=1; }
  var padX = (xmax-xmin)*0.1;
  xmin-=padX; xmax+=padX;
  function X(v){ return 20 + (v-xmin)/(xmax-xmin)*(W-40); }
  var axisY = H-30;
  ctx.strokeStyle="#16213E"; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(20,axisY); ctx.lineTo(W-20,axisY); ctx.stroke();

  var stack = {};
  sorted.forEach(function(v){
    stack[v] = (stack[v]||0)+1;
    var cy = axisY - 14*stack[v];
    ctx.fillStyle="#5B57C4";
    ctx.beginPath(); ctx.arc(X(v),cy,6,0,Math.PI*2); ctx.fill();
  });
  // mean marker
  ctx.fillStyle="#E3A72C"; ctx.strokeStyle="#16213E"; ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(X(mean),axisY+6); ctx.lineTo(X(mean)-7,axisY+18); ctx.lineTo(X(mean)+7,axisY+18); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle="#3A4A6B"; ctx.font="11px 'JetBrains Mono', monospace"; ctx.textAlign="center";
  ctx.fillText("mean", X(mean), axisY+30);

  $("#stReadout").innerHTML =
    '<span class="chip">n = <b>'+n+'</b></span>' +
    '<span class="chip">Mean = <b>'+fmt(Math.round(mean*1000)/1000)+'</b></span>' +
    '<span class="chip">Median = <b>'+fmt(median)+'</b></span>' +
    '<span class="chip">Modus = <b>'+modeText+'</b></span>' +
    '<span class="chip">Q1 = <b>'+fmt(Math.round(q1*1000)/1000)+'</b> · Q3 = <b>'+fmt(Math.round(q3*1000)/1000)+'</b></span>' +
    '<span class="chip">Jangkauan interkuartil = <b>'+fmt(Math.round(iqr*1000)/1000)+'</b></span>' +
    '<span class="chip">Jangkauan (range) = <b>'+fmt(range)+'</b></span>';
}
$("#st-calc").addEventListener("click", drawStats);
toolInitByTopic["topic-7"] = drawStats;

/* ================================================================
   QUIZ ENGINE
   ================================================================ */
function renderQuiz(containerId, storageKey, questions){
  var container = $("#"+containerId);
  var answered = new Array(questions.length).fill(false);
  var score = 0;

  var scoreBadge = document.createElement("div");
  scoreBadge.className = "quiz-score";
  container.innerHTML = "";
  container.appendChild(scoreBadge);

  questions.forEach(function(q,i){
    var qDiv = document.createElement("div");
    qDiv.className = "quiz-q";
    qDiv.innerHTML =
      '<p class="quiz-question"><span class="qnum">'+(i+1)+'</span><span>'+q.q+'</span></p>' +
      '<div class="quiz-options"></div>' +
      '<p class="quiz-explain" style="display:none;"></p>';
    var optWrap = qDiv.querySelector(".quiz-options");
    q.options.forEach(function(opt, oi){
      var b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-opt";
      b.innerHTML = opt;
      b.addEventListener("click", function(){
        if (answered[i]) return;
        answered[i] = true;
        var isCorrect = oi === q.correct;
        b.classList.add(isCorrect ? "correct" : "wrong");
        if (!isCorrect) optWrap.children[q.correct].classList.add("correct");
        Array.prototype.forEach.call(optWrap.children, function(child){ child.disabled = true; });
        var ex = qDiv.querySelector(".quiz-explain");
        ex.style.display = "block";
        ex.innerHTML = (isCorrect ? "✅ Benar. " : "❌ Kurang tepat. ") + q.explain;
        if (isCorrect) score++;
        updateScore();
        typeset(ex);
      });
      optWrap.appendChild(b);
    });
    container.appendChild(qDiv);
  });

  function updateScore(){
    var done = answered.filter(Boolean).length;
    scoreBadge.textContent = "Skor: "+score+"/"+questions.length+" · Dikerjakan "+done+"/"+questions.length;
    if (done === questions.length){
      try { localStorage.setItem(storageKey, JSON.stringify({score:score,total:questions.length})); } catch(e){}
      markSectionProgress(storageKey, score, questions.length);
    }
  }
  updateScore();

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved){
      var parsed = JSON.parse(saved);
      markSectionProgress(storageKey, parsed.score, parsed.total);
    }
  } catch(e){}

  typeset(container);
}

function markSectionProgress(storageKey, score, total){
  var num = storageKey.split("-")[1];
  var dot = $("#dot-"+num);
  if (!dot) return;
  dot.classList.remove("attempted","done");
  dot.classList.add(score/total >= 0.6 ? "done" : "attempted");
}

/* -------- quiz data (all answers verified) -------- */
var Q1 = [
  { q:"Faktorkan bentuk \\(x^2+5x+6\\).", options:["\\((x+2)(x+3)\\)","\\((x+1)(x+6)\\)","\\((x-2)(x-3)\\)","\\((x+6)(x-1)\\)"], correct:0,
    explain:"Cari \\(p,q\\) dengan \\(p+q=5\\) dan \\(pq=6\\), diperoleh \\(p=2, q=3\\), sehingga \\((x+2)(x+3)\\)." },
  { q:"Dengan pemfaktoran \\(a^2-b^2=(a+b)(a-b)\\), nilai dari \\(25^2-15^2\\) adalah…", options:["350","400","450","300"], correct:1,
    explain:"\\(25^2-15^2=(25+15)(25-15)=40\\times10=400\\)." },
  { q:"Koefisien \\(x^2\\) pada penjabaran \\((x+3)^3\\) adalah…", options:["3","6","9","27"], correct:2,
    explain:"\\((a+b)^3=a^3+3a^2b+3ab^2+b^3\\). Untuk \\(a=x,b=3\\): suku \\(3a^2b=3\\cdot x^2\\cdot3=9x^2\\), jadi koefisiennya 9." },
  { q:"Faktor dari \\(3x^2-4x-4\\) adalah…", options:["\\((3x-2)(x+2)\\)","\\((3x+2)(x-2)\\)","\\((x+2)(3x+2)\\)","\\((x-2)(x-2)\\)"], correct:1,
    explain:"Cek: \\((3x+2)(x-2)=3x^2-6x+2x-4=3x^2-4x-4\\). Cocok." },
  { q:"Pernyataan \\((m+n)+p=m+(n+p)\\) menunjukkan sifat…", options:["Komutatif","Distributif","Asosiatif","Identitas"], correct:2,
    explain:"Pengelompokan ulang tanpa mengubah urutan adalah sifat asosiatif." }
];

var Q2 = [
  { q:"Jika \\(A=\\{1,2,3\\}\\) dan \\(B=\\{4,5\\}\\), banyak pemetaan \\(f:A\\to B\\) yang mungkin adalah…", options:["6","8","9","5"], correct:1,
    explain:"Banyak pemetaan \\(=n(B)^{n(A)}=2^3=8\\)." },
  { q:"Jika \\(f(x)=2x-3\\), maka \\(f(4)=\\)…", options:["5","8","11","2"], correct:0,
    explain:"\\(f(4)=2(4)-3=8-3=5\\)." },
  { q:"Titik potong grafik \\(f(x)=x^2-2x-3\\) dengan sumbu-y adalah…", options:["(0, 3)","(3, 0)","(0, −3)","(−3, 0)"], correct:2,
    explain:"Titik potong sumbu-y adalah \\(f(0)=0^2-2(0)-3=-3\\), yaitu \\((0,-3)\\)." },
  { q:"Akar-akar dari \\(x^2-2x-3=0\\) adalah…", options:["3 dan 1","−3 dan 1","3 dan −1","−3 dan −1"], correct:2,
    explain:"\\(x^2-2x-3=(x-3)(x+1)=0 \\Rightarrow x=3\\) atau \\(x=-1\\)." },
  { q:"Grafik fungsi kuadrat \\(f(x)=ax^2+bx+c\\) dengan \\(a>0\\) terbuka ke arah…", options:["Atas","Bawah","Kiri","Kanan"], correct:0,
    explain:"Jika koefisien \\(a>0\\), parabola membuka ke atas." }
];

var Q3 = [
  { q:"Penyelesaian dari \\(2x+5=13\\) adalah…", options:["x = 3","x = 4","x = 5","x = 9"], correct:1,
    explain:"\\(2x=13-5=8 \\Rightarrow x=4\\)." },
  { q:"Penyelesaian dari \\(3(x-2)=15\\) adalah…", options:["x = 5","x = 7","x = 9","x = 3"], correct:1,
    explain:"\\(3x-6=15 \\Rightarrow 3x=21 \\Rightarrow x=7\\)." },
  { q:"Pada persamaan linear satu variabel \\(ax+b=0\\), syarat untuk \\(a\\) adalah…", options:["a ≠ 0","a = 0","a > 0 saja","a < 0 saja"], correct:0,
    explain:"Jika \\(a=0\\), persamaan bukan lagi persamaan linear (variabel \\(x\\) hilang)." },
  { q:"Penyelesaian dari \\(\\dfrac{x}{3}+2=5\\) adalah…", options:["x = 3","x = 6","x = 9","x = 15"], correct:2,
    explain:"\\(\\frac{x}{3}=3 \\Rightarrow x=9\\)." },
  { q:"Jika \\(5x-7=2x+8\\), maka nilai \\(x\\) adalah…", options:["x = 1","x = 3","x = 5","x = 15"], correct:2,
    explain:"\\(5x-2x=8+7 \\Rightarrow 3x=15 \\Rightarrow x=5\\)." }
];

var Q4 = [
  { q:"Jika \\(x+y=10\\) dan \\(x-y=2\\), maka nilai \\(y\\) adalah…", options:["2","4","6","8"], correct:1,
    explain:"Jumlahkan: \\(2x=12\\Rightarrow x=6\\), sehingga \\(y=10-6=4\\)." },
  { q:"Jika \\(2x+y=8\\) dan \\(x+y=5\\), maka nilai \\(x\\) adalah…", options:["2","3","4","5"], correct:1,
    explain:"Kurangkan kedua persamaan: \\(x=3\\), lalu \\(y=2\\)." },
  { q:"SPLDV tidak memiliki penyelesaian (tak konsisten) jika grafik kedua persamaannya…", options:["Berpotongan di satu titik","Sejajar","Berimpit","Tegak lurus"], correct:1,
    explain:"Dua garis sejajar tidak pernah berpotongan, sehingga tidak ada solusi." },
  { q:"Pada metode substitusi, langkah pertamanya adalah…", options:["Menyamakan koefisien salah satu variabel","Mengubah salah satu persamaan ke bentuk eksplisit lalu menggantikannya ke persamaan lain","Mengalikan kedua persamaan","Menggambar kedua garis"], correct:1,
    explain:"Substitusi berarti mengganti salah satu variabel dengan bentuk eksplisit dari persamaan lain." },
  { q:"Dari sistem \\(3x+4y=960.000\\) dan \\(2x+5y=990.000\\) (soal kaos &amp; topi), harga satu topi (y) adalah…", options:["Rp100.000","Rp120.000","Rp150.000","Rp200.000"], correct:2,
    explain:"Eliminasi menghasilkan \\(7y=1.050.000 \\Rightarrow y=150.000\\)." }
];

var Q5 = [
  { q:"Penyelesaian dari \\(2x-3<7\\) adalah…", options:["x < 2","x < 5","x < 7","x < 10"], correct:1,
    explain:"\\(2x<10 \\Rightarrow x<5\\)." },
  { q:"Penyelesaian dari \\(-3x\\ge9\\) adalah…", options:["x ≥ −3","x ≤ −3","x ≥ 3","x ≤ 3"], correct:1,
    explain:"Bagi kedua ruas dengan \\(-3\\) (negatif) — tanda dibalik: \\(x\\le-3\\)." },
  { q:"Jika \\(a<b\\) dan \\(c<0\\), maka hubungan \\(ac\\) dan \\(bc\\) adalah…", options:["ac > bc","ac < bc","ac = bc","Tidak dapat ditentukan"], correct:0,
    explain:"Mengalikan pertidaksamaan dengan bilangan negatif membalik tandanya, sehingga \\(ac>bc\\)." },
  { q:"Pertidaksamaan \\(|x|\\le3\\) ekuivalen dengan…", options:["x ≤ 3","x ≥ −3","−3 ≤ x ≤ 3","x ≤ −3 atau x ≥ 3"], correct:2,
    explain:"Sifat nilai mutlak: \\(|a|\\le b \\iff -b\\le a\\le b\\)." },
  { q:"Menurut pertaksamaan AM–GM, untuk \\(a,b\\ge0\\) selalu berlaku…", options:["\\(\\frac{a+b}{2}\\ge\\sqrt{ab}\\)","\\(\\frac{a+b}{2}\\le\\sqrt{ab}\\)","\\(\\frac{a+b}{2}=\\sqrt{ab}\\)","\\(ab\\ge a+b\\)"], correct:0,
    explain:"Rataan aritmetika selalu lebih besar atau sama dengan rataan geometri." }
];

var Q6 = [
  { q:"Suku ke-10 dari barisan aritmetika \\(2,5,8,11,\\dots\\) adalah…", options:["27","29","30","32"], correct:1,
    explain:"\\(U_{10}=2+(10-1)\\times3=2+27=29\\)." },
  { q:"Suku ke-6 dari barisan geometri \\(3,6,12,24,\\dots\\) adalah…", options:["48","64","96","192"], correct:2,
    explain:"\\(U_6=3\\times2^{5}=3\\times32=96\\)." },
  { q:"Jumlah 10 suku pertama deret \\(1+3+5+7+\\dots\\) adalah…", options:["90","100","110","55"], correct:1,
    explain:"\\(S_{10}=\\frac{10}{2}[2(1)+9(2)]=5\\times20=100\\)." },
  { q:"Jumlah deret geometri tak hingga \\(1+\\frac12+\\frac14+\\dots\\) adalah…", options:["1","1,5","2","4"], correct:2,
    explain:"\\(S_\\infty=\\dfrac{a}{1-r}=\\dfrac{1}{1-0.5}=2\\)." },
  { q:"Beda pada barisan aritmetika \\(20,15,10,5,\\dots\\) adalah…", options:["5","−5","10","−10"], correct:1,
    explain:"\\(b=15-20=-5\\)." }
];

var Q7 = [
  { q:"Data: 5, 7, 7, 9, 10, 10. Mean data tersebut adalah…", options:["7","8","9","6,5"], correct:1,
    explain:"Jumlah \\(=5+7+7+9+10+10=48\\), \\(n=6\\), mean \\(=48/6=8\\)." },
  { q:"Data terurut: 2, 4, 6, 8, 10, 12. Median data tersebut adalah…", options:["6","7","8","9"], correct:1,
    explain:"Data genap: median \\(=\\dfrac{6+8}{2}=7\\)." },
  { q:"Data terurut: 3, 5, 7, 9, 11. Median data tersebut adalah…", options:["5","6","7","9"], correct:2,
    explain:"Data ganjil (n=5): median adalah data ke-3, yaitu 7." },
  { q:"Data: 2, 3, 3, 3, 5, 6, 6, 7. Modus data tersebut adalah…", options:["2","3","6","7"], correct:1,
    explain:"Nilai 3 muncul paling sering (3 kali), sehingga modusnya adalah 3." },
  { q:"Data: 4, 9, 15, 22, 30. Jangkauan (range) data tersebut adalah…", options:["4","26","30","34"], correct:1,
    explain:"Jangkauan \\(=\\)data terbesar \\(-\\) data terkecil \\(=30-4=26\\)." }
];

renderQuiz("quiz-1","quiz-1",Q1);
renderQuiz("quiz-2","quiz-2",Q2);
renderQuiz("quiz-3","quiz-3",Q3);
renderQuiz("quiz-4","quiz-4",Q4);
renderQuiz("quiz-5","quiz-5",Q5);
renderQuiz("quiz-6","quiz-6",Q6);
renderQuiz("quiz-7","quiz-7",Q7);

/* ================================================================
   INITIAL RENDER
   ================================================================ */
drawSquareTool();
toolInitedOnce["topic-1"] = true;
drawBalance();
typeset(document.body);

window.addEventListener("resize", function(){
  var active = $(".topic.active");
  if (!active) return;
  var fn = toolInitByTopic[active.id];
  if (fn) fn(true);
});

})();
