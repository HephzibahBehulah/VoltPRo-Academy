const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const source=fs.readFileSync("platform/panel.js","utf8");
function panelApi(){const ctx={window:{},structuredClone:global.structuredClone,Math,Number,String,Array,Map,Set,Error};vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.window.VoltProPanel}
test("panel model creates an enclosure and DIN rail defaults",()=>{const api=panelApi(),p=api.create();assert.equal(p.rails.length,1);assert.equal(p.rails[0].id,"R1");assert.equal(p.rails[0].length,18);assert.equal(p.enclosure.ipRating,"IP40")});
test("panel device placement, repositioning and removal work",()=>{const api=panelApi(),p=api.create();api.place(p,{id:"P1",type:"breaker",label:"QF1",railId:"R1",position:0,width:36});api.move(p,"P1",{position:36});assert.equal(p.items[0].position,36);api.remove(p,"P1");assert.equal(p.items.length,0)});
test("layout validation reports overlaps, duplicate IDs and rail overflow",()=>{const api=panelApi(),p=api.create();api.place(p,{id:"P1",type:"breaker",label:"QF1",railId:"R1",position:0,width:36});p.items.push({id:"P2",type:"relay",label:"K1",railId:"R1",position:18,width:36});p.items.push({id:"P2",type:"relay",label:"K2",railId:"R1",position:324,width:36});const result=api.validate(p);assert.equal(result.valid,false);assert.ok(result.errors.some(x=>x.includes("Overlap")));assert.ok(result.errors.some(x=>x.includes("Duplicate placement ID")));assert.ok(result.errors.some(x=>x.includes("exceeds")))});
test("panel-only accessories are identified as warnings, not electrical components",()=>{const api=panelApi(),p=api.create();api.place(p,{id:"P1",type:"terminal-strip",label:"X1 terminal strip",railId:"R1",position:0,width:36,kind:"accessory"});const r=api.validate(p);assert.equal(r.valid,true);assert.ok(r.warnings.some(x=>x.includes("panel-only")));assert.equal(r.deviceCount,0)});
test("additional rails have unique IDs and can hold more placements",()=>{const api=panelApi(),p=api.create();api.addRail(p,{id:"R2",length:24});assert.equal(p.rails.length,2);assert.throws(()=>api.addRail(p,{id:"R2",length:18}),/Duplicate rail id/)});
