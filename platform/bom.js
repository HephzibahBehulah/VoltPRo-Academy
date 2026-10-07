(()=>{"use strict";
function build(project,library=[]){const counts=new Map();(project.components||[]).forEach(c=>{const key=c.type+"|"+JSON.stringify(c.props||{});counts.set(key,(counts.get(key)||0)+1)});return [...counts].map(([k,qty])=>{const [type,props]=k.split("|");const d=library.find(x=>x.id===type||x.type===type);return {reference:type,description:d?.name||type,quantity:qty,properties:props}})}
function csv(rows){const head="Reference,Description,Quantity,Properties";return [head,...rows.map(r=>[r.reference,r.description,r.quantity,r.properties].map(x=>'"'+String(x).replaceAll('"','""')+'"').join(","))].join("\n")}
window.VoltProBOM={build,csv};
})();