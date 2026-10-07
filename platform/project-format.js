(()=>{"use strict";
const CURRENT=4;
function normalize(p={}){return {format:"voltpro",version:CURRENT,metadata:{name:"Untitled Circuit",author:"",created:new Date().toISOString(),updated:new Date().toISOString(),standards:["IEC 60617","IEC 81346","IEC 60417"]},settings:{grid:20,units:"SI",symbolStandard:"IEC",theme:"dark"},components:Array.isArray(p.components)?p.components:[],wires:Array.isArray(p.wires)?p.wires:[],panel:p.panel||{rails:[],items:[],width:600,height:400},firmware:p.firmware||{target:null,language:"arduino-cpp",code:""},faults:p.faults||[],history:[]}}
function encode(p){return JSON.stringify(normalize(p),null,2)}
function decode(s){const p=typeof s==="string"?JSON.parse(s):s;if(!p||typeof p!=="object")throw Error("Invalid .voltpro project");return normalize(p)}
function migrate(p){const raw=typeof p==="string"?JSON.parse(p):p;const old=raw?.version??CURRENT;const x=decode(p);if(old<CURRENT){x.metadata=x.metadata||{};x.metadata.migratedFrom=old}return x}
window.VoltProProject={CURRENT,normalize,encode,decode,migrate};
})();