(()=>{'use strict';
function create(initial={}){let state={version:1,time:0,running:false,electrical:{nodes:{},branches:{},nets:{}},devices:{},faults:[],diagnostics:[],...(structuredClone(initial)||{})};const listeners=new Set();
function publish(next){state=Object.freeze(next);for(const fn of listeners)fn(state);return state}
return {get:()=>state,subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn)},setElectrical(e){return publish({...state,electrical:structuredClone(e)})},setDevice(id,value){return publish({...state,devices:{...state.devices,[id]:structuredClone(value)}})},setFaults(faults){return publish({...state,faults:structuredClone(faults)})},setDiagnostics(diagnostics){return publish({...state,diagnostics:structuredClone(diagnostics)})},tick(time){return publish({...state,time})},setRunning(running){return publish({...state,running:Boolean(running)})},snapshot(){return structuredClone(state)}}}
window.VoltProSimulationStore={create};
})();