/* VoltPRo terminal engine.
 * Pure topology/model layer: no SVG, DOM, or renderer dependency.
 * The legacy build()/endpoint() entry points remain compatible.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.VoltProTerminalGraph = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
  const validId = value => typeof value === "string" && /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(value);
  const validLocalId = value => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(value);
  const DOMAINS = new Set(["dc","ac","ac1","ac3","three-phase","three_phase","control","signal","logic","digital","analog","data","ground","pneumatic","hydraulic","mechanical","thermal","optical","unknown"]);
  const key = (deviceId, terminalId) => {
    if (!validId(deviceId)) throw new Error("Invalid device id: " + deviceId);
    if (!validLocalId(String(terminalId))) throw new Error("Invalid terminal id: " + terminalId);
    return deviceId + ":" + terminalId;
  };
  const terminal = (id, label, x, y, extra = {}) => ({
    id, label: label || id, number: extra.number == null ? null : String(extra.number),
    type: extra.type || "electrical", domain: extra.domain || "dc",
    position: { x, y }, direction: extra.direction || "passive",
    phase: extra.phase ?? null, polarity: extra.polarity ?? null,
    electrical: clone(extra.electrical || {}), metadata: clone(extra.metadata || {})
  });
  const path = (id, from, to, kind, extra = {}) => ({ id, from, to, kind, ...clone(extra) });

  // Device terminals and internal paths are model data, never inferred from SVG pin counts.
  const DEFINITIONS = {
    resistor: { terminals:[terminal("1","1",-20,0,{number:"1"}),terminal("2","2",20,0,{number:"2"})], paths:[path("resistance","1","2","resistive")] },
    lamp: { terminals:[terminal("1","L",-20,0,{direction:"input"}),terminal("2","N",20,0,{direction:"output"})], paths:[path("lamp-load","1","2","load")] },
    switch: { terminals:[terminal("1","1",-20,0),terminal("2","2",20,0)], paths:[path("switch-contact","1","2","switchable",{stateKey:"closed"})] },
    "pushbutton-no": { terminals:[terminal("13","13",-20,0,{number:"13"}),terminal("14","14",20,0,{number:"14"})], paths:[path("no-contact","13","14","switchable",{stateKey:"pressed",closedWhen:true})] },
    "pushbutton-nc": { terminals:[terminal("21","21",-20,0,{number:"21"}),terminal("22","22",20,0,{number:"22"})], paths:[path("nc-contact","21","22","switchable",{stateKey:"pressed",closedWhen:false})] },
    fuse: { terminals:[terminal("1","1",-20,0),terminal("2","2",20,0)], paths:[path("fuse-link","1","2","protective",{stateKey:"intact"})] },
    "circuit-breaker": { terminals:[terminal("1","LINE",-20,0),terminal("2","LOAD",20,0)], paths:[path("breaker-contact","1","2","switchable",{stateKey:"closed"})] },
    contactor: { terminals:[
      terminal("A1","A1",-24,-22,{domain:"control",direction:"input"}),terminal("A2","A2",24,-22,{domain:"control",direction:"output"}),
      terminal("L1","L1",-24,-6,{number:"1"}),terminal("T1","T1",24,-6,{number:"2"}),
      terminal("L2","L2",-24,6,{number:"3"}),terminal("T2","T2",24,6,{number:"4"}),
      terminal("L3","L3",-24,18,{number:"5"}),terminal("T3","T3",24,18,{number:"6"}),
      terminal("13","13",-24,30,{number:"13",domain:"control"}),terminal("14","14",24,30,{number:"14",domain:"control"}),
      terminal("21","21",-24,42,{number:"21",domain:"control"}),terminal("22","22",24,42,{number:"22",domain:"control"})
    ], paths:[
      path("coil","A1","A2","coil",{domain:"control"}),
      path("main-1","L1","T1","switchable",{stateKey:"energized",closedWhen:true}),
      path("main-2","L2","T2","switchable",{stateKey:"energized",closedWhen:true}),
      path("main-3","L3","T3","switchable",{stateKey:"energized",closedWhen:true}),
      path("aux-no-13-14","13","14","switchable",{stateKey:"energized",closedWhen:true,domain:"control"}),
      path("aux-nc-21-22","21","22","switchable",{stateKey:"energized",closedWhen:false,domain:"control"})
    ]},
    relay: { terminals:[
      terminal("A1","A1",-24,-12,{domain:"control"}),terminal("A2","A2",24,-12,{domain:"control"}),
      terminal("11","11",-24,0,{domain:"control"}),terminal("12","12",24,0,{domain:"control"}),terminal("14","14",24,12,{domain:"control"}),
      terminal("21","21",-24,24,{domain:"control"}),terminal("22","22",24,24,{domain:"control"}),terminal("24","24",24,36,{domain:"control"})
    ], paths:[path("coil","A1","A2","coil",{domain:"control"}),path("changeover-1-nc","11","12","switchable",{stateKey:"energized",closedWhen:false,domain:"control"}),path("changeover-1-no","11","14","switchable",{stateKey:"energized",closedWhen:true,domain:"control"}),path("changeover-2-nc","21","22","switchable",{stateKey:"energized",closedWhen:false,domain:"control"}),path("changeover-2-no","21","24","switchable",{stateKey:"energized",closedWhen:true,domain:"control"})] },
    motor: { terminals:["U1","V1","W1","U2","V2","W2","PE"].map((id,i)=>terminal(id,id,i%2?-20:20,Math.floor(i/2)*14-21,{domain:id==="PE"?"ground":"ac3",phase:({U1:"L1",V1:"L2",W1:"L3",U2:"L1",V2:"L2",W2:"L3"})[id]||null,polarity:id==="PE"?"protective-earth":null})), paths:[path("phase-U","U1","U2","motor-winding",{phase:"L1"}),path("phase-V","V1","V2","motor-winding",{phase:"L2"}),path("phase-W","W1","W2","motor-winding",{phase:"L3"})] },
    transformer: { terminals:[terminal("P1","P1",-24,-12,{domain:"ac"}),terminal("P2","P2",-24,12,{domain:"ac"}),terminal("S1","S1",24,-12,{domain:"ac"}),terminal("S2","S2",24,12,{domain:"ac"})], paths:[path("primary","P1","P2","transformer-winding"),path("secondary","S1","S2","transformer-winding")] },
    "terminal-block": { terminals:[terminal("1","1",-20,0),terminal("2","2",20,0)], paths:[path("through-terminal","1","2","passive")] },
    sensor: { terminals:[terminal("V+","V+",-20,-12,{domain:"control",polarity:"positive"}),terminal("0V","0V",-20,12,{domain:"ground",polarity:"negative"}),terminal("OUT","OUT",20,0,{domain:"signal",direction:"output"})], paths:[] },
    "plc-input": { terminals:[terminal("COM","COM",-20,0,{domain:"control"}),terminal("I0","I0",20,0,{domain:"digital",direction:"input"})], paths:[] },
    "plc-output": { terminals:[terminal("COM","COM",-20,0,{domain:"control"}),terminal("Q0","Q0",20,0,{domain:"digital",direction:"output"})], paths:[] },
    "measurement-instrument": { terminals:[terminal("COM","COM",-20,0,{domain:"dc",polarity:"negative"}),terminal("V","V",20,0,{domain:"dc",polarity:"positive"}),terminal("A","A",0,20,{domain:"dc"})], paths:[] },
    battery: { terminals:[terminal("PLUS","+",-20,0,{polarity:"positive"}),terminal("MINUS","−",20,0,{polarity:"negative"})], paths:[path("source","PLUS","MINUS","voltage-source")] }
  };

  function definitionFor(type) {
    const normalized = String(type || "").toLowerCase().replace(/[_ ]+/g,"-");
    const aliases = { pushbutton:"pushbutton-no", contactor3p:"contactor", motor3phase:"motor", "circuitbreaker":"circuit-breaker", "terminalblock":"terminal-block", "plc-input-module":"plc-input", "plc-output-module":"plc-output", sensor:"sensor", lamp:"lamp", voltmeter:"measurement-instrument", ammeter:"measurement-instrument", multimeter:"measurement-instrument" };
    const def = DEFINITIONS[aliases[normalized] || normalized];
    return def ? clone(def) : null;
  }
  function localTerminalDefinitions(device) {
    const explicit = Array.isArray(device.terminals) && device.terminals.length ? device.terminals : null;
    const definition = definitionFor(device.type);
    const base = explicit || definition?.terminals;
    if (!base) throw new Error("No explicit terminal definition for device type '" + device.type + "'");
    return base.map((t,i) => {
      const id = String(t.id ?? t.terminalId ?? i);
      const template = definition?.terminals?.find(item => String(item.id) === id) || {};
      const pos = t.position || t.localPosition || template.position || {};
      return { id, label:String(t.label ?? t.name ?? template.label ?? id), number:t.number == null ? (template.number ?? null) : String(t.number),
        type:t.type || template.type || "electrical", domain:t.domain || template.domain || "dc",
        position:{x:Number(pos.x ?? t.x ?? 0),y:Number(pos.y ?? t.y ?? 0)},
        direction:t.direction || t.connectionDirection || template.direction || "passive", phase:t.phase ?? template.phase ?? null, polarity:t.polarity ?? template.polarity ?? null,
        electrical:clone(t.electrical || template.electrical || {}), metadata:clone(t.metadata || template.metadata || {}) };
    });
  }
  function terminalPosition(device, t) {
    const p = t.position || t.localPosition || {x:0,y:0};
    const angle = (Number(device.rotation) || 0) * Math.PI / 180;
    const c = Math.cos(angle), s = Math.sin(angle);
    return { x:Number(device.position?.x || 0) + Number(p.x || 0)*c - Number(p.y || 0)*s,
      y:Number(device.position?.y || 0) + Number(p.x || 0)*s + Number(p.y || 0)*c };
  }
  function compatibility(a,b,wire={}) {
    const errors = [];
    if (!a || !b) errors.push({code:"TERMINAL_NOT_FOUND",message:"Both wire endpoints must resolve to terminals"});
    else {
      if (a.id === b.id) errors.push({code:"SAME_TERMINAL",message:"A wire must connect two distinct terminals"});
      if (a.domain !== b.domain) errors.push({code:"DOMAIN_MISMATCH",message:"Terminal domains do not match: "+a.domain+" / "+b.domain});
      if (wire.domain && wire.domain !== a.domain) errors.push({code:"WIRE_DOMAIN_MISMATCH",message:"Wire domain does not match terminal domain"});
      const types = new Set([a.type,b.type]);
      if ((types.has("mechanical") && types.has("electrical")) || (types.has("optical") && types.has("electrical"))) errors.push({code:"TERMINAL_TYPE_MISMATCH",message:"Incompatible terminal types"});
      if (a.polarity && b.polarity && a.polarity !== b.polarity && !wire.allowPolarityReversal) errors.push({code:"POLARITY_MISMATCH",message:"Terminal polarity mismatch"});
      if (a.direction === "input" && b.direction === "input" && a.domain !== "dc" && a.domain !== "ac") errors.push({code:"DIRECTION_MISMATCH",message:"Two input-only terminals cannot be connected"});
    }
    return {valid:errors.length===0,errors};
  }

  class TerminalEngine {
    constructor(project = {devices:[],wires:[]}, options = {}) {
      this.project = project;
      this.definitions = options.definitions || DEFINITIONS;
      this.terminals = new Map();
      this.devicesById = new Map();
      this.errors = [];
      this.rebuild();
    }
    rebuild() {
      this.terminals.clear(); this.devicesById.clear(); this.errors = [];
      const devices = this.project.devices || this.project.components || [];
      for (const device of devices) {
        if (!device || !validId(device.id)) { this.errors.push({code:"DEVICE_ID_INVALID",deviceId:device?.id}); continue; }
        if (this.devicesById.has(device.id)) { this.errors.push({code:"DUPLICATE_DEVICE",deviceId:device.id}); continue; }
        this.devicesById.set(device.id,device);
        let specs;
        try { specs = localTerminalDefinitions(device); }
        catch (e) { this.errors.push({code:"TERMINAL_DEFINITION_MISSING",deviceId:device.id,message:e.message}); continue; }
        const locals = new Set();
        for (const spec of specs) {
          if (!validLocalId(spec.id)) { this.errors.push({code:"TERMINAL_ID_INVALID",deviceId:device.id,terminalId:spec.id}); continue; }
          if (locals.has(spec.id)) { this.errors.push({code:"DUPLICATE_TERMINAL",deviceId:device.id,terminalId:spec.id}); continue; }
          locals.add(spec.id);
          if (!DOMAINS.has(spec.domain)) { this.errors.push({code:"DOMAIN_INVALID",deviceId:device.id,terminalId:spec.id,domain:spec.domain}); continue; }
          const id = key(device.id,spec.id);
          this.terminals.set(id,{...spec,id,deviceId:device.id,device,worldPosition:terminalPosition(device,spec),connectionStatus:"unconnected"});
        }
      }
      this._refreshConnections();
      return this;
    }
    registerTerminal(deviceId, spec) {
      const device=this.devicesById.get(deviceId);
      if (!device) throw new Error("Unknown owning device: "+deviceId);
      const id=key(deviceId,String(spec.id));
      if (this.terminals.has(id)) throw new Error("Duplicate terminal id: "+id);
      const normalized=localTerminalDefinitions({id:deviceId,type:device.type,terminals:[spec]})[0];
      this.terminals.set(id,{...normalized,id,deviceId,device,worldPosition:terminalPosition(device,normalized),connectionStatus:"unconnected"});
      this._refreshConnections();
      return this.terminals.get(id);
    }
    resolveTerminal(id, localId) { return this.terminals.get(localId === undefined ? String(id) : key(id,String(localId))) || null; }
    resolve(id, localId) { return this.resolveTerminal(id,localId); }
    terminalPosition(id) { const t=this.resolveTerminal(id); return t ? {...t.worldPosition} : null; }
    terminalsForDevice(deviceId) { return Array.from(this.terminals.values()).filter(t=>t.deviceId===deviceId); }
    findConnectedWires(id) { return (this.project.wires||[]).filter(w=>w.from===id||w.to===id||w.a===id||w.b===id); }
    _refreshConnections() {
      for (const t of this.terminals.values()) t.connectionStatus=this.findConnectedWires(t.id).length ? "connected" : "unconnected";
    }
    findConnectedNets(id) {
      const terminal=this.resolveTerminal(id); if(!terminal) return [];
      const parent=new Map(), find=x=>{if(!parent.has(x))parent.set(x,x);if(parent.get(x)!==x)parent.set(x,find(parent.get(x)));return parent.get(x)};
      for(const t of this.terminals.keys())find(t);
      for(const w of this.project.wires||[]) { const a=w.from||w.a,b=w.to||w.b;if(this.terminals.has(a)&&this.terminals.has(b)){const ra=find(a),rb=find(b);if(ra!==rb){if(ra<rb)parent.set(rb,ra);else parent.set(ra,rb)}}}
      const root=find(terminal.id); return Array.from(this.terminals.keys()).filter(k=>find(k)===root).sort();
    }
    validateConnection(fromId,toId,wire={}) { return compatibility(this.resolveTerminal(fromId),this.resolveTerminal(toId),wire); }
    validateTopology() {
      const errors=this.errors.slice(), wires=this.project.wires||[], wireIds=new Set();
      wires.forEach((w,i)=>{
        if(!object(w)){errors.push({code:"WIRE_INVALID",index:i});return}
        if(!validId(w.id))errors.push({code:"WIRE_ID_INVALID",wireId:w.id,index:i});
        else if(wireIds.has(w.id))errors.push({code:"DUPLICATE_WIRE_ID",wireId:w.id,index:i});
        wireIds.add(w.id);
        const a=w.from||w.a,b=w.to||w.b;
        if(!this.resolveTerminal(a))errors.push({code:"INVALID_TERMINAL_REFERENCE",wireId:w.id,endpoint:"from",terminalId:a});
        if(!this.resolveTerminal(b))errors.push({code:"INVALID_TERMINAL_REFERENCE",wireId:w.id,endpoint:"to",terminalId:b});
        if(this.resolveTerminal(a)&&this.resolveTerminal(b))errors.push(...this.validateConnection(a,b,w).errors.map(e=>({...e,wireId:w.id})));
      });
      return {valid:errors.length===0,errors};
    }
    danglingTerminals() { return Array.from(this.terminals.values()).filter(t=>t.connectionStatus==="unconnected").map(t=>t.id).sort(); }
    internalPaths(deviceId) {
      const d=this.devicesById.get(deviceId); if(!d)return [];
      const custom=d.internalPaths || d.electricalPaths;
      const def=custom || definitionFor(d.type)?.paths || [];
      return clone(def).map(p=>({...p,deviceId,from:key(deviceId,p.from),to:key(deviceId,p.to)}));
    }
    createDevice(device, options={}) {
      if(!object(device)||!validId(device.id))throw new Error("Device requires a valid stable id");
      if(this.devicesById.has(device.id))throw new Error("Duplicate device id: "+device.id);
      const normalized=clone(device);
      const specs=localTerminalDefinitions(normalized);
      normalized.terminals=specs.map(t=>({...t,localPosition:clone(t.position)}));
      this.project.devices ||= []; this.project.devices.push(normalized); this.rebuild();
      if(this.errors.some(e=>e.deviceId===normalized.id)) { this.project.devices.pop();this.rebuild();throw new Error("Device terminal registration failed: "+JSON.stringify(this.errors)); }
      return normalized;
    }
    deleteDevice(deviceId, options={}) {
      if(!this.devicesById.has(deviceId))return {deleted:false,removedWires:[],blockedWires:[]};
      const dependent=(this.project.wires||[]).filter(w=>[w.from||w.a,w.to||w.b].some(id=>typeof id==="string"&&id.startsWith(deviceId+":")));
      const policy=options.wires || "remove";
      if(policy==="reject"&&dependent.length)return {deleted:false,removedWires:[],blockedWires:dependent.map(w=>w.id)};
      if(policy==="keep"&&dependent.length)throw new Error("Cannot delete device while retaining dependent wires");
      const ids=new Set(dependent);
      this.project.wires=(this.project.wires||[]).filter(w=>!ids.has(w));
      if (Array.isArray(this.project.devices)) this.project.devices=this.project.devices.filter(d=>d.id!==deviceId);
      else if (Array.isArray(this.project.components)) this.project.components=this.project.components.filter(d=>d.id!==deviceId);
      this.rebuild();
      return {deleted:true,removedWires:dependent.map(w=>w.id),blockedWires:[]};
    }
    updateTopology(mutator) {
      if(typeof mutator==="function")mutator(this.project);
      this.rebuild();
      return this.validateTopology();
    }
    snapshot() {
      return {terminals:Array.from(this.terminals.values()).map(t=>({id:t.id,deviceId:t.deviceId,label:t.label,number:t.number,type:t.type,domain:t.domain,position:{...t.worldPosition},direction:t.direction,phase:t.phase,polarity:t.polarity,connectionStatus:t.connectionStatus})),errors:this.errors.slice()};
    }
  }
  function build(project) {
    const engine=new TerminalEngine(project);
    // Legacy consumers rely on these fields and methods.
    engine.endpointIds=()=>Array.from(engine.terminals.keys());
    return engine;
  }
  function endpoint(deviceId,terminalId) { return key(deviceId,String(terminalId)); }
  return {TerminalEngine,DEFINITIONS,DOMAINS:[...DOMAINS],key,endpoint,definitionFor,terminalPosition,compatibility,build};
});
