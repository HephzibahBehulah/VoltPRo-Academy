(()=>{"use strict";
const C={voltage:12,current:0,resistance:1000};
const S={version:1,mode:"schematic",components:[],wires:[],selected:null,wireStart:null,running:false,zoom:1,pan:{x:0,y:0},grid:20,history:[],future:[],meter:"voltage",theme:"dark"};
const defs={
 battery:{cat:"Power",name:"DC Source",symbol:"V",pins:2,props:{voltage:12},unit:"V",res:0},
 resistor:{cat:"Passive",name:"Resistor",symbol:"R",pins:2,props:{resistance:1000},unit:"Ω"},
 lamp:{cat:"Loads",name:"Lamp",symbol:"L",pins:2,props:{resistance:120},unit:"Ω"},
 led:{cat:"Semiconductor",name:"LED",symbol:"D",pins:2,props:{forward:2,resistance:330},unit:"Ω"},
 switch:{cat:"Switches",name:"Switch",symbol:"S",pins:2,props:{closed:1}},
 fuse:{cat:"Protection",name:"Fuse",symbol:"F",pins:2,props:{rating:1}},
 breaker:{cat:"Protection",name:"MCB",symbol:"QF",pins:2,props:{rating:6}},
 rcd:{cat:"Protection",name:"RCD / FI",symbol:"RCD",pins:2,props:{trip:0.03}},
 relay:{cat:"Relays",name:"Relay",symbol:"K",pins:4,props:{coil:24,closed:0}},
 contactor:{cat:"Relays",name:"Contactor",symbol:"KM",pins:4,props:{coil:24,closed:0}},
 motor:{cat:"Loads",name:"DC Motor",symbol:"M",pins:2,props:{resistance:24}},
 ground:{cat:"Grounding",name:"Protective Earth",symbol:"PE",pins:1,props:{}},
 terminal:{cat:"Panel",name:"Terminal Block",symbol:"X",pins:2,props:{label:"X1"}},
 multimeter:{cat:"Measurement",name:"Multimeter",symbol:"V/A",pins:2,props:{mode:"voltage"}},
 oscilloscope:{cat:"Measurement",name:"Oscilloscope",symbol:"OSC",pins:2,props:{mode:"voltage"}},
 acsource:{cat:"Power",name:"AC Source",symbol:"~",pins:2,props:{voltage:230}},
 threephase:{cat:"Power",name:"3-Phase Source",symbol:"3~",pins:3,props:{voltage:400}},
 capacitor:{cat:"Passive",name:"Capacitor",symbol:"C",pins:2,props:{capacitance:0.000001}},
 inductor:{cat:"Passive",name:"Inductor",symbol:"L",pins:2,props:{inductance:0.01}},
 diode:{cat:"Semiconductor",name:"Diode",symbol:"→|",pins:2,props:{forward:0.7,resistance:100}},
 zener:{cat:"Semiconductor",name:"Zener Diode",symbol:"Z",pins:2,props:{voltage:5.1,resistance:50}},
 logic_and:{cat:"Logic",name:"AND Gate",symbol:"AND",pins:3,props:{}},
 logic_or:{cat:"Logic",name:"OR Gate",symbol:"OR",pins:3,props:{}},
 logic_not:{cat:"Logic",name:"NOT Gate",symbol:"NOT",pins:2,props:{}},
 arduino:{cat:"Microcontroller",name:"Arduino UNO",symbol:"UNO",pins:8,props:{code:"blink"}},
 gpio:{cat:"Microcontroller",name:"GPIO Pin",symbol:"GPIO",pins:1,props:{state:0}},
 sensor:{cat:"Microcontroller",name:"Virtual Sensor",symbol:"S",pins:1,props:{value:50}},
 buzzer:{cat:"Loads",name:"Buzzer",symbol:"BZ",pins:2,props:{resistance:100}},
 heater:{cat:"Loads",name:"Heater",symbol:"H",pins:2,props:{resistance:46}},
 socket:{cat:"Panel",name:"Schuko Socket",symbol:"⏚",pins:3,props:{}},
 rail:{cat:"Panel",name:"DIN Rail",symbol:"DIN",pins:0,props:{length:18}},
 wirelabel:{cat:"Panel",name:"Wire Label",symbol:"LBL",pins:1,props:{label:"101"}}
};
const cats=[...new Set(Object.values(defs).map(d=>d.cat))];
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
const svg=$("#canvas"), comps=$("#components"), wires=$("#wires"), labels=$("#labels"), selg=$("#selection"), wrap=$("#canvasWrap");
let search="",cat="All",dragging=null,panStart=null;
function uid(){return "c"+Math.random().toString(36).slice(2,9)}
function snap(v){return Math.round(v/S.grid)*S.grid}
function esc(x){return String(x??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
function log(m){$("#console").textContent+=("\n"+m);$("#console").scrollTop=$("#console").scrollHeight}
function saveHistory(){S.history.push(JSON.stringify({components:S.components,wires:S.wires}));if(S.history.length>30)S.history.shift();S.future=[]}
function restore(s){const x=JSON.parse(s);S.components=x.components;S.wires=x.wires;S.selected=null;render()}
function compDef(t){return defs[t]||defs.resistor}
function addComponent(type,x,y){saveHistory();const d=compDef(type);const c={id:uid(),type,x:snap(x),y:snap(y),rotation:0,props:JSON.parse(JSON.stringify(d.props)),pins:[]};S.components.push(c);S.selected=c.id;render();log("PLACED "+d.name+" "+c.id)}
function posFromEvent(e){const r=svg.getBoundingClientRect();return{x:(e.clientX-r.left-S.pan.x)/S.zoom,y:(e.clientY-r.top-S.pan.y)/S.zoom}}
function pinPos(c,i){const d=compDef(c.type), n=d.pins;const spacing=22; if(n===1)return{x:c.x+38,y:c.y};if(n===2)return{x:c.x+(i?55:-55),y:c.y};if(n===3)return{x:c.x-55+i*55,y:c.y+42};return{x:c.x-55+(i%2)*110,y:c.y+(i<2?-34:34)}}
function symbol(c){const d=compDef(c.type), active=S.running&&["battery","acsource","threephase","lamp","led","motor","heater","buzzer"].includes(c.type);let extra="";
 if(c.type==="switch")extra='<line x1="-25" y1="0" x2="25" y2="-13" class="symbol"/>';
 else if(c.type==="battery"||c.type==="acsource"||c.type==="threephase")extra='<circle r="24" class="source"/><text y="5" text-anchor="middle">'+esc(d.symbol)+'</text>';
 else if(c.type==="ground")extra='<path d="M-20 0H20M-13 7H13M-6 14H6" class="symbol"/>';
 else extra='<rect x="-34" y="-21" width="68" height="42" rx="7" class="body"/><text y="4" text-anchor="middle">'+esc(d.symbol)+'</text>';
 return extra}
function render(){renderPalette();renderCanvas();renderInspector();$("#componentCount").textContent=Object.keys(defs).length;$("#simStatus").textContent=S.running?"RUNNING":"READY";$("#zoomLabel").textContent=Math.round(S.zoom*100)+"%"}
function renderPalette(){const tabs=$("#catTabs");tabs.innerHTML=["All",...cats].map(x=>'<button class="'+(cat===x?"active":"")+'" data-cat="'+esc(x)+'">'+esc(x)+'</button>').join("");$$("[data-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.cat;renderPalette()});
 const list=Object.entries(defs).filter(([k,d])=>(cat==="All"||d.cat===cat)&&(d.name+" "+k).toLowerCase().includes(search.toLowerCase()));
 $("#paletteList").innerHTML=list.map(([k,d])=>'<div class="palette-item" draggable="true" data-type="'+k+'"><span class="sym">'+esc(d.symbol)+'</span><span><b>'+esc(d.name)+'</b><small>'+esc(d.cat)+'</small></span></div>').join("");
 $$(".palette-item").forEach(el=>{el.ondragstart=e=>{e.dataTransfer.setData("text/plain",el.dataset.type)}});
}
function renderCanvas(){comps.innerHTML=S.components.map(c=>{const d=compDef(c.type),pins=Array.from({length:d.pins},(_,i)=>{const p=pinPos(c,i);return '<circle class="pin '+(S.wireStart===c.id+":"+i?"selected":"")+'" data-pin="'+c.id+":"+i+'" cx="'+(p.x-c.x)+'" cy="'+(p.y-c.y)+'" r="4"/>'}).join("");return '<g class="component '+(S.selected===c.id?"selected":"")+'" data-id="'+c.id+'" transform="translate('+c.x+','+c.y+') rotate('+c.rotation+')">'+symbol(c)+'<text y="36" text-anchor="middle">'+esc(d.name)+'</text><text class="value" y="48" text-anchor="middle">'+esc(valueText(c))+'</text>'+pins+'</g>'}).join("");
 wires.innerHTML=S.wires.map((w,i)=>{const a=getPin(w.a),b=getPin(w.b);if(!a||!b)return "";return '<line class="wire '+(S.running&&isLiveWire(w)?"live":"")+'" data-wire="'+i+'" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"/>'}).join("");
 $$("[data-id]").forEach(g=>{g.onmousedown=e=>{if(e.target.classList.contains("pin"))return;S.selected=g.dataset.id;saveHistory();dragging={id:S.selected,start:posFromEvent(e),orig:{...S.components.find(c=>c.id===S.selected)}};renderCanvas();renderInspector();}});
 $$(".pin").forEach(p=>p.onclick=e=>{e.stopPropagation();handlePin(p.dataset.pin)});
 $$("[data-wire]").forEach(w=>w.onclick=e=>{const i=+w.dataset.wire;S.selected=null;renderCanvas();log("WIRE "+i+" selected")});
}
function valueText(c){const p=c.props;if(c.type==="resistor")return (p.resistance||0)+" Ω";if(c.type==="battery"||c.type==="acsource")return (p.voltage||0)+" V";if(c.type==="fuse"||c.type==="breaker")return (p.rating||0)+" A";if(c.type==="switch")return p.closed?"CLOSED":"OPEN";return p.label||""}
function getPin(ref){const [id,ix]=ref.split(":");const c=S.components.find(x=>x.id===id);return c?pinPos(c,+ix):null}
function handlePin(ref){if(!S.wireStart){S.wireStart=ref;renderCanvas();return}if(S.wireStart===ref){S.wireStart=null;renderCanvas();return}saveHistory();S.wires.push({a:S.wireStart,b:ref});log("NET "+S.wires.length+" CONNECTED");S.wireStart=null;renderCanvas()}
function isClosed(c){return c.type!=="switch"||!!c.props.closed}
function resistance(c){const p=c.props;if(c.type==="resistor")return Math.max(.001,+p.resistance||1);if(c.type==="lamp"||c.type==="motor"||c.type==="heater"||c.type==="buzzer")return Math.max(.001,+p.resistance||100);if(c.type==="led"||c.type==="diode"||c.type==="zener")return Math.max(1,+p.resistance||330);if(c.type==="switch")return isClosed(c)?.01:Infinity;if(c.type==="fuse"||c.type==="breaker"||c.type==="rcd")return 0.05;return Infinity}
function solve(){const src=S.components.find(c=>c.type==="battery"||c.type==="acsource");if(!src)return {voltage:0,current:0,loads:[]};const active=S.components.filter(c=>["resistor","lamp","led","motor","heater","buzzer","diode","zener","switch","fuse","breaker","rcd"].includes(c.type)&&isClosed(c));const adj=new Map();S.wires.forEach(w=>{const [a]=w.a.split(":"),[b]=w.b.split(":");if(!adj.has(a))adj.set(a,[]);if(!adj.has(b))adj.set(b,[]);adj.get(a).push(b);adj.get(b).push(a)});
 const srcPins=S.wires.filter(w=>w.a.startsWith(src.id+":")||w.b.startsWith(src.id+":"));if(srcPins.length<2)return {voltage:+src.props.voltage||0,current:0,loads:[]};
 const nodes=new Map();let n=0;function nodeOf(pin){const [id]=pin.split(":");if(!nodes.has(id))nodes.set(id,n++);return nodes.get(id)}
 S.wires.forEach(w=>{nodeOf(w.a);nodeOf(w.b)});let plus=null,minus=null;for(const w of S.wires){if(w.a.startsWith(src.id+":0"))plus=nodeOf(w.b);if(w.b.startsWith(src.id+":0"))plus=nodeOf(w.a);if(w.a.startsWith(src.id+":1"))minus=nodeOf(w.b);if(w.b.startsWith(src.id+":1"))minus=nodeOf(w.a)}if(plus===null||minus===null)return {voltage:+src.props.voltage||0,current:0,loads:[]};
 const V=+src.props.voltage||12;const R=[];for(const c of active){const ps=S.wires.filter(w=>w.a.startsWith(c.id+":")||w.b.startsWith(c.id+":"));if(ps.length<2)continue;const na=ps[0].a.startsWith(c.id)?nodeOf(ps[0].b):nodeOf(ps[0].a);const nb=ps[1].a.startsWith(c.id)?nodeOf(ps[1].b):nodeOf(ps[1].a);R.push({c,na,nb,r:resistance(c)})}
 let series=0;for(const x of R)series+=x.r;const current=series>0?V/series:0;return {voltage:V,current,loads:R.map(x=>({id:x.c.id,name:compDef(x.c.type).name,current:current,resistance:x.r}))}
}
function run(){S.running=true;const r=solve();$("#meterReadout").textContent=r.current.toFixed(3)+" A";$("#console").textContent="RUN simulation\nSource: "+r.voltage+" V\nTotal current: "+r.current.toFixed(3)+" A\n";r.loads.forEach(x=>$("#console").textContent+=x.name+" "+x.resistance+" Ω · "+x.current.toFixed(3)+" A\n");renderCanvas();$("#simStatus").textContent="RUNNING"}
function stop(){S.running=false;$("#simStatus").textContent="READY";renderCanvas()}
function renderInspector(){const c=S.components.find(x=>x.id===S.selected);if(!c){$("#inspectorBody").innerHTML='<div class="empty">Select a component to inspect it.<br><br>Tip: use double-click or click a component and edit its properties here.</div>';return}const d=compDef(c.type);const fields=Object.entries(c.props).map(([k,v])=>'<div class="prop"><label>'+esc(k)+'</label><input data-prop="'+esc(k)+'" value="'+esc(v)+'"></div>').join("");$("#inspectorBody").innerHTML='<div class="prop"><label>Component</label><input value="'+esc(d.name)+'" disabled></div>'+fields+'<div class="prop-row"><button class="ins-btn" id="rotateBtn">Rotate</button><button class="ins-btn" id="duplicateBtn">Duplicate</button></div><button class="ins-btn" id="removeBtn" style="margin-top:7px;color:#ff8c96">Delete component</button>';
 $$("[data-prop]").forEach(i=>i.onchange=()=>{saveHistory();c.props[i.dataset.prop]=isNaN(i.value)?i.value:+i.value;render()});$("#rotateBtn").onclick=()=>{saveHistory();c.rotation=(c.rotation+90)%360;render()};$("#duplicateBtn").onclick=()=>{saveHistory();const n={...JSON.parse(JSON.stringify(c)),id:uid(),x:c.x+S.grid,y:c.y+S.grid};S.components.push(n);S.selected=n.id;render()};$("#removeBtn").onclick=()=>{saveHistory();S.components=S.components.filter(x=>x.id!==c.id);S.wires=S.wires.filter(w=>!w.a.startsWith(c.id+":")&&!w.b.startsWith(c.id+":"));S.selected=null;render()};
}
function clearProject(){saveHistory();S.components=[];S.wires=[];S.selected=null;stop();render()}
function demoMotor(){saveHistory();S.components=[];S.wires=[];const add=(type,x,y,props={})=>{const d=compDef(type),c={id:uid(),type,x,y,rotation:0,props:{...JSON.parse(JSON.stringify(d.props)),...props},pins:[]};S.components.push(c);return c};const v=add("threephase",170,260,{voltage:400}),k=add("contactor",380,260,{closed:1}),m=add("motor",600,260,{resistance:32}),pe=add("ground",600,380);S.wires=[{a:v.id+":0",b:k.id+":0"},{a:k.id+":1",b:m.id+":0"},{a:m.id+":1",b:v.id+":1"}];S.selected=m.id;render();log("MOTOR STARTER demo loaded: 3-phase source → contactor → motor.");run()}
function demoLogic(){saveHistory();S.components=[];S.wires=[];const add=(type,x,y)=>{const d=compDef(type),c={id:uid(),type,x,y,rotation:0,props:JSON.parse(JSON.stringify(d.props)),pins:[]};S.components.push(c);return c};const a=add("gpio",180,220),b=add("gpio",180,320),g=add("logic_and",380,270),o=add("gpio",580,270);S.wires=[{a:a.id+":0",b:g.id+":0"},{a:b.id+":0",b:g.id+":1"},{a:g.id+":2",b:o.id+":0"}];S.selected=g.id;render();log("LOGIC LAB demo loaded: GPIO + GPIO → AND → GPIO.");}
function exportSVG(){const clone=svg.cloneNode(true);clone.querySelectorAll("#gridRect").forEach(x=>x.remove());clone.setAttribute("xmlns","http://www.w3.org/2000/svg");const data=new XMLSerializer().serializeToString(clone);download("voltpro-schematic.svg",data,"image/svg+xml")}
function serialize(){return JSON.stringify({format:"voltpro",version:1,metadata:{name:"VoltPRo project",created:new Date().toISOString()},mode:S.mode,components:S.components,wires:S.wires,simulation:{running:false}},null,2)}
function download(name,data,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function loadProject(data){const x=JSON.parse(data);if(x.format!=="voltpro")throw Error("Not a .voltpro project");S.components=x.components||[];S.wires=x.wires||[];S.mode=x.mode||"schematic";S.selected=null;render()}
svg.addEventListener("dragover",e=>e.preventDefault());svg.addEventListener("drop",e=>{e.preventDefault();const t=e.dataTransfer.getData("text/plain");if(t){const p=posFromEvent(e);addComponent(t,p.x,p.y)}});svg.addEventListener("mousemove",e=>{if(!dragging)return;const p=posFromEvent(e),c=S.components.find(x=>x.id===dragging.id);if(c){c.x=snap(dragging.orig.x+(p.x-dragging.start.x));c.y=snap(dragging.orig.y+(p.y-dragging.start.y));renderCanvas();}});
window.addEventListener("mouseup",()=>{if(dragging){dragging=null;render()}});svg.addEventListener("wheel",e=>{e.preventDefault();S.zoom=Math.max(.35,Math.min(2.5,S.zoom*(e.deltaY<0?1.1:.9)));render()},{passive:false});
$("#componentSearch").oninput=e=>{search=e.target.value;renderPalette()};$("#runBtn").onclick=run;$("#stopBtn").onclick=stop;$("#newBtn").onclick=()=>{if(confirm("Start a new project?")){saveHistory();S.components=[];S.wires=[];S.selected=null;render();}};$("#saveBtn").onclick=()=>{localStorage.setItem("voltpro-project",serialize());toast("Project saved locally")};$("#loadBtn").onclick=()=>$("#fileInput").click();$("#fileInput").onchange=e=>{const f=e.target.files[0];if(f)f.text().then(loadProject).catch(x=>alert(x.message))};$("#exportBtn").onclick=()=>download("voltpro-project.voltpro",serialize(),"application/json");$("#deleteBtn").onclick=()=>{if(S.selected)$("#removeBtn").click()};$("#wireBtn").onclick=()=>{$("#canvas").style.cursor="crosshair";S.wireStart=null};$("#undoBtn").onclick=()=>{if(S.history.length){S.future.push(JSON.stringify({components:S.components,wires:S.wires}));restore(S.history.pop())}};$("#redoBtn").onclick=()=>{if(S.future.length){S.history.push(JSON.stringify({components:S.components,wires:S.wires}));restore(S.future.pop())}};$("#fitBtn").onclick=()=>{S.zoom=1;S.pan={x:0,y:0};render()};$("#zoomIn").onclick=()=>{S.zoom=Math.min(2.5,S.zoom*1.15);render()};$("#zoomOut").onclick=()=>{S.zoom=Math.max(.35,S.zoom/1.15);render()};
$$("[data-meter]").forEach(b=>b.onclick=()=>{S.meter=b.dataset.meter;const r=solve();$("#meterReadout").textContent=S.meter==="voltage"?r.voltage.toFixed(2)+" V":S.meter==="current"?r.current.toFixed(3)+" A":S.meter==="resistance"?(r.current?(r.voltage/r.current).toFixed(1):"∞")+" Ω":(r.current?"PASS":"OPEN")});
$$(".mode").forEach(b=>b.onclick=()=>{$$(".mode").forEach(x=>x.classList.remove("active"));b.classList.add("active");S.mode=b.dataset.mode;$("#engineInfo").textContent=b.dataset.mode==="micro"?"Microcontroller workspace · local educational engine":b.dataset.mode==="panel"?"Panel planning workspace · local educational engine":"DC educational engine · local-only"});
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("voltpro-theme",document.body.classList.contains("light")?"light":"dark")};
function toast(m){const t=document.createElement("div");t.textContent=m;t.style="position:fixed;right:18px;bottom:45px;background:#12314a;border:1px solid #39647f;color:white;padding:9px 13px;border-radius:8px;z-index:99;font-size:11px";document.body.append(t);setTimeout(()=>t.remove(),1600)}
window.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();$("#undoBtn").click()}if((e.ctrlKey||e.metaKey)&&e.key==="s"){e.preventDefault();$("#saveBtn").click()}if(e.key==="Delete")$("#deleteBtn").click();});
render();log("Component registry: "+Object.keys(defs).length+" active simulation components.");
})();