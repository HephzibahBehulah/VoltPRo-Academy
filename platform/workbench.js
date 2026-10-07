(()=>{"use strict";
const $=s=>document.querySelector(s);
const esc=x=>String(x??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
let catalog=[];
function ensureStyle(){
 if($("#vpWorkbenchStyle"))return;
 const s=document.createElement("style");s.id="vpWorkbenchStyle";s.textContent=`
#vpWorkbench{position:fixed;inset:72px 18px 42px 18px;background:#071321;border:1px solid #29475f;border-radius:14px;z-index:9000;display:none;grid-template-rows:auto 1fr;box-shadow:0 25px 80px #000b;overflow:hidden}
#vpWorkbench.open{display:grid}
.vpw-head{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #29475f}
.vpw-head b{color:#35d5ff;font:800 12px ui-monospace,monospace;letter-spacing:.08em}.vpw-head span{color:#8da4bd;font-size:10px}
.vpw-head button{margin-left:auto;background:#102238;color:#eaf5ff;border:1px solid #31516d;border-radius:7px;padding:6px 10px;cursor:pointer}
.vpw-body{min-height:0;display:grid;grid-template-columns:235px 1fr}
.vpw-side{padding:12px;border-right:1px solid #29475f;overflow:auto}.vpw-side input{width:100%;background:#06101b;color:#eaf5ff;border:1px solid #29475f;border-radius:7px;padding:8px;margin-bottom:9px}
.vpw-cat{display:block;width:100%;text-align:left;background:#0b1b2c;color:#a8bed3;border:1px solid #213b53;border-radius:7px;padding:8px;margin:4px 0;cursor:pointer}.vpw-cat.active{color:#fff;border-color:#35d5ff}
.vpw-main{min-width:0;min-height:0;overflow:auto;padding:14px}.vpw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
.vpw-card{background:#0b1a2b;border:1px solid #203b53;border-radius:10px;padding:10px;cursor:pointer}.vpw-card:hover{border-color:#35d5ff;transform:translateY(-1px)}
.vpw-symbol{height:64px;display:grid;place-items:center;background:#081624;border-radius:7px;color:#35d5ff;font:900 20px ui-monospace,monospace;margin-bottom:8px}.vpw-card b{font-size:11px}.vpw-card small{display:block;color:#8da4bd;font-size:9px;margin-top:3px}
.vpw-detail{display:none;background:#081a2b;border:1px solid #31516d;border-radius:10px;padding:14px;margin-bottom:12px}.vpw-detail.open{display:block}.vpw-detail h3{margin:0 0 8px;color:#35d5ff}.vpw-detail p{color:#a8bed3;font-size:10px;line-height:1.5}.vpw-detail code{color:#9fecc7}
.vpw-panel{display:grid;grid-template-columns:1fr 260px;gap:12px;height:100%}.vpw-rail{position:relative;min-height:320px;background:repeating-linear-gradient(0deg,#081522,#081522 31px,#0b1d2d 32px);border:1px solid #29475f;border-radius:10px;overflow:auto;padding:22px}
.vpw-rail-line{height:18px;background:#334b5e;border:1px solid #526d82;border-radius:3px;margin:115px 0 0}.vpw-device{position:absolute;top:55px;min-width:70px;height:105px;background:#d9e1e8;color:#071321;border:1px solid #8798a7;border-radius:4px;padding:7px 5px;text-align:center;font:800 9px system-ui;box-shadow:0 5px 15px #0007}.vpw-device small{display:block;font-weight:500;margin-top:7px}.vpw-sidebox{background:#081a2b;border:1px solid #29475f;border-radius:10px;padding:12px;color:#a8bed3;font-size:10px;overflow:auto}.vpw-sidebox h4{color:#35d5ff;margin:0 0 8px}
.vpw-plc{display:grid;grid-template-columns:220px 1fr;gap:12px}.vpw-logic-card{background:#0b1a2b;border:1px solid #29475f;border-radius:9px;padding:12px;margin-bottom:8px;color:#eaf5ff}.vpw-logic-card button{margin:4px;background:#102238;color:#fff;border:1px solid #31516d;border-radius:6px;padding:6px}.vpw-ladder{background:#06101b;border:1px solid #29475f;border-radius:10px;min-height:300px;padding:20px;font:11px/2 ui-monospace,monospace;color:#9fecc7}
@media(max-width:760px){#vpWorkbench{inset:64px 6px 34px 6px}.vpw-body{grid-template-columns:1fr}.vpw-side{max-height:150px;border-right:0;border-bottom:1px solid #29475f}.vpw-panel,.vpw-plc{grid-template-columns:1fr}.vpw-sidebox{display:none}}
`;document.head.appendChild(s);
}
function open(title,body){ensureStyle();let x=$("#vpWorkbench");if(!x){x=document.createElement("section");x.id="vpWorkbench";document.body.appendChild(x)}x.innerHTML='<div class="vpw-head"><b>'+esc(title)+'</b><span>FREE · LOCAL · NO SUBSCRIPTION</span><button id="vpwClose">Close</button></div><div class="vpw-body">'+body+'</div>';x.classList.add("open");$("#vpwClose").onclick=()=>x.classList.remove("open")}
async function loadCatalog(){if(catalog.length)return catalog;try{if(window.VoltProRegistry?.ready)await window.VoltProRegistry.ready;catalog=window.VoltProRegistry?.search?.("")||[];if(!catalog.length)catalog=await fetch("components.json",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(x=>x.library||[])}catch{catalog=[]}return catalog}
function reference(){
 loadCatalog().then(items=>{let cat="All",q="";const draw=()=>{const cats=["All",...new Set(items.map(x=>x.category))];const filtered=items.filter(x=>(cat==="All"||x.category===cat)&&x.name.toLowerCase().includes(q.toLowerCase()));open("COMPONENT REFERENCE LIBRARY",'<aside class="vpw-side"><input id="vpwSearch" placeholder="Search 700+ components...">'+cats.map(c=>'<button class="vpw-cat '+(cat===c?"active":"")+'" data-c="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</aside><main class="vpw-main"><div id="vpwDetail" class="vpw-detail"></div><div class="vpw-grid">'+filtered.map((x,i)=>'<article class="vpw-card" data-i="'+i+'"><div class="vpw-symbol">'+esc(x.symbol==="generic"?"◇":x.symbol)+'</div><b>'+esc(x.name)+'</b><small>'+esc(x.category||"Component")+'</small></article>').join("")+'</div></main>');$("#vpwSearch").value=q;$("#vpwSearch").oninput=e=>{q=e.target.value;draw()};document.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{cat=b.dataset.c;draw()});document.querySelectorAll("[data-i]").forEach((c,i)=>c.onclick=()=>{const x=filtered[i],d=$("#vpwDetail");d.innerHTML="<h3>"+esc(x.name)+"</h3><p><b>Category:</b> "+esc(x.category)+"<br><b>Symbol:</b> "+esc(x.symbol)+"<br><b>Model:</b> "+esc(x.electricalModel?.type||x.model||"catalog reference")+"<br><b>License:</b> VoltPRo original catalog entry. Verify third-party manufacturer assets before redistribution.</p>";d.classList.add("open")})};draw()})
}
function panel(){
 const comps=(window.S?.components||[]), list=comps.map((c,i)=>{const d=window.defs?.[c.type]||{};return '<div class="vpw-device" style="left:'+(25+i*88)+'px">'+esc(d.symbol||c.type)+'<small>'+esc(d.name||c.type)+'</small></div>'}).join("");
 open("PANEL DESIGNER · DIN RAIL WORKSPACE",'<main class="vpw-main"><div class="vpw-panel"><div class="vpw-rail">'+list+'<div class="vpw-rail-line"></div></div><aside class="vpw-sidebox"><h4>Panel workflow</h4><p>Place protection, contactors, relays, terminals and loads on the rail.</p><p>Use the main canvas for electrical connectivity. This view is the panel layout companion.</p><p><b>Current devices:</b> '+comps.length+'</p><p><b>Rail:</b> TS 35 / DIN · 18 modules</p></aside></div></main>')
}
function plc(){
 open("PLC LOGIC LAB",'<aside class="vpw-side"><div class="vpw-logic-card"><b>Inputs</b><br><button data-plc="i0">I0 Start</button><button data-plc="i1">I1 Stop</button><button data-plc="i2">I2 E-Stop</button></div><div class="vpw-logic-card"><b>Outputs</b><br><button data-plc="q0">Q0 Motor</button><button data-plc="q1">Q1 Lamp</button></div></aside><main class="vpw-main"><div class="vpw-ladder" id="vpwLadder">PLC LADDER LOGIC\n\n|----[ I0 START ]----[/ I1 STOP ]----( Q0 MOTOR )----|\n|----[ I2 E-STOP ]-------------------[/ Q0 MOTOR ]----|\n\nState: READY\n\nThis is the local educational logic workspace. Native PLC hardware execution is not claimed.</div></main>');
 document.querySelectorAll("[data-plc]").forEach(b=>b.onclick=()=>{$("#vpwLadder").textContent+="\nTOGGLED "+b.dataset.plc+" · "+new Date().toLocaleTimeString()})
}
function bind(){document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.mode==="reference")reference();else if(b.dataset.mode==="panel")panel();else if(b.dataset.mode==="plc")plc()}))}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();
window.VoltProWorkbench={reference,panel,plc};
})();