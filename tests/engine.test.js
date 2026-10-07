const test=require("node:test");const assert=require("node:assert/strict");const fs=require("node:fs");const vm=require("node:vm");
const source=fs.readFileSync("engine/voltpro-engine.js","utf8");
function engine(){const ctx={window:{},console,Date};vm.createContext(ctx);vm.runInContext(source,ctx);return ctx.window.VoltProEngine}
test("DC engine solves a 12V/1kΩ circuit",()=>{const e=engine();const p={components:[
{id:"v1",type:"battery",props:{voltage:12},pins:["v1:0","v1:1"]},
{id:"r1",type:"resistor",props:{resistance:1000},pins:["r1:0","r1:1"]}],wires:[
{a:"v1:0",b:"r1:0"},{a:"r1:1",b:"v1:1"}]};
const a=e.dc(p);assert.equal(a.ok,true);assert.ok(Math.abs(a.totalCurrent-0.012)<1e-9);assert.ok(Math.abs(a.totalPower-0.144)<1e-6)});
test("engine exposes transient and AC contracts",()=>{const e=engine();assert.equal(typeof e.transient,"function");assert.equal(typeof e.ac,"function");assert.equal(typeof e.analyze,"function")});
test("component model schema and challenge files parse",()=>{for(const f of ["data/component-models.v3.json","data/component-schema.json","data/challenges.json","data/tutorials.json","data/faults.json"])JSON.parse(fs.readFileSync(f,"utf8"))});
test("analysis is deterministic for identical inputs",()=>{const a={components:[{id:"v",type:"battery",pins:["v:0","v:1"],props:{voltage:12}},{id:"r",type:"resistor",pins:["r:0","r:1"],props:{resistance:1000}}],wires:[{a:"v:0",b:"r:0"},{a:"r:1",b:"v:1"}]};const x=JSON.stringify(engine().analyze(a)),y=JSON.stringify(engine().analyze(a));assert.equal(x,y)});


test("AC forwards ground reference",()=>{
 const project={components:[{id:"B1",type:"battery",pins:["B1:1","B1:2"],props:{voltage:12}},{id:"R1",type:"resistor",pins:["R1:1","R1:2"],props:{resistance:1000}}],wires:[{a:"B1:1",b:"R1:1"},{a:"R1:2",b:"B1:2"}]};
 const out=engine().analyze(project,{groundRef:"B1:2",ac:{frequency:50,groundRef:"B1:2"}});
 assert.equal(out.ac.ok,true);
});
