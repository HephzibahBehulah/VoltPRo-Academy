(()=>{"use strict";
const MODULE=18,WIDTH=600,HEIGHT=400;
function layout(items=[],opts={}){const width=opts.width||WIDTH;return items.map((x,i)=>({...x,position:Math.max(0,Math.min(width-MODULE,(x.position??i*MODULE))),width:x.width||MODULE}))}
function validate(items=[],rails=[{id:"R1",length:18}]){const errors=[],occupied=new Map();for(const x of items){const start=Math.round(x.position||0),modules=Math.max(1,Math.ceil((x.width||MODULE)/MODULE));for(let m=0;m<modules;m++){const slot=Math.floor(start/MODULE)+m;if(occupied.has(slot))errors.push("Overlap at module "+(slot+1));else occupied.set(slot,x.id)}}const max=(rails[0]?.length||18)*MODULE;for(const x of items)if((x.position||0)+(x.width||MODULE)>max)errors.push(x.id+" exceeds rail length");return {valid:errors.length===0,errors,modules:occupied.size}}
function dinRail(length=18){return {standard:"TS 35 / DIN rail",length,unit:"modules",moduleWidth:MODULE}}
window.VoltProPanel={layout,validate,dinRail};
})();