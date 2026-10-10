const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const T = require("../src/core/terminal-graph.js");

function runtime(defs = {}) {
  const window = { VoltProTerminalGraph: T, defs };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../platform/v5-runtime.js"), "utf8"), {
    window, structuredClone, Map, String, Number, Array, Boolean, Object
  });
  return window.VoltProV5Runtime;
}

test("legacy numeric pins adapt to stable model terminal IDs", () => {
  const result = runtime({resistor:{pins:2}}).adapt({
    components:[{id:"R1",type:"resistor",x:0,y:0},{id:"R2",type:"resistor",x:100,y:0}],
    wires:[{a:"R1:0",b:"R2:1"}]
  });
  assert.equal(JSON.stringify(result.devices[0].terminals.map(t=>t.id)),JSON.stringify(["1","2"]));
  assert.equal(result.wires[0].from,"R1:1");
  assert.equal(result.wires[0].to,"R2:2");
  assert.equal(result.wires[0].domain,"dc");
  assert.equal(T.build(result).validateTopology().valid,true);
});

test("three-phase source and three-pole breaker adapt to phase-labelled terminals", () => {
  const result = runtime({ "circuit-breaker-3p":{pins:6}, threephase:{pins:3} }).adapt({
    components:[
      {id:"PS1",type:"threephase",x:0,y:0},
      {id:"QF1",type:"circuit-breaker-3p",x:100,y:0}
    ],
    wires:[{a:"PS1:0",b:"QF1:0"},{a:"PS1:1",b:"QF1:1"},{a:"PS1:2",b:"QF1:2"}]
  });
  assert.equal(JSON.stringify(result.devices[0].terminals.map(t=>t.id)),JSON.stringify(["L1","L2","L3"]));
  assert.equal(JSON.stringify(result.devices[1].terminals.map(t=>t.id)),JSON.stringify(["L1","L2","L3","T1","T2","T3"]));
  assert.equal(JSON.stringify(result.wires.map(w=>[w.from,w.to,w.domain])),JSON.stringify([
    ["PS1:L1","QF1:L1","ac3"],
    ["PS1:L2","QF1:L2","ac3"],
    ["PS1:L3","QF1:L3","ac3"]
  ]));
  const topology=T.build(result).validateTopology();
  assert.equal(topology.valid,true,JSON.stringify(topology.errors));
});
