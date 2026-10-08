(()=>{'use strict';
function bom(p){const m=new Map();for(const d of p.devices||[]){const key=d.type||'unknown';m.set(key,(m.get(key)||0)+1)}return Array.from(m.entries()).map(([type,quantity])=>({type,quantity}))}
function wireSchedule(p){return (p.wires||[]).map(w=>({number:w.number||w.id,from:w.from,to:w.to,crossSection:w.crossSection||null,colour:w.colour||null,domain:w.domain||null,phase:w.phase||null}))}
function terminalSchedule(p){return (p.devices||[]).flatMap(d=>(d.terminals||[]).map(t=>({device:d.ref||d.id,terminal:t.number||t.label||t.id,net:null}))) }
window.VoltProSchedules={bom,wireSchedule,terminalSchedule};
})();