(()=>{"use strict";
const manifestUrl="components/index.json";
let records=new Map();
let ready=null;
const slug=x=>String(x||"").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase();
function defaults(parameters){const o={};for(const [k,v] of Object.entries(parameters||{}))o[k]=v&&Object.prototype.hasOwnProperty.call(v,"default")?v.default:"";return o}
function toDef(r){return {cat:String(r.category||"Other"),name:r.name||r.id,symbol:r.symbol?.label||"◇",pins:Array.isArray(r.terminals)?r.terminals.length:2,props:defaults(r.parameters),unit:"",res:typeof r.parameters?.resistance?.default==="number"?r.parameters.resistance.default:undefined,registryId:r.id,model:r.electricalModel,behavior:r.behaviorModel}}
async function load(){
 if(ready)return ready;
 ready=(async()=>{try{
  const m=await fetch(manifestUrl,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("component manifest unavailable");return r.json()});
  const chunks=await Promise.all((m.files||[]).map(f=>fetch(f,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("component family unavailable: "+f);return r.json()})));
  for(const chunk of chunks)for(const r of chunk.components||[]){records.set(r.id,r);if(window.defs&&!window.defs[r.id])window.defs[r.id]=toDef(r)}
  window.VoltProRegistry={version:2,records,count:records.size,get:id=>records.get(id),definition:id=>records.get(id)?toDef(records.get(id)):null,search:(q="")=>[...records.values()].filter(r=>(r.name+" "+r.id+" "+r.category).toLowerCase().includes(q.toLowerCase())),ready:Promise.resolve()};
  window.dispatchEvent(new CustomEvent("voltpro-registry-ready",{detail:{count:records.size}}));
  return records;
 }catch(e){window.VoltProRegistry={version:2,records,count:0,get:()=>null,definition:()=>null,search:()=>[],ready:Promise.resolve()};console.warn("VoltPRo component registry:",e.message);return records}})();
 return ready;
}
window.VoltProRegistry={version:2,records,count:0,ready:load()};
})();